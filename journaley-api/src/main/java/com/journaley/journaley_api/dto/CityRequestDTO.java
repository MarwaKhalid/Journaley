package com.journaley.journaley_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CityRequestDTO {
    @NotBlank(message = "City name is required")
    private String name;

	private String region;
	private String countryCode;
}
