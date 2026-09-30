import { protectedFetch } from "../core/server"

export const getSubscription = async ()=>{
  return protectedFetch("/api/subscriptions");
}