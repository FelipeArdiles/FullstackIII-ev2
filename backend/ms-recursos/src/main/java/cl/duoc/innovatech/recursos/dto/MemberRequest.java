package cl.duoc.innovatech.recursos.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

public record MemberRequest(
        @NotBlank String name,
        @NotBlank String role,
        @NotBlank @Email String email,
        @Min(1) Integer weeklyHours
) {}
