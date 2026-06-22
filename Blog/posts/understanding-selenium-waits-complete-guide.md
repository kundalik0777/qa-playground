---
title: "Understanding Selenium Waits: Implicit, Explicit, and Fluent Wait Explained"
description: "Selenium waits are confusing for beginners. This guide explains implicit wait, explicit wait, and fluent wait clearly with examples and tells you exactly when to use each one."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-09-15"
lastModified: "2025-09-15"
category: ["automation", "selenium"]
keywords: "selenium waits, implicit wait, explicit wait, fluent wait, WebDriverWait, selenium timing"
slug: "understanding-selenium-waits-complete-guide"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "Selenium waits guide - implicit explicit fluent"
draft: false
---

## Introduction

Timing is everything in Selenium automation. Your script moves faster than the browser can load elements, and if you try to interact with an element before it is ready, your test fails. This is one of the most common sources of flaky tests.

Selenium provides three types of waits to handle this: **Implicit Wait**, **Explicit Wait**, and **Fluent Wait**. Many beginners get confused about which one to use and when. This guide will clear all the confusion with real examples.

---

## Why Waits Are Necessary

Modern web applications are dynamic. Data loads via API calls, elements appear after animations, modals open after button clicks, page sections load lazily. None of this happens instantaneously.

Without waits, Selenium immediately tries to find elements as soon as a command is given. If the element is not yet in the DOM, you get `NoSuchElementException`. If it is in the DOM but not visible yet, you get `ElementNotInteractableException`.

Waits tell Selenium to pause and wait for a specific condition before continuing.

---

## Type 1: Implicit Wait

Implicit wait is a **global setting** that tells Selenium to wait up to a specified time before throwing an exception when it cannot find an element. Once set, it applies to every `find_element` call in that WebDriver session.

### How It Works

```python
from selenium import webdriver

driver = webdriver.Chrome()

# Set implicit wait of 10 seconds
driver.implicitly_wait(10)

# Now every find_element will wait up to 10 seconds before failing
driver.get("https://example.com")
element = driver.find_element(By.ID, "some-element")  # Waits up to 10 sec
```

When Selenium looks for an element and doesn't find it immediately, it keeps retrying (polling the DOM) until it finds the element or the timeout expires.

### Pros of Implicit Wait

- Simple to set up — one line of code for the entire session
- No need to write wait logic for every element
- Good for pages where elements load consistently

### Cons of Implicit Wait

- Applied globally — every find_element gets this wait, even elements that should be instant
- Can slow down tests unnecessarily when checking that an element does NOT exist
- Cannot wait for specific conditions (just for element presence)
- Can cause weird behavior when mixed with explicit waits

### When to Use Implicit Wait

Use implicit wait as a baseline safety net in your `conftest.py` or driver setup:

```python
@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.implicitly_wait(10)  # Base implicit wait
    yield driver
    driver.quit()
```

Set it to a reasonable value (5-10 seconds) but don't rely on it for complex conditions.

---

## Type 2: Explicit Wait

Explicit wait is applied to **a specific element** and waits for a **specific condition** to be true. It is much more powerful and flexible than implicit wait.

### How It Works

```python
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

# Create a wait object with timeout and driver
wait = WebDriverWait(driver, 15)

# Wait until a specific condition is met for a specific element
element = wait.until(
    EC.element_to_be_clickable((By.ID, "submit-btn"))
)
element.click()
```

The `until()` method keeps checking the condition every 500ms (by default) until it is true or the timeout is reached.

### Built-in Expected Conditions

The `expected_conditions` module has many useful conditions:

```python
from selenium.webdriver.support import expected_conditions as EC

# Element conditions
EC.presence_of_element_located(locator)        # Element exists in DOM
EC.visibility_of_element_located(locator)       # Element is visible
EC.element_to_be_clickable(locator)            # Element is visible AND enabled
EC.invisibility_of_element_located(locator)     # Element is NOT visible
EC.element_to_be_selected(locator)             # Checkbox/radio is selected
EC.element_selection_state_to_be(element, True) # Checkbox state matches

# Text conditions
EC.text_to_be_present_in_element(locator, text)         # Element contains text
EC.text_to_be_present_in_element_value(locator, text)   # Input value contains text

# Alert conditions
EC.alert_is_present()                          # Alert/confirm/prompt dialog is open

# URL conditions
EC.url_contains(url_part)                      # Current URL contains string
EC.url_to_be(full_url)                         # Exact URL match
EC.title_contains(title_part)                  # Page title contains string

# iFrame conditions
EC.frame_to_be_available_and_switch_to_it(locator)  # Frame exists and switch to it
```

### Practical Examples

```python
# Wait for loading spinner to disappear before clicking next
wait.until(EC.invisibility_of_element_located((By.CSS_SELECTOR, ".spinner")))

# Wait for success message after form submission
wait.until(EC.text_to_be_present_in_element(
    (By.ID, "status-msg"), "Successfully saved"
))

# Wait for redirect after login
wait.until(EC.url_contains("/dashboard"))

# Wait for modal to appear
modal = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".modal")))

# Wait for element in new AJAX content
new_items = wait.until(EC.presence_of_all_elements_located(
    (By.CSS_SELECTOR, ".result-item")
))
print(f"Found {len(new_items)} results")
```

### Custom Wait Conditions with Lambda

When no built-in condition fits, write your own with a lambda:

```python
# Wait until table has at least 5 rows
wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, "tbody tr")) >= 5)

# Wait until input value changes from empty
wait.until(lambda d: d.find_element(By.ID, "auto-fill").get_attribute("value") != "")

# Wait until specific element count
wait.until(lambda d: len(d.find_elements(By.CSS_SELECTOR, ".product-card")) == 10)
```

### Pros of Explicit Wait

- Waits for exact conditions — much more precise
- Applied only where needed — faster tests
- Many built-in conditions available
- Can write custom conditions

### Cons of Explicit Wait

- More code to write for each wait
- Easy to forget to add wait before interacting with dynamic elements

---

## Type 3: Fluent Wait

Fluent wait is an extended version of explicit wait that gives you more control:

- **Custom polling interval** — how often to check the condition
- **Ignore specific exceptions** — continue polling even if certain exceptions are thrown

### How It Works

```python
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException

# Fluent wait: check every 500ms, ignore StaleElementReferenceException
fluent_wait = WebDriverWait(
    driver,
    timeout=20,
    poll_frequency=0.5,
    ignored_exceptions=[NoSuchElementException, StaleElementReferenceException]
)

element = fluent_wait.until(EC.element_to_be_clickable((By.ID, "dynamic-btn")))
element.click()
```

### When to Use Fluent Wait

Use fluent wait when:

- The element is in a part of the page that refreshes/updates frequently (stale element issues)
- You want to reduce the polling interval for faster response
- You need to ignore specific exceptions during polling

```python
# Practical example: polling for an element that might be stale
def wait_for_stable_element(driver, locator, timeout=15):
    wait = WebDriverWait(
        driver,
        timeout,
        poll_frequency=0.5,
        ignored_exceptions=[StaleElementReferenceException, NoSuchElementException]
    )
    return wait.until(EC.element_to_be_clickable(locator))
```

---

## Comparing the Three Waits

| Feature | Implicit Wait | Explicit Wait | Fluent Wait |
|---|---|---|---|
| Scope | Global (all find_elements) | Specific element + condition | Specific element + condition |
| Setup | Once per session | Each time needed | Each time needed |
| Conditions | Element presence only | Many built-in + custom | Many built-in + custom |
| Polling interval | Fixed (built-in) | Fixed (500ms default) | Customizable |
| Exception handling | Default | Default | Customizable |
| Best for | Baseline safety net | Most use cases | Complex/flaky scenarios |

---

## The Big Warning: Don't Mix Implicit and Explicit Waits

This is important. Mixing implicit and explicit waits can cause unexpected behaviour and very confusing bugs.

When you have an implicit wait AND an explicit wait on the same driver, the actual wait time becomes unpredictable. The WebDriver may wait longer than your timeout or behave inconsistently across different versions.

**Best practice:**

- Set implicit wait to 0 (disabled) or a small value (1-2 seconds) in your driver setup
- Use explicit waits everywhere you need to wait for a condition
- Use fluent wait for special cases

```python
# Recommended approach
@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.implicitly_wait(2)  # Small base wait, mostly disabled
    yield driver
    driver.quit()

# In page objects / test code, use explicit wait everywhere
wait = WebDriverWait(driver, 15)
element = wait.until(EC.element_to_be_clickable(locator))
```

---

## Common Wait Mistakes

❌ **Using time.sleep()** — Never. Explicit wait is always better.

❌ **Setting implicit wait too high** — 30-60 second implicit wait makes failed tests very slow.

❌ **Forgetting to wait before assertions** — Just because you clicked a button doesn't mean the result is visible yet.

❌ **Mixing implicit and explicit waits** — Creates unpredictable behavior.

❌ **Using `presence_of_element` when you need to click** — Use `element_to_be_clickable` for elements you are about to interact with.

---

## Conclusion

Waits are fundamental to reliable Selenium automation. Once you understand the three types and when to use each one, your tests will be significantly more stable.

The practical rule is:
1. Set a small implicit wait as safety net
2. Use explicit wait for everything dynamic
3. Use fluent wait when you have stale element issues or need custom polling

Practice these on our [Wait practice page](https://www.qaplayground.com/practice/waits) — it has elements that load with various delays specifically for this kind of practice.

🚀 **Happy Testing!**
