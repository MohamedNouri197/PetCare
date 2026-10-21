package com.petcare.app.entity;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "weight_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeightRecord {

    @Id
    private String id;

    @NotNull
    private Double weight;

    @NotNull
    private LocalDate date;

    private String notes;

    @NotNull
    private String animalId;
}
