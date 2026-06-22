---
title: "Getting Started with Playwright in Python: A Beginner's Guide"
description: "New to Playwright? This step-by-step guide will get you up and running with Playwright and Python from scratch. Learn installation, first test, locators, and common patterns."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-10-05"
lastModified: "2025-10-05"
category: ["playwright", "automation"]
keywords: "playwright python tutorial, playwright beginner guide, playwright setup, playwright first test, playwright vs selenium"
slug: "getting-started-with-playwright-python-beginners-guide"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "Getting started with Playwright Python for automation testing"
draft: false
---

## Introduction

If you have been doing Selenium automation and heard about Playwright, or if you are starting automation fresh and wondering what to use — this guide is for you.

Playwright is a browser automation framework from Microsoft that was designed to make writing reliable automation tests easier. It has some really nice features that make it less painful than Selenium for modern web applications.

In this guide I will walk you through everything from installing Playwright to writing your first real test. We will use Python since it is the most common language for automation testers.

---

## Why Playwright?

Before we get into the setup, here is quickly why Playwright is worth learning:

- **Auto-waiting** — Playwright waits for elements automatically. No more `WebDriverWait` for every action.
- **Reliable by default** — Fewer flaky tests right out of the box
- **Fast** — Significantly faster than Selenium for most use cases
- **Great debugging** — Built-in trace viewer, codegen, and screenshot/video on failure
- **Modern APIs** — Cleaner, more readable test code
- **API testing too** — You can do API and UI testing in the same test

---

## Installation and Setup

### Step 1: Install Playwright

```bash
# Install playwright library
pip install playwright

# Install the browsers (Chromium, Firefox, WebKit)
playwright install
```

This downloads Chromium, Firefox, and Safari (WebKit) browsers. You can also install just one:

```bash
playwright install chromium
```

### Step 2: Install pytest-playwright

This gives you pytest fixtures for Playwright:

```bash
pip install pytest-playwright
```

### Step 3: Verify Installation

```bash
playwright --version
```

You should see something like `Version 1.44.0`.

---

## Your First Playwright Test

Create a file `test_first.py`:

```python
from playwright.sync_api import Page, expect


def test_qaplayground_title(page: Page):
    page.goto("https://www.qaplayground.com")
    expect(page).to_have_title("QA Playground")


def test_practice_page_loads(page: Page):
    page.goto("https://www.qaplayground.com/practice")
    
    # Check header is visible
    heading = page.get_by_role("heading", name="Practice")
    expect(heading).to_be_visible()
```

Run it:

```bash
pytest test_first.py -v
```

You should see both tests passing! Notice something — there is no `driver.get()`, no `find_element()`, no explicit waits. Playwright handles all the waiting automatically.

---

## Understanding the `page` Fixture

When you use `pytest-playwright`, the `page` fixture is automatically available in your tests. It represents a browser page (tab) and is the main object you will work with.

```python
def test_example(page: Page):
    # Navigate
    page.goto("https://example.com")
    
    # Get current URL
    print(page.url)
    
    # Get page title
    print(page.title())
    
    # Take screenshot
    page.screenshot(path="screenshot.png")
```

---

## Playwright Locators

This is where Playwright really shines. The locator API is much cleaner than Selenium's.

### Preferred Locators (Most Stable)

```python
# By role - recommended
page.get_by_role("button", name="Login")
page.get_by_role("textbox", name="Email")
page.get_by_role("link", name="About Us")
page.get_by_role("checkbox", name="Remember me")
page.get_by_role("heading", name="Welcome")

# By label - great for form inputs
page.get_by_label("Email address")
page.get_by_label("Password")

# By placeholder
page.get_by_placeholder("Enter your email")
page.get_by_placeholder("Search...")

# By text
page.get_by_text("Welcome back")
page.get_by_text("Sign in")

# By test ID (data-testid attribute)
page.get_by_test_id("submit-btn")
page.get_by_test_id("user-menu")
```

### CSS and XPath (When Needed)

```python
# CSS selector
page.locator("button.primary-btn")
page.locator("#login-form input[type='email']")
page.locator("[data-testid='submit']")

# XPath
page.locator("//button[text()='Login']")
page.locator("//input[@name='email']")
```

---

## Interacting with Elements

```python
# Click
page.get_by_role("button", name="Login").click()

# Type into field
page.get_by_label("Email").fill("admin@test.com")

# Clear and type
page.get_by_label("Email").clear()
page.get_by_label("Email").fill("new@test.com")

# Press keyboard key
page.get_by_label("Search").press("Enter")

# Select from dropdown
page.get_by_label("Country").select_option("India")
page.get_by_label("Country").select_option(value="IN")

# Check a checkbox
page.get_by_label("Remember me").check()
page.get_by_label("Remember me").uncheck()

# Get text content
text = page.get_by_role("heading").text_content()

# Get attribute value
value = page.get_by_label("Email").input_value()

# Hover over element
page.get_by_role("button", name="Menu").hover()
```

---

## Assertions with Playwright

Playwright has its own assertion library using `expect()`. These assertions automatically retry until the condition is true (up to a timeout), which makes tests much more stable.

```python
from playwright.sync_api import Page, expect

def test_login(page: Page):
    page.goto("https://www.qaplayground.com/bank")
    
    page.get_by_label("Username").fill("admin")
    page.get_by_label("Password").fill("admin123")
    page.get_by_role("button", name="Login").click()
    
    # Auto-retrying assertions
    expect(page).to_have_url("https://www.qaplayground.com/bank/dashboard")
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()
    
    # Text assertion
    expect(page.get_by_test_id("welcome-msg")).to_contain_text("Welcome")
    
    # Element state assertions
    expect(page.get_by_role("button", name="Logout")).to_be_visible()
    expect(page.get_by_role("button", name="Submit")).to_be_enabled()
    expect(page.get_by_role("button", name="Delete")).to_be_disabled()
    
    # Input value assertion
    expect(page.get_by_label("Username")).to_have_value("admin")
    
    # Count assertion
    expect(page.get_by_role("row")).to_have_count(5)
```

---

## Working with Page Objects in Playwright

You can use Page Object Model with Playwright just like Selenium:

```python
# pages/login_page.py
from playwright.sync_api import Page, expect


class LoginPage:
    def __init__(self, page: Page):
        self.page = page
        self.url = "https://www.qaplayground.com/bank"
    
    def open(self):
        self.page.goto(self.url)
        return self
    
    def login(self, username: str, password: str):
        self.page.get_by_label("Username").fill(username)
        self.page.get_by_label("Password").fill(password)
        self.page.get_by_role("button", name="Login").click()
        return self
    
    def get_error_message(self) -> str:
        return self.page.get_by_css_selector(".error-msg").text_content()
    
    def expect_error_visible(self):
        expect(self.page.locator(".error-msg")).to_be_visible()
```

---

## Handling Different Scenarios

### Waiting for Navigation

```python
# Click and wait for navigation to complete
with page.expect_navigation():
    page.get_by_role("button", name="Login").click()

# Or use more explicit approach
page.get_by_role("button", name="Login").click()
page.wait_for_url("**/dashboard")
```

### Handling Dialogs (Alerts)

```python
# Accept an alert automatically
page.on("dialog", lambda dialog: dialog.accept())
page.get_by_role("button", name="Delete").click()

# Handle with specific text check
def handle_dialog(dialog):
    assert "Are you sure" in dialog.message
    dialog.accept()

page.on("dialog", handle_dialog)
page.get_by_role("button", name="Delete").click()
```

### Multiple Tabs/Windows

```python
# Wait for new page/tab to open
with page.expect_popup() as popup_info:
    page.get_by_role("link", name="Open in new tab").click()

new_page = popup_info.value
new_page.wait_for_load_state()
print(new_page.url)
```

---

## Configuring Playwright

Create a `playwright.config.py` or use `pytest.ini`:

```ini
# pytest.ini
[pytest]
addopts = --browser chromium --headed
```

Or configure in code:

```python
# conftest.py
import pytest

@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "viewport": {"width": 1920, "height": 1080},
        "record_video_dir": "videos/",
        "base_url": "https://www.qaplayground.com"
    }
```

---

## Running Tests with Options

```bash
# Run all tests
pytest

# Run in headless mode (no browser window)
pytest --headed=false

# Run in specific browser
pytest --browser firefox

# Run in all three browsers
pytest --browser chromium --browser firefox --browser webkit

# Run in slow motion (useful for debugging)
pytest --slowmo 1000

# Run with video recording
pytest --video=on

# Run with trace (for debugging)
pytest --tracing=on
```

---

## Debugging Failed Tests

Playwright's debugging tools are one of its best features.

**Trace Viewer:**

If you add `--tracing=on` when running tests, you can open the trace for any failed test:

```bash
playwright show-trace trace.zip
```

This opens a timeline showing every action, screenshot, network request, and console message during the test.

**Codegen (Record Actions):**

Generate test code by recording your browser actions:

```bash
playwright codegen https://www.qaplayground.com
```

This opens a browser window. Everything you click and type gets converted to Playwright code automatically. Great for quickly generating test scripts.

---

## Common Beginner Questions

**Q: Can I use Playwright with pytest fixtures I already know?**

Yes. `pytest-playwright` provides fixtures like `page`, `browser`, `context`, and `browser_type`. You can compose these with your own fixtures exactly like you would in Selenium + pytest.

**Q: Does Playwright support running tests in parallel?**

Yes, pytest-playwright supports parallel execution with `pytest-xdist`. Just install it and add `-n auto` to your pytest command. Playwright creates separate browser contexts for each test worker so they don't interfere with each other.

**Q: What if the site I am testing does not use English?**

Playwright supports full Unicode. `fill()` and `type()` handle any language correctly. You can also configure the locale:

```python
@pytest.fixture
def browser_context_args(browser_context_args):
    return {**browser_context_args, "locale": "en-IN"}
```

**Q: Can I run Playwright tests without installing browsers on CI?**

The Playwright browsers need to be installed in CI too. Most teams cache the Playwright browser installation to save time:

```yaml
# GitHub Actions example
- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('requirements.txt') }}

- name: Install Playwright browsers
  run: playwright install --with-deps chromium
```

---

## Conclusion

Playwright is a joy to work with compared to Selenium for modern web applications. The auto-waiting alone eliminates a huge portion of the setup work that Selenium requires.

The learning curve is similar to Selenium, but you will find yourself writing cleaner, more reliable tests much faster. The `get_by_role()` and `get_by_label()` locators in particular make tests more readable and stable.

Start with the basics — navigate, fill, click, expect. Then explore the trace viewer and codegen to speed up your workflow. Once you are comfortable, try it on our [Practice Page](https://www.qaplayground.com/practice) and you will see how naturally Playwright handles all the common automation scenarios.

🚀 **Happy Testing!**
