package cl.duoc.innovatech.recursos.strategy;

/** Strategy: calcula el porcentaje de capacidad disponible de un recurso. */
public interface CapacityStrategy {
    double availablePercentage(int weeklyHours, int assignedHours);
}
