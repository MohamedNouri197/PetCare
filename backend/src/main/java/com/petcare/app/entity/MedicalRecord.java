package com.petcare.app.entity;

import com.petcare.app.enums.MedicalRecordType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Document(collection = "medical_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecord {

    @Id
    private String id;

    @NotNull
    private MedicalRecordType type;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDate date;

    private String veterinarian;
    private String clinic;
    private String notes;
    private BigDecimal cost;

    @NotNull
    private String animalId;
}
