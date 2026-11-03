package org.tsa.quality;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * An intentionally in-process *teaching* fixture for Failsafe discovery.
 * It does not contact Steward, Postgres, a browser, or an external service.
 */
public class ProtocolIT {
    @Test void provesFailsafeOwnsITDiscovery() {
        String observed = "202 accepted";
        assertEquals("202 accepted", observed);
    }
}
