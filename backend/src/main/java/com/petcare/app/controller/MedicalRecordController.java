package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateMedicalRecordRequest;
import com.petcare.app.dto.response.MedicalRecordResponse;
import com.petcare.app.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals/{animalId}/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecordResponse>> getAll(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(medicalRecordService.getAllByAnimalId(animalId, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> getById(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(medicalRecordService.getById(animalId, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<MedicalRecordResponse> create(
            @PathVariable String animalId,
            @Valid @RequestBody CreateMedicalRecordRequest request,
            Authentication authentication) {
        MedicalRecordResponse response = medicalRecordService.create(animalId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecordResponse> update(
            @PathVariable String animalId, @PathVariable String id,
            @Valid @RequestBody CreateMedicalRecordRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(medicalRecordService.update(animalId, id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        medicalRecordService.delete(animalId, id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
