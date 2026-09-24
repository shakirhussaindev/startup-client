"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Link2,
  Linkedin,
  Globe,
  Send,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Clock,
  User,
  Mail,
  ArrowLeft,
} from "lucide-react";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Description,
  Button,
  Avatar,
} from "@heroui/react";
import { submitApplication } from "@/lib/actions/application";

const AVAILABILITY_OPTIONS = [
  "Immediate (within 1 week)",
  "2 weeks notice",
  "1 month notice",
  "Flexible / Part-time start",
];

export default function ApplyForm({ opportunity, applicant }) {
  const router = useRouter();

  // Form states
  const [resumeLink, setResumeLink] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
  const [pitchNote, setPitchNote] = useState("");

  // Submission feedback states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate required resume link
    if (!resumeLink.trim()) {
      setErrorMessage(
        "Please provide a valid resume link (Google Drive, Notion, or PDF link).",
      );
      return;
    }

    try {
      new URL(resumeLink.trim());
    } catch {
      setErrorMessage("Please enter a valid URL for your resume.");
      return;
    }

    setSubmitting(true);

    try {
      const applicationPayload = {
        opportunityId: opportunity?._id,
        opportunityTitle: opportunity?.title,
        startupId: opportunity?.startupId,
        startupName: opportunity?.startupName,
        applicant: {
          id: applicant?._id || applicant?.id,
          name: applicant?.name,
          email: applicant?.email,
          image: applicant?.image,
        },
        resumeLink: resumeLink.trim(),
        portfolioUrl: portfolioUrl.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        availability,
        pitchNote: pitchNote.trim() || null,
        status: "Pending", // Pending, Shortlisted, Accepted, Rejected
        appliedAt: new Date().toISOString(),
      };

      // console.log("Submitting application payload:", applicationPayload);

      const applicationSubmit = await submitApplication(applicationPayload);

      if (applicationSubmit.insertedId) {
        setSuccessMessage(
          "Your application was submitted successfully! Redirecting...",
        );
        
        setTimeout(() => {
          router.push(`/opportunities/${opportunity?._id}`);
        }, 1500);
      }
      } catch (err) {
      setErrorMessage(
        err.message || "Failed to submit application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Navigation link */}
      <Link
        href={`/opportunities/${opportunity?._id || ""}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-default-500 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        <span>Back to Opportunity Details</span>
      </Link>

      {/* Main Container */}
      <div className="rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl transition-colors dark:border-default-100/20 dark:bg-[#0c0c0e]/90 sm:p-10">
        {/* Header: Opportunity Context */}
        <div className="flex flex-col gap-4 border-b border-default-200/60 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-default-100/20">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 shrink-0 rounded-2xl ring-2 ring-orange-500/30">
              <Avatar.Image
                src={opportunity?.startupLogo}
                alt={opportunity?.startupName || "Startup Logo"}
                className="object-cover"
              />
              <Avatar.Fallback className="text-sm font-bold text-orange-500">
                {opportunity?.startupName?.slice(0, 2).toUpperCase() || "SF"}
              </Avatar.Fallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  {opportunity?.startupName}
                </span>
                <span className="text-default-300 dark:text-default-700">
                  •
                </span>
                <span className="text-xs text-default-400">
                  {opportunity?.StartupIndustry}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Apply for {opportunity?.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <span className="inline-flex items-center gap-1 rounded-lg bg-default-100/70 px-2.5 py-1 text-xs font-medium capitalize text-default-600 dark:bg-default-100/20 dark:text-default-300">
              <Globe size={13} className="text-orange-500" />
              {opportunity?.workType || "Remote"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg bg-default-100/70 px-2.5 py-1 text-xs font-medium capitalize text-default-600 dark:bg-default-100/20 dark:text-default-300">
              <Clock size={13} className="text-orange-500" />
              {opportunity?.commitment || "Full-time"}
            </span>
          </div>
        </div>

        {/* Applicant Verification Card */}
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-default-200/60 bg-default-100/40 p-4 dark:border-default-100/10 dark:bg-default-100/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-1 ring-default-300 dark:ring-default-700">
              <Avatar.Image src={applicant?.image} alt={applicant?.name} />
              <Avatar.Fallback className="text-xs font-bold">
                {applicant?.name?.slice(0, 2).toUpperCase() || "ME"}
              </Avatar.Fallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold text-foreground">
                Applying as{" "}
                <span className="font-bold">
                  {applicant?.name || "Candidate"}
                </span>
              </p>
              <p className="text-[11px] text-default-400">
                {applicant?.email || "candidate@startupforge.dev"}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            Verified Account
          </span>
        </div>

        {/* Dynamic Alerts */}
        <AnimatePresence mode="wait">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-danger-500/20 bg-danger-500/10 p-3.5 text-xs text-danger-600 dark:text-danger-400"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Application Form */}
        <Form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          {/* 1. Resume / CV Link (Required) */}
          <TextField isRequired name="resumeLink" className="w-full">
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600 dark:text-default-400">
              Resume / CV Link
            </Label>
            <div className="relative mt-1">
              <Input
                type="url"
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                placeholder="https://drive.google.com/file/... or Notion / PDF URL"
                className="w-full !rounded-xl text-xs"
              />
            </div>
            <Description className="text-[11px] text-default-400">
              Ensure the link sharing permission is set to "Anyone with the link
              can view".
            </Description>
            <FieldError />
          </TextField>

          {/* 2. Optional Profiles (Two Columns) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Portfolio / GitHub */}
            <TextField name="portfolioUrl" className="w-full">
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600 dark:text-default-400">
                Portfolio or GitHub URL{" "}
                <span className="text-default-400 text-[10px] normal-case">
                  (Optional)
                </span>
              </Label>
              <Input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/your-handle"
                className="mt-1 w-full !rounded-xl text-xs"
              />
              <FieldError />
            </TextField>

            {/* LinkedIn Profile */}
            <TextField name="linkedinUrl" className="w-full">
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600 dark:text-default-400">
                LinkedIn Profile{" "}
                <span className="text-default-400 text-[10px] normal-case">
                  (Optional)
                </span>
              </Label>
              <Input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="mt-1 w-full !rounded-xl text-xs"
              />
              <FieldError />
            </TextField>
          </div>

          {/* 3. Earliest Availability (Optional) */}
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600 dark:text-default-400">
              Availability / Start Date{" "}
              <span className="text-default-400 text-[10px] normal-case">
                (Optional)
              </span>
            </Label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="mt-1 h-10 w-full rounded-xl border border-default-200/80 bg-background px-3 text-xs font-medium text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/30"
            >
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Pitch Note to the Founder (Optional) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-default-600 dark:text-default-400">
                Note to the Founder{" "}
                <span className="text-default-400 text-[10px] normal-case">
                  (Optional)
                </span>
              </Label>
              <span className="text-[11px] text-default-400">
                {pitchNote.length}/500
              </span>
            </div>
            <textarea
              rows={4}
              maxLength={500}
              value={pitchNote}
              onChange={(e) => setPitchNote(e.target.value)}
              placeholder="Briefly describe what excites you about this startup, your key technical achievements, and how you can add immediate value..."
              className="mt-1 w-full rounded-xl border border-default-200/80 bg-background p-3 text-xs leading-relaxed text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/30"
            />
          </div>

          {/* Form Actions */}
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end border-t border-default-200/60 pt-5 dark:border-default-100/20">
            <Button
              as={Link}
              href={`/opportunities/${opportunity?._id || ""}`}
              variant="secondary"
              className="h-11 !rounded-xl font-semibold sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isDisabled={submitting}
              className="h-11 !rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01] hover:shadow-orange-500/30 sm:w-48"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send size={14} />
                  <span>Submit Application</span>
                </div>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
