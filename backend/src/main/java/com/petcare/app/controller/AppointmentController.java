package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateAppointmentRequest;
import com.petcare.app.dto.response.AppointmentResponse;
import com.petcare.app.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals/{animalId}/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<AppointmentResponse>> getAll(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getAllByAnimalId(animalId, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getById(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(appointmentService.getById(animalId, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(
            @PathVariable String animalId,
            @Valid @RequestBody CreateAppointmentRequest request,
            Authentication authentication) {
        AppointmentResponse response = appointmentService.create(animalId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponse> update(
            @PathVariable String animalId, @PathVariable String id,
            @Valid @RequestBody CreateAppointmentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(appointmentService.update(animalId, id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        appointmentService.delete(animalId, id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
