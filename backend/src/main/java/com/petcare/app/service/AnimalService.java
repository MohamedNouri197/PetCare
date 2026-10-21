package com.petcare.app.service;

import com.petcare.app.dto.request.CreateAnimalRequest;
import com.petcare.app.dto.request.UpdateAnimalRequest;
import com.petcare.app.dto.response.AnimalResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.User;
import com.petcare.app.enums.Species;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.exception.UnauthorizedAccessException;
import com.petcare.app.repository.AnimalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    private final AnimalRepository animalRepository;
    private final AuthService authService;

    public AnimalService(AnimalRepository animalRepository, AuthService authService) {
        this.animalRepository = animalRepository;
        this.authService = authService;
    }

    public List<AnimalResponse> getAllAnimals(String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return animalRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AnimalResponse getAnimalById(String id, String userEmail) {
        Animal animal = getAnimalAndVerifyOwner(id, userEmail);
        return toResponse(animal);
    }

    public AnimalResponse createAnimal(CreateAnimalRequest request, String userEmail) {
        User user = authService.getUserByEmail(userEmail);

        Animal animal = Animal.builder()
                .name(request.getName())
                .species(request.getSpecies())
                .breed(request.getBreed())
                .birthDate(request.getBirthDate())
                .weight(request.getWeight())
                .gender(request.getGender())
                .photoUrl(request.getPhotoUrl())
                .color(request.getColor())
                .notes(request.getNotes())
                .chipNumber(request.getChipNumber())
                .userId(user.getId())
                .build();

        animal = animalRepository.save(animal);
        return toResponse(animal);
    }

    public AnimalResponse updateAnimal(String id, UpdateAnimalRequest request, String userEmail) {
        Animal animal = getAnimalAndVerifyOwner(id, userEmail);

        if (request.getName() != null) animal.setName(request.getName());
        if (request.getSpecies() != null) animal.setSpecies(request.getSpecies());
        if (request.getBreed() != null) animal.setBreed(request.getBreed());
        if (request.getBirthDate() != null) animal.setBirthDate(request.getBirthDate());
        if (request.getWeight() != null) animal.setWeight(request.getWeight());
        if (request.getGender() != null) animal.setGender(request.getGender());
        if (request.getPhotoUrl() != null) animal.setPhotoUrl(request.getPhotoUrl());
        if (request.getColor() != null) animal.setColor(request.getColor());
        if (request.getNotes() != null) animal.setNotes(request.getNotes());
        if (request.getChipNumber() != null) animal.setChipNumber(request.getChipNumber());

        animal = animalRepository.save(animal);
        return toResponse(animal);
    }

    public void deleteAnimal(String id, String userEmail) {
        Animal animal = getAnimalAndVerifyOwner(id, userEmail);
        animalRepository.delete(animal);
    }

    public List<AnimalResponse> searchAnimals(String name, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return animalRepository.findByUserIdAndNameContainingIgnoreCase(user.getId(), name).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AnimalResponse> getAnimalsBySpecies(Species species, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        return animalRepository.findByUserIdAndSpecies(user.getId(), species).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Animal getAnimalAndVerifyOwner(String animalId, String userEmail) {
        User user = authService.getUserByEmail(userEmail);
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() -> new ResourceNotFoundException("Animal", animalId));

        if (!animal.getUserId().equals(user.getId())) {
            throw new UnauthorizedAccessException("You do not own this animal");
        }
        return animal;
    }

    private AnimalResponse toResponse(Animal animal) {
        return AnimalResponse.builder()
                .id(animal.getId())
                .name(animal.getName())
                .species(animal.getSpecies())
                .breed(animal.getBreed())
                .birthDate(animal.getBirthDate())
                .weight(animal.getWeight())
                .gender(animal.getGender())
                .photoUrl(animal.getPhotoUrl())
                .color(animal.getColor())
                .notes(animal.getNotes())
                .chipNumber(animal.getChipNumber())
                .ownerId(animal.getUserId())
                .build();
    }
}
