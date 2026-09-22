"use server";

import { serverMutation } from "../core/server";


export const createOpportunity = async(newOpportunity) =>{
  return serverMutation("/api/opportunities",newOpportunity);
}


// const basrUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// export const createOpportunity = async (newOpportunity) => {
//   const res = await fetch(`${basrUrl}/api/opportunities`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(newOpportunity),
//   });

//   return res.json();
// };
