package com.journaley.journaley_api.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
	name = "personal_reflections",
	uniqueConstraints = {
		@UniqueConstraint(name = "uk_personal_reflections_trip_id", columnNames = { "trip_id" })
	}
)
public class PersonalReflections {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "trip_id", nullable = false, unique = true)
	private Long tripId;

	@Column(name = "overall_feeling")
	private String overallFeeling;

	@Column(name = "favorite_moment")
	private String favoriteMoment;

	@Column(name = "what_i_loved_most")
	private String whatILovedMost;

	@Column(name = "what_i_took_away_from_the_trip")
	private String whatITookAwayFromTheTrip;

	@Column(name = "would_i_go_back_and_why")
	private String wouldIGoBackAndWhy;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private LocalDateTime updatedAt;
}

