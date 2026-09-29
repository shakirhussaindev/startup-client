// components/profile/ProfileClient.jsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Calendar,
  Camera,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CreditCard,
  Edit3,
  X,
  UploadCloud,
} from "lucide-react";
import { Avatar, Button } from "@heroui/react";
import { updateUserProfile } from "@/lib/actions/users";

// ================= Image Upload Helper =================
const uploadImageToImgBB = async (imageFile) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ImgBB API key is missing. Add NEXT_PUBLIC_IMGBB_API_KEY in .env.local",
    );
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.data.url;
};

export default function ProfileClient({ user }) {
  const router = useRouter();

  // Modal State
  const [isEditOpen, setIsEditOpen] = useState(false);

 
  const [displayUser, setDisplayUser] = useState({
    name: user.name || "",
    image: user.image || "",
    bio: user.bio || "",
    skills: Array.isArray(user.skills)
      ? user.skills
      : user.skills
        ? [user.skills]
        : [],
  });

  // Edit Form States
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.image || "");

  // Collaborator Skills (Comma separated input)
  const initialSkills = Array.isArray(user.skills)
    ? user.skills.join(", ")
    : user.skills || "";
  const [skills, setSkills] = useState(initialSkills);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const fileInputRef = useRef(null);

  const isFounder = user.role?.toLowerCase() === "founder";
  const isCollaborator = user.role?.toLowerCase() === "collaborator";

  // Formatted Joined Date
  const formattedJoinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  // File Selector
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      let finalImageUrl = displayUser.image;

      if (imageFile) {
        finalImageUrl = await uploadImageToImgBB(imageFile);
      }

    
      const processedSkills = isCollaborator
        ? skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const payload = {
        name: name.trim(),
        image: finalImageUrl,
        bio: bio.trim(),
        ...(isCollaborator && { skills: processedSkills }),
      };

      const userId = user._id || user.id;
      const res = await updateUserProfile(userId, payload);

      if (res.success) {
      
        setDisplayUser({
          name: payload.name,
          image: payload.image,
          bio: payload.bio,
          skills: processedSkills,
        });

        setStatusMessage({
          type: "success",
          text: "Profile updated successfully!",
        });

      
        router.refresh();

        setTimeout(() => {
          setIsEditOpen(false);
          setStatusMessage(null);
        }, 1000);
      } else {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update profile.",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ================= MAIN PROFILE CARD ================= */}
      <div className="relative overflow-hidden rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-xl backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e]/90 sm:p-10">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-rose-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* User Avatar */}
            <Avatar className="h-24 w-24 shrink-0 rounded-3xl border-2 border-default-200/80 bg-default-100 shadow-lg ring-4 ring-orange-500/20 dark:border-default-100/20 dark:bg-default-100/10 sm:h-28 sm:w-28">
              <Avatar.Image
                src={displayUser.image}
                alt={displayUser.name}
                className="object-cover"
              />
              <Avatar.Fallback className="text-3xl font-extrabold text-orange-500">
                {displayUser.name
                  ? displayUser.name.slice(0, 2).toUpperCase()
                  : "U"}
              </Avatar.Fallback>
            </Avatar>

            {/* Name, Email & Role Highlights */}
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                {displayUser.name || "Unnamed User"}
              </h2>
              <p className="text-xs text-default-400 sm:text-sm">
                {user.email}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Role Badge */}
                <span className="inline-flex items-center gap-1 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold capitalize text-orange-600 dark:text-orange-400">
                  <Shield size={12} />
                  <span>{user.role || "User"}</span>
                </span>

                {/* Founder Plan Badge */}
                {isFounder && (
                  <span className="inline-flex items-center gap-1 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold capitalize text-amber-600 dark:text-amber-400">
                    <CreditCard size={12} />
                    <span>{user.plan ? `${user.plan} Plan` : "Free Plan"}</span>
                  </span>
                )}

                {/* Joined Date Badge */}
                <span className="inline-flex items-center gap-1 rounded-xl border border-default-200/80 bg-default-100/60 px-3 py-1 text-xs text-default-500 dark:border-default-100/20 dark:bg-default-100/10">
                  <Calendar size={12} />
                  <span>Joined {formattedJoinedDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* EDIT YOUR PROFILE BUTTON */}
          <Button
            onPress={() => {
              
              setName(displayUser.name);
              setBio(displayUser.bio);
              setImagePreview(displayUser.image);
              setSkills(displayUser.skills.join(", "));
              setIsEditOpen(true);
            }}
            className="flex h-11 items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02]"
          >
            <Edit3 size={15} />
            <span>Edit Your Profile</span>
          </Button>
        </div>

        {/* Bio Section */}
        <div className="mt-8 border-t border-default-200/60 pt-6 dark:border-default-100/15">
          <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
            About / Bio
          </span>
          <p className="mt-2 text-sm leading-relaxed text-default-600 dark:text-default-300">
            {displayUser.bio ||
              "No personal bio added yet. Click 'Edit Your Profile' to introduce yourself."}
          </p>
        </div>

        {/* Collaborator Skills Section */}
        {isCollaborator && (
          <div className="mt-6 border-t border-default-200/60 pt-6 dark:border-default-100/15">
            <span className="text-[11px] font-bold uppercase tracking-wider text-default-400">
              Expertise & Skills
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {displayUser.skills && displayUser.skills.length > 0 ? (
                displayUser.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="rounded-xl border border-default-200/80 bg-default-100/60 px-3 py-1 text-xs font-semibold text-default-700 dark:border-default-100/20 dark:bg-default-100/10 dark:text-default-300"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-default-400">
                  No skills added yet.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsEditOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-default-200/80 bg-background/95 p-6 shadow-2xl backdrop-blur-xl dark:border-default-100/15 dark:bg-[#0c0c0e] sm:p-8">
            <div className="flex items-center justify-between border-b border-default-200/60 pb-4 dark:border-default-100/15">
              <div>
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  Edit Your Profile
                </h3>
                <p className="text-xs text-default-500">
                  Update your display name, photo, bio, and expertise.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full p-2 text-default-400 hover:bg-default-100 hover:text-foreground dark:hover:bg-default-100/10"
              >
                <X size={18} />
              </button>
            </div>

            {statusMessage && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
                  statusMessage.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <AlertCircle size={15} />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="mt-6 space-y-5">
              {/* Photo Upload Area */}
              <div className="flex flex-col items-center gap-3">
                <div className="group relative">
                  <Avatar className="h-24 w-24 rounded-3xl border border-default-200/80 bg-default-100 shadow-md ring-2 ring-orange-500/30 dark:border-default-100/20 dark:bg-default-100/10">
                    <Avatar.Image
                      src={imagePreview}
                      alt={name}
                      className="object-cover"
                    />
                    <Avatar.Fallback className="text-2xl font-bold text-orange-500">
                      {name ? name.slice(0, 2).toUpperCase() : "U"}
                    </Avatar.Fallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Camera size={20} />
                    <span className="mt-1 text-[10px] font-semibold">
                      Change
                    </span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onPress={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-xl border border-default-200/80 text-xs font-semibold dark:border-default-100/20"
                >
                  <UploadCloud size={14} className="text-orange-500" />
                  <span>Upload New Photo</span>
                </Button>
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-default-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="h-11 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3.5 text-xs font-medium text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
                />
              </div>

              {/* Email (Read Only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-default-500">
                  Email (Permanent)
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-xl border border-default-200/40 bg-default-100/20 px-3.5 text-xs font-medium text-default-400 dark:border-default-100/10 dark:bg-default-100/5"
                />
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-default-500">
                  Bio / Headline
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary about your background, startup, or passion..."
                  className="w-full rounded-xl border border-default-200/80 bg-default-100/40 p-3.5 text-xs font-medium text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
                />
              </div>

              {/* Collaborator Skills */}
              {isCollaborator && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-default-500">
                      Collaborator Skills
                    </label>
                    <span className="text-[10px] text-default-400">
                      Comma separated
                    </span>
                  </div>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Next.js, Node.js, Tailwind CSS, UI/UX"
                    className="h-11 w-full rounded-xl border border-default-200/80 bg-default-100/40 px-3.5 text-xs font-medium text-foreground transition-colors focus:border-orange-500 focus:outline-none dark:border-default-100/20 dark:bg-default-100/10"
                  />
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-default-200/60 pt-5 dark:border-default-100/15">
                <Button
                  type="button"
                  variant="ghost"
                  onPress={() => setIsEditOpen(false)}
                  className="h-10 rounded-xl text-xs font-semibold text-default-500 hover:bg-default-100"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.01]"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
