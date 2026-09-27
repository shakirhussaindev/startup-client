"use server"

import { serverMutation } from "../core/server"


 export const createStartup = async(newStartup) =>{
  return serverMutation("/api/startup",newStartup);
 }

 export const updateStartupStatus = async (id,data)=>{
  return serverMutation(`/api/startup/${id}`, data, 'PATCH');
 }


// const basrUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// export const createStartup = async (startup) => {
//   const res = await fetch(`${basrUrl}/api/startup`,{
//     method: "POST",
//     headers: {
//       "Content-Type":"application/json"
//     },
//     body: JSON.stringify(startup)      
//   });
//   return res.json()
// }