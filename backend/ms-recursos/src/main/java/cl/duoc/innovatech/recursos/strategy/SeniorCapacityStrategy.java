package cl.duoc.innovatech.recursos.strategy;

import org.springframework.stereotype.Component;

/** Strategy alternativa: roles senior tienen buffer del 10% adicional. */
@Component
public class SeniorCapacityStrategy implements CapacityStrategy {
    @Override
    public double availablePercentage(int weeklyHours, int assignedHours) {
        int effectiveWeekly = (int) (weeklyHours * 1.1);
        if (effectiveWeekly <= 0) return 0;
        double used = Math.min(assignedHours, effectiveWeekly);
        return Math.max(0, ((effectiveWeekly - used) / (double) effectiveWeekly) * 100);
    }
}
