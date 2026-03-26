package com.journaley.journaley_api.service;

import com.journaley.journaley_api.dto.EntryRequestDTO;
import com.journaley.journaley_api.dto.EntryResponseDTO;
import com.journaley.journaley_api.entity.City;
import com.journaley.journaley_api.entity.Entry;
import com.journaley.journaley_api.entity.Trip;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CityRepository;
import com.journaley.journaley_api.repository.EntryRepository;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntryService {

    private final EntryRepository entryRepository;
    private final CityRepository cityRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public EntryService(
        EntryRepository entryRepository,
        CityRepository cityRepository,
        TripRepository tripRepository,
        UserRepository userRepository
    ) {
        this.entryRepository = entryRepository;
        this.cityRepository = cityRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public List<EntryResponseDTO> getAllEntriesForCity(Long countryId, Long tripId, Long cityId, String email) {
        City city = requireOwnedCity(countryId, tripId, cityId, email);

        return entryRepository.findByTripIdAndCityIdOrderByCreatedAtDesc(tripId, city.getId())
            .stream()
            .map(EntryResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public EntryResponseDTO createEntry(Long countryId, Long tripId, Long cityId, EntryRequestDTO request, String email) {
        City city = requireOwnedCity(countryId, tripId, cityId, email);

        Entry entry = new Entry();
        entry.setTripId(tripId);
        entry.setCityId(city.getId());
        entry.setName(request.getTitle());
        entry.setLocation(request.getAddress());
        entry.setDescription(request.getReview());
        entry.setRating(request.getRating());
        entry.setCategory(request.getCategory());

        return EntryResponseDTO.fromEntity(entryRepository.save(entry));
    }

    public EntryResponseDTO updateEntry(Long countryId, Long tripId, Long cityId, Long entryId, EntryRequestDTO request, String email) {
        City city = requireOwnedCity(countryId, tripId, cityId, email);

        Entry entry = entryRepository.findByIdAndTripId(entryId, tripId)
            .orElseThrow(() -> new RuntimeException("Entry not found"));

        if (!entry.getCityId().equals(city.getId())) {
            throw new RuntimeException("Entry does not belong to this city");
        }

        entry.setName(request.getTitle());
        entry.setLocation(request.getAddress());
        entry.setDescription(request.getReview());
        entry.setRating(request.getRating());
        entry.setCategory(request.getCategory());

        return EntryResponseDTO.fromEntity(entryRepository.save(entry));
    }

    public void deleteEntry(Long countryId, Long tripId, Long cityId, Long entryId, String email) {
        City city = requireOwnedCity(countryId, tripId, cityId, email);

        Entry entry = entryRepository.findByIdAndTripId(entryId, tripId)
            .orElseThrow(() -> new RuntimeException("Entry not found"));

        if (!entry.getCityId().equals(city.getId())) {
            throw new RuntimeException("Entry does not belong to this city");
        }

        entryRepository.delete(entry);
    }

    private City requireOwnedCity(Long countryId, Long tripId, Long cityId, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getCountry().getId().equals(countryId)) {
            throw new RuntimeException("Trip does not belong to this country");
        }

        if (!trip.getCountry().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this trip");
        }

        City city = cityRepository.findById(cityId)
            .orElseThrow(() -> new RuntimeException("City not found"));

        if (!city.getTrip().getId().equals(tripId) || !city.getTrip().getCountry().getId().equals(countryId)) {
            throw new RuntimeException("City does not belong to this trip/country");
        }

        if (!city.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this city");
        }

        return city;
    }
}

