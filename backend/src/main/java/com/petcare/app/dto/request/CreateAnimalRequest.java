package com.petcare.app.dto.request;

import com.petcare.app.enums.Gender;
import com.petcare.app.enums.Species;
import jakarta.validation.constraints.NotBlank;
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
public class CreateAnimalRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Species is required")
    private Species species;

    private String breed;
    private LocalDate birthDate;
    private Double weight;
    private Gender gender;
    private String photoUrl;
    private String color;
    private String notes;
    private String chipNumber;
}
