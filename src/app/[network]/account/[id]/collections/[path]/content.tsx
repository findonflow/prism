"use client";
import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import { CollectionDetailsHeader, NftCard } from "@/components/ui/collection";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useCollectionDetails } from "@/hooks/useCollectionDetails";
import { useCollectionPathItems } from "@/hooks/useCollectionPathItems";
import useQueryParams from "@/hooks/utils/useQueryParams";
import Image from "next/image";
import { useParams } from "next/navigation";
import { extractCollectionName } from "../content";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";

export default function CollectionPathContent() {
  const { network, id, path } = useParams() as Record<string, string>;

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
  );
  const address = resolved?.owner;

  const { getQueryParams } = useQueryParams();
  const [offset = "0", limit = "25"] = getQueryParams(["offset", "limit"]);

  const { data: collectionDetails, isPending: fetchingDetails } =
    useCollectionDetails(address, path);

  const { data: collectionItems, isPending: fetchingItems } =
    useCollectionPathItems(address, path);

  const itemsList = collectionItems?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  );

  if (!address || !path)
    return <div>Please provide a valid account identifier.</div>;
  if (!collectionDetails && !fetchingDetails)
    return <div>No details found for this collection.</div>;

  return (
    <div className="flex flex-col w-full">
      {fetchingDetails ? (
        <LoadingBlock title="Loading Details" />
      ) : (
        <CollectionDetailsHeader collectionDetails={collectionDetails} />
      )}

      {collectionItems && (
        <SimpleClientPagination
          className="my-4"
          totalItems={collectionItems?.length}
        />
      )}
      <div className="grid mt-4 grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 w-full">
        {fetchingItems && <LoadingBlock title="Loading Items" />}
        {itemsList?.map((token: any, i: number) => (
          <a href={`${path}/${token.tokenId}`} className="contents">
            <NftCard token={token} key={`${i}-${path}`} address={address} />
          </a>
        ))}
      </div>
    </div>
  );
}
