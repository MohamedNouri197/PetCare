package com.petcare.app.dto.response;

import com.petcare.app.enums.AppointmentStatus;
import com.petcare.app.enums.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {

    private String id;
    private String title;
    private LocalDateTime dateTime;
    private String veterinarian;
    private String clinic;
    private AppointmentType type;
    private AppointmentStatus status;
    private String notes;
    private String animalId;
}
