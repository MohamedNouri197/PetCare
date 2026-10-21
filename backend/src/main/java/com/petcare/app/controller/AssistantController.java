package com.petcare.app.controller;

import com.petcare.app.dto.request.AssistantRequest;
import com.petcare.app.dto.response.AssistantResponse;
import com.petcare.app.service.AssistantService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/advice")
    public ResponseEntity<AssistantResponse> getAdvice(
            @Valid @RequestBody AssistantRequest request, Authentication authentication) {
        AssistantResponse response = assistantService.getAdvice(request, authentication.getName());
        return ResponseEntity.ok(response);
    }
}
