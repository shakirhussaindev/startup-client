import { serverFetch } from "../core/server";

const basrUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getStartupOpportunities = async (startupId) => {
  const res = await fetch(
    `${basrUrl}/api/startup/opportunities?startupId=${startupId}`,
  );
  return res.json();
};

export const getOpportunities = async (queryString) => {
  return serverFetch(`/api/opportunities?${queryString}`);
};

export const getFeaturedOpportunities = async () => {
  return serverFetch("/api/opportunities/featured");
};

export const getOpportunityById = async (id) => {
  return serverFetch(`/api/opportunities/${id}`);
};

