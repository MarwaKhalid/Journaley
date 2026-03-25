package com.journaley.journaley_api.service;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.journaley.journaley_api.dto.CountryRequestDTO;
import com.journaley.journaley_api.dto.CountryResponseDTO;
import com.journaley.journaley_api.entity.Country;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CountryRepository;
import com.journaley.journaley_api.repository.UserRepository;

@Service
public class CountryService {
    private final CountryRepository countryRepository;
    private final UserRepository userRepository;

    public CountryService(CountryRepository countryRepository, UserRepository userRepository) {
        this.countryRepository = countryRepository;
        this.userRepository = userRepository;
    }

    public CountryResponseDTO addCountry(CountryRequestDTO request, String email) {
        User user = requireUser(email);

        Country country = new Country();
        country.setUser(user);
        country.setName(request.getName().trim());
        country.setSlug(allocateSlug(user.getId(), request.getName(), null));
        applyIsoCode(country, request.getIsoCode(), true);

        Country saved = countryRepository.save(country);
        return CountryResponseDTO.fromEntity(saved);
    }

    public List<CountryResponseDTO> getAllCountriesForUser(String email) {
        User user = requireUser(email);
        return countryRepository.findByUser_IdOrderByNameAsc(user.getId()).stream()
                .map(CountryResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public CountryResponseDTO getCountryById(Long id, String email) {
        User user = requireUser(email);
        Country country = requireOwnedCountry(id, user.getId());
        return CountryResponseDTO.fromEntity(country);
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
        return CountryResponseDTO.fromEntity(updated);
    }

    public void deleteCountryById(Long id, String email) {
        User user = requireUser(email);
        requireOwnedCountry(id, user.getId());
        countryRepository.deleteById(id);
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

    /**
     * Resolves a slug unique for this user; {@code excludeCountryId} skips the current row on update.
     */
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
