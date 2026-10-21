package com.petcare.app.service;

import com.petcare.app.dto.request.CreateReminderRequest;
import com.petcare.app.dto.response.ReminderResponse;
import com.petcare.app.entity.Animal;
import com.petcare.app.entity.Reminder;
import com.petcare.app.exception.ResourceNotFoundException;
import com.petcare.app.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReminderService {

    private final ReminderRepository reminderRepository;
    private final AnimalService animalService;

    public ReminderService(ReminderRepository reminderRepository, AnimalService animalService) {
        this.reminderRepository = reminderRepository;
        this.animalService = animalService;
    }

    public List<ReminderResponse> getAllByAnimalId(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return reminderRepository.findByAnimalIdOrderByDateTimeDesc(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ReminderResponse> getActiveReminders(String animalId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        return reminderRepository.findActiveReminders(animalId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReminderResponse getById(String animalId, String reminderId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", reminderId));
        return toResponse(reminder);
    }

    public ReminderResponse create(String animalId, CreateReminderRequest request, String userEmail) {
        Animal animal = animalService.getAnimalAndVerifyOwner(animalId, userEmail);

        Reminder reminder = Reminder.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .dateTime(request.getDateTime())
                .type(request.getType())
                .recurring(request.isRecurring())
                .recurringIntervalDays(request.getRecurringIntervalDays())
                .active(true)
                .animalId(animal.getId())
                .build();

        reminder = reminderRepository.save(reminder);
        return toResponse(reminder);
    }

    public ReminderResponse update(String animalId, String reminderId, CreateReminderRequest request, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", reminderId));

        reminder.setTitle(request.getTitle());
        reminder.setMessage(request.getMessage());
        reminder.setDateTime(request.getDateTime());
        reminder.setType(request.getType());
        reminder.setRecurring(request.isRecurring());
        reminder.setRecurringIntervalDays(request.getRecurringIntervalDays());
        reminder.setActive(request.isActive());

        reminder = reminderRepository.save(reminder);
        return toResponse(reminder);
    }

    public void delete(String animalId, String reminderId, String userEmail) {
        animalService.getAnimalAndVerifyOwner(animalId, userEmail);
        Reminder reminder = reminderRepository.findById(reminderId)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", reminderId));
        reminderRepository.delete(reminder);
    }

    private ReminderResponse toResponse(Reminder reminder) {
        return ReminderResponse.builder()
                .id(reminder.getId())
                .title(reminder.getTitle())
                .message(reminder.getMessage())
                .dateTime(reminder.getDateTime())
                .type(reminder.getType())
                .recurring(reminder.isRecurring())
                .recurringIntervalDays(reminder.getRecurringIntervalDays())
                .active(reminder.isActive())
                .animalId(reminder.getAnimalId())
                .build();
    }
}
