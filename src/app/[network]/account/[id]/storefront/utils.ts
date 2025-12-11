import { CID } from "multiformats/cid";
import * as fcl from "@onflow/fcl";

export function handleIpfs(src: string) {
  return src.startsWith("ipfs")
    ? `https://ipfs.io/ipfs/${src.split("//")[1] ? src.split("//")[1] : src}`
    : src;
}

export function transactionStatusCallback(
  txId: string,
  callback: (status: any) => void,
) {
  fcl.tx(txId).subscribe(callback);
}

export const getRarityColor = (rarity: string) => {
  if (rarity == "rare") {
    return "text-blue-800 bg-blue-100";
  } else if (rarity == "epic") {
    return "text-yellow-800 bg-yellow-100";
  } else if (rarity == "legendary") {
    return "text-purple-800 bg-purple-100";
  } else {
    return "text-gray-800 bg-gray-100";
  }
};

export const getIPFSFileURL = (cid: string, path: string) => {
  if (!cid) {
    return;
  }
  // cid v0
  let v1 = cid;
  if (cid.startsWith("Qm")) {
    v1 = CID.parse(cid).toV1().toString();
  }

  // https://ipfs.github.io/public-gateway-checker/
  const rndInt = Math.floor(Math.random() * 2) + 1;
  let res = "";
  if (rndInt == 1) {
    if (!path) {
      res = `https://gateway.pinata.cloud/ipfs/${v1}`;
    } else {
      res = `https://gateway.pinata.cloud/ipfs/${v1}/${path}`;
    }
  } else if (rndInt == 2) {
    if (!path) {
      res = `https://cloudflare-ipfs.com/ipfs/${v1}`;
    } else {
      res = `https://cloudflare-ipfs.com/ipfs/${v1}/${path}`;
    }
  }
  console.log(res);

  return res;
};

export const getIPFSFileURLByURL = (url: string) => {
  if (!url.includes("ipfs://")) {
    return;
  }
  const path = url.replace("ipfs://", "");
  const comps = path.split("/");
  if (comps.length != 2) {
    return `https://gateway.pinata.cloud/ipfs/${path}`;
  }
  return getIPFSFileURL(comps[0], comps[1]);
};

export const getImageSrcFromMetadataViewsFile = (file: any) => {
  if (!file) return "/token_placeholder.png";
  if (
    file.url &&
    file.url.includes("https://") &&
    !file.url.includes("ipfs://")
  ) {
    return file.url.trim();
  } else if (file.url && file.url.includes("ipfs://")) {
    return getIPFSFileURLByURL(file.url);
  } else if (file.cid && file.cid.trim() != "") {
    if (file.path && file.path.trim() != "") {
      const imageCID = file.cid.trim();
      const imagePath = file.path.trim();
      return getIPFSFileURL(imageCID, imagePath);
    } else {
      return getIPFSFileURL(file.cid.trim(), "");
    }
  } else if (file.url && file.url.includes("data:image/")) {
    return file.url;
  } else {
    return "/token_placeholder.png";
  }
};

export const getContractInfoFromTypeId = (typeId: string) => {
  if (!typeId) {
    return null;
  }
  const comps = typeId.split(".");
  if (comps.length != 4) {
    return null;
  }
  const contractAddress = `0x${comps[1]}`;
  const contractName = comps[2];
  return {
    contractAddress: contractAddress,
    contractName: contractName,
  };
};

export const getCollectionStoragePath = (metadata: any) => {
  if (!metadata) return "";
  const { domain = "", identifier = "" } =
    metadata.collectionData?.storagePath || {};
  const collectionStoragePath = `/${domain}/${identifier}`;
  return collectionStoragePath;
};

export const getPaymentTokenSymbol = (listing: any) => {
  const symbol = listing?.paymentTokenInfo?.symbol ?? "UNKN";
  return symbol.toUpperCase();
};
