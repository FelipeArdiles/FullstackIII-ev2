package cl.duoc.innovatech.recursos.strategy;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SeniorCapacityStrategyTest {

    private final SeniorCapacityStrategy strategy = new SeniorCapacityStrategy();

    @Test
    void aplicaBufferDelDiezPorcientoEnHorasSemanales() {
        double capacity = strategy.availablePercentage(40, 20);
        assertTrue(capacity > 50.0);
        assertEquals(54.54, capacity, 0.1);
    }

    @Test
    void sinHorasSemanalesRetornaCero() {
        assertEquals(0, strategy.availablePercentage(0, 0));
    }

    @Test
    void horasAsignadasExcedenEfectivasRetornaCero() {
        assertEquals(0, strategy.availablePercentage(10, 100), 0.01);
    }
}
