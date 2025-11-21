"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import useAccountResolver from "@/hooks/useAccountResolver";
import ImageClient from "@/components/flowscan/ImageClient";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { TypeH2, TypeP, TypeSubsection } from "@/components/ui/typography";
import { splitCase } from "@/lib/format";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { Panel } from "@/components/ui/primitive";

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

  console.log({ data });

  return (
    <div className={"flex flex-col items-start justify-start gap-4"}>
      {loading && <LoadingBlock />}
      {showData && (
        <>
          <Panel>
            <div
              className={
                "grid w-full grid-cols-1 gap-4 lg:grid-cols-[auto_1fr] lg:gap-6"
              }
            >
              <div className="relative w-full overflow-hidden py-2.5 lg:w-[24rem]">
                <ImageClient
                  src={data?.thumbnail || "/"}
                  alt={data?.tokenId || ""}
                  dimension={"width"}
                />
              </div>
              <div className={"flex flex-col items-start space-y-2 text-left"}>
                <a
                  href={`/${network}/account/${id}/collections/${collectionName}`}
                  className={"underline"}
                >
                  {data?.collectionName}
                </a>
                <div className={"flex flex-wrap justify-start gap-2"}>
                  <SimpleTag
                    label={data?.id}
                    category={"ID"}
                    className={"text-xs"}
                  />

                  {data?.serial?.number && (
                    <SimpleTag
                      label={data?.serial?.number}
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
              </div>
            </div>
          </Panel>

          <div className={"space-y-8"}>
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
    <div className={"flex w-full flex-col items-start justify-start space-y-4"}>
      <TypeSubsection className={"opacity-75"}>Traits</TypeSubsection>
      <div
        className={
          "grid w-full grid-cols-1 gap-3 lg:grid-cols-4 2xl:grid-cols-6"
        }
      >
        {traits?.map((trait, i) => {
          const name = splitCase(trait.name);

          return (
            <div
              className={cn(
                "bg-prism-level-2 hover:bg-prism-level-3 flex w-full flex-col space-y-1 rounded-sm p-4",
                "border-prism-border rounded-xs border-1",
              )}
              key={trait.name}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <p className={"text-sm capitalize opacity-75"}>{name}</p>
                <TagTrait rarity={trait.rarity} />
              </div>
              <p
                className={"truncate text-lg font-semibold capitalize"}
                title={trait.value}
              >
                {trait.value}
              </p>
            </div>
          );
        })}
      </div>
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

  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-2"}>
      <TypeSubsection className={"opacity-75"}>Medias</TypeSubsection>

      <div className={"flex w-full flex-col items-start justify-start gap-px"}>
        {medias?.map((media: any) => {
          return (
            <div
              className={
                "bg-prism-level-2 flex w-full flex-row items-center justify-start gap-2 p-4"
              }
            >
              <a href={media.url} className={"underline"}>
                {media.url}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}