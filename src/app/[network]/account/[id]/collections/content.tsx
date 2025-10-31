"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Image from "next/image";
import { useParams } from "next/navigation";

import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import JumpingDots from "@/components/flowscan/JumpingDots/index";
import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import { NftCard } from "@/components/ui/collection";
import { NumberOfItems } from "@/components/ui/tags";
import { useAccountCollectionList } from "@/hooks/useAccountCollectionList";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useCollectionItems } from "@/hooks/useCollectionItems";
import useQueryParams from "@/hooks/utils/useQueryParams";
import { useEffect } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function extractCollectionName(collection: NFTCollection): string {
  const rawName = collection.type.typeID.split(".")[2];
  return collection.display?.name || rawName;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountCollectionsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isPending } = useAccountCollectionList(address);
  const { setQueryParams, getQueryParams } = useQueryParams();
  const [offset = "0", limit = "25"] = getQueryParams([
    "offset",
    "limit",
    "type",
    "refKind",
  ]);

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

  const items = sorted?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit),
  );

  if (!address) return <div>Please provide a valid account identifier.</div>;

  return (
    <div className={"flex w-full flex-col"}>
      {isPending && <JumpingDots />}
      {sorted && !isPending && (
        <SimpleClientPagination totalItems={sorted?.length} />
      )}
      {showList && (
        <div className={"fat-row-column mt-4 flex w-full flex-col gap-px"}>
          {items?.map((collection) => (
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

/*--------------------------------------------------------------------------------------------------------------------*/
interface SingleCollectionProps {
  address: string;
  collection: NFTCollection;
}
/*--------------------------------------------------------------------------------------------------------------------*/
function SingleCollection(props: SingleCollectionProps) {
  const { address, collection } = props;
  const name = extractCollectionName(collection);
  const collectionPathLink =
    "collections/" + collection.path.replace("/storage/", "");

  const previewImage = collection.display?.squareImage ? (
    <Image
      unoptimized
      width={20}
      height={20}
      src={collection.display.squareImage.file.url || "/"}
      alt={"name"}
      className={"h-full w-full"}
    />
  ) : (
    <div
      className={
        "flex h-full w-full flex-row items-center justify-center bg-gray-300/50 font-bold text-gray-400/50"
      }
    >
      ?
    </div>
  );

  return (
    <FatRow
      id={"collection-item"}
      details={
        <CollectionItems collection={collection} address={address} key={name} />
      }
      className={[]}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2 p-4">
        <div
          className={"flex w-full flex-row items-center justify-start gap-4"}
        >
          <a
            href={collectionPathLink}
            className={
              "flex h-8 w-8 flex-col items-center justify-center overflow-hidden rounded-full"
            }
          >
            {previewImage}
          </a>

          <div className={"flex flex-col"}>
            <div
              className={
                "inline-grid w-full flex-col flex-wrap items-start justify-start truncate font-bold"
              }
            >
              <a className="truncate" href={collectionPathLink}>
                {name}
              </a>
              <a
                href={collectionPathLink}
                className={"truncate text-sm font-normal"}
              >
                {collection.path}
              </a>
            </div>
          </div>
        </div>

        <NumberOfItems items={collection?.tokenIDs?.length} />
      </div>
    </FatRow>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
interface CollectionItemsProps {
  address: string;
  collection: NFTCollection;
}
/*--------------------------------------------------------------------------------------------------------------------*/
function CollectionItems(props: CollectionItemsProps) {
  const { address, collection } = props;
  const path = collection.path.split("/")[2];
  const { getQueryParams, setQueryParams } = useQueryParams();
  const [offset = "0", limit = "25"] = getQueryParams([
    path + "-offset",
    path + "-limit",
  ]);

  const { data, isPending } = useCollectionItems(
    address,
    path,
    collection.tokenIDs,
  );

  useEffect(() => {
    return () => {
      setQueryParams(
        {
          [path + "-offset"]: false,
          [path + "-limit"]: false,
        },
        { push: false, scroll: false },
      );
    };
  }, []);

  const itemsList = data?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit),
  );

  return (
    <FatRowDetails>
      {isPending && <JumpingDots />}

      {!isPending && data && (
        <SimpleClientPagination prefix={path + "-"} totalItems={data?.length} />
      )}

      <div className="flex flex-row flex-wrap gap-2">
        {itemsList?.map((token: any) => {
          return <NftCard token={token} key={token.tokenId} />;
        })}
      </div>
    </FatRowDetails>
  );
}
