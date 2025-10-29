import { extractCollectionName } from "@/app/[network]/account/[id]/collections/content";
import ImageClient from "@/components/flowscan/ImageClient";
import Image from "next/image";
import Link from "next/link";
import { NumberOfItems } from "../tags";

export function NftCard(props: { token: any; address: string }) {
  const { token, address } = props;
  const nftId = token.tokenId;
  return (
    <div className="h-full overflow-hidden rounded-xs bg-gray-300 shadow-subtle hover:bg-gray-400/50">
      <div className="bg relative min-h-[200px] py-2.5 mx-auto w-full overflow-hidden">
        <ImageClient
          src={token?.thumbnail.url || "/"}
          alt={token?.id || ""}
          dimension={"width"}
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <p className="text-main font-bold text-text-color">{token.name}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="text-tiny text-tabs-bg-active-text">Token ID:</p>
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
}

export function CollectionDetailsHeader(props: {
  collectionDetails: NFTCollection;
}) {
  const { collectionDetails } = props;
  console.log(collectionDetails);
  const previewImage = collectionDetails?.display?.squareImage ? (
    <Image
      unoptimized
      width={20}
      height={20}
      src={collectionDetails?.display.squareImage.file.url || "/"}
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

  const name = extractCollectionName(collectionDetails);
  return (
    <div className="flex w-full flex-row items-start justify-between">
      <div className="flex flex-col gap-3">
        <div
          className={"flex w-full flex-row items-center justify-start gap-4"}
        >
          <div
            className={
              "h-8 w-8 overflow-hidden rounded-full flex flex-col items-center justify-center"
            }
          >
            {previewImage}
          </div>

          <div className={"flex flex-col"}>
            <div
              className={
                "flex flex-col flex-wrap items-start justify-start font-bold truncate w-full"
              }
            >
              <span>{name}</span>
              <p className={"text-sm font-normal"}>{collectionDetails?.path}</p>
            </div>
          </div>
        </div>
        <p className={"text-sm font-normal mt-3"}>
          {collectionDetails?.display?.description}
        </p>
      </div>
      <span className="text-green-500 whitespace-nowrap font-bold">
        <NumberOfItems items={collectionDetails?.tokenIDs?.length} />
      </span>
    </div>
  );
}
