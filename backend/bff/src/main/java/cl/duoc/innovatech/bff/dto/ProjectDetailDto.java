package cl.duoc.innovatech.bff.dto;

import java.util.List;
import java.util.Map;

public record ProjectDetailDto(
        Map<String, Object> project,
        List<Map<String, Object>> members,
        double averageCapacityPercent
) {}
