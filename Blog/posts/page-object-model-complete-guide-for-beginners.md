---
title: "Page Object Model: A Complete Guide for Beginners"
description: "Learn Page Object Model (POM) from scratch with real examples in Python and Selenium. Understand why POM makes your automation more maintainable and how to implement it correctly."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-06-18"
lastModified: "2025-06-18"
category: ["automation", "selenium"]
keywords: "page object model, POM selenium, page object pattern, selenium page object, automation design pattern"
slug: "page-object-model-complete-guide-for-beginners"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "Page Object Model guide for automation testing"
draft: false
---

## Introduction

When you first start learning Selenium, you write your tests in a straightforward way — find element, do action, check result. Everything in one place. It works fine for small projects.

But as soon as your project grows — 50 tests, 100 tests, different pages — things start to fall apart. You have the same locators copy-pasted in 15 different test files. A developer changes one button ID and suddenly 15 tests fail. You spend 2 hours finding every place that locator is used.

This is the problem Page Object Model (POM) solves. And once you understand and use it, you will wonder how you ever managed without it.

---

## What is Page Object Model?

Page Object Model is a design pattern in test automation where you create a separate class for each page (or major component) of your application. This class:

- Stores all the **locators** for elements on that page
- Contains **methods** that represent actions a user can do on that page
- **Hides the implementation details** from your test scripts

Your test scripts then work with these page objects instead of directly with the browser driver. Think of page objects as a layer between your tests and the actual web page.

---

## Why Use POM?

**Without POM:**

- Locators are scattered across all test files
- When UI changes, you need to update multiple files
- Tests are hard to read because they are full of low-level browser commands
- Code duplication everywhere

**With POM:**

- Locators are defined in one place per page
- When UI changes, you update only the page object
- Tests read like user stories — easy to understand
- Reusable actions across multiple tests

---

## Structure of a POM Project

Here is how a typical POM project is structured:

```
automation-project/
├── pages/
│   ├── base_page.py       # Common methods (click, type, wait etc.)
│   ├── login_page.py      # Login page locators and actions
│   ├── dashboard_page.py  # Dashboard page locators and actions
│   └── account_page.py    # Account page locators and actions
├── tests/
│   ├── test_login.py
│   ├── test_dashboard.py
│   └── test_accounts.py
├── utils/
│   ├── driver_factory.py  # WebDriver setup
│   └── config.py          # Configuration values
└── conftest.py            # pytest fixtures
```

---

## Implementing POM Step by Step

Let me show you how to build this with a real example using the QA Playground bank app.

### Step 1: Create a Base Page

The base page contains common methods that all pages will use — things like clicking, typing, waiting for elements.

```python
# pages/base_page.py
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    def click(self, locator):
        """Wait for element to be clickable, then click"""
        element = self.wait.until(EC.element_to_be_clickable(locator))
        element.click()
    
    def type_text(self, locator, text):
        """Clear field and type text"""
        element = self.wait.until(EC.visibility_of_element_located(locator))
        element.clear()
        element.send_keys(text)
    
    def get_text(self, locator):
        """Get visible text of element"""
        element = self.wait.until(EC.visibility_of_element_located(locator))
        return element.text
    
    def is_element_visible(self, locator):
        """Check if element is visible"""
        try:
            self.wait.until(EC.visibility_of_element_located(locator))
            return True
        except:
            return False
```

---

### Step 2: Create Page Objects

Now create a class for each page in your application.

```python
# pages/login_page.py
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class LoginPage(BasePage):
    # Locators - defined as class variables
    USERNAME_FIELD = (By.ID, "username")
    PASSWORD_FIELD = (By.ID, "password")
    LOGIN_BUTTON = (By.CSS_SELECTOR, "button[type='submit']")
    ERROR_MESSAGE = (By.CSS_SELECTOR, ".error-message")
    REMEMBER_ME_CHECKBOX = (By.ID, "remember-me")
    
    def __init__(self, driver):
        super().__init__(driver)
        self.url = "https://www.qaplayground.com/bank"
    
    def open(self):
        """Navigate to the login page"""
        self.driver.get(self.url)
        return self
    
    def enter_username(self, username):
        self.type_text(self.USERNAME_FIELD, username)
        return self
    
    def enter_password(self, password):
        self.type_text(self.PASSWORD_FIELD, password)
        return self
    
    def click_login(self):
        self.click(self.LOGIN_BUTTON)
    
    def login(self, username, password):
        """Complete login action - combines multiple steps"""
        self.enter_username(username)
        self.enter_password(password)
        self.click_login()
    
    def get_error_message(self):
        return self.get_text(self.ERROR_MESSAGE)
    
    def is_error_displayed(self):
        return self.is_element_visible(self.ERROR_MESSAGE)
```

```python
# pages/dashboard_page.py
from selenium.webdriver.common.by import By
from pages.base_page import BasePage


class DashboardPage(BasePage):
    # Locators
    WELCOME_MESSAGE = (By.CSS_SELECTOR, "[data-testid='welcome-msg']")
    TOTAL_BALANCE = (By.CSS_SELECTOR, "[data-testid='total-balance']")
    ACCOUNTS_COUNT = (By.CSS_SELECTOR, "[data-testid='accounts-count']")
    LOGOUT_BUTTON = (By.CSS_SELECTOR, "[data-action='logout']")
    
    def get_welcome_message(self):
        return self.get_text(self.WELCOME_MESSAGE)
    
    def get_total_balance(self):
        return self.get_text(self.TOTAL_BALANCE)
    
    def is_dashboard_loaded(self):
        return self.is_element_visible(self.TOTAL_BALANCE)
    
    def logout(self):
        self.click(self.LOGOUT_BUTTON)
```

---

### Step 3: Write Clean Tests Using Page Objects

Now your test files are clean and readable:

```python
# tests/test_login.py
import pytest
from pages.login_page import LoginPage
from pages.dashboard_page import DashboardPage


class TestLogin:
    
    def test_login_with_valid_credentials(self, driver):
        login_page = LoginPage(driver)
        login_page.open()
        login_page.login("admin", "admin123")
        
        dashboard = DashboardPage(driver)
        assert dashboard.is_dashboard_loaded()
    
    def test_login_with_invalid_password_shows_error(self, driver):
        login_page = LoginPage(driver)
        login_page.open()
        login_page.login("admin", "wrongpassword")
        
        assert login_page.is_error_displayed()
        assert "Invalid credentials" in login_page.get_error_message()
    
    def test_login_with_empty_username_shows_error(self, driver):
        login_page = LoginPage(driver)
        login_page.open()
        login_page.login("", "admin123")
        
        assert login_page.is_error_displayed()
    
    def test_login_and_logout(self, driver):
        login_page = LoginPage(driver)
        login_page.open()
        login_page.login("admin", "admin123")
        
        dashboard = DashboardPage(driver)
        assert dashboard.is_dashboard_loaded()
        
        dashboard.logout()
        assert login_page.is_element_visible(login_page.LOGIN_BUTTON)
```

Look how clean the tests are! They read almost like plain English. Anyone on the team can understand what each test does without knowing Selenium.

---

### Step 4: Set Up Fixtures

```python
# conftest.py
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


@pytest.fixture(scope="function")
def driver():
    options = Options()
    options.add_argument("--headless")  # Run without browser window in CI
    driver = webdriver.Chrome(options=options)
    driver.maximize_window()
    
    yield driver
    
    driver.quit()
```

---

## Method Chaining (Optional but Nice)

You can make page object methods return `self` to enable method chaining, which makes the code read more fluently:

```python
# Without chaining
login_page.enter_username("admin")
login_page.enter_password("admin123")
login_page.click_login()

# With chaining (when methods return self)
login_page.enter_username("admin").enter_password("admin123").click_login()
```

---

## Common POM Mistakes to Avoid

**1. Adding test logic inside page objects**

Page objects should only contain page actions, not assertions or test logic. Keep assertions in your test files.

```python
# Bad - assertion in page object
def login(self, username, password):
    ...click login...
    assert "Dashboard" in self.driver.title  # Don't do this!

# Good - assertion in test
def test_login(driver):
    login_page.login("admin", "pass")
    assert "Dashboard" in driver.title  # Put it here
```

**2. Not using a Base Page**

Repeating the same wait logic in every page object creates duplication. Always have a base page with common utilities.

**3. One huge page object for the whole site**

Don't put all locators in one file. Create separate page objects for each distinct page or component.

**4. Hardcoding the base URL in every page**

Store the base URL in a config file and use it from there. When you need to switch between environments, you change one place.

---

## When POM is Not Needed

POM adds complexity. For very small projects with just 5-10 tests, it might be overkill. But any project that plans to grow should implement POM from the beginning — it is much harder to refactor later.

---

## Conclusion

Page Object Model is not just a pattern — it is a way of thinking about how your automation code should be organized. Once you start using it, you will see how much cleaner and easier to maintain your tests become.

Start by creating page objects for your most tested pages. Gradually convert the rest. The investment pays off quickly when you have to update locators after a UI change and realize you only need to touch one file instead of twenty.

Practice implementing POM on our [Bank Demo App](https://www.qaplayground.com/bank) — it is a perfect playground for trying out this pattern.

🚀 **Happy Testing!**
