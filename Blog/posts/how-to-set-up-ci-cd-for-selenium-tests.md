---
title: "How to Set Up CI/CD Pipeline for Selenium Tests with GitHub Actions"
description: "Learn how to set up a CI/CD pipeline to run Selenium automation tests automatically using GitHub Actions. Step-by-step guide from scratch to running tests on every pull request."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-08-10"
lastModified: "2025-08-10"
category: ["automation", "selenium"]
keywords: "CI/CD selenium tests, GitHub Actions selenium, automation pipeline, selenium headless CI, run tests automatically"
slug: "how-to-set-up-ci-cd-for-selenium-tests"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "Setting up CI/CD pipeline for Selenium automation tests"
draft: false
---

## Introduction

Running automation tests manually is fine when you are just starting out. But as soon as your test suite grows and your team starts making frequent code changes, you need tests to run automatically.

That is where CI/CD comes in. CI stands for Continuous Integration — the practice of automatically running tests every time code is pushed or a pull request is opened. This way, bugs are caught immediately before they reach production.

In this guide I will show you how to set up GitHub Actions to run your Selenium tests automatically. GitHub Actions is free for public repos and has generous free limits for private repos.

---

## What We Will Build

By the end of this guide you will have:

- Selenium tests running automatically on every push and pull request
- Tests running in headless Chrome (no browser window, works in CI server)
- Test results visible in the GitHub Actions UI
- HTML test report uploaded as an artifact you can download and view

---

## Prerequisites

- Python Selenium tests using pytest
- A GitHub repository
- Basic understanding of YAML

If you don't have a test project yet, you can create a simple one for practice.

---

## Step 1: Make Your Tests Run in Headless Mode

In CI environments there is no display — no screen, no browser window. Your tests need to run in headless mode (browser runs without UI).

```python
# conftest.py
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import os


@pytest.fixture(scope="function")
def driver():
    options = Options()
    
    # Run headless when in CI environment
    if os.environ.get("CI"):
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-gpu")
    
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(options=options)
    
    yield driver
    
    driver.quit()
```

The `CI` environment variable is automatically set to `true` by GitHub Actions, so your tests will automatically use headless mode in CI without affecting local development.

---

## Step 2: Create Requirements File

Make sure all your dependencies are listed in a `requirements.txt` file:

```txt
selenium==4.18.1
pytest==8.0.0
pytest-html==4.1.1
webdriver-manager==4.0.1
```

Test this locally first:

```bash
pip install -r requirements.txt
pytest tests/ -v
```

---

## Step 3: Set Up Project Structure

Here is a clean project structure that works well with CI:

```
my-automation-project/
├── .github/
│   └── workflows/
│       └── selenium-tests.yml     ← GitHub Actions config
├── pages/
│   ├── base_page.py
│   └── login_page.py
├── tests/
│   ├── test_login.py
│   └── test_dashboard.py
├── conftest.py
├── requirements.txt
└── pytest.ini
```

**pytest.ini** — configure pytest behavior:

```ini
[pytest]
testpaths = tests
addopts = -v --html=reports/test-report.html --self-contained-html
```

---

## Step 4: Create GitHub Actions Workflow

This is the main part. Create the file `.github/workflows/selenium-tests.yml` in your repository:

```yaml
name: Selenium Test Suite

# When to run
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  
  # Optional: allow manual trigger from GitHub UI
  workflow_dispatch:

jobs:
  selenium-tests:
    name: Run Selenium Tests
    runs-on: ubuntu-latest
    
    steps:
      # Step 1: Check out the code
      - name: Checkout code
        uses: actions/checkout@v4
      
      # Step 2: Set up Python
      - name: Set up Python 3.11
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      
      # Step 3: Cache pip packages (speeds up runs)
      - name: Cache pip packages
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-
      
      # Step 4: Install dependencies
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
      
      # Step 5: Install Chrome (Ubuntu usually has it, but we want specific version)
      - name: Set up Chrome
        uses: browser-actions/setup-chrome@latest
      
      # Step 6: Run the tests
      - name: Run Selenium tests
        run: |
          pytest tests/ -v --html=reports/test-report.html --self-contained-html
        continue-on-error: true  # Upload report even if tests fail
      
      # Step 7: Upload HTML report
      - name: Upload test report
        uses: actions/upload-artifact@v4
        if: always()  # Upload even if tests failed
        with:
          name: selenium-test-report
          path: reports/test-report.html
          retention-days: 14
```

---

## Step 5: Commit and Push

```bash
git add .github/workflows/selenium-tests.yml
git add requirements.txt
git add conftest.py
git commit -m "Add GitHub Actions CI for Selenium tests"
git push origin main
```

---

## Step 6: Watch Your Tests Run

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see your workflow running (yellow circle = in progress, green = pass, red = fail)
4. Click on the workflow run to see details
5. When it finishes, click **Artifacts** to download the HTML report

---

## Advanced: Running Tests in Parallel

If you have many tests and they take too long, you can run them in parallel using pytest-xdist:

**Add to requirements.txt:**
```txt
pytest-xdist==3.5.0
```

**Update pytest.ini:**
```ini
[pytest]
testpaths = tests
addopts = -v -n auto --html=reports/test-report.html --self-contained-html
```

The `-n auto` flag runs tests using as many CPU cores as available.

---

## Advanced: Running Tests on Multiple Environments

If you want to run tests against both staging and production, use workflow inputs:

```yaml
name: Selenium Tests

on:
  workflow_dispatch:
    inputs:
      environment:
        description: "Environment to test"
        required: true
        default: "staging"
        type: choice
        options:
          - staging
          - production

jobs:
  test:
    runs-on: ubuntu-latest
    env:
      TEST_ENV: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest tests/ -v
        env:
          BASE_URL: ${{ github.event.inputs.environment == 'production' && 'https://qaplayground.com' || 'https://staging.qaplayground.com' }}
```

---

## Advanced: Adding Slack Notifications

Add a step to notify your team when tests fail:

```yaml
      # Add after test step
      - name: Notify Slack on failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          channel-id: "qa-alerts"
          slack-message: "🚨 Selenium Tests FAILED on ${{ github.ref }} by ${{ github.actor }}"
        env:
          SLACK_BOT_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}
```

---

## Using Environment Secrets

Never put sensitive values like base URLs, usernames, or API keys directly in the workflow file. Use GitHub Secrets.

**Adding a secret:**

1. Go to your repo → Settings → Secrets and variables → Actions
2. Click **New repository secret**
3. Name it something like `TEST_USERNAME` and add the value
4. Click **Add secret**

**Using in workflow:**

```yaml
      - name: Run tests
        run: pytest tests/
        env:
          TEST_USERNAME: ${{ secrets.TEST_USERNAME }}
          TEST_PASSWORD: ${{ secrets.TEST_PASSWORD }}
          BASE_URL: ${{ secrets.STAGING_URL }}
```

In your Python code, read from environment variables:

```python
import os

base_url = os.environ.get("BASE_URL", "http://localhost:3000")
username = os.environ.get("TEST_USERNAME", "admin")
```

---

## Troubleshooting Common CI Issues

**Problem: Chrome not found**

Make sure you have the Chrome setup step in your workflow and `webdriver-manager` in requirements.

**Problem: Tests pass locally but fail in CI**

Most common cause is timing — CI servers can be slower. Increase your wait timeouts:

```python
WebDriverWait(driver, 20)  # Increase from 10 to 20 in CI
```

**Problem: `ModuleNotFoundError`**

Your `requirements.txt` is missing a package. Run `pip freeze > requirements.txt` locally to capture all dependencies.

**Problem: Screenshots not captured on failure**

Add a conftest fixture to capture screenshots:

```python
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    
    if rep.when == "call" and rep.failed:
        driver = item.funcargs.get("driver")
        if driver:
            driver.save_screenshot(f"reports/screenshot_{item.name}.png")
```

---

## Conclusion

Setting up CI/CD for your Selenium tests is one of the best investments you can make in your automation practice. Once it is set up, you get automated feedback on every code change without any extra effort.

Start with the basic workflow, get it working, then gradually add features like parallel execution, environment selection, and Slack notifications.

The key benefit is that you catch bugs immediately when they are introduced, not days later during a manual test cycle. Your team can deploy with confidence knowing the automation is watching every change.

🚀 **Happy Testing!**
