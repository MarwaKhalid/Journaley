package com.journaley.journaley_api.dto;

import java.time.LocalDateTime;

import com.journaley.journaley_api.entity.Country;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * API country row for the home carousel.
 *
 * <p>{@code imageFilename} — for phase 1 we always return {@code default.png} until upload/persistence
 * for country cover images exists; the Angular {@code ImgCard} resolves it under {@code assets/images/}.
 */
@Getter
@Setter
@AllArgsConstructor
public class CountryResponseDTO {
    private Long id;
    private String name;
    private String isoCode;
    /** Stable route key, unique per user. */
    private String slug;
    /** File name under {@code assets/images/} (placeholder until real uploads). */
    private String imageFilename;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private static final String PLACEHOLDER_IMAGE = "default.png";

    public static CountryResponseDTO fromEntity(Country country) {
        return new CountryResponseDTO(
                country.getId(),
                country.getName(),
                country.getIsoCode(),
                country.getSlug(),
                PLACEHOLDER_IMAGE,
                country.getCreatedAt(),
                country.getUpdatedAt());
    }
}
