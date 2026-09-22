import { serverFetch } from "../core/server"

export const getFounderStartup = async (founderId) =>{
  return serverFetch(`/api/my/startup?founderId=${founderId}`);
}