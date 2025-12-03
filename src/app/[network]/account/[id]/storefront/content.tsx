"use client";
import { useAccountListings } from "@/hooks/useAccountListings";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useParams, useSearchParams } from "next/navigation";
import ListingGroup, {
  CleanupButtons,
  Listing,
  transactionInProgressState,
  transactionStatusState,
} from "./components";
import { useLoginContext } from "@/fetch/provider";
import { useState } from "react";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import Toggle from "@/components/flowscan/Toggle";

const groupListings = (listings: Listing[] = []): Listing[][] => {
  console.log("Listings to group:", listings);
  const grouped: Record<string, Listing[]> = listings?.reduce(
    (acc: Record<string, Listing[]>, listing: Listing) => {
      const typeId = listing.details.nftType.typeID;
      if (!acc[typeId]) {
        acc[typeId] = [];
      }

      acc[typeId].push(listing);

      return acc;
    },
    {},
  );

  for (const type in grouped) {
    grouped[type].sort((a: Listing, b: Listing) =>
      b.listingResourceId.localeCompare(a.listingResourceId),
    );
  }

  const sortedGroups: Listing[][] = Object.keys(grouped)
    .sort()
    .map((key) => grouped[key]);

  return sortedGroups;
};

export default function ViewAccountListings() {
  const { id } = useParams();
  const { user } = useLoginContext();
  const searchParams = useSearchParams() as any;
  const showInvalid = searchParams.get("showInvalid") === "1";

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isPending: fetchingListings } = useAccountListings(address);

  const listingGroups = data ? groupListings(data.validItems) : [];
  const invalidListingsGroup = data ? groupListings(data.invalidItems) : [];

  const [transactionInProgress, setTransactionInProgress] = useState(
    transactionInProgressState.default,
  );
  const [, setTransactionStatus] = useState(transactionStatusState.default);
  if (isResolving || fetchingListings) {
    return (
      <div className="mt-10 flex h-[70px] justify-center text-base text-gray-400">
        <LoadingBlock />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-y-5">
      <div className="flex w-full items-center justify-between">
        <Toggle
          text="Show Invalid Listings"
          toggleString="showInvalid"
          tooltipText="Show Ghosted/Expired/Purchased Listings"
        />
        <CleanupButtons
          data={data}
          user={user}
          address={address as string | undefined}
          setTransactionInProgress={setTransactionInProgress}
          setTransactionStatus={setTransactionStatus}
          transactionInProgress={transactionInProgress}
          hasStorefront={Boolean(data)}
        />
      </div>
      <h2 className="mb-4 text-xl font-bold text-gray-200">
        Available Listings
      </h2>
      {listingGroups.length > 0 ? (
        listingGroups.map((listings, index) => {
          return (
            <ListingGroup
              key={`listing-groups-${index}`}
              listings={listings}
              user={user}
              address={address as string | undefined}
              setTransactionInProgress={setTransactionInProgress}
              setTransactionStatus={setTransactionStatus}
              transactionInProgress={transactionInProgress}
            />
          );
        })
      ) : (
        <div className="mt-10 flex h-[70px] justify-center text-base text-gray-400">
          Nothing found
        </div>
      )}
      {showInvalid && invalidListingsGroup.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-200">
            Unavailable Listings
          </h2>
          {invalidListingsGroup.map((listings, index) => {
            return (
              <ListingGroup
                key={`invalid-listing-groups-${index}`}
                listings={listings}
                user={user}
                address={address as string | undefined}
                setTransactionInProgress={setTransactionInProgress}
                setTransactionStatus={setTransactionStatus}
                transactionInProgress={transactionInProgress}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
