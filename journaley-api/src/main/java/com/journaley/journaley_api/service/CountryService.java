package com.journaley.journaley_api.service;

import com.journaley.journaley_api.dto.CountryRequest;
import com.journaley.journaley_api.dto.CountryResponse;
import com.journaley.journaley_api.entity.Country;
import com.journaley.journaley_api.entity.User;
import com.journaley.journaley_api.repository.CountryRepository;
import com.journaley.journaley_api.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CountryService {
    private final CountryRepository countryRepository;
    private final UserRepository userRepository;

    public CountryService(CountryRepository countryRepository, UserRepository userRepository) {
        this.countryRepository = countryRepository;
        this.userRepository = userRepository;
    }

    public CountryResponse addCountry(CountryRequest request, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = new Country();
        country.setUser(user);
        country.setName(request.getName());
        country.setIsoCode(request.getIsoCode());

        Country saved = countryRepository.save(country);
        return CountryResponse.fromEntity(saved);
    }

    public List<CountryResponse> getAllCountriesForUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        return countryRepository.findByUserId(user.getId())
            .stream()
            .map(CountryResponse::fromEntity)
            .collect(Collectors.toList());
    }

    public CountryResponse getCountryById(Long id, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        return CountryResponse.fromEntity(country);
    }

    public CountryResponse updateCountry(Long id, CountryRequest request, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        country.setName(request.getName());
        country.setIsoCode(request.getIsoCode());

        Country updated = countryRepository.save(country);
        return CountryResponse.fromEntity(updated);
    }

    public void deleteCountryById(Long id, String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Country country = countryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Country not found"));

        if (!country.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access");
        }

        countryRepository.deleteById(id);
    }
}
