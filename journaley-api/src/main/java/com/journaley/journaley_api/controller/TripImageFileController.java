package com.journaley.journaley_api.controller;

import java.nio.file.Path;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.journaley.journaley_api.service.TripImageStorageService;

/**
 * Serves uploaded trip images from disk. GET is {@code permitAll} so {@code <img src>} works
 * without attaching a JWT (URLs use unguessable UUID file names). Upload remains authenticated.
 */
@RestController
@RequestMapping("/api/files/trip-images")
public class TripImageFileController {

    private final TripImageStorageService storageService;

    public TripImageFileController(TripImageStorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        Path path = storageService.resolveExistingFile(fileName);
        Resource resource = new FileSystemResource(path);
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".png")) {
            mediaType = MediaType.IMAGE_PNG;
        } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if (lower.endsWith(".webp")) {
            mediaType = MediaType.parseMediaType("image/webp");
        }
        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=86400")
                .body(resource);
    }
}

