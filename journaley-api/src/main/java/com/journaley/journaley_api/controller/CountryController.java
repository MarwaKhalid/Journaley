package com.journaley.journaley_api.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.journaley.journaley_api.dto.CountryRequestDTO;
import com.journaley.journaley_api.dto.CountryResponseDTO;
import com.journaley.journaley_api.service.CountryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/countries")
@Validated
public class CountryController {
    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping("/{id}")
    public CountryResponseDTO getCountryById(
            @PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return countryService.getCountryById(id, userDetails.getUsername());
    }

    @GetMapping
    public List<CountryResponseDTO> getAllCountries(@AuthenticationPrincipal UserDetails userDetails) {
        return countryService.getAllCountriesForUser(userDetails.getUsername());
    }

    @PostMapping
    public ResponseEntity<CountryResponseDTO> addCountry(
            @Valid @RequestBody CountryRequestDTO request, @AuthenticationPrincipal UserDetails userDetails) {
        CountryResponseDTO body = countryService.addCountry(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public CountryResponseDTO updateCountry(
            @PathVariable Long id,
            @Valid @RequestBody CountryRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return countryService.updateCountry(id, request, userDetails.getUsername());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCountryById(
            @PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        countryService.deleteCountryById(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadCountryImage(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        countryService.uploadCountryImage(id, file, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/image")
    public ResponseEntity<Void> deleteCountryImage(
            @PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        countryService.deleteCountryImage(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
