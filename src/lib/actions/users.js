// src/lib/actions/users.js
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { authHeader } from "../core/server";

export const banUsers = async (
  userId,
  reason = "Violation of platform policies",
) => {
  const data = await auth.api.banUser({
    body: {
      userId: userId, // Dynamic parameter
      banReason: reason,
      banExpiresIn: 60 * 60 * 24 * 30, // 30 days ban (optional)
    },
    headers: await headers(),
  });

  revalidatePath("/dashboard/admin/manage-users");
  return data;
};

export const unbanUsers = async (userId) => {
  const data = await auth.api.unbanUser({
    body: {
      userId: userId, // Dynamic parameter
    },
    headers: await headers(),
  });

  revalidatePath("/dashboard/admin/manage-users");
  return data;
};

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const updateUserProfile = async (userId, updateData) => {
  try {
    const res = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ... await authHeader()
      },
      body: JSON.stringify(updateData),
    });

    if (!res.ok) {
      throw new Error("Failed to update profile");
    }

    revalidatePath("/profile");
    return { success: true };
  } catch (error) {
    console.error("Profile update error:", error);
    return { success: false, error: error.message };
  }
};