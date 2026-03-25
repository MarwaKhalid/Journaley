package com.journaley.journaley_api.dto;

import java.time.LocalDateTime;

import com.journaley.journaley_api.entity.Country;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * API country row for the home carousel.
 *
 * <p>{@code imageUrl} — browser-loadable URL when a cover image exists; {@code null} otherwise
 * (frontend may show a placeholder).
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
    /** Full URL to the cover image, or null. */
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CountryResponseDTO fromEntity(Country country, String imageUrl) {
        return new CountryResponseDTO(
                country.getId(),
                country.getName(),
                country.getIsoCode(),
                country.getSlug(),
                imageUrl,
                country.getCreatedAt(),
                country.getUpdatedAt());
    }
}
