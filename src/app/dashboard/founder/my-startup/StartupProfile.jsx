// app/dashboard/founder/my-startup/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Upload,
  Building2,
  Mail,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Settings2,
} from "lucide-react";
import {
  Button,
  Modal,
  TextField,
  Input,
  Label,
  FieldError,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { createStartup } from "@/lib/actions/startup";

export const FUNDING_STAGES = [
  "Idea / Pre-Product",
  "Bootstrapped",
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
];

export const INDUSTRIES = [
  "SaaS & Developer Tools",
  "Artificial Intelligence / ML",
  "Fintech",
  "Healthtech",
  "E-Commerce & Marketplaces",
  "Edtech",
  "Web3 & Blockchain",
  "Other",
];

export default function StartupProfile({ founder, founderStartup }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Initial startup data (null initially)
  const [startup, setStartup] = useState(founderStartup);

  // Modal & form states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Input states
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [fundingStage, setFundingStage] = useState(FUNDING_STAGES[0]);
  const [description, setDescription] = useState("");
  const [founderEmail, setFounderEmail] = useState("");

  // Populate founder email when user session resolves
  useEffect(() => {
    if (user?.email) {
      setFounderEmail(user.email);
    }
  }, [user]);

  // Open creation modal
  const handleOpenCreateModal = () => {
    setName("");
    setLogo("");
    setIndustry(INDUSTRIES[0]);
    setFundingStage(FUNDING_STAGES[0]);
    setDescription("");
    setFounderEmail(user?.email || "");
    setErrorMessage("");
    setIsCreateOpen(true);
  };

  // Upload image to ImgBB with instant local preview
  const handleImgBBUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image size must be under 2MB.");
      return;
    }

    // 1. Instant local image preview
    const localPreviewUrl = URL.createObjectURL(file);
    setLogo(localPreviewUrl);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setErrorMessage(
        "ImgBB API key is missing (NEXT_PUBLIC_IMGBB_API_KEY in .env.local).",
      );
      return;
    }

    setUploadingImage(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setLogo(result.data.display_url || result.data.url);
      } else {
        setErrorMessage(
          result.error?.message || "Failed to upload image to ImgBB.",
        );
      }
    } catch (err) {
      setErrorMessage("Network error during logo upload.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit new startup
  const handleCreateStartup = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Startup Name is required.");
      return;
    }

    if (!logo) {
      setErrorMessage("Please upload your startup logo.");
      return;
    }

    if (!description.trim()) {
      setErrorMessage("Startup Description is required.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        logo,
        industry,
        fundingStage,
        description: description.trim(),
        founderEmail: user?.email,
        status: "Pending",
        founderId: founder?.id,
        createdAt: new Date().toISOString(),
      };

      const res = await createStartup(payload);

      if (res.insertedId) {
        setStartup(payload);
        setSuccessMessage(
          "Startup registered successfully! Awaiting admin review.",
        );
        setIsCreateOpen(false);
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to register startup.");
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Rendering Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={13} />
            Approved
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <XCircle size={13} />
            Rejected
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock size={13} />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My Startup
        </h1>
        <p className="text-sm text-default-500">
          View your venture profile, team mission, and verification badge.
        </p>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. EMPTY STATE ================= */}
      {!startup?._id ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/60 p-12 text-center shadow-sm backdrop-blur-xl dark:border-default-100/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 shadow-inner">
            <Rocket size={32} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
            No Startup Registered Yet
          </h2>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-default-500 sm:text-sm">
            You have not registered your startup on StartupForge yet. Register
            your venture to post team opportunities and recruit vetted
            collaborators.
          </p>
          <Button
            type="button"
            onPress={handleOpenCreateModal}
            className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-semibold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform"
          >
            <span>Create a Startup</span>
          </Button>
        </div>
      ) : (
        /* ================= 2. REGISTERED DETAILS ================= */
        <div className="space-y-6">
          <div className="rounded-3xl border border-default-200/80 bg-background p-6 shadow-xl backdrop-blur-xl transition-colors sm:p-8 dark:border-default-100/20">
            <div className="flex flex-col gap-6 border-b border-default-200/60 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-default-100/20">
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-orange-500/10 ring-2 ring-orange-500/30">
                  {startup.logo ? (
                    <img
                      src={startup.logo}
                      alt={startup.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-orange-500">
                      {startup.name?.slice(0, 2).toUpperCase() || "SF"}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                      {startup.name}
                    </h2>
                    {renderStatusBadge(startup.status)}
                  </div>
                  <p className="text-xs font-medium text-default-500 sm:text-sm">
                    {startup.industry}
                  </p>
                </div>
              </div>

              <Link href="/dashboard/founder/manage-startup">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex h-10 items-center gap-2 rounded-xl border border-default-200 bg-background/90 px-4 text-xs font-semibold text-foreground hover:bg-default-100 dark:border-default-100/30"
                >
                  <Settings2 size={15} />
                  <span>Manage Startup</span>
                </Button>
              </Link>
            </div>

            {startup.status === "Pending" && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle size={17} className="shrink-0 mt-0.5" />
                <p>
                  <strong>Admin Verification In Progress:</strong> Your startup
                  profile is currently under review. Once approved, your profile
                  and recruitments will be listed across the public directory.
                </p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <div className="flex items-center gap-2 text-default-500">
                  <Building2 size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Industry
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">
                  {startup.industry}
                </p>
              </div>

              <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <div className="flex items-center gap-2 text-default-500">
                  <DollarSign size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Funding Stage
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold text-foreground">
                  {startup.fundingStage}
                </p>
              </div>

              <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <div className="flex items-center gap-2 text-default-500">
                  <Mail size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Founder Contact
                  </span>
                </div>
                <p className="mt-2 truncate text-sm font-bold text-foreground">
                  {startup.founderEmail}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-default-500">
                About the Venture
              </h3>
              <div className="mt-2 rounded-2xl border border-default-200/80 bg-default-100/30 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <p className="text-sm leading-relaxed text-default-700 dark:text-default-300">
                  {startup.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL WITHOUT HORIZONTAL SCROLLBAR ================= */}
      <Modal isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[560px] max-h-[90vh] flex flex-col overflow-hidden bg-background p-0 text-foreground">
              <Modal.CloseTrigger className="top-5 right-5" />

              {/* Fixed Header */}
              <Modal.Header className="shrink-0 border-b border-default-200/80 px-6 pt-6 pb-4 dark:border-default-100/20">
                <Modal.Heading className="text-lg font-bold text-foreground">
                  Register Your Startup
                </Modal.Heading>
                <p className="text-xs text-default-500">
                  Enter your venture details below to request platform
                  verification.
                </p>
              </Modal.Header>

              {/* Form container with vertical scroll only */}
              <form
                onSubmit={handleCreateStartup}
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
              >
                {/* Scrollable Body: overflow-y-auto & overflow-x-hidden */}
                <Modal.Body className="flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-6 py-4">
                  {errorMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-danger-500/20 bg-danger-500/10 p-3 text-xs text-danger-600 dark:text-danger-400">
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 1. Startup Name */}
                  <TextField isRequired name="name" className="w-full">
                    <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                      Startup Name
                    </Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. StartupForge"
                      className="mt-1 w-full !rounded-xl"
                    />
                    <FieldError />
                  </TextField>

                  {/* 2. Logo Upload with Guaranteed Live Preview */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                      Startup Logo <span className="text-rose-500">*</span>
                    </Label>
                    <div className="flex items-center gap-4 rounded-2xl border border-default-200/80 bg-default-100/40 p-3 dark:border-default-100/20">
                      {/* Logo Preview Box */}
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-500/10 ring-2 ring-orange-500/30">
                        {logo ? (
                          <img
                            src={logo}
                            alt="Logo preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-orange-500">
                            {name ? name.slice(0, 2).toUpperCase() : "SF"}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-1.5">
                        <label
                          className={`inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-default-200 bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-default-100 ${
                            uploadingImage
                              ? "pointer-events-none opacity-60"
                              : ""
                          }`}
                        >
                          {uploadingImage ? (
                            <>
                              <Loader2
                                size={13}
                                className="animate-spin text-orange-500"
                              />
                              <span>Uploading to ImgBB...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={13} />
                              <span>Upload File to ImgBB</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={handleImgBBUpload}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-default-400">
                          PNG, JPG, or WebP up to 2MB
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Industry & Funding Stage */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Industry <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="mt-1 h-10 w-full rounded-xl border border-default-200 bg-background px-3 text-xs font-semibold text-foreground focus:border-orange-500 focus:outline-none dark:border-default-100/30"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Funding Stage <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={fundingStage}
                        onChange={(e) => setFundingStage(e.target.value)}
                        className="mt-1 h-10 w-full rounded-xl border border-default-200 bg-background px-3 text-xs font-semibold text-foreground focus:border-orange-500 focus:outline-none dark:border-default-100/30"
                      >
                        {FUNDING_STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 4. Founder Email */}
                  <TextField
                    isRequired
                    name="founderEmail"
                    type="email"
                    className="w-full"
                  >
                    <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                      Founder Email
                    </Label>
                    <Input
                      value={founderEmail}
                      onChange={(e) => setFounderEmail(e.target.value)}
                      placeholder="founder@startupforge.dev"
                      className="mt-1 w-full !rounded-xl"
                    />
                    <FieldError />
                  </TextField>

                  {/* 5. Description */}
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                      Startup Description{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what your venture builds, your mission, and the collaborators you need..."
                      className="mt-1 w-full rounded-xl border border-default-200 bg-background p-3 text-xs leading-relaxed text-foreground focus:border-orange-500 focus:outline-none dark:border-default-100/30"
                    />
                  </div>
                </Modal.Body>

                {/* Fixed Footer: No horizontal scrollbar */}
                <Modal.Footer className="shrink-0 border-t border-default-200/80 px-6 py-4 dark:border-default-100/20">
                  <div className="flex w-full gap-2">
                    <Button
                      slot="close"
                      variant="secondary"
                      className="flex-1 !rounded-xl font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={submitting || uploadingImage}
                      className="flex-1 !rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 font-semibold text-white shadow-md shadow-orange-500/20"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" />
                          Saving...
                        </span>
                      ) : (
                        <span>Register Startup</span>
                      )}
                    </Button>
                  </div>
                </Modal.Footer>
              </form>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
