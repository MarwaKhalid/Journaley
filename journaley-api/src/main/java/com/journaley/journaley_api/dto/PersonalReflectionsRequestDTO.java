package com.journaley.journaley_api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PersonalReflectionsRequestDTO {
    private String overallFeeling;
    private String favoriteMoment;
    private String whatILovedMost;
    private String whatITookAwayFromTheTrip;
    private String wouldIGoBackAndWhy;
}

