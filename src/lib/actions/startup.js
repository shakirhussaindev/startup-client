"use server"

import { serverDelete, serverMutation } from "../core/server"


 export const createStartup = async(newStartup) =>{
  return serverMutation("/api/startup",newStartup);
 }

 export const updateStartupStatus = async (id,data)=>{
  return serverMutation(`/api/startup/${id}`, data, 'PATCH');
 }

 export const updateStartup = async (id,data)=>{
  return serverMutation(`/api/my/startup/${id}`, data, "PATCH");
 }


 export const deleteStartup = async (id)=>{
  return serverDelete(`/api/my/startup/${id}`);
 }


