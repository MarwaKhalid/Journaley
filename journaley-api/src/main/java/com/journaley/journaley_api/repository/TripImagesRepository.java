package com.journaley.journaley_api.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.journaley.journaley_api.entity.TripImages;

public interface TripImagesRepository extends JpaRepository<TripImages, Long> {

    List<TripImages> findByTripIdOrderBySortOrderAsc(Long tripId);

    Optional<TripImages> findByTripIdAndSortOrder(Long tripId, Integer sortOrder);

    void deleteByTripId(Long tripId);
}

