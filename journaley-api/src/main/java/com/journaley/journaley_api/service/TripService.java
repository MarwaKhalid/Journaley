package com.journaley.journaley_api.service;

import com.journaley.journaley_api.dto.TripRequestDTO;
import com.journaley.journaley_api.dto.TripResponseDTO;
import com.journaley.journaley_api.entity.Country;
import com.journaley.journaley_api.entity.Trip;
import com.journaley.journaley_api.entity.TripImages;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CityRepository;
import com.journaley.journaley_api.repository.CountryRepository;
import com.journaley.journaley_api.repository.EntryRepository;
import com.journaley.journaley_api.repository.PersonalReflectionsRepository;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.TripImagesRepository;
import com.journaley.journaley_api.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final CountryRepository countryRepository;
    private final TripImagesRepository tripImagesRepository;
    private final UserRepository userRepository;
    private final TripImageStorageService tripImageStorageService;
    private final CityRepository cityRepository;
    private final EntryRepository entryRepository;
    private final PersonalReflectionsRepository personalReflectionsRepository;

    public TripService(TripRepository tripRepository,
                      CountryRepository countryRepository,
                      TripImagesRepository tripImagesRepository,
                      UserRepository userRepository,
                      TripImageStorageService tripImageStorageService,
                      CityRepository cityRepository,
                      EntryRepository entryRepository,
                      PersonalReflectionsRepository personalReflectionsRepository) {
        this.tripRepository = tripRepository;
        this.countryRepository = countryRepository;
        this.tripImagesRepository = tripImagesRepository;
        this.userRepository = userRepository;
        this.tripImageStorageService = tripImageStorageService;
        this.cityRepository = cityRepository;
        this.entryRepository = entryRepository;
        this.personalReflectionsRepository = personalReflectionsRepository;
    }

    public TripResponseDTO getTripByIdForCountry(Long countryId, String email, Long tripId) {
        // Verify user owns this country
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(countryId)
            .orElseThrow(() -> new RuntimeException("Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this country");
        }

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getCountry().getId().equals(countryId)) {
            throw new RuntimeException("Trip does not belong to this country");
        }

        List<String> imageUrls = getTripImageUrls(trip.getId());
        return TripResponseDTO.fromEntity(trip, imageUrls);
    }

    public List<TripResponseDTO> getAllTripsForCountry(Long countryId, String email) {
        // Verify user owns this country
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(countryId)
            .orElseThrow(() -> new RuntimeException("Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this country");
        }

        return tripRepository.findByCountryId(countryId)
            .stream()
            .map(t -> TripResponseDTO.fromEntity(t, getTripImageUrls(t.getId())))
            .collect(Collectors.toList());
    }

    public TripResponseDTO createTrip(Long countryId, TripRequestDTO request, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(countryId)
            .orElseThrow(() -> new RuntimeException("Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this country");
        }

        Trip trip = new Trip();
        trip.setCountry(country);
        trip.setName(request.getName());
        trip.setSummary(request.getSummary());
        trip.setPeople(request.getPeople());  // Added people

        Trip saved = tripRepository.save(trip);
        return TripResponseDTO.fromEntity(saved, List.of());
    }

    public TripResponseDTO updateTrip(Long tripId, TripRequestDTO request, String email) {  // Changed to Long
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getCountry().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this trip");
        }

        trip.setName(request.getName());
        trip.setSummary(request.getSummary());
        trip.setPeople(request.getPeople());  // Added people

        Trip updated = tripRepository.save(trip);
        return TripResponseDTO.fromEntity(updated, getTripImageUrls(updated.getId()));
    }

    @Transactional
    public void deleteTrip(Long tripId, String email) {  // Changed to Long
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getCountry().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this trip");
        }

        // #region agent log
        try { Files.writeString(Path.of("debug-d01587.log"), "{\"sessionId\":\"d01587\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H1\",\"location\":\"TripService.java:deleteTrip\",\"message\":\"Deleting trip with dependent cleanup\",\"data\":{\"tripId\":" + tripId + "},\"timestamp\":" + System.currentTimeMillis() + "}\n", java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND); } catch (Exception __e) {}
        // #endregion

        // Delete dependent rows first to satisfy FK constraints.
        entryRepository.deleteByTripId(tripId);
        cityRepository.deleteByTripId(tripId);
        personalReflectionsRepository.deleteByTripId(tripId);
        deleteTripImageArtifacts(tripId);
        tripRepository.deleteById(tripId);

        // #region agent log
        try { Files.writeString(Path.of("debug-d01587.log"), "{\"sessionId\":\"d01587\",\"runId\":\"pre-fix\",\"hypothesisId\":\"H1\",\"location\":\"TripService.java:deleteTrip\",\"message\":\"Trip deleted successfully\",\"data\":{\"tripId\":" + tripId + "},\"timestamp\":" + System.currentTimeMillis() + "}\n", java.nio.file.StandardOpenOption.CREATE, java.nio.file.StandardOpenOption.APPEND); } catch (Exception __e) {}
        // #endregion
    }

    @Transactional
    public void uploadTripImages(Long countryId, Long tripId, String email,
            MultipartFile file1, MultipartFile file2, MultipartFile file3) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        Country country = countryRepository.findById(countryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized access to this country");
        }

        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        if (!trip.getCountry().getId().equals(countryId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trip does not belong to this country");
        }

        upsertTripImage(tripId, 1, file1);
        upsertTripImage(tripId, 2, file2);
        upsertTripImage(tripId, 3, file3);
    }

    private void upsertTripImage(Long tripId, int sortOrder, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }
        Optional<TripImages> existingOpt = tripImagesRepository.findByTripIdAndSortOrder(tripId, sortOrder);
        String previousKey = existingOpt.map(TripImages::getStorageKey).orElse(null);

        String storageKey = tripImageStorageService.saveFile(file, previousKey);
        String publicUrl = tripImageStorageService.publicUrlForStorageKey(storageKey);

        TripImages row = existingOpt.orElseGet(TripImages::new);
        row.setTripId(tripId);
        row.setSortOrder(sortOrder);
        row.setStorageKey(storageKey);
        row.setImageUrl(publicUrl);
        tripImagesRepository.save(row);
    }

    private List<String> getTripImageUrls(Long tripId) {
        List<TripImages> images = tripImagesRepository.findByTripIdOrderBySortOrderAsc(tripId);
        List<String> urls = new ArrayList<>();
        for (TripImages img : images) {
            if (img.getImageUrl() != null && !img.getImageUrl().isBlank()) {
                urls.add(img.getImageUrl());
            }
        }
        return urls;
    }

    private void deleteTripImageArtifacts(Long tripId) {
        List<TripImages> images = tripImagesRepository.findByTripIdOrderBySortOrderAsc(tripId);
        for (TripImages img : images) {
            tripImageStorageService.deleteFileIfExists(img.getStorageKey());
        }
        tripImagesRepository.deleteByTripId(tripId);
    }
}
