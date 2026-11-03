package org.tsa.quality;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.concurrent.atomic.AtomicInteger;
import static org.junit.jupiter.api.Assertions.*;

// PER_METHOD (the default) must construct a distinct test instance per test.
public class LifecycleOwnershipTest {
    static final AtomicInteger constructed = new AtomicInteger();
    static final AtomicInteger opened = new AtomicInteger();
    static final AtomicInteger closed = new AtomicInteger();

    private final int instanceNumber;
    private boolean ownedResourceOpen = false;

    public LifecycleOwnershipTest() {
        instanceNumber = constructed.incrementAndGet();
    }

    @BeforeEach void openOwnedResource() {
        assertFalse(ownedResourceOpen, "new test instance must not inherit resources");
        ownedResourceOpen = true;
        opened.incrementAndGet();
    }

    @AfterEach void closeOwnedResource() {
        assertTrue(ownedResourceOpen, "resource must exist even after test assertion failure");
        ownedResourceOpen = false;
        closed.incrementAndGet();
    }

    @Test void firstIndependentExecution() {
        assertTrue(ownedResourceOpen);
        assertTrue(instanceNumber >= 1);
    }

    @Test void secondIndependentExecution() {
        assertTrue(ownedResourceOpen);
        assertTrue(instanceNumber >= 1);
    }

    @AfterAll static void verifyEveryInvocationOwnedAndClosedItsResource() {
        assertEquals(2, constructed.get(), "default PER_METHOD must construct two instances");
        assertEquals(2, opened.get(), "two independent setups must run");
        assertEquals(2, closed.get(), "cleanup must run for both test invocations");
    }
}
