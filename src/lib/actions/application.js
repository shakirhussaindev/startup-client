"use server";
import { revalidatePath } from "next/cache";
import { serverMutation } from "../core/server";

export const submitApplication = async (applicationData) => {
  return serverMutation("/api/applications", applicationData);
};



export const updateApplicationStatus = async (appId, newStatus) => {
  try {
    const res = await serverMutation( `/api/applications/${appId}`,{ status: newStatus }, "PATCH", );

    
    if (res?.modifiedCount > 0 || res?.acknowledged) {
      revalidatePath("/dashboard/founder/applications");
      return { success: true };
    }

    return { success: false, error: "No changes made." };
  } catch (error) {
    console.error("updateApplicationStatus error:", error);
    return { success: false, error: error.message };
  }
};

