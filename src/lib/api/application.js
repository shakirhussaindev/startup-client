import { protectedFetch, serverFetch } from "../core/server"

export const getApplicationsByApplicant = async (applicantId) => {
  return protectedFetch(`/api/applications?applicantId=${applicantId}`);
};