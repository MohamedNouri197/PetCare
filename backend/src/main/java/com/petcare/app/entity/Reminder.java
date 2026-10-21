package com.petcare.app.entity;

import com.petcare.app.enums.ReminderType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "reminders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reminder {

    @Id
    private String id;

    @NotBlank
    private String title;

    private String message;

    @NotNull
    private LocalDateTime dateTime;

    @NotNull
    private ReminderType type;

    @Builder.Default
    private boolean recurring = false;

    private Integer recurringIntervalDays;

    @Builder.Default
    private boolean active = true;

    @NotNull
    private String animalId;
}
