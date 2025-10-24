"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import CopyText from "@/components/flowscan/CopyText";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { TypeLabel } from "@/components/ui/typography";
import useAccountResolver from "@/hooks/useAccountResolver";
import useStoredItems from "@/hooks/useStoredItems";
import useStoredResource from "@/hooks/useStoredResource";
import { cn } from "@/lib/utils";
import { BadgeJapaneseYen, Bolt, Database, Package, Plug } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import JsonView from "react18-json-view";

import { SearchBar } from "@/components/flowscan/SearchBar";
import Select from "@/components/flowscan/Select";
import "@/components/ui/json-view/style.css";
import { NumberOfItems } from "@/components/ui/tags";
import { formatNumberToAccounting } from "@/lib/format";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountStoredItemsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string
  );
  const address = resolved?.owner;

  const { data, isPending } = useStoredItems(address);
  const [type, setType] = useState("All");
  const [refKind, setRefKind] = useState("All");

  const [filter, setFilter] = useState("");

  useEffect(() => {
    setRefKind("All");
  }, [type]);

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

      console.log("filtering", referenceKind);

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

  const isLoading = isPending;

  const haveItemsBuHidden =
    filteredList.length === 0 && Boolean(data) && data!.length > 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <TypeLabel>Account Stored Items:</TypeLabel>

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
                .map((item) => item.type.kind)
            ),
          ]}
          onChange={setRefKind}
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

      {filteredList.length > 0 && (
        <motion.div
          className={
            "fat-row-column flex w-full flex-col items-start justify-start gap-px"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredList?.map((storageInfo) => {
              return (
                <StorageInfo
                  address={address}
                  storageInfo={storageInfo}
                  key={storageInfo.path}
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
function StorageInfo(props: {
  storageInfo: FlowStorageInfo;
  address?: string | null;
}) {
  const { storageInfo, address } = props;

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
            "flex flex-row items-center justify-start gap-2 flex-wrap truncate"
          }
        >
          <SimpleTag
            label={"storage"}
            category={<Database className={"h-4 w-4"} />}
            className={"text-gray-800"}
          />

          {storageInfo.isResource && (
            <SimpleTag
              label={<Bolt className={"h-4 w-4"} />}
              title={"Resource"}
              className={"text-gray-500"}
            />
          )}

          {storageInfo.isVault && (
            <SimpleTag
              title={"Vault"}
              label={<BadgeJapaneseYen className={"h-4 w-4"} />}
              className={"text-green-600"}
            />
          )}

          {storageInfo.type.kind === "Capability" && (
            <SimpleTag
              title={"Capability"}
              label={<Plug className={"h-4 w-4"} />}
              className={"text-gray-800"}
            />
          )}

          {storageInfo.isNFTCollection && (
            <SimpleTag
              label={"Collection"}
              category={<Package className={"h-4 w-4"} />}
              className={"text-blue-500"}
            />
          )}

          <p className={"text-sm truncate font-bold"}>{storageInfo.path}</p>
        </div>

        <div>
          {storageInfo.isNFTCollection && (
            <NumberOfItems items={storageInfo?.tokenIDs?.length} />
          )}

          {storageInfo.isVault && (
            <div
              className={cn(
                "flex flex-row items-center justify-end gap-1",
                Number(storageInfo?.balance) === 0
                  ? "text-grey-200/10"
                  : "text-green-600"
              )}
            >
              <BadgeJapaneseYen className={"h-4 w-4"} />
              <b className={"text-md"}>
                {formatNumberToAccounting(Number(storageInfo?.balance), 4, 2)}
              </b>
            </div>
          )}
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
            "flex flex-row items-center justify-start gap-2 truncate flex-wrap"
          }
        >
          <TypeLabel>Path:</TypeLabel>
          <div className={"flex flex-row gap-2 flex-wrap w-full"}>
            <span className={"text-sm font-bold truncate"}>
              {storageInfo.path}
            </span>
            <CopyText text={storageInfo.path} />
          </div>
        </div>

        <div
          className={
            "flex flex-row items-center justify-start gap-2 truncate flex-wrap"
          }
        >
          <TypeLabel>Type Kind:</TypeLabel>
          <div className={"flex flex-row gap-2 flex-wrap"}>
            <span className={"text-sm font-bold"}>{storageInfo.type.kind}</span>
          </div>
        </div>

        <div
          className={
            "flex flex-row items-center justify-start gap-2 truncate flex-wrap"
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

  console.log("resource data", { data });

  return (
    <div className={"flex flex-col items-start justify-start gap-2"}>
      {isPending && <LoadingBlock title={`Loading resource data... `} />}
      {!isPending && data && (
        <div className={"flex flex-col items-start justify-start gap-2 w-full"}>
          <TypeLabel>Resource Details:</TypeLabel>
          <div className={"bg-gray-400/30 p-4 w-full"}>
            <JsonView src={data} displaySize={"collapsed"} />
          </div>
        </div>
      )}
    </div>
  );
}
