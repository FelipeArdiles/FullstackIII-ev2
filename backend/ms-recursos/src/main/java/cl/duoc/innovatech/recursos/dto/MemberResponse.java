package cl.duoc.innovatech.recursos.dto;

import cl.duoc.innovatech.recursos.model.TeamMember;
import java.util.Set;

public record MemberResponse(
        Long id,
        String name,
        String role,
        String email,
        int weeklyHours,
        int assignedHours,
        double availableCapacityPercent,
        Set<Long> projectIds
) {
    public static MemberResponse from(TeamMember m, double capacity) {
        return new MemberResponse(
                m.getId(), m.getName(), m.getRole(), m.getEmail(),
                m.getWeeklyHours(), m.getAssignedHours(), capacity, m.getProjectIds()
        );
    }
}
