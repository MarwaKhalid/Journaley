package com.journaley.journaley_api.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Phase-1 local disk storage for country cover images. Production should use S3/Azure Blob.
 */
@Service
public class CountryImageStorageService {

    private static final long MAX_BYTES = 5 * 1024 * 1024;
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp");

    private final Path uploadDir;
    private final String publicBaseUrl;

    public CountryImageStorageService(
            @Value("${app.upload.country-images-dir:uploads/country-images}") String uploadDirProperty,
            @Value("${app.public-base-url:http://localhost:8080}") String publicBaseUrl) {
        this.uploadDir = Path.of(uploadDirProperty).toAbsolutePath().normalize();
        this.publicBaseUrl = publicBaseUrl.replaceAll("/$", "");
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Cannot create upload directory: " + this.uploadDir, e);
        }
    }

    public String publicUrlForStorageKey(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) {
            return null;
        }
        return publicBaseUrl + "/api/files/country-images/" + storageKey;
    }

    /**
     * Saves multipart file; returns storage key (file name on disk). Deletes previous file if
     * {@code previousStorageKey} is non-null.
     */
    public String saveFile(MultipartFile file, String previousStorageKey) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File too large (max 5MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null
                || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only JPEG, PNG, or WebP images are allowed");
        }

        String ext = extensionForContentType(contentType);
        String storageKey = UUID.randomUUID() + ext;

        Path target = uploadDir.resolve(storageKey).normalize();
        if (!target.startsWith(uploadDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid path");
        }

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save file");
        }

        deleteFileIfExists(previousStorageKey);
        return storageKey;
    }

    public void deleteFileIfExists(String storageKey) {
        if (storageKey == null || storageKey.isBlank()) {
            return;
        }
        if (!isSafeStorageKey(storageKey)) {
            return;
        }
        Path p = uploadDir.resolve(storageKey).normalize();
        if (!p.startsWith(uploadDir)) {
            return;
        }
        try {
            Files.deleteIfExists(p);
        } catch (IOException ignored) {
            // best-effort
        }
    }

    public Path resolveExistingFile(String storageKey) {
        if (!isSafeStorageKey(storageKey)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
        }
        Path p = uploadDir.resolve(storageKey).normalize();
        if (!p.startsWith(uploadDir) || !Files.isRegularFile(p)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found");
        }
        return p;
    }

    private static boolean isSafeStorageKey(String key) {
        return key != null
                && !key.contains("..")
                && !key.contains("/")
                && !key.contains("\\")
                && key.matches(
                        "(?i)[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|jpeg|png|webp)");
    }

    private static String extensionForContentType(String contentType) {
        String ct = contentType.toLowerCase(Locale.ROOT);
        if (ct.contains("jpeg")) {
            return ".jpg";
        }
        if (ct.contains("png")) {
            return ".png";
        }
        if (ct.contains("webp")) {
            return ".webp";
        }
        return ".bin";
    }
}
