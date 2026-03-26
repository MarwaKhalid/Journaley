package com.journaley.journaley_api.controller;

import com.journaley.journaley_api.dto.PersonalReflectionsRequestDTO;
import com.journaley.journaley_api.dto.PersonalReflectionsResponseDTO;
import com.journaley.journaley_api.service.PersonalReflectionsService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/countries/{countryId}/trips/{tripId}/reflections")
public class PersonalReflectionsController {

    private final PersonalReflectionsService personalReflectionsService;

    public PersonalReflectionsController(PersonalReflectionsService personalReflectionsService) {
        this.personalReflectionsService = personalReflectionsService;
    }

    @GetMapping
    public PersonalReflectionsResponseDTO getReflections(
        @PathVariable Long countryId,
        @PathVariable Long tripId,
        Authentication authentication
    ) {
        return personalReflectionsService.getForTrip(countryId, tripId, authentication.getName());
    }

    @PutMapping
    public PersonalReflectionsResponseDTO saveReflections(
        @PathVariable Long countryId,
        @PathVariable Long tripId,
        @RequestBody PersonalReflectionsRequestDTO request,
        Authentication authentication
    ) {
        return personalReflectionsService.upsertForTrip(countryId, tripId, request, authentication.getName());
    }
}

