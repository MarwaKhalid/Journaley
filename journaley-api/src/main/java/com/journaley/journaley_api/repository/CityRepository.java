package com.journaley.journaley_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import com.journaley.journaley_api.entity.City;

public interface CityRepository extends JpaRepository<City, Long> {
    List<City> findByTripId(Long tripId);
    Optional<City> findByIdAndTripId(Long cityId, Long tripId);
    void deleteByTripId(Long tripId);
}
