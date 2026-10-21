package com.petcare.app.dto.request;

import com.petcare.app.enums.MealUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMealRequest {

    @NotBlank(message = "Food name is required")
    private String foodName;

    private String foodBrand;

    @NotNull(message = "Quantity is required")
    private Double quantity;

    @NotNull(message = "Unit is required")
    private MealUnit unit;

    @NotNull(message = "Scheduled time is required")
    private LocalTime scheduledTime;

    private String notes;
}
