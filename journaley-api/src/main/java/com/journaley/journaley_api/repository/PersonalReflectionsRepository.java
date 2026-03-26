package com.journaley.journaley_api.repository;

import com.journaley.journaley_api.entity.PersonalReflections;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonalReflectionsRepository extends JpaRepository<PersonalReflections, Long> {
    Optional<PersonalReflections> findByTripId(Long tripId);
    void deleteByTripId(Long tripId);
}

