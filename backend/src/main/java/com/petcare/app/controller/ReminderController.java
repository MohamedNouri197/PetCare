package com.petcare.app.controller;

import com.petcare.app.dto.request.CreateReminderRequest;
import com.petcare.app.dto.response.ReminderResponse;
import com.petcare.app.service.ReminderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animals/{animalId}/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> getAll(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(reminderService.getAllByAnimalId(animalId, authentication.getName()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<ReminderResponse>> getActiveReminders(
            @PathVariable String animalId, Authentication authentication) {
        return ResponseEntity.ok(reminderService.getActiveReminders(animalId, authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderResponse> getById(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        return ResponseEntity.ok(reminderService.getById(animalId, id, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<ReminderResponse> create(
            @PathVariable String animalId,
            @Valid @RequestBody CreateReminderRequest request,
            Authentication authentication) {
        ReminderResponse response = reminderService.create(animalId, request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderResponse> update(
            @PathVariable String animalId, @PathVariable String id,
            @Valid @RequestBody CreateReminderRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(reminderService.update(animalId, id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String animalId, @PathVariable String id, Authentication authentication) {
        reminderService.delete(animalId, id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
