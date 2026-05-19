package cl.duoc.innovatech.recursos.strategy;

import org.springframework.stereotype.Component;

@Component
public class StandardCapacityStrategy implements CapacityStrategy {
    @Override
    public double availablePercentage(int weeklyHours, int assignedHours) {
        if (weeklyHours <= 0) return 0;
        double used = Math.min(assignedHours, weeklyHours);
        return Math.max(0, ((weeklyHours - used) / (double) weeklyHours) * 100);
    }
}
