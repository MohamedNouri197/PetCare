package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateMealRequest;
import com.petcare.app.dto.response.MealResponse;
import com.petcare.app.service.MealService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals/{animalId}/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public ResponseEntity<List<MealResponse>> getAll(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(mealService.getAllByAnimalId(animalId, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealResponse> getById(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(mealService.getById(animalId, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<MealResponse> create(
            @PathVariable String animalId,
            @Valid @RequestBody CreateMealRequest request,
            Authentication authentication) {
        MealResponse response = mealService.create(animalId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealResponse> update(
            @PathVariable String animalId, @PathVariable String id,
            @Valid @RequestBody CreateMealRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(mealService.update(animalId, id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        mealService.delete(animalId, id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
