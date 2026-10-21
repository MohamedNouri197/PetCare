package com.petcare.app.dto.response;

import com.petcare.app.enums.MedicalRecordType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordResponse {

    private String id;
    private MedicalRecordType type;
    private String title;
    private String description;
    private LocalDate date;
    private String veterinarian;
    private String clinic;
    private String notes;
    private BigDecimal cost;
    private String animalId;
}
