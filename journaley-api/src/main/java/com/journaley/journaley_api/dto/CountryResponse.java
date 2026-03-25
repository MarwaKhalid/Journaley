package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.Country;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class CountryResponse {
    private Long id;
    private String name;
    private String isoCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CountryResponse fromEntity(Country country) {
        return new CountryResponse(
            country.getId(),
            country.getName(),
            country.getIsoCode(),
            country.getCreatedAt(),
            country.getUpdatedAt()
        );
    }
}
