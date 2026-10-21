package com.petcare.app.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "vaccinations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vaccination {

    @Id
    private String id;

    @NotBlank
    private String name;

    @NotNull
    private LocalDate date;

    private LocalDate nextDueDate;
    private String veterinarian;
    private String clinic;
    private String batchNumber;
    private String notes;

    @NotNull
    private String animalId;
}
