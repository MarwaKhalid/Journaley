package com.journaley.journaley_api.repository;

import com.journaley.journaley_api.entity.Entry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EntryRepository extends JpaRepository<Entry, Long> {
    List<Entry> findByTripIdAndCityIdOrderByCreatedAtDesc(Long tripId, Long cityId);
    Optional<Entry> findByIdAndTripId(Long id, Long tripId);
    void deleteByTripId(Long tripId);
}

