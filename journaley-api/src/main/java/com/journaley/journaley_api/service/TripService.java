package com.journaley.journaley_api.service;

import com.journaley.journaley_api.dto.TripRequestDTO;
import com.journaley.journaley_api.dto.TripResponseDTO;
import com.journaley.journaley_api.entity.Country;
import com.journaley.journaley_api.entity.Trip;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CountryRepository;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final CountryRepository countryRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository,
                      CountryRepository countryRepository,
                      UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.countryRepository = countryRepository;
        this.userRepository = userRepository;
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

        return TripResponseDTO.fromEntity(trip);
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
            .map(TripResponseDTO::fromEntity)
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
        return TripResponseDTO.fromEntity(saved);
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
        return TripResponseDTO.fromEntity(updated);
    }

    public void deleteTrip(Long tripId, String email) {  // Changed to Long
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getCountry().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this trip");
        }

        tripRepository.deleteById(tripId);
    }
}
