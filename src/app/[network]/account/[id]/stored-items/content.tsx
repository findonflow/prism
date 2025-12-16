"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { BadgeJapaneseYen, Bolt, Database, Package, Plug } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import JsonView from "react18-json-view";

import CopyText from "@/components/flowscan/CopyText";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { SearchBar } from "@/components/flowscan/SearchBar";
import Select from "@/components/flowscan/Select";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { NumberOfItems, VaultBalance } from "@/components/ui/tags";
import { TypeLabel } from "@/components/ui/typography";
import useAccountResolver from "@/hooks/useAccountResolver";
import useStoredItems from "@/hooks/useStoredItems";
import useStoredResource from "@/hooks/useStoredResource";

import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import useQueryParams from "@/hooks/utils/useQueryParams";
import { useTokenRegistry } from "@/hooks/useTokenList";
import { cn } from "@/lib/utils";
import { variants } from "@/lib/animate";
import "@/components/ui/json-view/style.css";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountStoredItemsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data: tokenRegistry, isPending: fetchingRegistry } =
    useTokenRegistry();

  const tokenRegistryMap = tokenRegistry
    ? (tokenRegistry as any).tokenByPath
    : {};

  const { data, isPending } = useStoredItems(address);

  const [filter, setFilter] = useState("");

  const { setQueryParams, getQueryParams } = useQueryParams();
  const [offset = "0", limit = "25", typeParam = "All", refKindParam = "All"] =
    getQueryParams(["offset", "limit", "type", "refKind"]);

  const [type, setType] = useState(typeParam);
  const [refKind, setRefKind] = useState(refKindParam);

  const filteredList =
    data?.filter((storageInfo: FlowStorageInfo) => {
      let typeFilter = true;
      if (type === "Balance") {
        typeFilter = Boolean(storageInfo.balance);
      }
      if (type === "Collection") {
        typeFilter = Boolean(storageInfo.isNFTCollection);
      }

      let refFilter = true;
      const reference = storageInfo?.type;
      const referenceKind = reference?.kind;

      if (refKind !== "All") {
        refFilter = referenceKind === refKind;
      }

      let nftCollectionFilter = true;

      let vaultFilter = true;

      return (
        refFilter &&
        typeFilter &&
        nftCollectionFilter &&
        vaultFilter &&
        storageInfo.path?.toLowerCase().includes(filter.toLowerCase())
      );
    }) || [];

  const itemsList = filteredList?.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit),
  );

  const isLoading = isPending;

  const haveItemsBuHidden =
    filteredList.length === 0 && Boolean(data) && data!.length > 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
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
            setQueryParams(
              { type: val, refKind: false, limit: false, offset: false },
              { push: false },
            );
            setRefKind("All");
          }}
        />

        <Select
          className={"min-w-[160px] max-md:grow"}
          initialValue={"All"}
          value={refKind}
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
                    typeFilter = Boolean(storageInfo.isNFTCollection);
                  }
                  return typeFilter;
                })
                .map((item) => item.type.kind),
            ),
          ]}
          onChange={(val) => {
            setRefKind(val);
            setQueryParams({ refKind: val }, { push: false });
          }}
        />
      </div>

      {isLoading && (
        <LoadingBlock title={`Loading ${address} stored items... `} />
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
          {itemsList?.map((storageInfo) => {
            return (
              <motion.div
                layout
                variants={variants}
                className={"w-full"}
                exit={{ opacity: 0, height: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                key={storageInfo.path}
              >
                <StorageInfo
                  address={address}
                  storageInfo={storageInfo}
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
              <TypeLabel className={"opacity-50"}>No items to show.</TypeLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function StorageInfo(props: {
  storageInfo: FlowStorageInfo;
  address?: string | null;
  tokenRegistryMap?: Record<any, any>;
}) {
  const { storageInfo, address, tokenRegistryMap } = props;
  const token = tokenRegistryMap ? tokenRegistryMap?.[storageInfo.path] : null;

  return (
    <FatRow
      id={storageInfo.path}
      details={
        <StorageInfoDetails storageInfo={storageInfo} address={address} />
      }
      className={[]}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2 p-4">
        <div
          className={
            "flex flex-row flex-wrap items-center justify-start gap-2 truncate"
          }
        >
          <SimpleTag
            label={"storage"}
            category={<Database className={"h-4 w-4"} />}
            className={"text-xs text-gray-400"}
          />

          {storageInfo.isResource && (
            <SimpleTag
              label={<Bolt className={"h-4 w-4"} />}
              title={"Resource"}
              className={"text-violet-400"}
            />
          )}

          {storageInfo.isVault && (
            <SimpleTag
              title={"Vault"}
              label={<BadgeJapaneseYen className={"h-4 w-4"} />}
              className={"text-prism-primary"}
            />
          )}

          {storageInfo.type.kind === "Capability" && (
            <SimpleTag
              title={"Capability"}
              label={<Plug className={"h-4 w-4"} />}
              className={"text-purple-400"}
            />
          )}

          {storageInfo.isNFTCollection && (
            <SimpleTag
              label={"Collection"}
              category={<Package className={"h-4 w-4"} />}
              className={"text-blue-500"}
            />
          )}

          <p className={"truncate text-sm font-bold"}>{storageInfo.path}</p>
        </div>

        <div>
          {storageInfo.isNFTCollection && (
            <NumberOfItems items={storageInfo?.tokenIDs?.length} />
          )}

          <div className="flex items-center justify-between">
            {storageInfo.isVault && (
              <>
                {token && (
                  <img
                    src={token?.logoURI || "/"}
                    title={token?.name || storageInfo?.path.split("/").pop()}
                    onError={(e) => {
                      const errorReplacementDiv =
                        document?.createElement("div");
                      errorReplacementDiv.className = cn(
                        "flex items-center justify-center text-primary rounded-full aspect-square font-bold text-accent capitalize bg-prism-level-3",
                        "h-5 w-5 p-2",
                      );
                      errorReplacementDiv.innerText =
                        token?.name.split("")[0] ||
                        storageInfo?.path.split("/").pop()?.split("")[0] ||
                        "T";
                      e.currentTarget.parentNode?.replaceChild(
                        errorReplacementDiv,
                        e.currentTarget,
                      );
                    }}
                    alt={"token"}
                    className={"h-4 w-4"}
                  />
                )}
                <VaultBalance balance={storageInfo?.balance} />
              </>
            )}
          </div>
        </div>
      </div>
    </FatRow>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function StorageInfoDetails(props: {
  storageInfo: FlowStorageInfo;
  address?: string | null;
}) {
  const { storageInfo, address } = props;

  let imageSrc = storageInfo.display?.squareImage?.file.url;
  if (!imageSrc) {
    const cid = storageInfo.display?.squareImage.file.cid;
    if (cid) {
      imageSrc = `https://ipfs.io/ipfs/${cid}`;
    }
  }

  return (
    <FatRowDetails>
      <div className={"flex w-full flex-col gap-2"}>
        {storageInfo.display && (
          <div className={"flex flex-col items-start justify-start gap-2"}>
            {imageSrc && (
              <Image
                src={imageSrc}
                alt={"Collection image"}
                width={100}
                height={100}
                className={"aspect-square w-16"}
                unoptimized
              />
            )}
            <div className={"flex flex-row gap-2"}>
              <TypeLabel>Name:</TypeLabel>
              <span className={"text-sm font-bold"}>
                {storageInfo.display.name}
              </span>
            </div>
          </div>
        )}
        <div
          className={
            "flex flex-row flex-wrap items-center justify-start gap-2 truncate"
          }
        >
          <TypeLabel>Path:</TypeLabel>
          <div className={"flex w-full flex-row flex-wrap gap-2"}>
            <span className={"truncate text-sm font-bold"}>
              {storageInfo.path}
            </span>
            <CopyText text={storageInfo.path} />
          </div>
        </div>

        <div
          className={
            "flex flex-row flex-wrap items-center justify-start gap-2 truncate"
          }
        >
          <TypeLabel>Type Kind:</TypeLabel>
          <div className={"flex flex-row flex-wrap gap-2"}>
            <span className={"text-sm font-bold"}>{storageInfo.type.kind}</span>
          </div>
        </div>

        <div
          className={
            "flex flex-row flex-wrap items-center justify-start gap-2 truncate"
          }
        >
          <TypeLabel>Type ID:</TypeLabel>
          <div className={"flex flex-row gap-2"}>
            <span className={"text-sm font-bold"}>
              {storageInfo.type.typeID}
            </span>
            <CopyText text={storageInfo.type.typeID} />
          </div>
        </div>

        <StorageInfoResourceDetails path={storageInfo.path} address={address} />
      </div>
    </FatRowDetails>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function StorageInfoResourceDetails(props: {
  path: string;
  address?: string | null;
}) {
  const { path, address } = props;
  const { data, isPending } = useStoredResource(address, path);


  return (
    <div className={"flex flex-col items-start justify-start gap-2"}>
      {isPending && <LoadingBlock title={`Loading resource data... `} />}
      {!isPending && data && (
        <div className={"flex w-full flex-col items-start justify-start gap-2"}>
          <TypeLabel>Resource Details:</TypeLabel>
          <div className={"bg-prism-level-2 w-full p-4"}>
            <JsonView src={data} displaySize={"collapsed"} />
          </div>
        </div>
      )}
    </div>
  );
}
