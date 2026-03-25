package com.journaley.journaley_api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.journaley.journaley_api.entity.Country;

public interface CountryRepository extends JpaRepository<Country, Long> {
    List<Country> findByUserId(Long userId);
}
