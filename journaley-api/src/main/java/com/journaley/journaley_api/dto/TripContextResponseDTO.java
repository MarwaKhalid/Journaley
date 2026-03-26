package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.Trip;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TripContextResponseDTO {
    private Long id;
    private String name;
    private Long countryId;
    private String countrySlug;

    public static TripContextResponseDTO fromEntity(Trip trip) {
        return new TripContextResponseDTO(
            trip.getId(),
            trip.getName(),
            trip.getCountry().getId(),
            trip.getCountry().getSlug()
        );
    }
}

