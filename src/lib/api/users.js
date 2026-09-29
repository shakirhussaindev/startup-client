
import { headers } from "next/headers";
import { auth } from "../auth";
import { protectedFetch } from "../core/server";



export const getUserList = async () => {
  const users = await auth.api.listUsers({
    query: { 
      sortBy: "createdAt", 
      sortDirection: "desc",
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  });

  return users
}


export const getUserById = async (userId) => {
  return protectedFetch(`/api/user/${userId}`);
}