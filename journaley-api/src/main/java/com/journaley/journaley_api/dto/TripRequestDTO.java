package com.journaley.journaley_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TripRequestDTO {
    @NotBlank(message = "Trip name is required")
    private String name;

    @NotBlank(message = "Trip summary is required")
    private String summary;
    private String people;  // Added people field (optional)
}
