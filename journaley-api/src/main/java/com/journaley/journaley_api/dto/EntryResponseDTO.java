package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.Entry;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class EntryResponseDTO {
    private Long id;
    private Long cityId;
    private String title;
    private String address;
    private String review;
    private Integer rating;
    private String category;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static EntryResponseDTO fromEntity(Entry entry) {
        return new EntryResponseDTO(
            entry.getId(),
            entry.getCityId(),
            entry.getName(),
            entry.getLocation(),
            entry.getDescription(),
            entry.getRating(),
            entry.getCategory(),
            entry.getCreatedAt(),
            entry.getUpdatedAt()
        );
    }
}

