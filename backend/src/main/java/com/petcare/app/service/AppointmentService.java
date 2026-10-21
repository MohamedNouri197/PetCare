package com.petcare.app.service;

import com.petcare.app.dto.request.CreateAppointmentRequest;
import com.petcare.app.dto.response.AppointmentResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.Appointment;
import com.petcare.app.enums.AppointmentStatus;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AnimalService animalService;

    public AppointmentService(AppointmentRepository appointmentRepository, AnimalService animalService) {
        this.appointmentRepository = appointmentRepository;
        this.animalService = animalService;
    }

    public List<AppointmentResponse> getAllByAnimalId(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return appointmentRepository.findByAnimalIdOrderByDateTimeDesc(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getById(String animalId, String appointmentId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));
        return toResponse(appointment);
    }

    public AppointmentResponse create(String animalId, CreateAppointmentRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(animalId, userEmail);

        Appointment appointment = Appointment.builder()
                .title(request.getTitle())
                .dateTime(request.getDateTime())
                .veterinarian(request.getVeterinarian())
                .clinic(request.getClinic())
                .type(request.getType())
                .status(request.getStatus() != null ? request.getStatus() : AppointmentStatus.SCHEDULED)
                .notes(request.getNotes())
                .animalId(animal.getId())
                .build();

        appointment = appointmentRepository.save(appointment);
        return toResponse(appointment);
    }

    public AppointmentResponse update(String animalId, String appointmentId, CreateAppointmentRequest request, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));

        appointment.setTitle(request.getTitle());
        appointment.setDateTime(request.getDateTime());
        appointment.setVeterinarian(request.getVeterinarian());
        appointment.setClinic(request.getClinic());
        appointment.setType(request.getType());
        if (request.getStatus() != null) {
            appointment.setStatus(request.getStatus());
        }
        appointment.setNotes(request.getNotes());

        appointment = appointmentRepository.save(appointment);
        return toResponse(appointment);
    }

    public void delete(String animalId, String appointmentId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", appointmentId));
        appointmentRepository.delete(appointment);
    }

    private AppointmentResponse toResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .title(appointment.getTitle())
                .dateTime(appointment.getDateTime())
                .veterinarian(appointment.getVeterinarian())
                .clinic(appointment.getClinic())
                .type(appointment.getType())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .animalId(appointment.getAnimalId())
                .build();
    }
}
