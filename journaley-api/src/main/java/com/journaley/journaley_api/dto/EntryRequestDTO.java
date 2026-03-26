package com.journaley.journaley_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EntryRequestDTO {

    @NotBlank(message = "Entry title is required")
    private String title;

    private String address;

    private String review;

    @NotNull(message = "Rating is required")
    private Integer rating;

    @NotBlank(message = "Category is required")
    private String category;
}

