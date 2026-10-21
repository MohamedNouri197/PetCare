package com.petcare.app.dto.response;

import com.petcare.app.enums.ReminderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReminderResponse {

    private String id;
    private String title;
    private String message;
    private LocalDateTime dateTime;
    private ReminderType type;
    private boolean recurring;
    private Integer recurringIntervalDays;
    private boolean active;
    private String animalId;
}
