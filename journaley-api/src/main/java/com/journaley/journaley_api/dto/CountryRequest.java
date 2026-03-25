package com.journaley.journaley_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CountryRequest {
    @NotBlank(message = "Country name is required")
    private String name;

    @NotBlank(message = "ISO is required")
    private String isoCode;
}
