"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2,
  Pencil,
  Trash2,
  Upload,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  DollarSign,
  Mail,
  Rocket,
  ShieldAlert,
} from "lucide-react";
import {
  Button,
  Modal,
  AlertDialog,
  TextField,
  Input,
  Label,
  FieldError,
  Avatar,
} from "@heroui/react";
import { authClient } from "@/lib/auth-client";

const FUNDING_STAGES = [
  "Idea / Pre-Product",
  "Bootstrapped",
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
];

const INDUSTRIES = [
  "SaaS & Developer Tools",
  "Artificial Intelligence / ML",
  "Fintech",
  "Healthtech",
  "E-Commerce & Marketplaces",
  "Edtech",
  "Web3 & Blockchain",
  "Other",
];

export default function ManageStartupProfile({ founder, founderStartup }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Change to null to verify the empty state
  const [startup, setStartup] = useState(founderStartup);

  // Modal and feedback states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Edit form states
  const [editName, setEditName] = useState("");
  const [editLogo, setEditLogo] = useState("");
  const [editIndustry, setEditIndustry] = useState(INDUSTRIES[0]);
  const [editFundingStage, setEditFundingStage] = useState(FUNDING_STAGES[0]);
  const [editDescription, setEditDescription] = useState("");
  const [editFounderEmail, setEditFounderEmail] = useState("");

  const handleOpenEdit = () => {
    if (!startup) return;
    setEditName(startup.name || "");
    setEditLogo(startup.logo || "");
    setEditIndustry(startup.industry || INDUSTRIES[0]);
    setEditFundingStage(startup.fundingStage || FUNDING_STAGES[0]);
    setEditDescription(startup.description || "");
    setEditFounderEmail(startup.founderEmail || user?.email || "");
    setErrorMessage("");
    setIsEditOpen(true);
  };

  // ImgBB Upload Handler
  const handleImgBBUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image size must be under 2MB.");
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      setErrorMessage("ImgBB API key is missing (NEXT_PUBLIC_IMGBB_API_KEY).");
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
        setEditLogo(result.data.url);
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

  // Update Startup Submit
  const handleUpdateStartup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const updatedPayload = {
        name: editName.trim(),
        logo: editLogo,
        industry: editIndustry,
        fundingStage: editFundingStage,
        description: editDescription.trim(),
        founderEmail: editFounderEmail.trim(),
      };

      // TODO: Connect update API:
      // await fetch(`/api/startups/${startup._id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updatedPayload),
      // });

      setStartup((prev) => ({ ...prev, ...updatedPayload }));
      setSuccessMessage("Startup details successfully updated.");
      setIsEditOpen(false);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update startup details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Startup Handler
  const handleDeleteStartup = async () => {
    try {
      // TODO: Connect delete API:
      // await fetch(`/api/startups/${startup._id}`, { method: "DELETE" });

      setStartup(null);
      setSuccessMessage("Startup permanently deleted.");
      setTimeout(() => {
        router.push("/dashboard/founder/my-startup");
      }, 1000);
    } catch (error) {
      console.error("Failed to delete startup:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Manage Startup
        </h1>
        <p className="text-sm text-default-500">
          Update your venture settings, edit team information, or delete the
          profile.
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

      {/* Empty State */}
      {!startup ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-default-300 bg-background/60 p-12 text-center shadow-sm backdrop-blur-xl dark:border-default-100/20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
            <Rocket size={32} />
          </div>
          <h2 className="mt-4 text-lg font-bold text-foreground sm:text-xl">
            No Startup to Manage
          </h2>
          <p className="mt-1.5 max-w-md text-xs leading-relaxed text-default-500 sm:text-sm">
            You must register your startup profile first before you can modify
            its settings.
          </p>
          <Link href="/dashboard/founder/my-startup">
            <Button
              type="button"
              className="mt-6 flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-semibold text-white shadow-lg shadow-orange-500/20"
            >
              <span>Go to My Startup</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overview & Update Card */}
          <div className="rounded-3xl border border-default-200/80 bg-background p-6 shadow-xl backdrop-blur-xl dark:border-default-100/20 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-default-200/60 pb-6 dark:border-default-100/20">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-2xl ring-2 ring-orange-500/30">
                  <Avatar.Image src={startup.logo} alt={startup.name} />
                  <Avatar.Fallback className="text-base font-bold text-orange-500">
                    {startup.name?.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {startup.name}
                  </h2>
                  <p className="text-xs text-default-500">
                    {startup.industry} • {startup.fundingStage}
                  </p>
                </div>
              </div>

              {/* Update Trigger */}
              <Button
                type="button"
                onPress={handleOpenEdit}
                className="flex h-10 items-center gap-2 rounded-xl bg-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-500/20 hover:scale-[1.01]"
              >
                <Pencil size={14} />
                <span>Update Startup</span>
              </Button>
            </div>

            {/* Current Values Preview */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
                  Industry
                </span>
                <p className="mt-1 font-semibold text-foreground text-sm">
                  {startup.industry}
                </p>
              </div>

              <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
                  Funding Stage
                </span>
                <p className="mt-1 font-semibold text-foreground text-sm">
                  {startup.fundingStage}
                </p>
              </div>

              <div className="rounded-2xl border border-default-200/80 bg-default-100/40 p-4 dark:border-default-100/15 dark:bg-default-100/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
                  Founder Email
                </span>
                <p className="mt-1 truncate font-semibold text-foreground text-sm">
                  {startup.founderEmail}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-default-200/80 bg-default-100/30 p-4 dark:border-default-100/15 dark:bg-default-100/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-default-500">
                Description
              </span>
              <p className="mt-1 text-xs text-default-600 dark:text-default-300 leading-relaxed">
                {startup.description}
              </p>
            </div>
          </div>

          {/* Danger Zone: Delete Startup */}
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-6 shadow-sm dark:border-rose-500/15 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <ShieldAlert size={18} />
                  <h3 className="text-base font-bold">Danger Zone</h3>
                </div>
                <p className="text-xs text-default-500 max-w-md">
                  Permanently remove this startup and all related opportunities
                  and applications. This action is irreversible.
                </p>
              </div>

              {/* Hero UI v3 AlertDialog */}
              <AlertDialog>
                <Button
                  type="button"
                  variant="danger"
                  className="flex h-10 items-center gap-2 rounded-xl text-xs font-semibold"
                >
                  <Trash2 size={14} />
                  <span>Delete Startup</span>
                </Button>

                <AlertDialog.Backdrop>
                  <AlertDialog.Container>
                    <AlertDialog.Dialog className="sm:max-w-[420px] bg-background text-foreground">
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="danger" />
                        <AlertDialog.Heading>
                          Delete Startup?
                        </AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p className="text-xs text-default-500 leading-relaxed">
                          Are you sure you want to delete{" "}
                          <strong>{startup.name}</strong>? All published
                          opportunities, recruitments, and applicant logs
                          associated with this startup will be permanently
                          removed.
                        </p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary">
                          Cancel
                        </Button>
                        <Button
                          slot="close"
                          variant="danger"
                          onPress={handleDeleteStartup}
                        >
                          Confirm Delete
                        </Button>
                      </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                  </AlertDialog.Container>
                </AlertDialog.Backdrop>
              </AlertDialog>
            </div>
          </div>
        </div>
      )}

      {/* ================= UPDATE STARTUP MODAL ================= */}
      {startup && (
        <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
          <Modal.Backdrop>
            <Modal.Container>
              <Modal.Dialog className="sm:max-w-[560px] p-6 max-h-[90vh] flex flex-col bg-background text-foreground">
                <Modal.CloseTrigger />

                <Modal.Header className="pb-3 border-b border-default-200/80 dark:border-default-100/20">
                  <Modal.Heading className="text-lg font-bold text-foreground">
                    Update Startup Details
                  </Modal.Heading>
                  <p className="text-xs text-default-500">
                    Modify profile information and team settings.
                  </p>
                </Modal.Header>

                <form
                  onSubmit={handleUpdateStartup}
                  className="flex-1 overflow-y-auto"
                >
                  <Modal.Body className="space-y-4 py-4">
                    {errorMessage && (
                      <div className="flex items-center gap-2 rounded-xl border border-danger-500/20 bg-danger-500/10 p-3 text-xs text-danger-600 dark:text-danger-400">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Startup Name */}
                    <TextField isRequired name="editName" className="w-full">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Startup Name
                      </Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="mt-1 w-full !rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    {/* Logo Upload via ImgBB */}
                    <div className="flex flex-col gap-2">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Startup Logo <span className="text-rose-500">*</span>
                      </Label>
                      <div className="flex items-center gap-4 rounded-2xl border border-default-200/80 bg-default-100/40 p-3 dark:border-default-100/20">
                        <Avatar className="h-14 w-14 shrink-0 rounded-xl ring-2 ring-orange-500/30">
                          <Avatar.Image src={editLogo} alt="Logo preview" />
                          <Avatar.Fallback className="text-xs font-bold text-orange-500">
                            {editName
                              ? editName.slice(0, 2).toUpperCase()
                              : "SF"}
                          </Avatar.Fallback>
                        </Avatar>

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
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={13} />
                                <span>Change Logo (ImgBB)</span>
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

                    {/* Industry & Funding Stage */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                          Industry <span className="text-rose-500">*</span>
                        </Label>
                        <select
                          value={editIndustry}
                          onChange={(e) => setEditIndustry(e.target.value)}
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
                          value={editFundingStage}
                          onChange={(e) => setEditFundingStage(e.target.value)}
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

                    {/* Founder Email */}
                    <TextField
                      isRequired
                      name="editFounderEmail"
                      type="email"
                      className="w-full"
                    >
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Founder Email
                      </Label>
                      <Input
                        value={editFounderEmail}
                        onChange={(e) => setEditFounderEmail(e.target.value)}
                        className="mt-1 w-full !rounded-xl"
                      />
                      <FieldError />
                    </TextField>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-semibold uppercase text-default-600 dark:text-default-400">
                        Startup Description{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <textarea
                        rows={4}
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-default-200 bg-background p-3 text-xs leading-relaxed text-foreground focus:border-orange-500 focus:outline-none dark:border-default-100/30"
                      />
                    </div>
                  </Modal.Body>

                  <Modal.Footer className="flex gap-2 border-t border-default-200/80 pt-3 dark:border-default-100/20">
                    <Button
                      slot="close"
                      variant="secondary"
                      className="flex-1 !rounded-xl font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={isSubmitting || uploadingImage}
                      className="flex-1 !rounded-xl bg-orange-500 font-semibold text-white shadow-md shadow-orange-500/20"
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </div>
  );
}
