"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { AnimatePresence, motion } from "motion/react";
import { variants } from "@/lib/animate";
import { useParams } from "next/navigation";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import useAccountResolver from "@/hooks/useAccountResolver";
import ImageClient from "@/components/flowscan/ImageClient";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import {
  TypeH2,
  TypeLabel,
  TypeP,
  TypeSubsection,
} from "@/components/ui/typography";
import { splitCase } from "@/lib/format";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { Panel } from "@/components/ui/primitive";
import VideoPlayer from "@/components/flowscan/VideoPlayer";
import TokenImage from "@/components/flowscan/TokenImage";
import { buttonClasses, hoverClasses } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { FlowtyLogo, FlowverseLogo } from "@/components/ui/icons";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function SingleCollectionItemPage() {
  const { network, itemId, collectionName, id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isPending } = useNFTMetadata(
    address,
    collectionName as string,
    itemId as string,
  );

  const loading = isResolving || isPending;
  const showData = !isPending && data;

  const parts = data?.type?.split(".") || [];
  const contractAddress = parts[1];

  console.log({ data });

  return (
    <div className={"flex flex-col items-start justify-start space-y-6"}>
      <Link
        href={`/${network}/account/${id}/collections/${collectionName}`}
        className={
          "text-prism-primary flex flex-row items-center gap-1 underline"
        }
      >
        <ArrowLeft className={"h-4 w-4"} />
        <span>Back to collection</span>
      </Link>
      {loading && <LoadingBlock />}
      {showData && (
        <>
          <Panel>
            <div
              className={
                "grid w-full grid-cols-1 gap-4 lg:grid-cols-[auto_1fr] lg:gap-6"
              }
            >
              <div className="bg-prism-level-3 relative w-full overflow-hidden py-2.5 lg:h-[24rem] lg:w-[24rem]">
                <ImageClient
                  src={data?.thumbnail || "/"}
                  alt={data?.tokenId || ""}
                  dimension={"width"}
                />
              </div>

              <div
                className={
                  "flex flex-col items-start justify-center space-y-3 text-left"
                }
              >
                <div className={"flex flex-row items-center gap-2"}>
                  <TypeLabel>Collection:</TypeLabel>
                  <a
                    href={`/${network}/account/${id}/collections/${collectionName}`}
                    className={"text-md text-prism-primary underline"}
                  >
                    {data?.collectionName}
                  </a>
                </div>

                <div className={"flex flex-wrap justify-start gap-2"}>
                  <SimpleTag
                    label={data?.id}
                    category={"ID"}
                    className={"text-xs"}
                  />

                  {data?.serial && (
                    <SimpleTag
                      label={data.serial || data?.serial?.number}
                      category={"Serial"}
                      className={"text-xs"}
                    />
                  )}
                </div>

                <TypeH2 className={"text-3xl"}>{data?.name}</TypeH2>
                {data?.rarity?.score && <p>Rarity: {data?.rarity?.score}</p>}
                {data?.description && (
                  <TypeP className={"max-w-[42em] text-balance"}>
                    {data?.description}
                  </TypeP>
                )}
                <SimpleTag
                  label={data.uuid}
                  category={"UUID"}
                  className={"text-prism-text-muted/75 mb-8 text-[11px]"}
                />

                {/* Other platforms*/}
                <div
                  className={
                    "grid w-full grid-cols-1 items-center justify-end gap-4 lg:flex lg:w-full lg:flex-wrap lg:justify-start"
                  }
                >
                  {data?.externalUrl && (
                    <a
                      target={"_blank"}
                      title={`Trade ${collectionName} on Flowverse`}
                      href={`https://nft.flowverse.co/marketplace/${collectionName}`}
                      className={cn(
                        buttonClasses,
                        hoverClasses,
                        "flex items-center gap-2 py-3 text-center",
                      )}
                    >
                      <Globe className={"h-4 w-4"} />
                      <span>Website</span>
                    </a>
                  )}

                  <div className={"flex flex-row gap-4"}>
                    {collectionName && (
                      <a
                        target={"_blank"}
                        title={`Trade ${collectionName} on Flowverse`}
                        href={`https://nft.flowverse.co/marketplace/${collectionName}`}
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
                      title={`Trade ${collectionName} on Flowty`}
                      href={`https://www.flowty.io/collection/${contractAddress}/${collectionName}`}
                      className={cn(
                        buttonClasses,
                        hoverClasses,
                        "flex flex-row items-center gap-2 py-3 text-center",
                      )}
                    >
                      <FlowtyLogo className={"rounded-full w-5 h-5"}/>
                      <span>Trade on Flowty</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Panel>

          <div className={"w-full space-y-8"}>
            {/* Traits and Royalties*/}
            {data?.traits && <NFTTraits traits={data?.traits} />}
            {data?.royalties && (
              <NFTRoyalties
                royalties={data?.royalties.cutInfos || data?.royalties}
              />
            )}
            {data.medias && <NFTMedias medias={data.medias} />}
          </div>
        </>
      )}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function NFTTraits(props: { traits: Array<any> }) {
  const { traits } = props;

  if (!traits) return null;

  return (
    <div className={cn("w-full space-y-4")}>
      <TypeSubsection>Traits</TypeSubsection>
      <motion.div
        className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3")}
        variants={variants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {traits.map((trait, index) => {
            const name = trait.name.replace(/([A-Z])/g, " $1").trim();
            return (
              <motion.div
                variants={variants}
                key={`${trait.name}-${index}`}
                className={cn(
                  "bg-prism-level-2 hover:bg-prism-level-3 flex w-full flex-col space-y-1 rounded-sm p-4",
                  "border-prism-border rounded-xs border-1",
                )}
              >
                <div className={"flex flex-row items-center justify-between"}>
                  <p className={"text-sm capitalize opacity-75"}>{name}</p>
                  <TagTrait rarity={trait.rarity} />
                </div>
                <p
                  className={"truncate text-lg font-semibold capitalize"}
                  title={trait.value}
                >
                  {typeof trait.value === "boolean"
                    ? trait.value.toString()
                    : trait.value}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function rarityColor(rarity?: string) {
  switch (rarity) {
    case "common":
      return "text-gray-500";
    case "rare":
      return "text-blue-500";
    case "epic":
      return "text-orange-500";
    case "legendary":
      return "text-violet-500";
    default:
      return "text-gray-100";
  }
}

/*--------------------------------------------------------------------------------------------------------------------*/
interface Rarity {
  description?: string;
  max: string;
  score: string;
}

function TagTrait(props: { rarity: Rarity }) {
  const { rarity } = props;

  if (!rarity) return null;

  return (
    <SimpleTag
      label={rarity.description}
      className={cn(
        "px-[0.25rem] py-[0.125rem] text-[11px] capitalize",
        rarityColor(rarity?.description),
      )}
    />
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
interface Share {
  receiver: {
    address: string;
    id: string;
  };
  description?: string;
  cut: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
function NFTRoyalties(props: { royalties: Array<any> }) {
  const { network } = useParams();

  const { royalties } = props;

  if (!royalties || royalties.length === 0) {
    return null;
  }

  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-2"}>
      <TypeSubsection className={"opacity-75"}>Royalties</TypeSubsection>

      <div className={"flex w-full flex-col items-start justify-start gap-px"}>
        {royalties?.map((share: Share) => {
          const receiver = share?.receiver?.address;

          return (
            <div
              className={
                "bg-prism-level-2 flex w-full flex-row items-center justify-start gap-2 p-4"
              }
            >
              <span className={"font-bold"}>{Number(share.cut) * 100}%</span>
              <a
                href={`/${network}/account/${receiver}`}
                className={"underline"}
              >
                {receiver}
              </a>
              <p className={"truncate"} title={share.description}>
                {share.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function NFTMedias(props: { medias: Array<any> }) {
  const { medias } = props;

  if (!medias || medias.length === 0) {
    return null;
  }

  const images =
    medias?.filter((item) => item.contentType?.includes("image")) || [];
  const videos =
    medias?.filter((item) => item.contentType?.includes("video")) || [];

  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-2"}>
      <div className={"flex w-full flex-col items-start justify-start gap-px"}>
        <TypeSubsection className={"opacity-75"}>Media: Videos</TypeSubsection>
        <div
          className={cn(
            "items-top grid grid-cols-1 justify-start gap-2",
            "lg:grid-cols-3",
          )}
        >
          {videos.map((video) => {
            return <VideoPlayer src={video.uri} key={video.uri} />;
          })}
        </div>

        <TypeSubsection className={"opacity-75"}>Media: Images</TypeSubsection>
        <div
          className={cn(
            "items-top grid grid-cols-2 justify-start gap-2",
            "lg:flex lg:flex-wrap",
          )}
        >
          {images.map(({ uri = "" }) => {
            return (
              <div
                key={uri}
                className={cn("relative h-[45vw] w-full", "lg:h-48 lg:w-auto")}
              >
                <TokenImage src={uri} alt={uri} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
