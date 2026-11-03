package org.tsa.quality;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

// These tags label an isolated classroom fixture; no real API is called.
public class TagFilteringExampleTest {
    @Tag("smoke")
    @Tag("fixture")
    @Test void fastDeterministicCheck() {
        assertEquals("service", " service ".trim());
    }

    @Tag("regression")
    @Test void secondIndependentCheck() {
        assertEquals(6, 2 * 3);
    }
}
