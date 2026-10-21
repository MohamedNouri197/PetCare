package com.petcare.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VaccinationResponse {

    private String id;
    private String name;
    private LocalDate date;
    private LocalDate nextDueDate;
    private String veterinarian;
    private String clinic;
    private String batchNumber;
    private String notes;
    private String animalId;
}
