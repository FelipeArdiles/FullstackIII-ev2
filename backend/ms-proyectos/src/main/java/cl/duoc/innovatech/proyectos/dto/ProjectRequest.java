package cl.duoc.innovatech.proyectos.dto;

import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import jakarta.validation.constraints.NotBlank;

public record ProjectRequest(
        @NotBlank String name,
        @NotBlank String description,
        ProjectStatus initialStatus,
        Long teamId
) {}
