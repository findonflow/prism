/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { BadgeJapaneseYen, Blend, Bolt, Package, Plug } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import CopyText from "@/components/flowscan/CopyText";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { TypeLabel } from "@/components/ui/typography";

import useAccountResolver from "@/hooks/useAccountResolver";
import usePublicStorageList from "@/hooks/usePublicStorageList";

import { SearchBar } from "@/components/flowscan/SearchBar";
import Select from "@/components/flowscan/Select";
import { formatNumberToAccounting } from "@/lib/format";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorageContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
  );
  const address = resolved?.owner;

  const { data, isLoading } = usePublicStorageList(address);
  const [type, setType] = useState("All");
  const [refKind, setRefKind] = useState("All");

  const [filter, setFilter] = useState("");

  const filteredList =
    data?.filter((pp: FlowPublicPathInfo) => {
      let typeFilter = true;
      if (type === "Balance") {
        typeFilter = Boolean(pp.isBalanceCap);
      }
      if (type === "Collection") {
        typeFilter = Boolean(pp.isCollectionCap);
      }

      let refFilter = true;
      const cap = pp?.type?.type;
      const reference = cap?.type;
      const referenceKind = reference?.kind;

      if (refKind !== "All") {
        refFilter = referenceKind === refKind;
      }

      return (
        refFilter &&
        typeFilter &&
        pp.path?.toLowerCase().includes(filter.toLowerCase())
      );
    }) || [];

  const haveItemsBuHidden =
    filteredList.length === 0 && Boolean(data) && data!.length > 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <TypeLabel>Account Public Storage:</TypeLabel>
      <div
        className={
          "flex w-full flex-row max-md:flex-wrap items-center justify-start gap-4"
        }
      >
        <SearchBar
          value={filter}
          onChange={setFilter}
          placeholder={"Filter by path"}
        />
        <Select
          value={type}
          className={"min-w-[160px] max-md:grow"}
          initialValue={"All"}
          options={["All", "Balance", "Collection"]}
          onChange={setType}
        />
        <Select
          className={"min-w-[160px] max-md:grow"}
          initialValue={"All"}
          options={["All", "Resource", "Intersection"]}
          onChange={setRefKind}
        />
      </div>

      {isLoading && (
        <LoadingBlock title={`Loading ${address} public items... `} />
      )}
      {haveItemsBuHidden && (
        <p className={"text-md opacity-50"}>
          There are {data?.length} items, but all of them are hidden. Try to
          relax filter criteria
        </p>
      )}

      {filteredList.length > 0 && (
        <motion.div
          className={
            "fat-row-column flex w-full flex-col items-start justify-start gap-px"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredList?.map((capability) => {
              return (
                <PublicCapability
                  address={address}
                  capability={capability}
                  key={capability.path}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function PublicCapability(props: {
  capability: FlowPublicPathInfo;
  address?: string | null;
}) {
  const { capability, address } = props;

  const cap = capability?.type?.type;
  // const capabilityKind = cap?.kind;
  const reference = cap?.type;
  const referenceKind = reference?.kind;
  const title = `Reference Kind: ${referenceKind}`;

  return (
    <FatRow
      key={capability.path}
      id={capability.path}
      details={
        <PublicCapabilityDetails
          capability={capability}
          address={address || ""}
          key={capability.path}
        />
      }
      className={[]}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2 p-4">
        <div
          className={
            "flex flex-row items-center justify-start gap-2 flex-wrap truncate"
          }
        >
          <SimpleTag
            label={"public"}
            category={<Plug className={"h-4 w-4"} />}
            className={"text-gray-800"}
          />

          {referenceKind === "Intersection" && (
            <SimpleTag label={<Blend className={"h-4 w-4"} />} title={title} />
          )}

          {referenceKind === "Resource" && (
            <SimpleTag
              label={<Bolt className={"h-4 w-4"} />}
              title={title}
              className={"text-green-600"}
            />
          )}

          {capability.isCollectionCap && (
            <SimpleTag
              label={"Collection"}
              category={<Package className={"h-4 w-4"} />}
              className={"text-blue-500"}
            />
          )}

          {capability.isBalanceCap && (
            <SimpleTag
              label={"Balance"}
              category={<BadgeJapaneseYen className={"h-4 w-4"} />}
              className={"text-green-600"}
            />
          )}
          <p className={"text-sm truncate font-bold"}>{capability.path}</p>
        </div>

        {capability.isBalanceCap && (
          <div
            className={cn(
              "flex flex-row items-center justify-end gap-1",
              Number(capability?.balance) === 0
                ? "text-grey-200/10"
                : "text-green-600"
            )}
          >
            <BadgeJapaneseYen className={"h-4 w-4"} />
            <b className={"text-md"}>
              {formatNumberToAccounting(Number(capability?.balance), 4, 2)}
            </b>
          </div>
        )}

        {capability.isCollectionCap && (
          <div
            className={cn(
              "flex flex-row items-center justify-end gap-1",
              capability?.tokenIDs?.length === 0
                ? "text-grey-200/10"
                : "text-blue-500"
            )}
          >
            <Package className={"h-4 w-4"} />
            <b className={"text-copy"}>{capability?.tokenIDs?.length}</b>
          </div>
        )}
      </div>
    </FatRow>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function PublicCapabilityDetails(props: {
  address: string;
  capability: FlowPublicPathInfo;
}) {
  const { capability } = props;

  const item = capability;

  const cap = item?.type?.type;
  const capabilityKind = cap?.kind;
  const reference = cap?.type;
  const referenceKind = reference?.kind;

  return (
    <FatRowDetails>
      <div className={"flex w-full flex-col gap-2"}>
        {Boolean(item) && (
          <>
            {/* Type Details*/}
            {item?.type && (
              <div className={"flex w-full flex-col gap-2"}>
                <div
                  className={"flex flex-row items-center justify-start gap-2"}
                >
                  <TypeLabel>Path:</TypeLabel>
                  <div className={"flex flex-row gap-2"}>
                    <span className={"text-sm font-bold"}>
                      {capability.path}
                    </span>
                    <CopyText text={capability.path} />
                  </div>
                </div>

                <div
                  className={"flex flex-row items-center justify-start gap-2"}
                >
                  <TypeLabel>Authorization:</TypeLabel>
                  <span className={"text-sm font-bold"}>
                    {cap.authorization.kind}
                  </span>
                </div>

                <div
                  className={"flex flex-row items-center justify-start gap-2"}
                >
                  <TypeLabel>Kind:</TypeLabel>
                  <span className={"text-sm font-bold"}>{capabilityKind}</span>
                </div>

                <div
                  className={"flex flex-row items-center justify-start gap-2"}
                >
                  <TypeLabel>Reference kind:</TypeLabel>
                  <span className={"text-sm font-bold"}>{referenceKind}</span>
                </div>

                {reference && (
                  <div className={"bg-gray-400/30 p-4"}>
                    <div
                      className={
                        "flex w-full flex-col items-start justify-start gap-4"
                      }
                    >
                      <div
                        className={
                          "flex w-full flex-row items-center gap-2 text-copy"
                        }
                      >
                        <TypeLabel>Reference type ID:</TypeLabel>
                        <div className={"truncate"}>{reference.typeID}</div>
                        <CopyText
                          text={reference.typeID}
                          title={"Copy reference type id"}
                        />
                      </div>

                      {reference.types && (
                        <div className={"flex flex-col gap-2"}>
                          {reference.types?.map((type: any) => {
                            return (
                              <div
                                className={
                                  "flex flex-row items-center justify-start gap-2 text-sm font-bold"
                                }
                                key={type.typeID}
                              >
                                <SimpleTag label={type.kind} />
                                <div>{type.typeID}</div>
                                <CopyText
                                  text={type.typeID}
                                  className={"h-3 w-3"}
                                  title={"Copy type id"}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {!Boolean(item?.type) && (
          <div className={"text-copy text-gray-400"}>
            Could not retrieve extra data for this capability
          </div>
        )}
      </div>
    </FatRowDetails>
  );
}
