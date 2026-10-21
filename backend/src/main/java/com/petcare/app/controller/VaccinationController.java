package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateVaccinationRequest;
import com.petcare.app.dto.response.VaccinationResponse;
import com.petcare.app.service.VaccinationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals/{animalId}/vaccinations")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    public VaccinationController(VaccinationService vaccinationService) {
        this.vaccinationService = vaccinationService;
    }

    @GetMapping
    public ResponseEntity<List<VaccinationResponse>> getAll(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(vaccinationService.getAllByAnimalId(animalId, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VaccinationResponse> getById(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(vaccinationService.getById(animalId, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<VaccinationResponse> create(
            @PathVariable String animalId,
            @Valid @RequestBody CreateVaccinationRequest request,
            Authentication authentication) {
        VaccinationResponse response = vaccinationService.create(animalId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VaccinationResponse> update(
            @PathVariable String animalId, @PathVariable String id,
            @Valid @RequestBody CreateVaccinationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(vaccinationService.update(animalId, id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        vaccinationService.delete(animalId, id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
