package com.journaley.journaley_api.service;

import com.journaley.journaley_api.dto.CityRequestDTO;
import com.journaley.journaley_api.dto.CityResponseDTO;
import com.journaley.journaley_api.entity.City;
import com.journaley.journaley_api.entity.Trip;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CityRepository;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CityService {

    private final CityRepository cityRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public CityService(CityRepository cityRepository,
                       TripRepository tripRepository,
                       UserRepository userRepository) {
        this.cityRepository = cityRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

        // Get all cities for a trip under a country
    public List<CityResponseDTO> getAllCitiesForTrip(Long countryId, Long tripId, String email) {
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

        return cityRepository.findByTripId(tripId)
            .stream()
            .map(CityResponseDTO::fromEntity)
            .collect(Collectors.toList());
    }

    public CityResponseDTO getCityById(Long countryId, Long tripId, Long cityId, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        City city = cityRepository.findById(cityId)
            .orElseThrow(() -> new RuntimeException("City not found"));

        if (!city.getTrip().getId().equals(tripId) ||
            !city.getTrip().getCountry().getId().equals(countryId)) {
            throw new RuntimeException("City does not belong to this trip/country");
        }

        if (!city.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this city");
        }

        return CityResponseDTO.fromEntity(city);
    }

    public CityResponseDTO createCity(Long countryId, Long tripId, CityRequestDTO request, String email) {
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

        City city = City.builder()
            .name(request.getName())
            .region(request.getRegion())
            .countryCode(request.getCountryCode())
            .trip(trip)
            .user(user)
            .build();

        return CityResponseDTO.fromEntity(cityRepository.save(city));
    }

    public CityResponseDTO updateCity(Long countryId, Long tripId, Long cityId, CityRequestDTO request, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        City city = cityRepository.findById(cityId)
            .orElseThrow(() -> new RuntimeException("City not found"));

        if (!city.getTrip().getId().equals(tripId) ||
            !city.getTrip().getCountry().getId().equals(countryId)) {
            throw new RuntimeException("City does not belong to this trip/country");
        }

        if (!city.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this city");
        }

        city.setName(request.getName());
        city.setRegion(request.getRegion());
        city.setCountryCode(request.getCountryCode());

        return CityResponseDTO.fromEntity(cityRepository.save(city));
    }

    public void deleteCity(Long countryId, Long tripId, Long cityId, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        City city = cityRepository.findById(cityId)
            .orElseThrow(() -> new RuntimeException("City not found"));

        if (!city.getTrip().getId().equals(tripId) ||
            !city.getTrip().getCountry().getId().equals(countryId)) {
            throw new RuntimeException("City does not belong to this trip/country");
        }

        if (!city.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this city");
        }

        cityRepository.delete(city);
    }
}
