package com.journaley.journaley_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.journaley.journaley_api.entity.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {

    List<Country> findByUser_IdOrderByNameAsc(Long userId);

    Optional<Country> findByUser_IdAndSlug(Long userId, String slug);
}
