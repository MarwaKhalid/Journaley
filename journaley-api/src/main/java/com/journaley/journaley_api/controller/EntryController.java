package com.journaley.journaley_api.controller;

import com.journaley.journaley_api.dto.EntryRequestDTO;
import com.journaley.journaley_api.dto.EntryResponseDTO;
import com.journaley.journaley_api.service.EntryService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/countries/{countryId}/trips/{tripId}/cities/{cityId}/entries")
public class EntryController {

    private final EntryService entryService;

    public EntryController(EntryService entryService) {
        this.entryService = entryService;
    }

    @GetMapping
    public List<EntryResponseDTO> getAllEntries(
        @PathVariable Long countryId,
        @PathVariable Long tripId,
        @PathVariable Long cityId,
        Authentication authentication
    ) {
        return entryService.getAllEntriesForCity(countryId, tripId, cityId, authentication.getName());
    }

    @PostMapping
    public EntryResponseDTO createEntry(
        @PathVariable Long countryId,
        @PathVariable Long tripId,
        @PathVariable Long cityId,
        @Valid @RequestBody EntryRequestDTO request,
        Authentication authentication
    ) {
        return entryService.createEntry(countryId, tripId, cityId, request, authentication.getName());
    }

    @PutMapping("/{entryId}")
    public EntryResponseDTO updateEntry(
        @PathVariable Long countryId,
        @PathVariable Long tripId,
        @PathVariable Long cityId,
        @PathVariable Long entryId,
        @Valid @RequestBody EntryRequestDTO request,
        Authentication authentication
    ) {
        return entryService.updateEntry(countryId, tripId, cityId, entryId, request, authentication.getName());
    }

    @DeleteMapping("/{entryId}")
    public void deleteEntry(
        @PathVariable Long countryId,
        @PathVariable Long tripId,
        @PathVariable Long cityId,
        @PathVariable Long entryId,
        Authentication authentication
    ) {
        entryService.deleteEntry(countryId, tripId, cityId, entryId, authentication.getName());
    }
}

