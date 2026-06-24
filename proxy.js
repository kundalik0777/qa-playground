import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter — only created when Upstash env vars are present.
// In local dev without these vars, rate limiting is skipped gracefully.
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        prefix: "rl:auth",
        analytics: false,
      })
    : null;

function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ── Rate limiting on auth endpoints ──────────────────────────────────────
  // Fail open: if Upstash is unreachable or over its request quota, never let
  // the rate limiter crash auth — allow the request through instead.
  if (ratelimit && pathname.startsWith("/api/auth")) {
    const ip = getClientIp(request);
    try {
      const { success, limit, remaining, reset } = await ratelimit.limit(ip);

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "X-RateLimit-Limit": String(limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(reset),
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            },
          }
        );
      }
    } catch (err) {
      // Upstash failure (quota exceeded, network error, etc.) — log and continue.
      console.error("[proxy] Rate limit check failed, allowing request:", err?.message);
    }
  }

  // ── Admin route protection ────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    try {
      const sessionRes = await fetch(
        new URL("/api/auth/get-session", request.nextUrl.origin),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!sessionRes.ok) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      const session = await sessionRes.json();

      if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth/:path*"],
};
