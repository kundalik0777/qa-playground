"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Loader2, LogIn, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/study-tracker/dashboard",
    });
    setGoogleLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    // Keep loading=true — the page will navigate away, no need to reset
    if (data?.user?.role === "ADMIN") {
      router.push("/admin/dashboard");
    } else {
      router.push("/study-tracker/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      id="login-page-container"
    >
      <div className="w-full max-w-[480px]" id="login-wrapper">
        <Card
          className="auth-card-shadow backdrop-blur-sm bg-card/95 dark:bg-[rgba(15,10,30,0.95)] border border-violet-200/40 dark:border-violet-500/25"
          id="login-card"
        >
          <CardHeader className="text-center space-y-2" id="login-header">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_4px_12px_rgba(124,58,237,0.25)] ring-[6px] ring-violet-500/[0.12]">
                <LogIn className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-title" id="login-title">
              Sign In
            </h1>
            <CardDescription
              className="text-slate-500 dark:text-gray-400"
              id="login-subtitle"
            >
              QA PlayGround — access your dashboard
            </CardDescription>
          </CardHeader>

          <CardContent id="login-content">
            {!showEmailForm ? (
              /* ── Step 1: Choose login method ── */
              <div className="space-y-3" id="login-method-picker" data-testid="login-method-picker">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-lg font-medium border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200"
                  id="google-signin-btn"
                  data-testid="google-signin-button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FcGoogle className="mr-2 h-5 w-5" />
                  )}
                  Continue with Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-lg font-medium border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-800 transition-all duration-200"
                  id="email-signin-btn"
                  data-testid="email-signin-button"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail className="mr-2 h-5 w-5 text-slate-500 dark:text-gray-400" />
                  Continue with Email
                </Button>
              </div>

            ) : (
              /* ── Step 2: Email login form ── */
              <>
                <button
                  type="button"
                  onClick={() => { setShowEmailForm(false); setError(""); }}
                  className="flex items-center gap-1 text-sm text-slate-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 mb-5 transition-colors"
                  data-testid="back-to-methods-btn"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>

                <form
                  onSubmit={handleSubmit}
                  id="login-form"
                  data-testid="login-form"
                >
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5" id="email-field-container">
                      <Label htmlFor="email" id="email-label">Email</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="yourmail@gmail.com"
                        data-testid="email-input"
                        autoComplete="username"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                        aria-describedby={error ? "login-error" : "email-hint"}
                        aria-invalid={!!error}
                        disabled={loading}
                      />
                      <p
                        id="email-hint"
                        className="text-xs text-slate-500 dark:text-gray-400 mt-0.5"
                      >
                        This is a real platform — enter the email you signed up with.
                      </p>
                    </div>

                    <div className="flex flex-col gap-1.5" id="password-field-container">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" id="password-label">Password</Label>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-violet-600 dark:text-violet-400 hover:underline underline-offset-2"
                          id="forgot-password-link"
                          data-testid="forgot-password-link"
                          prefetch={false}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          placeholder="••••••••"
                          data-testid="password-input"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 rounded-lg pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-500"
                          aria-describedby={error ? "login-error" : undefined}
                          aria-invalid={!!error}
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          data-testid="toggle-password-visibility"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2" id="remember-me-container">
                      <Checkbox
                        id="remember-me"
                        name="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(!!checked)}
                        data-testid="remember-me-checkbox"
                        disabled={loading}
                      />
                      <Label
                        htmlFor="remember-me"
                        className="text-sm text-slate-600 dark:text-gray-400 font-normal cursor-pointer"
                      >
                        Remember me for 30 days
                      </Label>
                    </div>

                    {error && (
                      <Alert
                        variant="destructive"
                        id="login-error"
                        data-testid="login-error"
                        role="alert"
                      >
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 tracking-wide"
                      id="login-btn"
                      data-testid="login-button"
                      data-action="login"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </CardContent>

          <CardFooter className="justify-center pb-6" id="login-footer">
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-violet-600 dark:text-violet-400 font-medium hover:underline underline-offset-2"
                id="signup-link"
                prefetch={false}
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
