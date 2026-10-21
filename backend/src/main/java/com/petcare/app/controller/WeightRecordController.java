package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateWeightRecordRequest;
import com.petcare.app.dto.response.WeightRecordResponse;
import com.petcare.app.service.WeightRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals/{animalId}/weight-records")
public class WeightRecordController {

    private final WeightRecordService weightRecordService;

    public WeightRecordController(WeightRecordService weightRecordService) {
        this.weightRecordService = weightRecordService;
    }

    @GetMapping
    public ResponseEntity<List<WeightRecordResponse>> getAll(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(weightRecordService.getAllByAnimalId(animalId, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeightRecordResponse> getById(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(weightRecordService.getById(animalId, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<WeightRecordResponse> create(
            @PathVariable String animalId,
            @Valid @RequestBody CreateWeightRecordRequest request,
            Authentication authentication) {
        WeightRecordResponse response = weightRecordService.create(animalId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeightRecordResponse> update(
            @PathVariable String animalId, @PathVariable String id,
            @Valid @RequestBody CreateWeightRecordRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(weightRecordService.update(animalId, id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        weightRecordService.delete(animalId, id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
