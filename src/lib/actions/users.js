// src/lib/actions/users.js
"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

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
