---
title: "API Testing with Postman: A Complete Beginner's Guide"
description: "New to API testing? This step-by-step Postman guide will teach you how to send requests, write test scripts, organize collections, and test APIs like a professional QA engineer."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-07-05"
lastModified: "2025-07-05"
category: ["api-testing", "tools"]
keywords: "Postman tutorial, API testing Postman, Postman beginners guide, how to use Postman, REST API Postman"
slug: "api-testing-with-postman-beginners-guide"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "API testing with Postman for beginners"
draft: false
---

## Introduction

If you are a QA engineer and you have not learned Postman yet, you are missing out on one of the most useful tools in the industry. Postman is the most popular tool for API testing and almost every company uses it.

The good news is it is not hard to learn. In this guide I will take you from zero to being able to test real APIs confidently. By the end you will know how to send requests, write tests, organize your work, and run tests automatically.

---

## What is Postman?

Postman is a platform for API development and testing. With Postman you can:

- Send HTTP requests (GET, POST, PUT, DELETE, etc.)
- View and analyse API responses
- Write automated test scripts
- Organize requests into collections
- Use variables for different environments
- Run collections via command line (Newman)
- Share collections with team members

You can download Postman for free from [postman.com](https://www.postman.com/downloads/).

---

## Understanding the Postman Interface

When you first open Postman, the interface can look overwhelming. Let me break it down:

**Sidebar (left):**
- Collections — organized groups of saved requests
- Environments — sets of variables (dev, staging, prod)
- History — recent requests you made

**Main area (center):**
- Request URL bar — where you type the endpoint
- Method selector (GET, POST, etc.) — left of the URL bar
- Tabs — Params, Authorization, Headers, Body, Tests
- Send button — sends the request

**Response area (bottom):**
- Body — the response data
- Headers — response headers
- Status code — 200, 404, 500, etc.
- Response time — how long it took

---

## Sending Your First Request

Let's start with something simple. We will call a public API that returns user data.

1. Open Postman
2. Click **New Request** or press `Ctrl+T`
3. Select **GET** from the method dropdown
4. Enter this URL: `https://jsonplaceholder.typicode.com/users/1`
5. Click **Send**

You should see a JSON response with user data. Congratulations — you just made your first API call!

---

## Different Request Methods

### GET Request — Reading Data

Used to fetch data. No request body needed.

```
GET https://jsonplaceholder.typicode.com/posts
GET https://jsonplaceholder.typicode.com/posts/1
GET https://jsonplaceholder.typicode.com/users?_limit=5
```

Query parameters go in the **Params** tab or directly in the URL.

### POST Request — Creating Data

Used to create new resources. Requires a request body.

1. Change method to **POST**
2. URL: `https://jsonplaceholder.typicode.com/posts`
3. Go to **Body** tab
4. Select **raw** and choose **JSON** from dropdown
5. Enter:

```json
{
  "title": "My First Post",
  "body": "This is the post content",
  "userId": 1
}
```

6. Click **Send**

You should get a `201 Created` response with the created object.

### PUT Request — Updating Data

Updates an existing resource completely.

```
PUT https://jsonplaceholder.typicode.com/posts/1
```

Body same as POST but you are replacing the entire resource.

### PATCH Request — Partial Update

Updates only specific fields.

```
PATCH https://jsonplaceholder.typicode.com/posts/1
```

Body only contains the fields you want to change.

### DELETE Request — Deleting Data

```
DELETE https://jsonplaceholder.typicode.com/posts/1
```

Usually no body needed.

---

## Writing Test Scripts in Postman

This is where Postman really shines for QA engineers. You can write JavaScript tests in the **Tests** tab that run automatically after every response.

### Basic Assertions

```javascript
// Test 1: Check status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Test 2: Check response time
pm.test("Response time is less than 2 seconds", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Test 3: Check response body has data
pm.test("Response body is not empty", function () {
    pm.expect(pm.response.json()).to.not.be.empty;
});
```

### Validating Response Structure

```javascript
pm.test("Response has required fields", function () {
    const json = pm.response.json();
    
    pm.expect(json).to.have.property("id");
    pm.expect(json).to.have.property("name");
    pm.expect(json).to.have.property("email");
});

pm.test("ID is a number", function () {
    const json = pm.response.json();
    pm.expect(json.id).to.be.a("number");
});

pm.test("Email is valid string", function () {
    const json = pm.response.json();
    pm.expect(json.email).to.be.a("string");
    pm.expect(json.email).to.include("@");
});
```

### Saving Values for Next Request

This is very useful for chaining requests — for example, creating a user and then using the created user's ID in the next request.

```javascript
// In POST /users Tests tab
pm.test("Save user ID for next request", function () {
    const json = pm.response.json();
    pm.environment.set("userId", json.id);
    console.log("Saved user ID:", json.id);
});
```

In the next request you can use `{{userId}}` in the URL:

```
GET https://api.example.com/users/{{userId}}
```

---

## Using Environment Variables

Never hardcode URLs and tokens. Use environments instead.

**Setting up an environment:**

1. Click **Environments** in the sidebar
2. Click **+** to create new
3. Name it "Development"
4. Add variables:

| Variable | Value |
|---|---|
| `base_url` | `https://api.example.com` |
| `auth_token` | `your-bearer-token-here` |

**Using variables in requests:**

```
URL: {{base_url}}/users

Authorization Header: Bearer {{auth_token}}
```

Now you can create separate environments for Dev, Staging, and Production with the same collection but different variable values.

---

## Setting Up Authorization

Most APIs require authentication. Postman supports many auth types.

**Bearer Token:**

1. Go to **Authorization** tab
2. Select **Bearer Token** from dropdown
3. Enter `{{auth_token}}`

**Basic Auth:**

1. Go to **Authorization** tab
2. Select **Basic Auth**
3. Enter username and password

**You can also set auth at the collection level** so all requests inherit it — go to collection settings → Authorization tab.

---

## Organizing Requests into Collections

A collection is a group of related API requests. Think of it as a test suite.

**Creating a collection:**

1. Click **New** → **Collection**
2. Give it a name like "User API Tests"
3. Add folders for organization (e.g., "Auth Tests", "User CRUD Tests")

**Good collection structure:**

```
User API Tests/
├── Auth/
│   ├── Login with valid credentials
│   ├── Login with invalid password
│   └── Logout
├── Users/
│   ├── Get all users
│   ├── Get user by ID
│   ├── Create new user
│   ├── Update user
│   └── Delete user
└── Error Cases/
    ├── Request without auth token
    ├── Get non-existent user
    └── Create user with invalid data
```

---

## Running Tests Automatically with Collection Runner

Once you have a collection, you can run all tests at once.

1. Click the **...** next to your collection name
2. Select **Run collection**
3. You can:
   - Select which requests to run
   - Set number of iterations
   - Add a delay between requests
   - Upload CSV/JSON file for data-driven testing

After the run you see a summary of all passed and failed tests.

---

## Running Postman Tests in CI/CD with Newman

Newman is the command-line runner for Postman collections. It lets you run your API tests in CI/CD pipelines.

**Install Newman:**

```bash
npm install -g newman
```

**Export your collection** from Postman (File → Export → Collection v2.1)

**Run via command line:**

```bash
# Basic run
newman run my-collection.json

# With environment
newman run my-collection.json -e development.json

# Generate HTML report
newman run my-collection.json --reporters cli,htmlextra
```

This is how you integrate API tests into GitHub Actions, Jenkins, or any other CI system.

---

## Postman Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` | Send request |
| `Ctrl+S` | Save request |
| `Ctrl+T` | New tab |
| `Ctrl+/` | Toggle sidebar |
| `Ctrl+Shift+L` | Toggle console |

---

## Common Beginner Mistakes

❌ **Not saving requests** — Click Save (Ctrl+S) or changes are lost when you close the tab.

❌ **Hardcoding URLs** — Use environment variables from day one.

❌ **Not writing tests** — Just looking at the response manually is not proper API testing. Write assertions.

❌ **Not checking all fields** — Getting a 200 doesn't mean the data is correct. Validate the response body.

❌ **Ignoring error scenarios** — Don't just test the happy path. Send bad data and check how the API responds.

---

## Conclusion

Postman is one of those tools where the basics are simple to learn but there is always more depth to explore. Start with sending simple requests, then add test scripts, then organize into collections, and finally set up Newman for CI/CD.

The skill of API testing is incredibly valuable in the industry right now. Companies want QA engineers who can test APIs directly, not just through the UI. Postman is the best way to develop this skill.

Go practice on public APIs like JSONPlaceholder or the Reqres API — both are free and designed for testing. Once you are comfortable, start testing the real APIs in your project.

🚀 **Happy Testing!**
