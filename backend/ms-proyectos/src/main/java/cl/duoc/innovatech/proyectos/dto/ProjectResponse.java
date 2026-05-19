package cl.duoc.innovatech.proyectos.dto;

import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import java.time.LocalDateTime;

public record ProjectResponse(
        Long id,
        String name,
        String description,
        ProjectStatus status,
        int pendingTasks,
        Long teamId,
        LocalDateTime createdAt
) {
    public static ProjectResponse from(Project p) {
        return new ProjectResponse(
                p.getId(), p.getName(), p.getDescription(),
                p.getStatus(), p.getPendingTasks(), p.getTeamId(), p.getCreatedAt()
        );
    }
}
