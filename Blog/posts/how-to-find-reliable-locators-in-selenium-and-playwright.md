---
title: "How to Find Reliable Locators in Selenium and Playwright"
description: "Finding good locators is one of the most important skills in automation testing. Learn how to write stable, reliable locators in Selenium and Playwright with real examples."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-05-10"
lastModified: "2025-05-10"
category: ["automation", "selenium", "playwright"]
keywords: "locators in selenium, find locators, CSS selectors, XPath, reliable locators, playwright locators"
slug: "how-to-find-reliable-locators-in-selenium-and-playwright"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "QA engineer finding locators for automation testing"
draft: false
---

## Introduction

One of the first things you learn in automation testing is — finding elements on a webpage. It sounds simple but trust me, this is where most beginners get stuck. Bad locators are the number one reason automation scripts break. You run your test on Monday and by Wednesday the dev team changed a class name and now everything fails.

In this post I will walk you through how to find good, reliable locators in Selenium and Playwright. We will cover different locator strategies, when to use each one, and some real examples you can try yourself.

---

## Why Locators Break So Often

Before we jump into the how-to part, lets understand why locators fail in the first place.

Most beginners copy the XPath from browser devtools and paste it directly into their code. That works for a few days but then breaks because:

- Developer changed the element's class or ID
- A new element got added above or below it which shifted the XPath position
- Dynamic IDs that change on every page load (like `div[id='component_12345_abc']`)
- Page structure changes after a UI redesign

The goal is to write locators that are **stable** — meaning they don't break easily even when small UI changes happen.

---

## Types of Locators You Can Use

### 1. ID

This is the most reliable locator if available. IDs are supposed to be unique on a page so they are stable and fast.

```python
# Selenium
driver.find_element(By.ID, "username")

# Playwright
page.locator("#username")
```

**When to use:** Always prefer ID when the element has a meaningful, stable ID like `login-btn` or `email-input`. Avoid if the ID looks auto-generated like `input-123abc`.

---

### 2. Name Attribute

Name attributes are common in forms. Good alternative when ID is not available.

```python
# Selenium
driver.find_element(By.NAME, "email")
```

---

### 3. CSS Selectors

CSS selectors are fast and readable. Most professional automation engineers prefer CSS over XPath because it is cleaner.

```python
# Selenium
driver.find_element(By.CSS_SELECTOR, "button.submit-btn")
driver.find_element(By.CSS_SELECTOR, "input[type='email']")
driver.find_element(By.CSS_SELECTOR, "#login-form .error-msg")
```

**Common CSS patterns:**

| Pattern | Meaning |
|---|---|
| `#id` | Element with specific ID |
| `.class` | Element with specific class |
| `div > p` | Direct child |
| `input[type='text']` | Input with type attribute |
| `button:first-child` | First button among siblings |

---

### 4. XPath

XPath is powerful but can get messy if you write it wrong. Use it when CSS selectors don't work or when you need to find elements by their text content.

```python
# Selenium - absolute (bad practice)
driver.find_element(By.XPATH, "/html/body/div[1]/div[2]/form/input")

# Selenium - relative (much better)
driver.find_element(By.XPATH, "//input[@id='username']")
driver.find_element(By.XPATH, "//button[text()='Login']")
driver.find_element(By.XPATH, "//label[contains(text(),'Email')]/following-sibling::input")
```

---

### 5. Data-testid Attributes (Best Practice)

This is the approach most modern teams use. Developers add special attributes like `data-testid` or `data-qa` specifically for automation. These attributes don't affect styling or functionality so developers wont remove them accidentally.

```html
<button data-testid="submit-btn">Submit</button>
```

```python
# Selenium
driver.find_element(By.CSS_SELECTOR, "[data-testid='submit-btn']")

# Playwright
page.get_by_test_id("submit-btn")
```

If your team is not using `data-testid` yet, have a conversation with devs. This small change makes your automation much more stable.

---

### 6. Playwright-Specific Locators

Playwright has some really nice built-in locators that are more readable than raw CSS or XPath.

```python
# By role
page.get_by_role("button", name="Login")

# By label
page.get_by_label("Email address")

# By placeholder
page.get_by_placeholder("Enter your email")

# By text
page.get_by_text("Welcome back")
```

These locators are great because they match how users actually interact with the page — by reading text and clicking buttons by their label, not by some random CSS class.

---

## How to Inspect and Find Locators in Browser

Here is the step by step process I use:

1. **Open DevTools** — Right click on the element → Inspect (or press F12)
2. **Check for ID** — Look in the `id` attribute first
3. **Check for data-testid** — Look for `data-testid`, `data-qa`, or `data-cy`
4. **Write a CSS selector** — Using class, attribute, or combination
5. **Validate in Console** — Open DevTools console and test your selector:

```javascript
// Test CSS selector
document.querySelectorAll(".login-btn")

// Test XPath
$x("//button[@data-testid='login-btn']")
```

The console will show you how many elements match. You want exactly **1 match**. If you get 0, the selector is wrong. If you get more than 1, it is not unique enough.

---

## Tips for Writing Better Locators

**1. Never use absolute XPath**

Absolute XPath like `/html/body/div[1]/div[3]/form[2]/input[1]` will break the moment anyone changes the HTML structure. Always use relative XPath.

**2. Avoid using index-based selectors**

`div:nth-child(3)` or `//div[3]` are fragile. If someone adds a new div above, your index is now wrong.

**3. Use multiple attributes together**

Instead of just `.btn`, try `button.btn[type='submit']`. More specific = more stable.

**4. Prefer user-facing attributes**

Use things like `placeholder`, `aria-label`, `name`, and `role`. These change less often than CSS classes.

**5. Talk to your developers**

Seriously, this is the most underrated tip. Ask them to add `data-testid` attributes on elements you need to automate. Most developers are happy to do this.

---

## Common Mistakes to Avoid

❌ **Copying XPath from browser directly** — The generated XPath is usually absolute and very fragile. Write your own relative XPath instead.

❌ **Using class names that look generated** — Classes like `sc-bdVTJa` or `css-1x7ujbd` are auto-generated by CSS-in-JS libraries and they change with every build.

❌ **Not validating your selector** — Always test in the browser console before putting it in your code.

❌ **Using the same locator for different elements** — If a class appears on 10 buttons, you need a more specific selector.

---

## How to Build a Locator Strategy for Your Project

Having a consistent locator strategy across your whole team saves a lot of headache. Here is a priority order I recommend:

**Priority 1 — data-testid or data-qa**

Work with developers to add these attributes to all interactive elements. This is the most stable option and is specifically meant for testing. It should be your default choice whenever possible.

**Priority 2 — Semantic HTML attributes**

Use `id`, `name`, `aria-label`, `placeholder`, or `type` attributes. These are stable because they have functional meaning in the application and developers are unlikely to remove them without good reason.

**Priority 3 — CSS selectors using class names**

Use class names that are meaningful and not auto-generated. Something like `.submit-button` or `.error-message` is good. Something like `.sc-abc123` or `.css-xyz789` is fragile.

**Priority 4 — XPath**

Use XPath when CSS cannot do the job — mainly for text-based lookups or navigating up the DOM tree.

**Avoid completely:**

- Absolute XPath from browser DevTools
- Auto-generated class names
- Index-based selectors like `nth-child(3)` unless the order is truly guaranteed

Document your locator strategy in your project README so every team member follows the same approach. Consistency across the team is just as important as the choice of locator type.

---

## Practice Locators on QA Playground

If you want to practice writing locators, go to [QA Playground Practice Page](https://www.qaplayground.com/practice). Every element there has proper `id`, `data-testid`, and `data-action` attributes so you can practice writing real locators.

Try finding:
- The input field for entering text
- The submit button
- Table rows and columns
- Hidden elements that appear after a button click

---

## Conclusion

Finding good locators is a skill that gets better with practice. Start with IDs, move to CSS selectors, learn XPath for tricky cases, and push your team to use `data-testid` attributes. In Playwright, use the built-in role and label locators whenever possible.

The goal is not to find any locator that works — it is to find one that will still work three months from now when the dev team does a UI refresh.

Keep practicing and you will get the hang of it quickly. 🚀

---

*Happy Testing!*
