---
title: "How to Handle Dynamic Elements in Selenium WebDriver"
description: "Dynamic elements are one of the biggest challenges in Selenium automation. Learn practical strategies to handle dynamic IDs, AJAX content, loading spinners, and other tricky elements."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-06-25"
lastModified: "2025-06-25"
category: ["automation", "selenium"]
keywords: "dynamic elements selenium, handle dynamic content, AJAX selenium, dynamic XPath, flaky tests selenium"
slug: "how-to-handle-dynamic-elements-in-selenium"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "Handling dynamic elements in Selenium WebDriver"
draft: false
---

## Introduction

One of the most frustrating things in Selenium automation is dealing with dynamic elements. You write a perfectly good test, it passes when you run it manually step by step, but when you run it in the actual test suite it fails randomly. Sometimes it passes, sometimes it doesn't.

This is what we call flaky tests, and most of the time dynamic elements are to blame.

In this post I will cover the most common types of dynamic element problems and how to handle each one properly.

---

## What Are Dynamic Elements?

Dynamic elements are elements on a web page that change in some way — their content, their attributes, their visibility, or their position in the DOM — based on user actions, API calls, or application state.

Common examples:
- Auto-generated IDs that change on every load (`div[id='react-17382']`)
- Elements loaded via AJAX that appear after some delay
- Loading spinners that block other elements
- Dropdown options that populate based on previous selection
- Modal dialogs that appear on certain actions
- Content that changes after user interaction

---

## Problem 1: Dynamic IDs and Class Names

**The Problem:**

Some frameworks (React, Angular, Vue) auto-generate element IDs and class names. These look like `id="ember-123"` or `class="sc-bdVTJa"`. These change on every build or even every page load, making them useless for locators.

**The Solution:**

Use attributes that are stable and meaningful. Look for:

- `data-testid` — added specifically for testing
- `name` attribute — common in form inputs
- `aria-label` — accessibility attribute, rarely changes
- `placeholder` — form input placeholder text
- Combination of stable attributes

```python
# Bad - auto-generated ID
driver.find_element(By.ID, "ember-1274")

# Good - stable attribute
driver.find_element(By.CSS_SELECTOR, "[data-testid='username-field']")
driver.find_element(By.CSS_SELECTOR, "input[name='username']")
driver.find_element(By.CSS_SELECTOR, "input[placeholder='Enter username']")
```

**Partial matching for dynamic IDs:**

If the ID has a dynamic number but a stable prefix, use `contains` in XPath or `^=` in CSS:

```python
# ID like "user-section-1274" where 1274 changes
# XPath with contains
driver.find_element(By.XPATH, "//*[contains(@id,'user-section')]")

# CSS with starts-with
driver.find_element(By.CSS_SELECTOR, "[id^='user-section']")

# CSS with ends-with
driver.find_element(By.CSS_SELECTOR, "[class$='-wrapper']")

# CSS with contains
driver.find_element(By.CSS_SELECTOR, "[class*='user-card']")
```

---

## Problem 2: Elements That Load After AJAX Calls

**The Problem:**

You click a button and data loads from an API. But your code tries to find the result before it appears on screen. This causes `NoSuchElementException`.

**The Solution:**

Use explicit waits. Never use `time.sleep()` because:
- If the element loads in 1 second but you sleep for 5, you waste 4 seconds per test
- If the element takes 6 seconds but you sleep for 5, your test still fails

```python
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

wait = WebDriverWait(driver, 15)  # Wait up to 15 seconds

# Wait until element is visible
element = wait.until(
    EC.visibility_of_element_located((By.CSS_SELECTOR, ".results-table"))
)

# Wait until element is clickable
button = wait.until(
    EC.element_to_be_clickable((By.ID, "submit-btn"))
)

# Wait until text appears in element
wait.until(
    EC.text_to_be_present_in_element((By.ID, "status-msg"), "Success")
)

# Wait until element disappears (useful for loading spinners)
wait.until(
    EC.invisibility_of_element_located((By.CSS_SELECTOR, ".loading-spinner"))
)
```

---

## Problem 3: Loading Spinners and Overlays

**The Problem:**

Many modern apps show a loading spinner after an action. Selenium tries to click an element that is covered by the spinner and throws `ElementClickInterceptedException`.

**The Solution:**

Wait for the spinner to disappear before doing the next action.

```python
# Wait for loading overlay to disappear
wait = WebDriverWait(driver, 20)
wait.until(
    EC.invisibility_of_element_located((By.CSS_SELECTOR, ".loading-overlay"))
)

# Now safe to click
wait.until(EC.element_to_be_clickable((By.ID, "next-btn"))).click()
```

**Alternative — scroll element into view and use JavaScript click:**

```python
# Sometimes the spinner is gone but element still intercepted
element = driver.find_element(By.ID, "next-btn")
driver.execute_script("arguments[0].scrollIntoView(true);", element)
driver.execute_script("arguments[0].click();", element)
```

Use JavaScript click as a last resort. It bypasses the visual checks Selenium does, so it might work even when a real user couldn't click the element.

---

## Problem 4: Dynamic Table Content

**The Problem:**

Tables that load data dynamically or have rows you need to find based on content. Each row has no unique ID.

**The Solution:**

Use XPath to find elements based on their text content and relationship to other elements.

```python
# Find the Edit button in the row where Name is "John Doe"
row_edit_button = driver.find_element(
    By.XPATH,
    "//tr[td[text()='John Doe']]//button[text()='Edit']"
)

# Get all rows count
rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")
print(f"Total rows: {len(rows)}")

# Get specific cell value from a known row
first_row_name = driver.find_element(
    By.XPATH,
    "//tbody/tr[1]/td[2]"
).text

# Find row containing specific text anywhere in the row
row = driver.find_element(
    By.XPATH,
    "//tr[contains(., 'John Doe')]"
)
```

---

## Problem 5: Dropdown Options That Change Dynamically

**The Problem:**

A dropdown's options change based on a previous selection (like selecting a country loads cities). You need to wait for the second dropdown to populate.

**The Solution:**

```python
from selenium.webdriver.support.select import Select

# Select from first dropdown
country_dropdown = Select(driver.find_element(By.ID, "country-select"))
country_dropdown.select_by_visible_text("India")

# Wait for cities dropdown to populate
wait = WebDriverWait(driver, 10)
wait.until(lambda driver: len(
    Select(driver.find_element(By.ID, "city-select")).options) > 1
)

# Now select from second dropdown
city_dropdown = Select(driver.find_element(By.ID, "city-select"))
city_dropdown.select_by_visible_text("Mumbai")
```

---

## Problem 6: Stale Element Reference

**The Problem:**

You find an element, the page refreshes or updates partially (like AJAX), and when you try to interact with the element you get `StaleElementReferenceException`. The element reference you saved is no longer valid.

**The Solution:**

Don't save element references if the page might change. Re-find the element each time.

```python
# Bad - saves reference, might go stale
submit_btn = driver.find_element(By.ID, "submit")
# ... page does something ...
submit_btn.click()  # StaleElementReferenceException!

# Good - find fresh each time, or use retry logic
def click_with_retry(driver, locator, max_retries=3):
    for attempt in range(max_retries):
        try:
            driver.find_element(*locator).click()
            return
        except StaleElementReferenceException:
            if attempt == max_retries - 1:
                raise
            time.sleep(0.5)
```

---

## Problem 7: Elements in Shadow DOM

**The Problem:**

Some web components use Shadow DOM which hides elements from regular DOM queries. Selenium's `find_element` cannot access elements inside a shadow root directly.

**The Solution:**

Use JavaScript to pierce the shadow DOM:

```python
# Get the shadow host element
shadow_host = driver.find_element(By.CSS_SELECTOR, "my-custom-component")

# Get the shadow root
shadow_root = driver.execute_script("return arguments[0].shadowRoot", shadow_host)

# Now find elements inside shadow root
element = shadow_root.find_element(By.CSS_SELECTOR, "button.shadow-btn")
element.click()
```

Playwright handles Shadow DOM much better natively — another reason many teams are moving to Playwright.

---

## General Tips for Handling Dynamic Elements

**1. Increase wait timeouts for slow environments**

In CI/CD environments, things can run slower. Adjust your timeouts accordingly.

**2. Use custom wait conditions**

Sometimes built-in wait conditions aren't enough. Write your own:

```python
def wait_for_text_to_change(driver, locator, old_text, timeout=10):
    wait = WebDriverWait(driver, timeout)
    wait.until(lambda d: d.find_element(*locator).text != old_text)
```

**3. Check network idle in Playwright**

Playwright has a powerful feature to wait until the page network is idle after navigation:

```python
page.goto(url, wait_until="networkidle")
```

**4. Add explicit waits before every interaction**

Don't assume an element is there. Always wait for it first.

**5. Use fluent wait for polling**

```python
from selenium.webdriver.support.wait import WebDriverWait

# Check every 500ms, ignore stale element errors
wait = WebDriverWait(driver, 15, poll_frequency=0.5, 
                     ignored_exceptions=[StaleElementReferenceException])
element = wait.until(EC.element_to_be_clickable((By.ID, "submit")))
```

---

## Conclusion

Dynamic elements are a real challenge but not an unsolvable one. The key is understanding WHY your test is failing — is the element not yet loaded? Is it covered by an overlay? Is it in a shadow DOM? Is the element reference stale?

Once you identify the root cause, the fix is usually straightforward. Use proper waits, avoid fragile locators, and retry stale element interactions.

Practice handling these scenarios on our [Practice Page](https://www.qaplayground.com/practice) which has waits, alerts, and dynamic elements specifically designed for this kind of practice.

🚀 **Happy Testing!**
