package com.petcare.app.service;

import com.petcare.app.dto.request.CreateMealRequest;
import com.petcare.app.dto.response.MealResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.Meal;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.repository.MealRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MealService {

    private final MealRepository mealRepository;
    private final AnimalService animalService;

    public MealService(MealRepository mealRepository, AnimalService animalService) {
        this.mealRepository = mealRepository;
        this.animalService = animalService;
    }

    public List<MealResponse> getAllByAnimalId(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return mealRepository.findByAnimalIdOrderByScheduledTimeAsc(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MealResponse getById(String animalId, String mealId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal", mealId));
        return toResponse(meal);
    }

    public MealResponse create(String animalId, CreateMealRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(animalId, userEmail);

        Meal meal = Meal.builder()
                .foodName(request.getFoodName())
                .foodBrand(request.getFoodBrand())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .scheduledTime(request.getScheduledTime())
                .notes(request.getNotes())
                .animalId(animal.getId())
                .build();

        meal = mealRepository.save(meal);
        return toResponse(meal);
    }

    public MealResponse update(String animalId, String mealId, CreateMealRequest request, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal", mealId));

        meal.setFoodName(request.getFoodName());
        meal.setFoodBrand(request.getFoodBrand());
        meal.setQuantity(request.getQuantity());
        meal.setUnit(request.getUnit());
        meal.setScheduledTime(request.getScheduledTime());
        meal.setNotes(request.getNotes());

        meal = mealRepository.save(meal);
        return toResponse(meal);
    }

    public void delete(String animalId, String mealId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Meal meal = mealRepository.findById(mealId)
                .orElseThrow(() -> new ResourceNotFoundException("Meal", mealId));
        mealRepository.delete(meal);
    }

    private MealResponse toResponse(Meal meal) {
        return MealResponse.builder()
                .id(meal.getId())
                .foodName(meal.getFoodName())
                .foodBrand(meal.getFoodBrand())
                .quantity(meal.getQuantity())
                .unit(meal.getUnit())
                .scheduledTime(meal.getScheduledTime())
                .notes(meal.getNotes())
                .animalId(meal.getAnimalId())
                .build();
    }
}
