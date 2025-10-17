const network = process.env.NEXT_PUBLIC_VITE_NETWORK || "mainnet";
export default network;

export const isPreviewnet = network === "previewnet";
export const isMainnet = network === "mainnet";
export const isTestnet = network === "testnet";

