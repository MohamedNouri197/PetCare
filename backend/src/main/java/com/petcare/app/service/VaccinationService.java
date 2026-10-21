package com.petcare.app.service;

import com.petcare.app.dto.request.CreateVaccinationRequest;
import com.petcare.app.dto.response.VaccinationResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.Vaccination;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.repository.VaccinationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VaccinationService {

    private final VaccinationRepository vaccinationRepository;
    private final AnimalService animalService;

    public VaccinationService(VaccinationRepository vaccinationRepository, AnimalService animalService) {
        this.vaccinationRepository = vaccinationRepository;
        this.animalService = animalService;
    }

    public List<VaccinationResponse> getAllByAnimalId(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return vaccinationRepository.findByAnimalIdOrderByDateDesc(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public VaccinationResponse getById(String animalId, String vaccinationId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Vaccination vaccination = vaccinationRepository.findById(vaccinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination", vaccinationId));
        return toResponse(vaccination);
    }

    public VaccinationResponse create(String animalId, CreateVaccinationRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(animalId, userEmail);

        Vaccination vaccination = Vaccination.builder()
                .name(request.getName())
                .date(request.getDate())
                .nextDueDate(request.getNextDueDate())
                .veterinarian(request.getVeterinarian())
                .clinic(request.getClinic())
                .batchNumber(request.getBatchNumber())
                .notes(request.getNotes())
                .animalId(animal.getId())
                .build();

        vaccination = vaccinationRepository.save(vaccination);
        return toResponse(vaccination);
    }

    public VaccinationResponse update(String animalId, String vaccinationId, CreateVaccinationRequest request, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Vaccination vaccination = vaccinationRepository.findById(vaccinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination", vaccinationId));

        vaccination.setName(request.getName());
        vaccination.setDate(request.getDate());
        vaccination.setNextDueDate(request.getNextDueDate());
        vaccination.setVeterinarian(request.getVeterinarian());
        vaccination.setClinic(request.getClinic());
        vaccination.setBatchNumber(request.getBatchNumber());
        vaccination.setNotes(request.getNotes());

        vaccination = vaccinationRepository.save(vaccination);
        return toResponse(vaccination);
    }

    public void delete(String animalId, String vaccinationId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Vaccination vaccination = vaccinationRepository.findById(vaccinationId)
                .orElseThrow(() -> new ResourceNotFoundException("Vaccination", vaccinationId));
        vaccinationRepository.delete(vaccination);
    }

    private VaccinationResponse toResponse(Vaccination vaccination) {
        return VaccinationResponse.builder()
                .id(vaccination.getId())
                .name(vaccination.getName())
                .date(vaccination.getDate())
                .nextDueDate(vaccination.getNextDueDate())
                .veterinarian(vaccination.getVeterinarian())
                .clinic(vaccination.getClinic())
                .batchNumber(vaccination.getBatchNumber())
                .notes(vaccination.getNotes())
                .animalId(vaccination.getAnimalId())
                .build();
    }
}
