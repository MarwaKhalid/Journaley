package com.journaley.journaley_api.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.journaley.journaley_api.entity.CountryImages;

public interface CountryImagesRepository extends JpaRepository<CountryImages, Long> {

    Optional<CountryImages> findByCountryId(Long countryId);

    List<CountryImages> findByCountryIdIn(Collection<Long> countryIds);

    void deleteByCountryId(Long countryId);
}
