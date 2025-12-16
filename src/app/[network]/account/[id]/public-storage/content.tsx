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
import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import useQueryParams from "@/hooks/utils/useQueryParams";
import { formatNumberToAccounting } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useTokenRegistry } from "@/hooks/useTokenList";
import FlowIcon from "@/components/ui/icons";
import { variants } from "@/lib/animate";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorageContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isLoading } = usePublicStorageList(address);

  const [filter, setFilter] = useState("");

  const { setQueryParams, getQueryParams } = useQueryParams();
  const [offset = "0", limit = "25", typeParam = "All", refKindParam = "All"] =
    getQueryParams(["offset", "limit", "type", "refKind"]);

  const [type, setType] = useState(typeParam);
  const [refKind, setRefKind] = useState(refKindParam);
  const { data: tokenRegistry, isPending: fetchingRegistry } =
    useTokenRegistry();

  const tokenRegistryMap = tokenRegistry
    ? (tokenRegistry as any).tokens.reduce(
        (acc: Record<any, any>, item: any) => {
          acc[item.path.balance] = item;
          return acc;
        },
        {},
      )
    : {};

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

  const itemsList = filteredList?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit),
  );
  const haveItemsBuHidden =
    filteredList.length === 0 && Boolean(data) && data!.length > 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <TypeLabel>Account Public Storage:</TypeLabel>
      <div
        className={
          "flex w-full flex-row items-center justify-start gap-4 max-md:flex-wrap"
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
          onChange={(val) => {
            setType(val);
            setQueryParams({ type: val, refKind: false }, { push: false });
            setRefKind("All");
          }}
        />
        <Select
          className={"min-w-[160px] max-md:grow"}
          value={refKind}
          initialValue={"All"}
          options={[
            "All",
            ...new Set(
              data
                ?.filter((storageInfo) => {
                  let typeFilter = true;
                  if (type === "Balance") {
                    typeFilter = Boolean(storageInfo.balance);
                  }
                  if (type === "Collection") {
                    typeFilter = Boolean(storageInfo.isCollectionCap);
                  }
                  return typeFilter;
                })
                .map((item) => item.type?.type.type.kind)
                .filter(Boolean),
            ),
          ]}
          onChange={(val) => {
            setRefKind(val);
            setQueryParams({ refKind: val }, { push: false });
          }}
        />
      </div>

      {(isLoading || fetchingRegistry) && (
        <LoadingBlock title={`Loading ${address} public items... `} />
      )}
      {haveItemsBuHidden && (
        <p className={"text-md opacity-50"}>
          There are {data?.length} items, but all of them are hidden. Try to
          relax filter criteria
        </p>
      )}

      {filteredList && !isLoading && (
        <SimpleClientPagination totalItems={filteredList?.length} />
      )}

      <motion.div
        className={
          "fat-row-column flex w-full flex-col items-start justify-start gap-px"
        }
      >
        <AnimatePresence mode="popLayout">
          {itemsList?.map((capability) => {
            return (
              <motion.div
                layout
                variants={variants}
                className={"w-full"}
                exit={{ opacity: 0, height: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                key={capability.path}
              >
                <PublicCapability
                  address={address}
                  capability={capability}
                  tokenRegistryMap={tokenRegistryMap}
                />
              </motion.div>
            );
          })}
          {itemsList.length === 0 && !isLoading && (
            <motion.div
              layout
              variants={variants}
              className={"w-full"}
              animate={{ opacity: 1, scale: 1 }}
              key={"no-items-to-show"}
            >
              <TypeLabel className={"opacity-50"}>
                No items to show.
              </TypeLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function PublicCapability(props: {
  capability: FlowPublicPathInfo;
  address?: string | null;
  tokenRegistryMap?: any;
}) {
  const { capability, address, tokenRegistryMap } = props;
  const token = tokenRegistryMap ? tokenRegistryMap?.[capability.path] : null;

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
      <div
        className={cn(
          "flex w-full flex-col items-start justify-between gap-2 p-4",
          "md:flex-row md:items-center",
        )}
      >
        <div
          className={
            "flex flex-row flex-wrap items-center justify-start gap-2 truncate"
          }
        >
          <SimpleTag
            label={"public"}
            category={<Plug className={"h-4 w-4"} />}
            className={"hidden text-xs text-gray-400 md:flex"}
          />

          {referenceKind === "Intersection" && (
            <SimpleTag label={<Blend className={"h-4 w-4"} />} title={title} className={"text-pink-400"} />
          )}

          {referenceKind === "Resource" && (
            <SimpleTag
              label={<Bolt className={"h-4 w-4"} />}
              title={title}
              className={"text-violet-400 text-xs"}
            />
          )}

          {capability.isCollectionCap && (
            <SimpleTag
              label={"Collection"}
              category={<Package className={"h-4 w-4"} />}
              className={"tex-xs text-blue-500"}
            />
          )}

          {capability.isBalanceCap && (
            <SimpleTag
              label={"Balance"}
              category={<BadgeJapaneseYen className={"h-4 w-4"} />}
              className={"text-prism-primary text-xs"}
            />
          )}
          <p className={"truncate text-sm font-bold"}>{capability.path}</p>
        </div>

        {capability.isBalanceCap && (
          <div
            className={cn(
              "flex flex-row items-center justify-end gap-1",
              Number(capability?.balance) === 0
                ? "text-grey-200/10"
                : "text-prism-primary",
            )}
          >
            {token &&
              (token.name === "Flow" ? (
                <FlowIcon className={"h-4 w-4"} />
              ) : (
                <img
                  src={token?.logoURI || "/"}
                  title={token?.name || capability?.path.split("/").pop()}
                  onError={(e) => {
                    const errorReplacementDiv = document?.createElement("div");
                    errorReplacementDiv.className = cn(
                      "flex items-center justify-center text-primary rounded-full aspect-square font-bold text-accent capitalize bg-prism-level-3",
                      "h-5 w-5 p-2",
                    );
                    errorReplacementDiv.innerText =
                      token?.name.split("")[0] ||
                      capability?.path.split("/").pop()?.split("")[0] ||
                      "T";
                    e.currentTarget.parentNode?.replaceChild(
                      errorReplacementDiv,
                      e.currentTarget,
                    );
                  }}
                  alt={"token"}
                  className={"h-4 w-4"}
                />
              ))}
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
                : "text-blue-500",
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
                  <div className={"bg-prism-level-2 p-4"}>
                    <div
                      className={
                        "flex w-full flex-col items-start justify-start gap-4"
                      }
                    >
                      <div
                        className={
                          "text-copy flex w-full flex-row items-center gap-2"
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
