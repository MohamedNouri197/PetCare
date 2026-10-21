package com.petcare.app.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateWeightRecordRequest {

    @NotNull(message = "Weight is required")
    private Double weight;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String notes;
}
