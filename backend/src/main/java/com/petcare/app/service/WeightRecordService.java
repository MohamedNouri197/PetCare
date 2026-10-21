package com.petcare.app.service;

import com.petcare.app.dto.request.CreateWeightRecordRequest;
import com.petcare.app.dto.response.WeightRecordResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.WeightRecord;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.repository.AnimalRepository;
import com.petcare.app.repository.WeightRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeightRecordService {

    private final WeightRecordRepository weightRecordRepository;
    private final AnimalService animalService;
    private final AnimalRepository animalRepository;

    public WeightRecordService(WeightRecordRepository weightRecordRepository, AnimalService animalService,
                               AnimalRepository animalRepository) {
        this.weightRecordRepository = weightRecordRepository;
        this.animalService = animalService;
        this.animalRepository = animalRepository;
    }

    public List<WeightRecordResponse> getAllByAnimalId(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return weightRecordRepository.findByAnimalIdOrderByDateDesc(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public WeightRecordResponse getById(String animalId, String recordId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        WeightRecord record = weightRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("WeightRecord", recordId));
        return toResponse(record);
    }

    public WeightRecordResponse create(String animalId, CreateWeightRecordRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(animalId, userEmail);

        WeightRecord record = WeightRecord.builder()
                .weight(request.getWeight())
                .date(request.getDate())
                .notes(request.getNotes())
                .animalId(animal.getId())
                .build();

        record = weightRecordRepository.save(record);

        // Update the animal's current weight
        animal.setWeight(request.getWeight());
        animalRepository.save(animal);

        return toResponse(record);
    }

    public WeightRecordResponse update(String animalId, String recordId, CreateWeightRecordRequest request, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        WeightRecord record = weightRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("WeightRecord", recordId));

        record.setWeight(request.getWeight());
        record.setDate(request.getDate());
        record.setNotes(request.getNotes());

        record = weightRecordRepository.save(record);
        return toResponse(record);
    }

    public void delete(String animalId, String recordId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        WeightRecord record = weightRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("WeightRecord", recordId));
        weightRecordRepository.delete(record);
    }

    private WeightRecordResponse toResponse(WeightRecord record) {
        return WeightRecordResponse.builder()
                .id(record.getId())
                .weight(record.getWeight())
                .date(record.getDate())
                .notes(record.getNotes())
                .animalId(record.getAnimalId())
                .build();
    }
}
