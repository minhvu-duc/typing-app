from playwright.sync_api import sync_playwright

def verify_typing_app():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.on("console", lambda msg: print(f"Console: {msg.text}"))

        page.goto("http://localhost:3000")

        page.screenshot(path="jules-scratch/verification/verification.png")
        print("Screenshot taken!")
        browser.close()

if __name__ == "__main__":
    verify_typing_app()
