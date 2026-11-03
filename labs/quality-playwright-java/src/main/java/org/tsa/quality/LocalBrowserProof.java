package org.tsa.quality;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

/**
 * Actual Playwright JAVA against TSA's disposable local Quality teaching page.
 * No real Steward product, credentials, identity provider or database.
 */
public class LocalBrowserProof {
    static void check(String actual, String expected, String why) {
        if (!Objects.equals(actual, expected)) {
            throw new AssertionError("EXPECTED_STORAGE_MISMATCH " + why
                + " expected=" + expected + " actual=" + actual);
        }
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 1) throw new IllegalArgumentException("Pass local teaching URL");
        String url = args[0];
        if (!url.startsWith("http://127.0.0.1:4173/labs/quality-browser-events.html"))
            throw new IllegalArgumentException("Local training fixture only: " + url);
        boolean wrongOracle = args.length > 1 && args[1].equals("--wrong-oracle");

        try (Playwright playwright = Playwright.create()) {
            Browser browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(true));
            BrowserContext firstContext = browser.newContext(
                new Browser.NewContextOptions().setViewportSize(390, 844)
                    .setAcceptDownloads(true));
            try {
                Page first = firstContext.newPage();
                first.navigate(url);
                assertThat(first.getByRole(AriaRole.HEADING,
                    new Page.GetByRoleOptions().setName("Browser Events — Local Quality Lab"))).isVisible();

                first.getByRole(AriaRole.BUTTON,
                    new Page.GetByRoleOptions().setName("Save isolated sample state")).click();
                check(first.locator("#state-result").textContent(),
                    "origin=sample-42; tab=tab-42", "initial stored values");

                Page secondTab = firstContext.newPage();
                secondTab.navigate(url);
                secondTab.getByRole(AriaRole.BUTTON,
                    new Page.GetByRoleOptions().setName("Read sample state")).click();
                check(secondTab.locator("#state-result").textContent(),
                    wrongOracle ? "origin=absent; tab=absent" : "origin=sample-42; tab=absent",
                    "same-context localStorage shared, sessionStorage distinct");
                System.out.println("PASS Java Playwright: two Pages share origin storage, not tab session");

                BrowserContext isolated = browser.newContext(
                    new Browser.NewContextOptions().setViewportSize(390, 844));
                try {
                    Page fresh = isolated.newPage();
                    fresh.navigate(url);
                    fresh.getByRole(AriaRole.BUTTON,
                        new Page.GetByRoleOptions().setName("Read sample state")).click();
                    check(fresh.locator("#state-result").textContent(),
                        "origin=absent; tab=absent", "separate BrowserContext");
                } finally { isolated.close(); }
                System.out.println("PASS Java Playwright: fresh BrowserContext has no fixture state");

                Download download = first.waitForDownload(() ->
                    first.getByRole(AriaRole.LINK,
                        new Page.GetByRoleOptions().setName("Download sample report")).click());
                check(download.suggestedFilename(), "quality-record-42.csv", "filename");
                Path result = Files.createTempFile("tsa-quality-java-export-", ".csv");
                try {
                    download.saveAs(result);
                    check(Files.readString(result, StandardCharsets.UTF_8),
                        "record_id,owner\n42,team7\n", "downloaded CSV bytes");
                } finally { Files.deleteIfExists(result); }
                System.out.println("PASS Java Playwright: event-safe download and exact CSV bytes");
            } finally {
                firstContext.close();
                browser.close();
            }
        }
        System.out.println("PASS isolated Java Playwright Chromium teaching fixture");
    }
}
