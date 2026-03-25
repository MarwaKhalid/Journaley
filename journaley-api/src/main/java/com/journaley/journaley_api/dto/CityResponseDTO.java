package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.City;
import com.journaley.journaley_api.entity.Country;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CityResponseDTO {
    private Long id;
    private String name;
    private String region;
    private String countryCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CityResponseDTO fromEntity(City city) {
        return new CityResponseDTO(
            city.getId(),
            city.getName(),
            city.getRegion(),
            city.getCountryCode(),
            city.getCreatedAt(),
            city.getUpdatedAt()
        );
    }
}
