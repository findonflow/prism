import { extractCollectionName } from "@/app/[network]/account/[id]/collections/content";
import ImageClient from "@/components/flowscan/ImageClient";
import Image from "next/image";
import Link from "next/link";
import { NumberOfItems } from "../tags";
import { useParams } from "next/navigation";
import { TypeP } from "@/components/ui/typography";

export function NftCard(props: { token: any }) {
  const { token } = props;
  const { network, id, collectionName } = useParams();
  const nftId = token.tokenId;

  return (
    <div
      className="shadow-subtle h-full overflow-hidden rounded-xs bg-prism-level-3 hover:bg-prism-level-4"
      key={`${nftId}-${collectionName}`}
    >
      <div className="bg relative mx-auto min-h-[200px] w-full overflow-hidden">
        <ImageClient
          src={token?.thumbnail.url || "/"}
          alt={token?.id || ""}
          dimension={"width"}
        />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <a
          href={`/${network}/account/${id}/collections/${collectionName}/${nftId}`}
          className={"underline"}
          target={"_blank"}
        >
          <p className="text-main text-text-color font-bold">{token.name}</p>
        </a>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="text-tiny">Token ID:</p>
            <p className="text-fineprint text-text-color">{nftId}</p>
          </div>
          <div className="flex items-center gap-1 overflow-hidden">
            <p className="text-xs">Owner:</p>
            <Link
              href={`/${network}/account/` + id}
              className="text-fineprint truncate"
            >
              {id}
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
        "flex h-full w-full flex-row items-center justify-center bg-prism-level-2 font-bold text-prism-text-muted"
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
              "flex h-8 w-8 flex-col items-center justify-center overflow-hidden rounded-full"
            }
          >
            {previewImage}
          </div>

          <div className={"flex flex-col"}>
            <div
              className={
                "flex w-full flex-col flex-wrap items-start justify-start truncate font-bold"
              }
            >
              <span>{name}</span>
              <p className={"text-sm font-normal"}>{collectionDetails?.path}</p>
            </div>
          </div>
        </div>
        <TypeP className={"text-balance mb-4"}>
          {collectionDetails?.display?.description}
        </TypeP>
      </div>
      <span className="font-bold whitespace-nowrap text-green-500">
        <NumberOfItems items={collectionDetails?.tokenIDs?.length} />
      </span>
    </div>
  );
}
