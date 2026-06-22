---
title: "Complete Guide to API Authentication Testing for QA Engineers"
description: "Authentication bugs are some of the most critical bugs in any application. Learn how to test API authentication — Bearer tokens, Basic Auth, OAuth, API keys — with real examples."
author: "Kundalik Jadhav"
authorUrl: "https://www.qaplayground.com/about-me"
date: "2025-09-05"
lastModified: "2025-09-05"
category: ["api-testing", "testing"]
keywords: "API authentication testing, JWT testing, Bearer token testing, OAuth testing, API security testing"
slug: "complete-guide-to-api-authentication-testing"
image: "https://ik.imagekit.io/randomcoder/QAPlayground/id-02-people-in-meeting-with-laptop.webp"
imageAlt: "API authentication testing guide for QA engineers"
draft: false
---

## Introduction

Authentication is the backbone of almost every application. If authentication is broken, your entire application security falls apart. Yet many QA engineers focus all their testing on the UI login form and forget to properly test the API authentication layer.

In this guide I will cover the most common types of API authentication and exactly what you should be testing for each one. This is the kind of testing that catches real security bugs, not just functional bugs.

---

## Why API Authentication Testing Matters

Consider this scenario: Your UI tests pass perfectly. The login page works, the protected pages redirect unauthenticated users. But then someone discovers they can call the API directly without a token and get sensitive data. All your UI tests missed this because they test through the browser, not the API directly.

This is why API authentication testing is crucial:

- The UI might enforce auth but the API might not
- Token validation might have edge cases the dev didn't think of
- Authorization rules might differ between what the UI shows and what the API returns
- Expired tokens might still be accepted
- One user might be able to access another user's data

---

## Types of API Authentication

### 1. Bearer Token (JWT)

The most common type. After login, the server returns a token. The client includes this token in every subsequent request.

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Basic Authentication

Username and password encoded in Base64, sent with every request.

```
Authorization: Basic YWRtaW46cGFzc3dvcmQ=
```

### 3. API Key

A static key sent as a header or query parameter.

```
X-API-Key: your-api-key-here
# or
GET /data?api_key=your-api-key
```

### 4. OAuth 2.0

More complex flow involving access tokens, refresh tokens, and authorization servers. Used by Google, GitHub, Twitter, etc.

---

## What to Test: Authentication Test Scenarios

### Scenario Group 1: Valid Authentication

```
✅ Login with correct credentials → Receive valid token
✅ Token is returned in expected format
✅ Token contains expected fields (if JWT: user ID, role, expiry)
✅ Protected endpoint works with valid token
✅ All API endpoints that require auth work with valid token
```

**Postman tests for valid login:**

```javascript
pm.test("Login returns 200 status", function () {
    pm.response.to.have.status(200);
});

pm.test("Response contains access token", function () {
    const json = pm.response.json();
    pm.expect(json).to.have.property("token");
    pm.expect(json.token).to.be.a("string");
    pm.expect(json.token.length).to.be.above(0);
});

pm.test("Save token for subsequent tests", function () {
    const json = pm.response.json();
    pm.environment.set("auth_token", json.token);
});
```

---

### Scenario Group 2: Missing Authentication

```
❌ Call protected endpoint with NO token → Expect 401 Unauthorized
❌ Call protected endpoint with empty token → Expect 401
❌ Call protected endpoint with token as empty string → Expect 401
```

**Test in Postman:**

Send a request to a protected endpoint with no Authorization header. You should get `401 Unauthorized`. If you get `200`, that is a critical security bug.

```javascript
pm.test("Request without token returns 401", function () {
    pm.response.to.have.status(401);
});

pm.test("Error message is appropriate", function () {
    const json = pm.response.json();
    pm.expect(json.message).to.include("unauthorized");
});
```

---

### Scenario Group 3: Invalid Authentication

```
❌ Random string as token → Expect 401
❌ Malformed JWT (missing parts) → Expect 401
❌ JWT with invalid signature → Expect 401
❌ JWT from different environment (dev token on staging) → Expect 401
```

**Testing with invalid token:**

```
Authorization: Bearer this-is-not-a-valid-token
Authorization: Bearer eyJhbGci.invalid.signature
Authorization: Bearer null
Authorization: Bearer undefined
```

All of these should return `401`. If any of them return `200`, there is a bug in token validation.

---

### Scenario Group 4: Expired Tokens

This is one that developers often forget to implement properly.

```
❌ Use a token that has expired → Expect 401 with "token expired" message
❌ Verify expired token cannot be refreshed beyond its lifetime
✅ Valid refresh token can get new access token before expiry
```

**How to test expired tokens:**

If the token expiry is configurable, set a short expiry (30 seconds) in the test environment. Send the token, wait for it to expire, then try using it again.

Alternatively, you can decode a JWT (it is just Base64) and modify the `exp` (expiration) field to a past timestamp, then re-encode. If the server doesn't verify the signature properly, it will accept this — which is another security bug.

---

### Scenario Group 5: Authorization (Not Just Authentication)

Authentication = "Are you who you say you are?"
Authorization = "Are you allowed to do this?"

These are two different things and both need to be tested.

```
❌ Regular user accessing admin endpoint → Expect 403 Forbidden
❌ User A accessing User B's private data → Expect 403 Forbidden
❌ Regular user trying to modify another user's data → Expect 403 Forbidden
✅ Admin can access admin endpoints → Expect 200
✅ User can only see their own data
```

**IDOR (Insecure Direct Object Reference) Test:**

This is a very common vulnerability. User 1 is logged in and can see their own profile at `/users/123`. Can they access `/users/456` (User 2's profile)?

```
GET /api/users/456
Authorization: Bearer <token for user 123>

Expected: 403 Forbidden or 404 Not Found
If you get: 200 with User 456's data → That's a critical security bug (IDOR)
```

---

### Scenario Group 6: Token After Logout

```
✅ After logout, old token should be invalidated
❌ Using token after logout → Expect 401
```

**How to test:**

1. Login → Get token
2. Logout (call the logout endpoint)
3. Use the old token to call a protected endpoint
4. Expect 401

If you get 200 with the old token after logout, the server is not properly invalidating tokens — another security issue.

---

### Scenario Group 7: Brute Force and Rate Limiting

```
❌ Sending 100 failed login attempts → Expect rate limiting (429 Too Many Requests)
❌ Account should be locked after N consecutive failed attempts
✅ Rate limiting resets after appropriate cooldown
```

```javascript
// Postman test for rate limiting
pm.test("After many failed attempts returns 429", function () {
    // You would need to run this test after running many failed login attempts
    pm.response.to.have.status(429);
});
```

---

## Testing OAuth 2.0 Flows

OAuth is more complex. Here are the key scenarios:

**Authorization Code Flow:**
1. User clicks "Login with Google"
2. Redirect to Google auth page
3. User grants permission
4. Google redirects back with authorization code
5. Your app exchanges code for access token + refresh token

**What to test:**
- What happens if user denies permission?
- What happens if the authorization code is expired?
- What happens if the authorization code is reused?
- Is the `state` parameter (CSRF protection) validated?
- Can an authorization code from one app be used in another?

---

## Practical Tips for Authentication Testing

**1. Use a separate admin token for test setup**

Have a dedicated test admin account whose sole purpose is setting up test data via API. Never use real admin credentials in test code.

**2. Test every endpoint, not just a few**

It is common for developers to add authentication to most endpoints but forget one. Test authentication on every endpoint in your API.

**3. Document your auth test scenarios**

Create a checklist of authentication scenarios and track which endpoints have been tested. This ensures nothing is missed.

**4. Include auth tests in CI/CD**

Auth tests should run on every pull request. A broken authentication flow should block deployment.

**5. Test with multiple user roles**

If your app has multiple roles (admin, manager, user, guest), test each protected endpoint with each role and verify the correct access is granted or denied.

---

## Sample Authentication Test Checklist

| Scenario | Expected Status | Tested? |
|---|---|---|
| Login with valid credentials | 200 | |
| Login with wrong password | 401/400 | |
| Login with non-existent user | 401/400 | |
| Call protected endpoint with valid token | 200 | |
| Call protected endpoint without token | 401 | |
| Call protected endpoint with invalid token | 401 | |
| Call protected endpoint with expired token | 401 | |
| Use token after logout | 401 | |
| Regular user accesses admin endpoint | 403 | |
| User A accesses User B's data | 403 | |
| Many failed login attempts | 429 | |

Use this checklist for every new API you are responsible for testing.

---

## Conclusion

Authentication and authorization testing is not optional — it is one of the most important types of testing you can do. The scenarios in this guide cover the most common vulnerabilities and weak points in authentication systems.

The good news is that once you have a Postman collection set up for auth testing, it is easy to run it against new environments and catch regressions quickly. Invest the time to build this collection properly and it will save your application from serious security issues.

Security testing starts with authentication. Get this right and you have a solid foundation.

🚀 **Happy Testing!**
