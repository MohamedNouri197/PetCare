package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateAnimalRequest;
import com.petcare.app.dto.request.UpdateAnimalRequest;
import com.petcare.app.dto.response.AnimalResponse;
import com.petcare.app.enums.Species;
import com.petcare.app.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals")
public class AnimalController {

    private final AnimalService animalService;

    public AnimalController(AnimalService animalService) {
        this.animalService = animalService;
    }

    @GetMapping
    public ResponseEntity<List<AnimalResponse>> getAllAnimals(Authentication authentication) {
        return ResponseEntity.ok(animalService.getAllAnimals(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponse> getAnimalById(@PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(animalService.getAnimalById(id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AnimalResponse> createAnimal(
            @Valid @RequestBody CreateAnimalRequest request, Authentication authentication) {
        AnimalResponse response = animalService.createAnimal(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponse> updateAnimal(
            @PathVariable String id, @RequestBody UpdateAnimalRequest request, Authentication authentication) {
        return ResponseEntity.ok(animalService.updateAnimal(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable String id, Authentication authentication) {
        animalService.deleteAnimal(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<AnimalResponse>> searchAnimals(
            @RequestParam String name, Authentication authentication) {
        return ResponseEntity.ok(animalService.searchAnimals(name, authentication.getName()));
    }

    @GetMapping("/species/{species}")
    public ResponseEntity<List<AnimalResponse>> getAnimalsBySpecies(
            @PathVariable Species species, Authentication authentication) {
        return ResponseEntity.ok(animalService.getAnimalsBySpecies(species, authentication.getName()));
    }
}
