// app/login/page.jsx
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Button,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

 
  const redirectTo = searchParams.get("redirect") || "/";

  // Check if redirected immediately after signing up
  const isRegistered = searchParams.get("registered") === "true";

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(
    isRegistered ? "Account created successfully! Please sign in." : "",
  );

  // 1. Handle Credential Login (Email & Password)
  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMsg(
          error.message || "Invalid email or password. Please try again.",
        );
        setLoading(false);
        return;
      }

      setSuccessMsg("Logged in successfully! Redirecting...");

      setTimeout(() => {
        router.push(redirectTo);
        router.refresh();
      }, 800);
    } catch (err) {
      setErrorMsg(
        err.message || "An unexpected error occurred. Please try again.",
      );
      setLoading(false);
    }
  };

  // 2. Handle Google Social Login
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err) {
      setErrorMsg("Failed to connect with Google. Try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-[420px] w-[520px] rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl border border-default-200/60 bg-background/85 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-default-100/30">
          {/* Header */}
          <div className="text-center">
            <Link
              href="/"
              className="group mx-auto inline-flex items-center gap-2.5 focus:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 shadow-md shadow-orange-500/20">
                <Flame className="h-5 w-5 text-white" strokeWidth={2.2} />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Startup
                <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Forge
                </span>
              </span>
            </Link>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-default-500">
              Sign in to your account to continue building
            </p>
          </div>

          {/* Feedback Alerts */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-danger-500/20 bg-danger-500/10 p-3.5 text-sm text-danger-600 dark:text-danger-400"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign-in Button */}
          <div className="mt-6">
            <Button
              variant="secondary"
              isDisabled={loading || googleLoading}
              onPress={handleGoogleLogin}
              className="flex h-12 w-full items-center justify-center gap-3 !rounded-xl border border-default-200/80 bg-background/80 font-medium text-foreground transition-all hover:bg-default-100 hover:border-default-300 dark:border-default-100/30"
            >
              {googleLoading ? (
                <Loader2 size={18} className="animate-spin text-orange-500" />
              ) : (
                <FcGoogle size={20} />
              )}
              <span>Continue with Google</span>
            </Button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-default-200/60 dark:border-default-100/20" />
            <span className="absolute bg-background px-3 text-xs uppercase tracking-wider text-default-400">
              Or with email
            </span>
          </div>

          {/* Credential Form */}
          <Form
            onSubmit={handleCredentialLogin}
            className="flex flex-col gap-4"
          >
            {/* Email Field */}
            <TextField
              isRequired
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              className="w-full"
              validate={(val) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)) {
                  return "Please enter a valid email address.";
                }
                return null;
              }}
            >
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                Email Address
              </Label>
              <Input
                placeholder="founder@startupforge.dev"
                className="mt-1 w-full !rounded-xl"
              />
              <FieldError />
            </TextField>

            {/* Password Field */}
            <TextField
              isRequired
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              className="w-full"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-orange-600 transition-colors hover:text-orange-500 hover:underline dark:text-orange-400"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-1 w-full">
                <Input
                  placeholder="••••••••••••"
                  className="w-full !rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <FieldError />
            </TextField>

            {/* Submit Button */}
            <Button
              type="submit"
              isDisabled={loading || googleLoading}
              className="mt-2 h-12 w-full !rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] hover:shadow-orange-500/35"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </Form>

          {/* Signup Link */}
          <p className="mt-8 text-center text-sm text-default-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup?redirect=${redirectTo}`}
              className="font-semibold text-orange-600 transition-colors hover:text-orange-500 dark:text-orange-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Wrapped in Suspense to prevent Next.js client de-optimization due to useSearchParams
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-3 border-orange-500 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
