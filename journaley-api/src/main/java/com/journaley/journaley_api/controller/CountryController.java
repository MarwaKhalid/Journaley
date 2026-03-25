package com.journaley.journaley_api.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.journaley.journaley_api.dto.CountryRequest;
import com.journaley.journaley_api.dto.CountryResponse;
import com.journaley.journaley_api.service.CountryService;
import java.util.List;

@RestController
@RequestMapping("/countries")
public class CountryController {
    private final CountryService countryService;

    public CountryController(CountryService countryService) {
        this.countryService = countryService;
    }

    @GetMapping("/{id}")
    public CountryResponse getCountryById(@PathVariable Long id,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        return countryService.getCountryById(id, userDetails.getUsername());
    }

    @GetMapping
    public List<CountryResponse> getAllCountries(@AuthenticationPrincipal UserDetails userDetails) {
        return countryService.getAllCountriesForUser(userDetails.getUsername());
    }

    @PostMapping
    public CountryResponse addCountry(@RequestBody CountryRequest request,
                                     @AuthenticationPrincipal UserDetails userDetails) {
        return countryService.addCountry(request, userDetails.getUsername());
    }

    @PutMapping("/{id}")
    public CountryResponse updateCountry(@PathVariable Long id,
                                        @RequestBody CountryRequest request,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        return countryService.updateCountry(id, request, userDetails.getUsername());
    }

    @DeleteMapping("/{id}")
    public void deleteCountryById(@PathVariable Long id,
                                  @AuthenticationPrincipal UserDetails userDetails) {
        countryService.deleteCountryById(id, userDetails.getUsername());
    }
}
