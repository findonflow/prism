/*--------------------------------------------------------------------------------------------------------------------*/
import type { Dispatch, SetStateAction } from "react";
import { txHandler } from "@/app/[network]/account/[id]/storefront/storefront_transactions";
import { mutate } from "@onflow/fcl";
import { cadenceMutatePublishToParent } from "@/mutate/cadence/cadence-mutate-publish-to-parent";
import { cadenceMutateSetChildDisplay } from "@/mutate/cadence/cadence-mutate-set-child-display";
import { cadenceMutateSetOwnedDisplay } from "@/mutate/cadence/cadence-mutate-set-owned-display";
import { cadenceMutateClaimChildAccount } from "@/mutate/cadence/cadence-mutate-claim-child-account";
import { cadenceMutateRemoveParent } from "@/mutate/cadence/cadence-mutate-remove-parent";

/*--------------------------------------------------------------------------------------------------------------------*/
export async function claimChildAccount(
  childAddress: string,
  setTransactionInProgress: Dispatch<SetStateAction<boolean>>,
  setTransactionStatus: Dispatch<SetStateAction<any>>,
) {
  return txHandler(
    // Handler function
    () => {
      console.log(`Claim ${childAddress} ChildAccount`);
      return mutate({
        args: (arg, t) => [arg(childAddress, t.Address)],
        cadence: cadenceMutateClaimChildAccount,
        limit: 9999,
      });
    },
    // State updates
    setTransactionInProgress,
    setTransactionStatus,
  );
}

export async function setOwnedDisplay(
  params: {
    name: string;
    description: string;
    thumbnail: string;
  },
  hooks: {
    setInProgress: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<any>>;
  },
) {
  const { name, description, thumbnail } = params;

  return txHandler(
    () => {
      return mutate({
        args: (arg, t) => [
          arg(name, t.String),
          arg(description, t.String),
          arg(thumbnail, t.String),
        ],
        cadence: cadenceMutateSetOwnedDisplay,
        limit: 9999,
      });
    },

    hooks.setInProgress,
    hooks.setStatus,
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export async function publishToParent(
  params: {
    parentAddress: string;
    factoryAddress: string;
    filterAddress: string;
  },
  hooks: {
    setInProgress: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<any>>;
  },
) {
  const { parentAddress, factoryAddress, filterAddress } = params;

  return txHandler(
    () => {
      // TODO: make it work on both Mainnet and Testnet
      // TODO: emulator would require extra work since these need to be deployed by user
      // const factoryAddress = "0x1b7fa5972fcb8af5"; // testnet NFT and FT capabilities
      // const filterAddress = "0xe2664be06bb0fe62"; // AllowAll filter

      return mutate({
        args: (arg, t) => [
          arg(parentAddress, t.Address),
          arg(factoryAddress, t.Address),
          arg(filterAddress, t.Address),
        ],
        cadence: cadenceMutatePublishToParent,
        limit: 9999,
      });
    },

    hooks.setInProgress,
    hooks.setStatus,
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/
export async function removeParent(
  params: {
    parentAddress?: string | null;
  },
  hooks: {
    setInProgress: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<any>>;
  },
) {
  const { parentAddress } = params;

  if(!parentAddress) {
    return null;
  }

  return txHandler(
    () => {
      return mutate({
        args: (arg, t) => [arg(parentAddress, t.Address)],
        cadence: cadenceMutateRemoveParent,
        limit: 9999,
      });
    },

    hooks.setInProgress,
    hooks.setStatus,
  );
}

export async function setChildDisplay(
  params: {
    childAddress: string;
    name: string;
    description: string;
    thumbnail: string;
  },
  hooks: {
    setInProgress: Dispatch<SetStateAction<boolean>>;
    setStatus: Dispatch<SetStateAction<any>>;
  },
) {
  const { childAddress, name, description, thumbnail } = params;

  return txHandler(
    () => {
      return mutate({
        args: (arg, t) => [
          arg(childAddress, t.Address),
          arg(name, t.String),
          arg(description, t.String),
          arg(thumbnail, t.String),
        ],
        cadence: cadenceMutateSetChildDisplay,
        limit: 9999,
      });
    },

    hooks.setInProgress,
    hooks.setStatus,
  );
}
