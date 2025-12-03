"use server";
const authHeaders = {
  Authorization: `Basic ${btoa(`${process.env.AUTHUSER}:${process.env.AUTHPASS}`)}`,
};
export const fetchAPIDirect = async (urlArg?: string, isMainnet?: boolean) => {
  if (!urlArg) return;
  const mainnetAPI = "https://api.find.xyz";
  const testnetAPI = "https://api.test-find.xyz";
  const primaryPath = isMainnet ? mainnetAPI : testnetAPI;
  let url = urlArg;
  if (!url.startsWith(primaryPath)) url = primaryPath + urlArg;
  const data = await fetch(url, { headers: authHeaders });
  return await data.json();
};
