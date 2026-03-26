package com.journaley.journaley_api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(value = "/{tripId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public void uploadTripImages(
            @PathVariable Long countryId,
            @PathVariable Long tripId,
            @RequestPart(value = "file1", required = false) MultipartFile file1,
            @RequestPart(value = "file2", required = false) MultipartFile file2,
            @RequestPart(value = "file3", required = false) MultipartFile file3,
            @AuthenticationPrincipal UserDetails userDetails) {
        tripService.uploadTripImages(countryId, tripId, userDetails.getUsername(), file1, file2, file3);
    }
}
