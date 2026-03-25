package com.journaley.journaley_api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.journaley.journaley_api.dto.TripRequestDTO;
import com.journaley.journaley_api.dto.TripResponseDTO;
import com.journaley.journaley_api.service.TripService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/countries/{countryId}/trips")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/{tripId}")
    public TripResponseDTO getTripByIdForCountry(
            @PathVariable Long countryId,
            @AuthenticationPrincipal UserDetails userDetails,
        @PathVariable Long tripId) {
        return tripService.getTripByIdForCountry(countryId, userDetails.getUsername(), tripId);
    }

    @GetMapping
    public List<TripResponseDTO> getAllTripsForCountry(
            @PathVariable Long countryId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return tripService.getAllTripsForCountry(countryId, userDetails.getUsername());
    }

    @PostMapping
    public TripResponseDTO createTrip(
            @PathVariable Long countryId,
            @Valid @RequestBody TripRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return tripService.createTrip(countryId, request, userDetails.getUsername());
    }

    @PutMapping("/{tripId}")
    public TripResponseDTO updateTrip(
            @PathVariable Long countryId,
            @PathVariable Long tripId,  // Changed to Long
            @Valid @RequestBody TripRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return tripService.updateTrip(tripId, request, userDetails.getUsername());
    }

    @DeleteMapping("/{tripId}")
    public void deleteTrip(
            @PathVariable Long countryId,
            @PathVariable Long tripId,  // Changed to Long
            @AuthenticationPrincipal UserDetails userDetails) {
        tripService.deleteTrip(tripId, userDetails.getUsername());
    }
}
