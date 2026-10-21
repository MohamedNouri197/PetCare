package com.petcare.app.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssistantRequest {

    @NotNull(message = "Animal ID is required")
    private String animalId;

    @NotEmpty(message = "At least one symptom is required")
    private List<String> symptoms;
}
