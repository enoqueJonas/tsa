package org.tsa.quality;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(PolicyTest.ProbeExtension.class)
public class PolicyTest {
    static final class ProbeExtension implements BeforeEachCallback {
        static int calls;
        @Override public void beforeEach(ExtensionContext context) {
            if (context.getRequiredTestMethod() == null) throw new IllegalStateException("undiscovered method");
            calls++;
        }
    }
    private boolean initialized;
    @BeforeEach void setUp() { initialized = true; }

    static boolean mayEdit(String actor, boolean active, boolean locked) {
        return actor.equals("owner") && active && !locked;
    }

    @Test void ownerCanEditActiveUnlocked() {
        assertTrue(initialized, "JUnit Jupiter must call BeforeEach");
        assertTrue(ProbeExtension.calls > 0, "JUnit extension must run");
        assertTrue(mayEdit("owner", true, false));
    }

    @ParameterizedTest(name="nonowner case {index}: {0}, active={1}, locked={2}")
    @CsvSource({"nonowner,true,false", "owner,false,false", "owner,true,true"})
    void editRejectedWhenContractForbids(String actor, boolean active, boolean locked) {
        assertTrue(initialized, "JUnit Jupiter must initialize each invocation");
        assertFalse(mayEdit(actor, active, locked));
    }
}
