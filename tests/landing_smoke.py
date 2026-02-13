import subprocess
import time
import urllib.request
import urllib.error
import sys
from playwright.sync_api import sync_playwright

PORT = 4173
BASE_URL = f"http://127.0.0.1:{PORT}"


def wait_for_server(url: str, timeout_s: float = 20.0) -> None:
    start = time.time()
    while time.time() - start < timeout_s:
        try:
            with urllib.request.urlopen(url, timeout=1.5) as resp:
                if resp.status == 200:
                    return
        except Exception:
            pass
        time.sleep(0.3)
    raise RuntimeError(f"Timed out waiting for server at {url}")


def run_smoke() -> None:
    failures: list[str] = []

    with sync_playwright() as p:
        browser = p.firefox.launch(headless=True)
        for width in [375, 768, 1024, 1440]:
            context = browser.new_context(viewport={"width": width, "height": 900})
            page = context.new_page()

            console_errors: list[str] = []
            page.on("pageerror", lambda err: console_errors.append(f"pageerror: {err}"))
            page.on("console", lambda msg: console_errors.append(f"console: {msg.text}") if msg.type == "error" else None)

            page.goto(BASE_URL, wait_until="networkidle")

            overflow = page.evaluate(
                """() => ({
                  scrollWidth: document.documentElement.scrollWidth,
                  innerWidth: window.innerWidth,
                  hasOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
                })"""
            )
            if overflow["hasOverflow"]:
                failures.append(f"[{width}px] Horizontal overflow: {overflow['scrollWidth']} > {overflow['innerWidth']}")

            page.locator('a:has-text("Start Building")').first.click()
            page.wait_for_timeout(200)
            if "/dashboard" not in page.url:
                failures.append(f"[{width}px] Start Building CTA bad URL: {page.url}")

            page.goto(BASE_URL, wait_until="networkidle")
            page.locator('a:has-text("View Traces")').first.click()
            page.wait_for_timeout(200)
            if "/traces" not in page.url:
                failures.append(f"[{width}px] View Traces CTA bad URL: {page.url}")

            page.goto(BASE_URL, wait_until="networkidle")
            if width < 1024:
                page.locator('nav button:visible').first.click()
                page.locator('a[href="#districts"]').first.click()
            else:
                page.locator('button:has-text("Discover")').first.hover()
                page.locator('a[href="#districts"]').first.click()
            page.wait_for_timeout(150)
            if not page.url.endswith('#districts'):
                failures.append(f"[{width}px] Nav anchor did not navigate to #districts: {page.url}")

            if console_errors:
                failures.append(f"[{width}px] Console errors: {' | '.join(console_errors)}")

            context.close()

        browser.close()

    if failures:
        raise RuntimeError("Landing smoke checks failed:\n- " + "\n- ".join(failures))

    print("Landing smoke checks passed for 375/768/1024/1440")


def main() -> int:
    dev = subprocess.Popen(
        ["npm", "--prefix", "web", "run", "dev", "--", "--host", "0.0.0.0", "--port", str(PORT)],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    try:
        wait_for_server(BASE_URL)
        run_smoke()
        return 0
    finally:
        dev.terminate()
        try:
            dev.wait(timeout=5)
        except subprocess.TimeoutExpired:
            dev.kill()


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(exc, file=sys.stderr)
        raise
