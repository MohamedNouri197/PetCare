package com.petcare.app.dto.request;

import com.petcare.app.enums.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReminderRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String message;

    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;

    @NotNull(message = "Reminder type is required")
    private ReminderType type;

    private boolean recurring;
    private Integer recurringIntervalDays;
    private boolean active;
}
