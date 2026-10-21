package com.petcare.app.dto.request;

import com.petcare.app.enums.AppointmentStatus;
import com.petcare.app.enums.AppointmentType;
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
public class CreateAppointmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;

    private String veterinarian;
    private String clinic;

    @NotNull(message = "Appointment type is required")
    private AppointmentType type;

    private AppointmentStatus status;
    private String notes;
}
