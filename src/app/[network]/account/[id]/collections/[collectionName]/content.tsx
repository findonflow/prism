"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import { CollectionDetailsHeader, NftCard } from "@/components/ui/collection";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useCollectionDetails } from "@/hooks/useCollectionDetails";
import { useCollectionPathItems } from "@/hooks/useCollectionPathItems";
import useQueryParams from "@/hooks/utils/useQueryParams";
import { useParams } from "next/navigation";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
/*--------------------------------------------------------------------------------------------------------------------*/

export default function CollectionPathContent() {
  const { network, id, collectionName } = useParams() as Record<string, string>;

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { getQueryParams } = useQueryParams();
  const [offset = "0", limit = "25"] = getQueryParams(["offset", "limit"]);

  const { data: collectionDetails, isPending: fetchingDetails } =
    useCollectionDetails(address, collectionName);

  const { data: collectionItems, isPending: fetchingItems } =
    useCollectionPathItems(address, collectionName);

  const itemsList = collectionItems?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit),
  );

  console.log({collectionDetails})

  if (!address || !collectionName)
    return <div>Please provide a valid account identifier.</div>;

  if (!collectionDetails && !fetchingDetails)
    return <div>No details found for this collection.</div>;

  return (
    <div className="flex w-full flex-col">
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
      <div className="mt-4 grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {fetchingItems && <LoadingBlock title="Loading Items" />}
        {itemsList?.map((token: any, i: number) => (
          <Link
            href={`/${network}/account/${id}/collections/${collectionName}/${token.tokenId}`}
            className="truncate underline"
          >
            <NftCard token={token} key={token.tokenId} />
          </Link>
        ))}
      </div>
    </div>
  );
}
