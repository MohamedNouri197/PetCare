package com.petcare.app.entity;

import com.petcare.app.enums.MealUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Document(collection = "meals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Meal {

    @Id
    private String id;

    @NotBlank
    private String foodName;

    private String foodBrand;

    @NotNull
    private Double quantity;

    @NotNull
    private MealUnit unit;

    @NotNull
    private LocalTime scheduledTime;

    private String notes;

    @NotNull
    private String animalId;
}
