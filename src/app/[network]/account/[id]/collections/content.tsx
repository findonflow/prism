"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import ImageClient from "@/components/flowscan/ImageClient";
import JumpingDots from "@/components/flowscan/JumpingDots/index";
import { NumberOfItems } from "@/components/ui/tags";
import { useAccountCollectionList } from "@/hooks/useAccountCollectionList";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useCollectionItems } from "@/hooks/useCollectionItems";
import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import { useEffect } from "react";
import useQueryParams from "@/hooks/utils/useQueryParams";

/*--------------------------------------------------------------------------------------------------------------------*/
export function extractCollectionName(collection: NFTCollection): string {
  const rawName = collection.type.typeID.split(".")[2];
  return collection.display?.name || rawName;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountCollectionsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
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
    parseInt(offset) + parseInt(limit)
  );

  if (!address) return <div>Please provide a valid account identifier.</div>;

  return (
    <div className={"flex w-full flex-col"}>
      {isPending && <JumpingDots />}
      {sorted && !isPending && (
        <SimpleClientPagination totalItems={sorted?.length} />
      )}
      {showList && (
        <div className={"fat-row-column w-full mt-4 flex flex-col gap-px"}>
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
        "flex h-full w-full flex-row items-center justify-center bg-gray-300/50 text-gray-400/50 font-bold"
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
              "h-8 w-8 overflow-hidden rounded-full flex flex-col items-center justify-center"
            }
          >
            {previewImage}
          </a>

          <div className={"flex flex-col"}>
            <div
              className={
                "flex flex-col flex-wrap items-start justify-start font-bold truncate w-full"
              }
            >
              <a href={collectionPathLink}>{name}</a>
              <a href={collectionPathLink} className={"text-sm font-normal"}>
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
  const {network} = useParams();
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
    collection.tokenIDs
  );

  useEffect(() => {
    return () => {
      setQueryParams(
        {
          [path + "-offset"]: false,
          [path + "-limit"]: false,
        },
        { push: false, scroll: false }
      );
    };
  }, []);

  const itemsList = data?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit)
  );

  return (
    <FatRowDetails>
      {isPending && <JumpingDots />}

      {!isPending && data && (
        <SimpleClientPagination prefix={path + "-"} totalItems={data?.length} />
      )}

      <div className="flex flex-row gap-2 flex-wrap">
        {itemsList?.map((token: any, i: number) => {
          const nftId = token.tokenId;

          return (
            <div
              className="h-full overflow-hidden rounded-xs bg-gray-300 shadow-subtle hover:bg-gray-400/50"
              key={`${i}-${path}`}
            >
              <div className="bg relative min-h-[200px] mx-auto w-full overflow-hidden">
                <ImageClient
                  src={token?.thumbnail.url || "/"}
                  alt={token?.id || ""}
                  dimension={"width"}
                />
              </div>
              <div className="flex flex-col gap-2 p-4">
                <a href={`/${network}/collections/${path}/${nftId}`} className={"underline"}>
                <p className="text-main font-bold text-text-color underline">
                  {token.name}
                </p>
                </a>
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
    </FatRowDetails>
  );
}
