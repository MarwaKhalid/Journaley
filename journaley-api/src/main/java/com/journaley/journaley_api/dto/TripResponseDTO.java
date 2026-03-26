package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;

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
    /** Sorted by image sort_order; may be empty. */
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TripResponseDTO fromEntity(Trip trip, List<String> imageUrls) {
        return new TripResponseDTO(
            trip.getId(),
            trip.getCountry().getId(),
            trip.getCountry().getName(),
            trip.getName(),
            trip.getSummary(),
            trip.getPeople(),  // Added people field
            imageUrls,
            trip.getCreatedAt(),
            trip.getUpdatedAt()
        );
    }
}
