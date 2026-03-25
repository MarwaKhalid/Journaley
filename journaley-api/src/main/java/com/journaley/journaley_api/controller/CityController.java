package com.journaley.journaley_api.controller;

import com.journaley.journaley_api.dto.CityRequestDTO;
import com.journaley.journaley_api.dto.CityResponseDTO;
import com.journaley.journaley_api.service.CityService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/countries/{countryId}/trips/{tripId}/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public List<CityResponseDTO> getAllCities(
            @PathVariable Long countryId,
            @PathVariable Long tripId,
            Authentication authentication) {

        return cityService.getAllCitiesForTrip(countryId, tripId, authentication.getName());
    }

    @GetMapping("/{cityId}")
    public CityResponseDTO getCity(
            @PathVariable Long countryId,
            @PathVariable Long tripId,
            @PathVariable Long cityId,
            Authentication authentication) {

        return cityService.getCityById(countryId, tripId, cityId, authentication.getName());
    }

    @PostMapping
    public CityResponseDTO createCity(
            @PathVariable Long countryId,
            @PathVariable Long tripId,
            @Valid @RequestBody CityRequestDTO request,
            Authentication authentication) {

        return cityService.createCity(countryId, tripId, request, authentication.getName());
    }

    @PutMapping("/{cityId}")
    public CityResponseDTO updateCity(
            @PathVariable Long countryId,
            @PathVariable Long tripId,
            @PathVariable Long cityId,
            @Valid @RequestBody CityRequestDTO request,
            Authentication authentication) {

        return cityService.updateCity(countryId, tripId, cityId, request, authentication.getName());
    }

    @DeleteMapping("/{cityId}")
    public void deleteCity(
            @PathVariable Long countryId,
            @PathVariable Long tripId,
            @PathVariable Long cityId,
            Authentication authentication) {

        cityService.deleteCity(countryId, tripId, cityId, authentication.getName());
    }
}
