package com.petcare.app.entity;

import com.petcare.app.enums.AppointmentStatus;
import com.petcare.app.enums.AppointmentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    private String id;

    @NotBlank
    private String title;

    @NotNull
    private LocalDateTime dateTime;

    private String veterinarian;
    private String clinic;

    @NotNull
    private AppointmentType type;

    @NotNull
    private AppointmentStatus status;

    private String notes;

    @NotNull
    private String animalId;
}
