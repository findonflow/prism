"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import FatRow from "@/components/flowscan/FatRow";
import ImageClient from "@/components/flowscan/ImageClient";
import JumpingDots from "@/components/flowscan/JumpingDots/index";
import useAccountResolver from "@/hooks/useAccountResolver";
import { cn } from "@/lib/utils";
import {
  NFTCollection,
  usePrismCollectionItems,
  usePrismCollectionList,
} from "@interfaces/fcl";
import { Package } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

function extractCollectionName(collection: NFTCollection): string {
  const rawName = collection.type.typeID.split(".")[2];
  return collection.display?.name || rawName;
}

export default function ViewPrismCollectionList() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
  );
  const address = resolved?.owner;

  const { data, isPending } = usePrismCollectionList(address);

  const showList = !isPending && Boolean(data);
  const filtered =
    data?.filter((collection) => collection.tokenIDs.length > 0) || [];

  const sorted = filtered.sort((a: NFTCollection, b: NFTCollection) => {
    const aName = extractCollectionName(a);
    const bName = extractCollectionName(b);

    return aName.localeCompare(bName, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  if (!address) return <div>Please provide a valid account identifier.</div>;

  return (
    <div className={"flex w-full flex-col"}>
      {isPending && <JumpingDots />}
      {showList && (
        <div className={"fat-row-column w-full"}>
          {sorted?.map((collection) => (
            <SingleCollection
              collection={collection}
              key={collection.path}
              address={address}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SingleCollection(props: {
  address: string;
  collection: NFTCollection;
}) {
  const { address, collection } = props;
  const name = extractCollectionName(collection);

  const previewImage = collection.display?.squareImage ? (
    <img
      src={collection.display.squareImage.file.url}
      alt={"name"}
      className={"h-full w-full"}
    />
  ) : (
    <div
      className={
        "flex h-full w-full flex-row items-center justify-center bg-white/20"
      }
    >
      ?
    </div>
  );
  const numberOfItems = collection.tokenIDs.length;

  return (
    <FatRow
      id={"collection-item"}
      details={
        <CollectionItems collection={collection} address={address} key={name} />
      }
      className={[]}
    >
      <div
        className={cn(
          "relative flex w-full flex-col items-start justify-start gap-2 p-4",
          "md:gap-2 md:p-4"
        )}
      >
        <div
          className={"flex w-full flex-row items-center justify-start gap-4"}
        >
          <div className={"h-8 w-8 overflow-hidden rounded-full"}>
            {previewImage}
          </div>
          <div className={"flex flex-col"}>
            <div
              className={
                "flex flex-row items-center justify-start gap-2 font-bold text-white"
              }
            >
              <span>{name}</span>
              <span
                title={`This collection has ${numberOfItems} item${numberOfItems > 1 ? "s" : ""} in it`}
                className={
                  "flex flex-row items-center justify-start gap-1 text-fineprint opacity-30"
                }
              >
                <Package className={"h-4 w-4"} /> {numberOfItems}
              </span>
            </div>
            <p className={"text-fineprint"}>{collection.path}</p>
          </div>
        </div>
      </div>
    </FatRow>
  );
}

function CollectionItems(props: {
  address: string;
  collection: NFTCollection;
}) {
  const { address, collection } = props;
  const path = collection.path.split("/")[2];
  const { data, isPending } = usePrismCollectionItems(
    address,
    path,
    collection.tokenIDs
  );

  // TODO: this is a bit more tricky since we are stiching them together and I am not sure if order is always preserved
  const reverseIds = collection.tokenIDs.reverse();

  return (
    <div
      className={
        "flex w-full flex-col items-start justify-start gap-2 bg-neutral-500 p-4"
      }
    >
      {isPending && <JumpingDots />}
      <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-3 @3xl:gap-4 @4xl:grid-cols-4 @5xl:grid-cols-5 @7xl:grid-cols-7">
        {data?.map((token: any, i: number) => {
          const nftId = reverseIds[i];

          return (
            <div
              className="h-full overflow-hidden rounded-md bg-widgets-bg shadow-subtle hover:bg-neutral-300"
              key={`i-${path}`}
            >
              <div className="bg relative min-h-[200px] w-full overflow-hidden">
                <ImageClient
                  src={token?.thumbnail.url || ""}
                  alt={token?.id || ""}
                  dimension={"width"}
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <p className="text-main font-bold text-text-color">
                  {token.name}
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <p className="text-tiny text-tabs-bg-active-text">
                      Token ID:
                    </p>
                    <p className="text-fineprint text-text-color">{nftId}</p>
                  </div>
                  <div className="flex items-center gap-1 overflow-hidden">
                    <p className="text-tiny text-tabs-bg-active-text">Owner:</p>
                    <Link
                      href={"/account/" + address}
                      className="truncate text-fineprint text-transaction-table-cell-author-link"
                    >
                      {address}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
