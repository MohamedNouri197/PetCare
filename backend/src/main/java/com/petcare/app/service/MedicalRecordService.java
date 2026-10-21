package com.petcare.app.service;

import com.petcare.app.dto.request.CreateMedicalRecordRequest;
import com.petcare.app.dto.response.MedicalRecordResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.MedicalRecord;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AnimalService animalService;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository, AnimalService animalService) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.animalService = animalService;
    }

    public List<MedicalRecordResponse> getAllByAnimalId(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return medicalRecordRepository.findByAnimalIdOrderByDateDesc(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MedicalRecordResponse getById(String animalId, String recordId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", recordId));
        return toResponse(record);
    }

    public MedicalRecordResponse create(String animalId, CreateMedicalRecordRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(animalId, userEmail);

        MedicalRecord record = MedicalRecord.builder()
                .type(request.getType())
                .title(request.getTitle())
                .description(request.getDescription())
                .date(request.getDate())
                .veterinarian(request.getVeterinarian())
                .clinic(request.getClinic())
                .notes(request.getNotes())
                .cost(request.getCost())
                .animalId(animal.getId())
                .build();

        record = medicalRecordRepository.save(record);
        return toResponse(record);
    }

    public MedicalRecordResponse update(String animalId, String recordId, CreateMedicalRecordRequest request, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", recordId));

        record.setType(request.getType());
        record.setTitle(request.getTitle());
        record.setDescription(request.getDescription());
        record.setDate(request.getDate());
        record.setVeterinarian(request.getVeterinarian());
        record.setClinic(request.getClinic());
        record.setNotes(request.getNotes());
        record.setCost(request.getCost());

        record = medicalRecordRepository.save(record);
        return toResponse(record);
    }

    public void delete(String animalId, String recordId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", recordId));
        medicalRecordRepository.delete(record);
    }

    private MedicalRecordResponse toResponse(MedicalRecord record) {
        return MedicalRecordResponse.builder()
                .id(record.getId())
                .type(record.getType())
                .title(record.getTitle())
                .description(record.getDescription())
                .date(record.getDate())
                .veterinarian(record.getVeterinarian())
                .clinic(record.getClinic())
                .notes(record.getNotes())
                .cost(record.getCost())
                .animalId(record.getAnimalId())
                .build();
    }
}
