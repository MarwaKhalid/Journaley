package com.journaley.journaley_api.repository;

import com.journaley.journaley_api.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {  // Changed to Long

    @Query("SELECT t FROM Trip t WHERE t.country.id = :countryId")
    List<Trip> findByCountryId(@Param("countryId") Long countryId);
}
