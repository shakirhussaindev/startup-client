import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL;


export const authHeader = async () => {
  const token = await getUserToken()
  const header = token? {
    authorization: `Bearer ${token}`
  } : {};

  return header;
}


export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return res.json();
};


export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`,
    {
      headers: await authHeader()
    }
  );
//  handle 401, 403, 404

  return handleStatusCode(res)
}


export const serverMutation = async (path,data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ... await authHeader()
    },
    body: JSON.stringify(data),
  });

 return handleStatusCode(res)
};

export const serverDelete = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      ... await authHeader()
    },
  });

 return handleStatusCode(res)
};


// handle 401 403 404
const handleStatusCode = (res) => {
   if (res.status === 401) {
     redirect("/unauthorized");
   } else if (res.status === 403) {
     redirect("/forbidden");
   }

   return res.json();
} 