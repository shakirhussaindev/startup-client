const basrUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getStartupOpportunities = async (startupId) => {
  const res = await fetch(
    `${basrUrl}/api/opportunities?startupId=${startupId}`,
  );
  return res.json();
};