package com.journaley.journaley_api.dto;

import com.journaley.journaley_api.entity.PersonalReflections;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PersonalReflectionsResponseDTO {
    private Long tripId;
    private String overallFeeling;
    private String favoriteMoment;
    private String whatILovedMost;
    private String whatITookAwayFromTheTrip;
    private String wouldIGoBackAndWhy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PersonalReflectionsResponseDTO fromEntity(PersonalReflections pr) {
        return new PersonalReflectionsResponseDTO(
            pr.getTripId(),
            pr.getOverallFeeling(),
            pr.getFavoriteMoment(),
            pr.getWhatILovedMost(),
            pr.getWhatITookAwayFromTheTrip(),
            pr.getWouldIGoBackAndWhy(),
            pr.getCreatedAt(),
            pr.getUpdatedAt()
        );
    }
}

