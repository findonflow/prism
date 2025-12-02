import { extractCollectionName } from "@/app/[network]/account/[id]/collections/content";
import ImageClient from "@/components/flowscan/ImageClient";
import Image from "next/image";
import Link from "next/link";
import { NumberOfItems } from "../tags";
import { useParams } from "next/navigation";
import { TypeH1, TypeP } from "@/components/ui/typography";
import { Panel } from "@/components/ui/primitive";
import { useCollectionRegistry } from "@/hooks/useCollectionDetails";
import { ReactNode } from "react";
import { Gamepad, Globe, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonClasses, hoverClasses } from "@/components/ui/button";
import { withPrefix } from "@/lib/validate";
import { FlowtyLogo, FlowverseLogo } from "@/components/ui/icons";

export function NftCard(props: { token: any }) {
  const { token } = props;
  const { network, id, collectionName } = useParams();
  const nftId = token.id;

  const { storagePath } = token;

  return (
    <div
      className="shadow-subtle bg-prism-level-3 hover:bg-prism-level-4 h-full truncate overflow-hidden rounded-xs"
      key={`${nftId}-${collectionName}`}
    >
      <div className="bg relative mx-auto min-h-[200px] w-full overflow-hidden">
        <ImageClient
          src={token?.thumbnail || "/"}
          alt={token?.id || ""}
          dimension={"width"}
        />
      </div>
      <div className="flex flex-col gap-2 truncate p-4">
        <a
          href={`/${network}/account/${id}/collections/${storagePath}/${nftId}`}
          className={"underline"}
          target={"_blank"}
        >
          <p className="text-main text-text-color truncate font-bold">
            {token.name}
          </p>
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
  const { data: registry, isPending: loadingRegistry } =
    useCollectionRegistry();

  const extraDetails = registry?.tokenByPath[collectionDetails?.path];
  const logoUrl =
    extraDetails?.logoURI || collectionDetails?.display?.squareImage || "/";

  const previewImage = collectionDetails?.display?.squareImage ? (
    <Image
      unoptimized
      width={20}
      height={20}
      src={logoUrl}
      alt={"name"}
      className={"bg-prism-level-2 h-full w-full"}
    />
  ) : (
    <div
      className={
        "bg-prism-level-2 text-prism-text-muted flex h-full w-full flex-row items-center justify-center font-bold"
      }
    >
      ?
    </div>
  );
  const name = extractCollectionName(collectionDetails);

  const parts = collectionDetails?.type?.typeID?.split(".") || [];
  const contractAddress = parts ? withPrefix(parts[1]) : null;
  const contractName = parts ? withPrefix(parts[2]) : null;

  return (
    <Panel>
      <div className="flex w-full flex-row items-start justify-between">
        <div className="flex w-full flex-col gap-3">
          <div
            className={"flex w-full flex-row items-center justify-start gap-4"}
          >
            <div
              className={
                "flex h-16 w-16 flex-none flex-col items-center justify-center overflow-hidden rounded-full"
              }
            >
              {previewImage}
            </div>

            <div className={"my-4 flex w-full flex-col truncate"}>
              <div
                className={
                  "flex w-full flex-col flex-wrap items-start justify-start truncate font-bold"
                }
              >
                <TypeH1>{name}</TypeH1>
                <p
                  className={
                    "text-md text-prism-primary w-full truncate font-normal"
                  }
                >
                  {collectionDetails?.path}
                </p>
              </div>
            </div>
          </div>

          <TypeP className={"mb-4"}>
            {collectionDetails?.display?.description}
          </TypeP>

          <div
            className={cn(
              "flex flex-col items-start justify-between gap-4",
              "lg:flex-row lg:items-center",
            )}
          >
            {/*Socials*/}
            <div className={"flex flex-row items-center justify-end gap-2"}>
              {mapExtensions(extraDetails?.extensions)}
            </div>

            {/* Other platforms*/}
            <div
              className={
                "grid w-full grid-cols-1 items-center justify-end gap-4 lg:w-auto lg:grid-cols-2"
              }
            >
              {contractName && (
                <a
                  target={"_blank"}
                  title={`Trade ${contractName} on Flowverse`}
                  href={`https://nft.flowverse.co/marketplace/${contractName}`}
                  className={cn(
                    buttonClasses,
                    hoverClasses,
                    "flex flex-row items-center gap-2 py-3 text-center",
                  )}
                >
                  <FlowverseLogo />
                  <span>Trade on Flowverse</span>
                </a>
              )}
              <a
                target={"_blank"}
                title={`Trade ${name} on Flowty`}
                href={`https://www.flowty.io/collection/${contractAddress}/${contractName}`}
                className={cn(
                  buttonClasses,
                  hoverClasses,
                  "flex flex-row items-center gap-2 py-3 text-center",
                )}
              >
                <FlowtyLogo className={"h-5 w-5 rounded-full"} />
                <span>Trade on Flowty</span>
              </a>
            </div>
          </div>
        </div>

        <span className="absolute top-6 right-6 hidden font-bold whitespace-nowrap text-green-500 lg:block">
          <NumberOfItems items={collectionDetails?.tokenIDs?.length} />
        </span>
      </div>
    </Panel>
  );
}

const socials: Record<string, ReactNode> = {
  instagram: <Instagram className={"h-4 w-4"} />,
  twitter: <Twitter className={"h-4 w-4"} />,
  website: <Globe className={"h-4 w-4"} />,
  discord: <Gamepad className={"h-4 w-4"} />,
};

export function mapExtensions(
  extraDetails: NFTCollection,
): Array<ReactNode> | null {
  if (!extraDetails) {
    return null;
  }

  return Object.entries(extraDetails).map(([key, value]) => {
    const title = key[0].toUpperCase() + key.slice(1);
    return (
      <a
        href={value}
        key={key}
        title={title}
        className={cn(
          // "text-prism-text-muted bg-prism-level-3 border-prism-text-muted/25 rounded-sm border-1 p-3 transition-colors duration-500",
          //"hover:text-prism-primary hover:border-current",
          buttonClasses,
          hoverClasses,
          "p-3",
        )}
      >
        {socials[key]}
      </a>
    );
  });
}
