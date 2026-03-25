package com.journaley.journaley_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CountryRequestDTO {

    @NotBlank(message = "Country name is required")
    @Size(max = 255)
    private String name;

    /** Optional ISO code (e.g. JP). Omit or null to leave unchanged on update. */
    @Size(max = 8)
    private String isoCode;
}
