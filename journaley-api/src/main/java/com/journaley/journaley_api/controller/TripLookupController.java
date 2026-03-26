package com.journaley.journaley_api.controller;

import com.journaley.journaley_api.dto.TripContextResponseDTO;
import com.journaley.journaley_api.entity.Trip;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.TripRepository;
import com.journaley.journaley_api.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trips")
public class TripLookupController {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripLookupController(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{tripId}")
    public TripContextResponseDTO getTripContext(@PathVariable Long tripId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));

        if (!trip.getCountry().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this trip");
        }

        return TripContextResponseDTO.fromEntity(trip);
    }
}

