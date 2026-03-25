package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class TripResponseDTO {
    private Long id;
    private Long countryId;
    private String countryName;
    private String name;
    private String summary;
    private String people;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TripResponseDTO fromEntity(Trip trip) {
        return new TripResponseDTO(
            trip.getId(),
            trip.getCountry().getId(),
            trip.getCountry().getName(),
            trip.getName(),
            trip.getSummary(),
            trip.getPeople(),  // Added people field
            trip.getCreatedAt(),
            trip.getUpdatedAt()
        );
    }
}
