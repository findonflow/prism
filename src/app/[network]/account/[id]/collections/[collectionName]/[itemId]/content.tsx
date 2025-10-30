"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useNFTMetadata } from "@/hooks/useNFTMetadata";
import useAccountResolver from "@/hooks/useAccountResolver";
import ImageClient from "@/components/flowscan/ImageClient";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { TypeH2, TypeH3, TypeP } from "@/components/ui/typography";
import { splitCase } from "@/lib/format";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";

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

  console.log({ data });

  const loading = isResolving || isPending;
  const showData = !isPending && data;

  return (
    <div className={"flex flex-col items-start justify-start gap-4"}>
      {loading && <LoadingBlock />}
      {showData && (
        <>
          <div
            className={"grid w-full grid-cols-1 gap-4 lg:grid-cols-[auto_1fr]"}
          >
            <div className="relative w-full overflow-hidden py-2.5 lg:w-[24rem]">
              <ImageClient
                src={data?.display.thumbnail.url || "/"}
                alt={data?.tokenId || ""}
                dimension={"width"}
              />
            </div>
            <div className={"flex flex-col items-start space-y-2 text-left"}>
              <a
                href={`/${network}/account/${id}/collections/${collectionName}`}
                className={"underline"}
              >
                {data?.collectionDisplay.name}
              </a>
              <div className={"flex flex-wrap justify-start gap-2"}>
                <SimpleTag
                  label={data?.tokenId}
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

              <TypeH2 className={"text-3xl"}>{data?.display.name}</TypeH2>
              {data?.rarity && <p>Rarity: {data?.rarity?.score}</p>}
              {data?.display?.description && (
                <TypeP className={"max-w-[42em] text-balance"}>
                  {data?.display?.description}
                </TypeP>
              )}
            </div>
          </div>

          {/* Traits and Royalties*/}
          {data?.traits && <NFTTraits traits={data?.traits?.traits} />}
          {data?.royalties && (
            <NFTRoyalties royalties={data?.royalties.cutInfos} />
          )}
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
      <TypeH3>Traits</TypeH3>
      <div
        className={
          "grid w-full grid-cols-1 gap-3 lg:grid-cols-4 2xl:grid-cols-6"
        }
      >
        {traits?.map((trait, i) => {
          const name = splitCase(trait.name);

          return (
            <div
              className={
                "flex w-full flex-col space-y-1 rounded-sm bg-gray-100 p-4 hover:bg-gray-200"
              }
              key={trait.name}
            >
              <div className={"flex flex-row items-center justify-between"}>
                <p className={"text-sm capitalize"}>{name}</p>
                <TagTrait rarity={trait.rarity} />
              </div>
              <p
                className={"truncate text-lg font-bold capitalize"}
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
      className={cn("text-xs capitalize", rarityColor(rarity?.description))}
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
      <TypeH3>Royalties</TypeH3>

      <div className={"flex w-full flex-col items-start justify-start gap-px"}>
        {royalties?.map((share: Share) => {
          const receiver = share?.receiver?.address;

          return (
            <div
              className={
                "flex w-full flex-row items-center justify-start gap-2 bg-gray-100 p-4"
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
