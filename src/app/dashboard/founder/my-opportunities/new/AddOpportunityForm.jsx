// app/dashboard/opportunities/new/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Calendar,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  X,
  Globe,
  Building2,
  Laptop,
  Clock,
  Zap,
} from "lucide-react";
import {
  Form,
  TextField,
  Input,
  Label,
  FieldError,
  Description,
  Button,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { createOpportunity } from "@/lib/actions/opportunities";
import { authClient } from "@/lib/auth-client";

const SUGGESTED_SKILLS = [
  "React",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "UI/UX Design",
  "Product Management",
];

export default function AddOpportunityForm({ founderStartup }) {
  const router = useRouter();
  // Retrieve authenticated founder session
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Form states
  const [roleTitle, setRoleTitle] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [workType, setWorkType] = useState("remote");
  const [commitment, setCommitment] = useState("full-time");
  const [deadline, setDeadline] = useState("");

  // Status states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Add skill tag
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (!trimmed) return;

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already added.`);
      return;
    }

    setSkills([...skills, trimmed]);
    setSkillInput("");
    setErrorMsg("");
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Handle Enter key inside skill input without submitting form
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (skills.length === 0) {
      setErrorMsg("Please add at least one required skill.");
      return;
    }

    if (!deadline) {
      setErrorMsg("Please select an application deadline.");
      return;
    }

    setLoading(true);

    try {
      // 1. Calculate status dynamically based on deadline
      const deadlineDate = new Date(deadline);
      deadlineDate.setHours(23, 59, 59, 999);
      const isDeadlineActive = deadlineDate.getTime() >= Date.now();
      const status = isDeadlineActive ? "Active" : "Closed";

      

      // 3. Complete database payload
      const opportunityData = {
        title: roleTitle,
        skills,
        workType,
        commitment,
        deadline,
        status,
        startupId: founderStartup._id,
        startupName: founderStartup.name,
        StartupIndustry: founderStartup.industry,
        startupLogo: founderStartup.logo,
      };

      const res = await createOpportunity(opportunityData);

      if (res?.insertedId || res?.success) {
        setSuccessMsg("Opportunity published successfully! Redirecting...");

        setTimeout(() => {
          router.push("/dashboard/founder/my-opportunities");
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to publish opportunity. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Back button */}
      <Link
        href="/dashboard/opportunities"
        className="inline-flex items-center gap-2 text-xs font-semibold text-default-500 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={14} />
        <span>Back to Opportunities</span>
      </Link>

      {/* Main Card Container */}
      <div className="rounded-3xl border border-default-200/60 bg-background/85 p-6 shadow-2xl backdrop-blur-xl sm:p-10 dark:border-default-100/30">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-default-100 pb-6 dark:border-default-100/20">
          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <span>New Recruitment Listing</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Post an Opportunity
          </h1>
          <p className="text-sm text-default-500">
            Define role requirements to attract vetted co-founders and technical
            operators.
          </p>
        </div>

        {/* Alerts */}
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

        {/* Form */}
        <Form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          {/* ================= 1. ROLE TITLE ================= */}
          <TextField
            isRequired
            name="roleTitle"
            type="text"
            value={roleTitle}
            onChange={setRoleTitle}
            className="w-full"
          >
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
              Role Title
            </Label>
            <Input
              placeholder="e.g., Lead Full-Stack Co-Founder (Next.js / Node)"
              className="mt-1 w-full !rounded-xl"
            />
            <Description className="text-xs text-default-400">
              Specify the primary designation and key focus area.
            </Description>
            <FieldError />
          </TextField>

          {/* ================= 2. REQUIRED SKILLS ================= */}
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
              Required Skills <span className="text-rose-500">*</span>
            </Label>

            {/* Input with Add Button */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill (e.g. Tailwind CSS) and press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="w-full !rounded-xl text-sm"
              />
              <Button
                type="button"
                variant="secondary"
                onPress={() => handleAddSkill()}
                className="h-10 shrink-0 !rounded-xl px-4 text-xs font-semibold"
              >
                <Plus size={15} />
                <span>Add</span>
              </Button>
            </div>

            {/* Selected Skills Chips */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="rounded-full p-0.5 hover:bg-orange-500/20"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Suggested Quick Add Tags */}
            <div className="pt-1">
              <span className="text-[11px] font-medium text-default-400">
                Suggested:
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {SUGGESTED_SKILLS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleAddSkill(item)}
                    className="rounded-lg border border-default-200/80 bg-default-100/50 px-2.5 py-1 text-[11px] font-medium text-default-600 transition-colors hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-500 dark:border-default-100/30"
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= 3. WORK TYPE ================= */}
          <div className="flex flex-col gap-2 pt-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
              Work Type <span className="text-rose-500">*</span>
            </Label>
            <RadioGroup
              isRequired
              value={workType}
              onChange={setWorkType}
              name="workType"
              orientation="horizontal"
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {/* Remote */}
              <Radio
                value="remote"
                className="group relative flex w-full cursor-pointer select-none flex-col rounded-2xl border border-default-200/80 p-3.5 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
              >
                <Radio.Content className="flex items-center gap-2">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Globe size={15} className="text-orange-500" />
                    <span>Remote</span>
                  </div>
                </Radio.Content>
                <p className="mt-1 pl-6 text-xs text-default-400">
                  Work anywhere worldwide
                </p>
              </Radio>

              {/* Hybrid */}
              <Radio
                value="hybrid"
                className="group relative flex w-full cursor-pointer select-none flex-col rounded-2xl border border-default-200/80 p-3.5 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
              >
                <Radio.Content className="flex items-center gap-2">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Laptop size={15} className="text-orange-500" />
                    <span>Hybrid</span>
                  </div>
                </Radio.Content>
                <p className="mt-1 pl-6 text-xs text-default-400">
                  Mixed office & remote
                </p>
              </Radio>

              {/* Onsite */}
              <Radio
                value="onsite"
                className="group relative flex w-full cursor-pointer select-none flex-col rounded-2xl border border-default-200/80 p-3.5 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
              >
                <Radio.Content className="flex items-center gap-2">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Building2 size={15} className="text-orange-500" />
                    <span>Onsite</span>
                  </div>
                </Radio.Content>
                <p className="mt-1 pl-6 text-xs text-default-400">
                  Fixed physical office
                </p>
              </Radio>
            </RadioGroup>
          </div>

          {/* ================= 4. COMMITMENT LEVEL ================= */}
          <div className="flex flex-col gap-2 pt-1">
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
              Commitment Level <span className="text-rose-500">*</span>
            </Label>
            <RadioGroup
              isRequired
              value={commitment}
              onChange={setCommitment}
              name="commitment"
              orientation="horizontal"
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
            >
              {/* Full-time */}
              <Radio
                value="full-time"
                className="group relative flex w-full cursor-pointer select-none flex-col rounded-2xl border border-default-200/80 p-3.5 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
              >
                <Radio.Content className="flex items-center gap-2">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Clock size={15} className="text-orange-500" />
                    <span>Full-time</span>
                  </div>
                </Radio.Content>
                <p className="mt-1 pl-6 text-xs text-default-400">
                  40+ hrs / week
                </p>
              </Radio>

              {/* Part-time */}
              <Radio
                value="part-time"
                className="group relative flex w-full cursor-pointer select-none flex-col rounded-2xl border border-default-200/80 p-3.5 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
              >
                <Radio.Content className="flex items-center gap-2">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Clock size={15} className="text-orange-500" />
                    <span>Part-time</span>
                  </div>
                </Radio.Content>
                <p className="mt-1 pl-6 text-xs text-default-400">
                  15–20 hrs / week
                </p>
              </Radio>

              {/* Flexible / Equity */}
              <Radio
                value="equity"
                className="group relative flex w-full cursor-pointer select-none flex-col rounded-2xl border border-default-200/80 p-3.5 transition-all hover:border-orange-500/50 hover:bg-default-100/40 data-[selected=true]:border-orange-500 data-[selected=true]:bg-orange-500/5 dark:border-default-100/30"
              >
                <Radio.Content className="flex items-center gap-2">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                    <Zap size={15} className="text-orange-500" />
                    <span>Flexible / Equity</span>
                  </div>
                </Radio.Content>
                <p className="mt-1 pl-6 text-xs text-default-400">
                  Milestone & equity based
                </p>
              </Radio>
            </RadioGroup>
          </div>

          {/* ================= 5. DEADLINE ================= */}
          <TextField
            isRequired
            name="deadline"
            type="date"
            value={deadline}
            onChange={setDeadline}
            className="w-full"
          >
            <Label className="text-xs font-semibold uppercase tracking-wider text-default-600">
              Application Deadline
            </Label>
            <div className="relative mt-1 w-full">
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full !rounded-xl"
              />
            </div>
            <Description className="text-xs text-default-400">
              Listing will automatically expire after this date.
            </Description>
            <FieldError />
          </TextField>

          {/* ================= SUBMIT / ACTIONS ================= */}
          <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              as={Link}
              href="/dashboard/opportunities"
              variant="secondary"
              className="h-12 !rounded-xl font-semibold sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              isDisabled={loading}
              className="h-12 !rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] hover:shadow-orange-500/35 sm:w-48"
            >
              {loading ? (
                <span>Publishing...</span>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Publish Role</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
