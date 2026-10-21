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
public class WeightRecordResponse {

    private String id;
    private Double weight;
    private LocalDate date;
    private String notes;
    private String animalId;
}
