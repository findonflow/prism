import cadenceBuyItem from "@/fetch/cadence/cadence-buy-item";
import cadenceCleanupExpired from "@/fetch/cadence/cadence-cleanup-expired";
import cadenceCleanupGhosted from "@/fetch/cadence/cadence-cleanup-ghosted";
import cadenceCleanupPurchased from "@/fetch/cadence/cadence-cleanup-purchased";
import cadenceSetupAccount from "@/fetch/cadence/cadence-setup-account";
import * as fcl from "@onflow/fcl";
export const TxStatus = {
  // Initializing: Initialing
  // the transaction is waiting to be approved
  initializing() {
    return { status: "Initializing", error: null, txid: null };
  },
  // Pending: Pending & Finalized & Executed
  // the transaction has not been confirmed on chain
  pending(txid: string | null) {
    return { status: "Pending", error: null, txid: txid };
  },
  // Success: Sealed with no error
  success(txid: string | null) {
    return { status: "Success", error: null, txid: txid };
  },
  // Failed: Sealed with error
  failed(error: any, txid: string | null) {
    return { status: "Failed", error: error, txid: txid };
  },
};

const publicConfig: any = {};

export const txHandler = async (
  txFunc: () => Promise<string | null>,
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  let transactionId = null;
  setTransactionInProgress(true);
  setTransactionStatus(TxStatus.initializing());

  try {
    transactionId = await txFunc();
    setTransactionStatus(TxStatus.pending(transactionId));
    console.log({ transactionId });

    let res = await fcl.tx(transactionId || "").onceSealed();
    if (res.status === 4) {
      if (res.statusCode === 0) {
        setTransactionStatus(TxStatus.success(transactionId));
      } else {
        setTransactionStatus(TxStatus.failed(res.errorMessage, transactionId));
      }
      setTimeout(() => setTransactionInProgress(false), 3000);
    }
    return res;
  } catch (e) {
    console.log(e);
    setTransactionStatus(TxStatus.failed(e, null));
    setTimeout(() => setTransactionInProgress(false), 3000);
  }
};

export const setupAccount = async (
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doSetupAccount();
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doSetupAccount = async () => {
  const code = cadenceSetupAccount;

  const transactionId = fcl.mutate({
    cadence: code,
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};

export const cleanupGhosted = async (
  account: string,
  listingIds: number[],
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doCleanupGhosted(account, listingIds);
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doCleanupGhosted = async (account: string, listingIds: number[]) => {
  const code = cadenceCleanupGhosted;

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(account, t.Address),
      arg(listingIds, t.Array(t.UInt64)),
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};

export const cleanupPurchased = async (
  account: string,
  listingIds: number[],
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doCleanupPurchased(account, listingIds);
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doCleanupPurchased = async (account: string, listingIds: number[]) => {
  const code = cadenceCleanupPurchased;

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(account, t.Address),
      arg(listingIds, t.Array(t.UInt64)),
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};

export const cleanupExpired = async (
  account: string,
  fromIndex: string,
  toIndex: string,
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doCleanupExpired(account, fromIndex, toIndex);
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doCleanupExpired = async (
  account: string,
  fromIndex: string,
  toIndex: string,
) => {
  const code = cadenceCleanupExpired;

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(account, t.Address),
      arg(fromIndex, t.UInt64),
      arg(toIndex, t.UInt64),
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};

export const sellItem = async (
  contractName: string,
  contractAddress: string,
  collectionStoragePath: string,
  collectionPublicPath: string,
  saleItemID: number,
  saleItemPrice: string,
  days: number,
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doSellItem(
      contractName,
      contractAddress,
      collectionStoragePath,
      collectionPublicPath,
      saleItemID,
      saleItemPrice,
      days,
    );
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doSellItem = async (
  contractName: string,
  contractAddress: string,
  collectionStoragePath: string,
  collectionPublicPath: string,
  saleItemID: number,
  saleItemPrice: string,
  days: number,
) => {
  let code = await (
    await fetch("/transactions/storefront/sell_item.cdc")
  ).text();
  code = code
    .replaceAll("__NFT_CONTRACT_NAME__", contractName)
    .replaceAll("__NFT_CONTRACT_ADDRESS__", contractAddress)
    .replaceAll("__NFT_COLLECTION_STORAGE_PATH__", collectionStoragePath)
    .replaceAll("__NFT_COLLECTION_PUBLIC_PATH__", collectionPublicPath);

  let price = new Number(saleItemPrice).toFixed(8);
  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(saleItemID, t.UInt64),
      arg(price, t.UFix64),
      arg(days, t.UInt64),
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};

export const removeItem = async (
  listingResourceId: number,
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doRemoveItem(listingResourceId);
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doRemoveItem = async (listingResourceId: number) => {
  const code = await (
    await fetch("/transactions/storefront/remove_item.cdc")
  ).text();

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [arg(listingResourceId, t.UInt64)],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};

export const buyItem = async (
  contractName: string,
  contractAddress: string,
  collectionStoragePath: string,
  listingResourceId: number,
  storefrontAddress: string,
  setTransactionInProgress: React.Dispatch<React.SetStateAction<boolean>>,
  setTransactionStatus: React.Dispatch<React.SetStateAction<any>>,
) => {
  const txFunc = async () => {
    return await doBuyItem(
      contractName,
      contractAddress,
      collectionStoragePath,
      listingResourceId,
      storefrontAddress,
    );
  };

  return await txHandler(
    txFunc,
    setTransactionInProgress,
    setTransactionStatus,
  );
};

const doBuyItem = async (
  contractName: string,
  contractAddress: string,
  collectionStoragePath: string,
  listingResourceId: number,
  storefrontAddress: string,
) => {
  const code = cadenceBuyItem
    .replaceAll("__NFT_CONTRACT_NAME__", contractName)
    .replaceAll("__NFT_CONTRACT_ADDRESS__", contractAddress)
    .replaceAll("__NFT_COLLECTION_STORAGE_PATH__", collectionStoragePath);

  const commissionRecipient = publicConfig.accountBookmarkAddress;
  console.log(commissionRecipient, await fcl.currentUser().snapshot());

  const transactionId = fcl.mutate({
    cadence: code,
    args: (arg, t) => [
      arg(listingResourceId, t.UInt64),
      arg(storefrontAddress, t.Address),
      arg(commissionRecipient, t.Optional(t.Address)),
    ],
    proposer: fcl.currentUser,
    payer: fcl.currentUser,
    limit: 9999,
  });

  return transactionId;
};
