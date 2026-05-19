package cl.duoc.innovatech.recursos.strategy;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class StandardCapacityStrategyTest {

    private final StandardCapacityStrategy strategy = new StandardCapacityStrategy();

    @Test
    void calculaCapacidadDisponible() {
        assertEquals(50.0, strategy.availablePercentage(40, 20), 0.01);
    }

    @Test
    void sinHorasRetornaCero() {
        assertEquals(0, strategy.availablePercentage(0, 0));
    }
}
