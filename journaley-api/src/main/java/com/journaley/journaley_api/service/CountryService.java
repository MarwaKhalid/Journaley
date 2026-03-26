package com.journaley.journaley_api.service;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.journaley.journaley_api.dto.CountryRequestDTO;
import com.journaley.journaley_api.dto.CountryResponseDTO;
import com.journaley.journaley_api.entity.Country;
import com.journaley.journaley_api.entity.CountryImages;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CountryImagesRepository;
import com.journaley.journaley_api.repository.CountryRepository;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.UserRepository;

@Service
public class CountryService {
    private final CountryRepository countryRepository;
    private final CountryImagesRepository countryImagesRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final CountryImageStorageService imageStorageService;

    public CountryService(
            CountryRepository countryRepository,
            CountryImagesRepository countryImagesRepository,
            TripRepository tripRepository,
            UserRepository userRepository,
            CountryImageStorageService imageStorageService) {
        this.countryRepository = countryRepository;
        this.countryImagesRepository = countryImagesRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.imageStorageService = imageStorageService;
    }

    public CountryResponseDTO addCountry(CountryRequestDTO request, String email) {
        User user = requireUser(email);

        Country country = new Country();
        country.setUser(user);
        country.setName(request.getName().trim());
        country.setSlug(allocateSlug(user.getId(), request.getName(), null));
        applyIsoCode(country, request.getIsoCode(), true);

        Country saved = countryRepository.save(country);
        return CountryResponseDTO.fromEntity(saved, null);
    }

    public List<CountryResponseDTO> getAllCountriesForUser(String email) {
        User user = requireUser(email);
        List<Country> countries = countryRepository.findByUser_IdOrderByNameAsc(user.getId());
        Map<Long, CountryImages> byCountryId = loadImagesByCountryIds(
                countries.stream().map(Country::getId).collect(Collectors.toList()));
        return countries.stream()
                .map(c -> CountryResponseDTO.fromEntity(c, imageUrlFor(byCountryId.get(c.getId()))))
                .collect(Collectors.toList());
    }

    public CountryResponseDTO getCountryById(Long id, String email) {
        User user = requireUser(email);
        Country country = requireOwnedCountry(id, user.getId());
        String imageUrl = countryImagesRepository
                .findByCountryId(id)
                .map(CountryImages::getImageUrl)
                .orElse(null);
        return CountryResponseDTO.fromEntity(country, imageUrl);
    }

    public CountryResponseDTO updateCountry(Long id, CountryRequestDTO request, String email) {
        User user = requireUser(email);
        Country country = requireOwnedCountry(id, user.getId());

        String newName = request.getName().trim();
        if (!newName.equals(country.getName())) {
            country.setName(newName);
            country.setSlug(allocateSlug(user.getId(), newName, id));
        }
        applyIsoCode(country, request.getIsoCode(), false);

        Country updated = countryRepository.save(country);
        String imageUrl = countryImagesRepository
                .findByCountryId(id)
                .map(CountryImages::getImageUrl)
                .orElse(null);
        return CountryResponseDTO.fromEntity(updated, imageUrl);
    }

    @Transactional
    public void deleteCountryById(Long id, String email) {
        User user = requireUser(email);
        requireOwnedCountry(id, user.getId());
        if (tripRepository.existsByCountry_Id(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Delete trips first.");
        }
        deleteImageArtifacts(id);
        countryRepository.deleteById(id);
    }

    @Transactional
    public void uploadCountryImage(Long countryId, MultipartFile file, String email) {
        User user = requireUser(email);
        requireOwnedCountry(countryId, user.getId());

        Optional<CountryImages> existingOpt = countryImagesRepository.findByCountryId(countryId);
        String previousKey = existingOpt.map(CountryImages::getStorageKey).orElse(null);

        String storageKey = imageStorageService.saveFile(file, previousKey);
        String publicUrl = imageStorageService.publicUrlForStorageKey(storageKey);

        CountryImages row = existingOpt.orElseGet(CountryImages::new);
        row.setCountryId(countryId);
        row.setStorageKey(storageKey);
        row.setImageUrl(publicUrl);
        row.setAltText(null);
        countryImagesRepository.save(row);
    }

    @Transactional
    public void deleteCountryImage(Long countryId, String email) {
        User user = requireUser(email);
        requireOwnedCountry(countryId, user.getId());
        deleteImageArtifacts(countryId);
    }

    private void deleteImageArtifacts(Long countryId) {
        countryImagesRepository.findByCountryId(countryId).ifPresent(img -> {
            imageStorageService.deleteFileIfExists(img.getStorageKey());
            countryImagesRepository.delete(img);
        });
    }

    private Map<Long, CountryImages> loadImagesByCountryIds(List<Long> ids) {
        if (ids.isEmpty()) {
            return Map.of();
        }
        return countryImagesRepository.findByCountryIdIn(ids).stream()
                .collect(Collectors.toMap(CountryImages::getCountryId, ci -> ci, (a, b) -> a));
    }

    private static String imageUrlFor(CountryImages img) {
        return img != null ? img.getImageUrl() : null;
    }

    private User requireUser(String email) {
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return userRepository
                .findByEmail(normalized)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private Country requireOwnedCountry(Long countryId, Long userId) {
        Country country = countryRepository
                .findById(countryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found"));
        if (!country.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not allowed to access this country");
        }
        return country;
    }

    private void applyIsoCode(Country country, String isoCode, boolean isCreate) {
        if (isoCode == null) {
            if (isCreate) {
                country.setIsoCode(null);
            }
            return;
        }
        String trimmed = isoCode.trim();
        country.setIsoCode(trimmed.isEmpty() ? null : trimmed);
    }

    private static String baseSlug(String name) {
        String s = name.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9\\s-]", "");
        s = s.replaceAll("[\\s_-]+", "-").replaceAll("^-|-$", "");
        return s.isEmpty() ? "country" : s;
    }

    private String allocateSlug(Long userId, String name, Long excludeCountryId) {
        String base = baseSlug(name);
        String candidate = base;
        int suffix = 2;
        while (true) {
            Optional<Country> found = countryRepository.findByUser_IdAndSlug(userId, candidate);
            if (found.isEmpty() || found.get().getId().equals(excludeCountryId)) {
                return candidate;
            }
            candidate = base + "-" + suffix++;
        }
    }
}
