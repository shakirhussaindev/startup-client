import { serverFetch } from "../core/server"
import { getUserSession } from "../core/session";


export const getStartups = async () => {
  return serverFetch('/api/startups')
}

export const getFounderStartup = async (founderId) =>{
  return serverFetch(`/api/my/startup?founderId=${founderId}`);
}


export const getLoggedInFounderStartup = async ()=>{
  const user = await getUserSession()
  return getFounderStartup(user?.id)
}