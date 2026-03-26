package com.journaley.journaley_api.service;

import com.journaley.journaley_api.dto.PersonalReflectionsRequestDTO;
import com.journaley.journaley_api.dto.PersonalReflectionsResponseDTO;
import com.journaley.journaley_api.entity.PersonalReflections;
import com.journaley.journaley_api.entity.Trip;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.PersonalReflectionsRepository;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class PersonalReflectionsService {

    private final PersonalReflectionsRepository personalReflectionsRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public PersonalReflectionsService(
        PersonalReflectionsRepository personalReflectionsRepository,
        TripRepository tripRepository,
        UserRepository userRepository
    ) {
        this.personalReflectionsRepository = personalReflectionsRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public PersonalReflectionsResponseDTO getForTrip(Long countryId, Long tripId, String email) {
        requireOwnedTrip(countryId, tripId, email);

        return personalReflectionsRepository.findByTripId(tripId)
            .map(PersonalReflectionsResponseDTO::fromEntity)
            .orElse(null);
    }

    public PersonalReflectionsResponseDTO upsertForTrip(Long countryId, Long tripId, PersonalReflectionsRequestDTO request, String email) {
        requireOwnedTrip(countryId, tripId, email);

        PersonalReflections pr = personalReflectionsRepository.findByTripId(tripId)
            .orElseGet(() -> PersonalReflections.builder().tripId(tripId).build());

        pr.setOverallFeeling(request.getOverallFeeling());
        pr.setFavoriteMoment(request.getFavoriteMoment());
        pr.setWhatILovedMost(request.getWhatILovedMost());
        pr.setWhatITookAwayFromTheTrip(request.getWhatITookAwayFromTheTrip());
        pr.setWouldIGoBackAndWhy(request.getWouldIGoBackAndWhy());

        return PersonalReflectionsResponseDTO.fromEntity(personalReflectionsRepository.save(pr));
    }

    private void requireOwnedTrip(Long countryId, Long tripId, String email) {
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
    }
}

