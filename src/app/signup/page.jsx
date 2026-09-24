// app/signup/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Upload,
  ArrowRight,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Button,
  RadioGroup,
  Radio,
  Avatar,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [role, setRole] = useState("collaborator"); // Default: collaborator

  // UI & Loading states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  // Real-time password criteria
  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // Upload image to ImgBB
  const handleImgBBUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setServerError("Image size must be under 2MB.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setServerError(
        "ImgBB API key is missing. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local",
      );
      return;
    }

    setUploadingImage(true);
    setServerError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        setPhotoUrl(result.data.url);
      } else {
        setServerError(
          result.error?.message || "Failed to upload image to ImgBB.",
        );
      }
    } catch (err) {
      setServerError("Network error uploading image to ImgBB.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Safe user initials for Avatar fallback
  const getInitials = (text) => {
    if (!text?.trim()) return "SF";
    return text
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");

    if (!isPasswordValid) {
      setServerError("Password does not meet all security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setServerError("Passwords do not match.");
      return;
    }

    if (!role) {
      setServerError("Please select your account role.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoUrl,
        role,
      });

      if (error) {
        setServerError(error.message || "Failed to register. Try again.");
        setLoading(false);
        return;
      }

      // Ensure user is signed out so they must explicitly log in
      await authClient.signOut();

      setServerSuccess(
        "Account created successfully! Redirecting to sign in...",
      );

      setTimeout(() => {
        router.push(`/login?redirect=${redirectTo}`);
      }, 1500);
    } catch (err) {
      setServerError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-112.5 w-137.5 rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/10 to-transparent blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <div className="rounded-xl border border-default-200/60 bg-background/85 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-default-100/30">
          {/* Header */}
          <div className="text-center">
            <h1 className=" text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Create your{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                StartUp
              </span>{" "}
              account
            </h1>
            <p className="mt-1.5 text-sm text-default-500">
              Join as founders or collaborators today.
            </p>
          </div>

          {/* Feedback Alerts */}
          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 rounded-xl border border-danger-500/20 bg-danger-500/10 p-3.5 text-sm text-danger-600 dark:text-danger-400"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}

            {serverSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-sm text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                <span>{serverSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <Form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {/* 1. Full Name */}
            <TextField
              isRequired
              name="name"
              type="text"
              value={name}
              onChange={setName}
              className="w-full"
            >
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                Full Name
              </Label>
              <Input
                placeholder="Alex Vance"
                className="mt-1 w-full rounded-md"
              />
              <FieldError />
            </TextField>

            {/* 2. Email Address */}
            <TextField
              isRequired
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              className="w-full"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address.";
                }
                return null;
              }}
            >
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                Email Address
              </Label>
              <Input
                placeholder="alex@startupforge.dev"
                className="mt-1 w-full rounded-md"
              />
              <FieldError />
            </TextField>

            {/* 3. Password */}
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
                  Password <span className="text-rose-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs font-medium text-default-500 hover:text-foreground"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative mt-1 w-full">
                <Input
                  placeholder="••••••••••••"
                  className="w-full pr-10 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="mt-1 grid grid-cols-2 gap-2 bg-default-100/40 p-3 text-xs sm:grid-cols-3 dark:border-default-100/20 dark:bg-default-100/15">
                {/* 8+ Chars */}
                <span
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    passwordChecks.length
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  {/* {passwordChecks.length ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : (
                    <X size={13} strokeWidth={2.5} />
                  )} */}
                  6+ Characters
                </span>

                {/* Uppercase */}
                <span
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    passwordChecks.uppercase
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  Uppercase (A-Z)
                </span>

                {/* Lowercase */}
                <span
                  className={`inline-flex items-center gap-1.5 font-medium transition-colors ${
                    passwordChecks.lowercase
                      ? "text-emerald-500 dark:text-emerald-400"
                      : "text-rose-500 dark:text-rose-400"
                  }`}
                >
                  Lowercase (a-z)
                </span>
              </div>
              <FieldError />
            </TextField>

            {/* 4. Confirm Password */}
            <TextField
              isRequired
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={setConfirmPassword}
              className="w-full"
              validate={(val) => {
                if (val !== password) {
                  return "Passwords do not match.";
                }
                return null;
              }}
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                  Confirm Password <span className="text-rose-500">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-xs font-medium text-default-500 hover:text-foreground"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative mt-1 w-full">
                <Input
                  placeholder="••••••••••••"
                  className="w-full pr-10 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              <FieldError />
            </TextField>

            {/* 5. Profile Photo */}
            <div className="flex flex-col gap-2 pt-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                Profile Photo
              </Label>
              <div className="flex items-center gap-4 rounded-lg border border-default-200/70 bg-default-100/30 p-2 dark:border-default-100/30">
                {/* Upload Photo, Live Avatar Preview & Link Controls */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <label
                      className={`inline-flex cursor-pointer items-center gap-1.5 bg-background transition-colors hover:bg-default-100 ${uploadingImage ? "opacity-60 pointer-events-none" : ""}`}
                    >
                      <Avatar className="h-16 w-16 shrink-0 ring-2 rounded-xl ring-orange-500/30">
                        <Avatar.Image
                          src={photoUrl}
                          alt={name || "User Avatar"}
                        />
                        <Avatar.Fallback className="text-base font-bold text-orange-500">
                          <Upload size={25} />
                        </Avatar.Fallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={handleImgBBUpload}
                      />
                    </label>
                  </div>

                  <div>
                    <Label className="text-xs text-default-400 pl-1">
                      Or paste direct URL
                    </Label>
                    <Input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://i.ibb.co/..."
                      className="h-8 text-xs w-full rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 6. User Role Selector (Full Box Clickable & Required) */}
            <div className="flex flex-col gap-2 pt-1">
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
                Account Role <span className="text-rose-500">*</span>
              </Label>

              <RadioGroup
                isRequired
                value={role}
                onChange={setRole}
                name="role"
                orientation="horizontal"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {/* Option 1: Collaborator (Default) */}
                <Radio
                  value="collaborator"
                  className="group relative flex w-full cursor-pointer select-none flex-col justify-between rounded-lg border border-default-200/80 p-4 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                >
                  <Radio.Content className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <span className="text-sm font-semibold text-foreground">
                        Collaborator
                      </span>
                    </div>
                    <span className="rounded-full bg-default-100 px-2 py-0.5 text-[10px] font-semibold text-default-600 dark:bg-default-100/40">
                      Default
                    </span>
                  </Radio.Content>
                </Radio>

                {/* Option 2: Founder */}
                <Radio
                  value="founder"
                  className="group relative flex w-full cursor-pointer select-none flex-col justify-between rounded-lg border border-default-200/80 p-4 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
                >
                  <Radio.Content className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <span className="text-sm font-semibold text-foreground">
                        Founder
                      </span>
                    </div>
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isDisabled={loading || !isPasswordValid || uploadingImage}
              className="mt-3 h-12 w-full rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] hover:shadow-orange-500/35"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </Form>

          {/* Already have an account footer */}
          <p className="mt-8 text-center text-sm text-default-500">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${redirectTo}`}
              className="font-semibold text-orange-600 transition-colors hover:text-orange-500 dark:text-orange-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
