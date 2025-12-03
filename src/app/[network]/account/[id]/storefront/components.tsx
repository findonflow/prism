"use client";
import ImageClient from "@/components/flowscan/ImageClient";
import { fetchAPIDirect } from "@/interfaces/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  buyItem,
  cleanupExpired,
  cleanupGhosted,
  cleanupPurchased,
  removeItem,
  setupAccount,
} from "./storefront_transactions";
import {
  getCollectionStoragePath,
  getContractInfoFromTypeId,
  getImageSrcFromMetadataViewsFile,
  getPaymentTokenSymbol,
  getRarityColor,
} from "./utils";
import { cn } from "@/lib/utils";

export interface Listing {
  details: {
    nftType: {
      typeID: string;
    };
    nftID: string;
    salePrice: string;
    customID?: string;
  };
  listingResourceId: string;
  display: {
    name: string;
    thumbnail: any; // Consider creating a more specific type for this
  };
  rarity?: {
    description?: string;
  };
  collectionData: {
    storagePath: {
      identifier: string;
    };
  };
}

interface User {
  loggedIn: boolean;
  addr: string;
}

interface ListingGroupProps {
  listings: Listing[];
  user: User;
  address?: string;
  setTransactionInProgress: any;
  setTransactionStatus: any;
  transactionInProgress: boolean;
}

export const transactionStatusState = {
  key: "transactionStatusState",
  default: null,
};

export const transactionInProgressState = {
  key: "transactionInProgressState",
  default: false,
};

const getTypeId = (listing: Listing | undefined): string => {
  if (!listing) {
    return "Unknown";
  }

  const rawTypeId = listing.details.nftType.typeID;
  const comps = rawTypeId.split(".");
  return comps[2];
};

export default function ListingGroup(props: ListingGroupProps) {
  const {
    listings,
    user,
    address,
    setTransactionInProgress,
    setTransactionStatus,
    transactionInProgress,
  } = props;
  const firstListing: Listing | undefined = listings[0];
  const typeId: string = getTypeId(firstListing);

  return (
    <>
      <label className="text-lg font-bold">
        {`${typeId} (${listings.length})`}
      </label>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {listings?.map((listing, index) => {
          return (
            <Listing
              key={`listing-${index}`}
              listing={listing}
              typeId={typeId}
              user={user}
              address={address}
              setTransactionInProgress={setTransactionInProgress}
              setTransactionStatus={setTransactionStatus}
              transactionInProgress={transactionInProgress}
            />
          );
        })}
      </div>
    </>
  );
}

export function CleanupButtons(props: {
  data: any;
  user: any;
  address: string | undefined;
  setTransactionInProgress: any;
  setTransactionStatus: any;
  transactionInProgress: boolean;
  hasStorefront: boolean;
}) {
  const {
    data,
    address: account,
    setTransactionInProgress,
    setTransactionStatus,
    transactionInProgress,
    user,
    hasStorefront,
  } = props;

  const queryClient = useQueryClient();
  const mutate = (queryKey: any) => {
    queryClient.invalidateQueries({ queryKey: queryKey });
  };

  if (!account) return null;
  const purchasedIds =
    data?.invalidItems
      ?.filter((item: any) => item.isPurchased)
      .map((item: any) => item.listingResourceId) || [];
  const ghosteditems =
    data?.invalidItems
      ?.filter((item: any) => item.isGhosted && !item.isPurchased)
      .map((item: any) => item.listingResourceId) || [];
  const expiredItemsCount =
    data?.invalidItems?.filter((item: any) => item.isExpired).length || 0;
  return (
    <div className="ml-auto flex items-center gap-2">
      {user && user.loggedIn && user.addr == account && !hasStorefront && (
        <button
          className="mb-6 cursor-pointer rounded-md bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500/30 disabled:opacity-50"
          disabled={transactionInProgress}
          onClick={async () => {
            await setupAccount(setTransactionInProgress, (val) => {
              setTransactionStatus(val);
              if (val.status === "Success") {
                mutate([`prism-account-listings`, account]);
              }
            });
          }}
        >
          Setup Account
        </button>
      )}
      {purchasedIds.length > 0 && (
        <button
          className="mb-6 cursor-pointer rounded-md bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500/30 disabled:opacity-50"
          disabled={transactionInProgress}
          onClick={async () => {
            cleanupPurchased(
              account,
              purchasedIds,
              setTransactionInProgress,
              (val) => {
                setTransactionStatus(val);
                if (val.status === "Success") {
                  mutate([`prism-account-listings`, account]);
                }
              },
            );
          }}
        >
          Cleanup Purchased {`(`}
          {purchasedIds.length}
          {`)`}
        </button>
      )}
      {ghosteditems.length > 0 && (
        <button
          disabled={transactionInProgress}
          className="mb-6 ml-4 cursor-pointer rounded-md bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500/30 disabled:opacity-50"
          onClick={async () => {
            cleanupGhosted(
              account,
              ghosteditems,
              setTransactionInProgress,
              setTransactionStatus,
            );
            mutate([`prism-account-listings`, account]);
          }}
        >
          Cleanup Ghosted {`(`}
          {ghosteditems.length}
          {`)`}
        </button>
      )}
      {expiredItemsCount > 0 && (
        <button
          disabled={transactionInProgress}
          className="mb-6 ml-4 cursor-pointer rounded-md bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500/30 disabled:opacity-50"
          onClick={async () => {
            const itemCount =
              data.validItems?.length + data.invalidItems?.length - 1;
            cleanupExpired(
              account,
              "0",
              `${itemCount}`,
              setTransactionInProgress,
              (val) => {
                setTransactionStatus(val);
                if (val.status === "Success") {
                  mutate([`prism-account-listings`, account]);
                }
              },
            );
          }}
        >
          Cleanup Expired {`(`}
          {expiredItemsCount}
          {`)`}
        </button>
      )}
    </div>
  );
}

export function Listing(props: {
  listing: any;
  typeId: string;
  user: any;
  address: string | undefined;
  setTransactionInProgress: any;
  setTransactionStatus: any;
  transactionInProgress: boolean;
}) {
  const {
    listing,
    typeId,
    user,
    address: account,
    setTransactionInProgress,
    setTransactionStatus,
    transactionInProgress,
  } = props;
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutate = (queryKey: any) => {
    queryClient.invalidateQueries({ queryKey: queryKey });
  };

  const isMainnet = useParams().network === "mainnet";

  const symbol = getPaymentTokenSymbol(listing);
  const loggedIn = user && user.loggedIn && user.address == account;
  const display = listing.display;

  const { data: nftDetailsData } = useQuery({
    queryKey: [`prism-nft-id-details-${listing.listingResourceId}`],
    queryFn: () => {
      if (!listing || !listing.details) return null;
      return fetchAPIDirect(
        `/flow/v1/nft/${listing.details.nftType.typeID}/item/${listing.details.nftID}`,
        isMainnet,
      );
    },
  });

  const nftDetails = nftDetailsData?.data?.[0] || {};

  const getListingView = (listing: any) => {
    const display = listing.display;
    const rarity = listing.rarity;
    const rarityColor = getRarityColor(
      rarity && rarity.description ? rarity.description.toLowerCase() : null,
    );

    const thumbnailSrc = display?.thumbnail?.url;

    return (
      <>
        <div className="bg relative mx-auto min-h-[200px] w-full overflow-hidden">
          <ImageClient
            src={thumbnailSrc || nftDetails?.thumbnail || "/"}
            fallbackOnErrorSrc={[nftDetails?.thumbnail]}
            alt={display?.name || ""}
            dimension={"width"}
            className="border-b-[0.2px] border-solid border-b-gray-500"
          />
          {rarity ? (
            <div
              className={`absolute top-2 right-2 rounded-full px-2 text-xs font-medium ${rarityColor}`}
            >
              {`${rarity.description}`.toUpperCase()}
            </div>
          ) : null}
        </div>
      </>
    );
  };

  const getCustomIdView = (listing: any) => {
    if (!listing || !listing.details || !listing.details.customID) {
      return null;
    }

    let customId = listing.details.customID;
    if (customId == "flowverse-nft-marketplace") {
      customId = "flowverse";
    }
    return (
      <div className="mx-auto mb-2 w-fit shrink-0 px-2">
        <label
          className={`text-fineprint shrink-0 rounded-xs bg-gray-500/10 px-2 py-1 leading-3 text-gray-400`}
        >
          {customId}
        </label>
      </div>
    );
  };

  const getContractInfo = (listing: any) => {
    if (!listing || !listing.details || !listing.details.nftType) {
      return null;
    }

    let typeId = listing.details.nftType.typeID;
    return getContractInfoFromTypeId(typeId);
  };

  const getButton = () => {
    if (user && user.loggedIn && user.address == account) {
      return (
        <button
          className="w-full cursor-pointer rounded-md bg-red-500/10 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/20 disabled:opacity-50"
          disabled={transactionInProgress}
          onClick={async (event) => {
            event.stopPropagation();
            await removeItem(
              listing.listingResourceId,
              setTransactionInProgress,
              setTransactionStatus,
            );
            mutate([`prism-account-listings`, account]);
          }}
        >
          Remove
        </button>
      );
    }

    if (listing.isPurchased || listing.isExpired || listing.isGhosted) {
      return (
        <div className="w-full cursor-pointer rounded-md bg-yellow-500/10 py-2 text-center text-sm font-semibold text-yellow-500 disabled:opacity-50">
          {listing.isExpired
            ? "Purchased"
            : listing.isExpired
              ? "Expired"
              : "Ghosted"}
        </div>
      );
    }

    const collectionStoragePath = getCollectionStoragePath(listing);
    const contractInfo = getContractInfo(listing);
    if (!contractInfo) {
      return null;
    }

    const { contractName, contractAddress } = contractInfo;

    return (
      <button
        className="w-full cursor-pointer rounded-md bg-green-500/10 py-2 text-sm font-semibold text-green-500 hover:bg-green-500/20 disabled:opacity-50"
        disabled={transactionInProgress}
        onClick={async (event) => {
          event.stopPropagation();
          await buyItem(
            contractName,
            contractAddress,
            collectionStoragePath,
            listing.listingResourceId,
            account as string,
            setTransactionInProgress,
            setTransactionStatus,
          );
          mutate([`prism-account-listings`, account]);
        }}
      >
        Buy Now
      </button>
    );
  };

  return (
    <div
      className={cn(
        "shadow-subtle bg-prism-level-3 hover:bg-prism-level-4 flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-xs",
        (listing.isPurchased || listing.isExpired || listing.isGhosted) &&
          "cursor-auto",
      )}
      onClick={() => {
        router.push(
          `/account/${account}/collection/${listing.collectionData.storagePath.identifier}/${typeId}/${listing.details.nftID}`,
          // @ts-expect-error 'shallow' does not exist in type 'NavigateOptions'
          { shallow: true, scroll: false },
        );
      }}
    >
      <div>
        {getListingView(listing)}
        <div className="flex flex-col items-center gap-2 truncate p-4">
          <p className="text-main text-text-color w-[85%] truncate font-bold hover:line-clamp-3 hover:whitespace-normal">
            {display?.name || nftDetails?.name}
          </p>
          <div className="flex items-center gap-1">
            <p className="text-tiny">Token ID:</p>
            <p className="text-fineprint text-text-color">
              {listing.details.nftID}
            </p>
          </div>
        </div>
        {getCustomIdView(listing)}
      </div>
      <div className="flex flex-col gap-2 p-4 pt-0">
        <p className="text-main text-text-color truncate text-center font-bold">{`${new Number(listing.details.salePrice).toString()} ${symbol}`}</p>
        {getButton()}
      </div>
    </div>
  );
}
