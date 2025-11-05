"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useState } from "react";
import useAccountResolver from "@/hooks/useAccountResolver";
import { TypeLabel } from "@/components/ui/typography";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { useTokenList, useTokenRegistry } from "@/hooks/useTokenList";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import Image from "next/image";
import { VaultBalance } from "@/components/ui/tags";
import { cn } from "@/lib/utils";
import CopyText from "@/components/flowscan/CopyText";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { SearchBar } from "@/components/flowscan/SearchBar";
import Select from "@/components/flowscan/Select";
import SimpleClientPagination from "@/components/flowscan/SimpleClientPagination";
import useQueryParams from "@/hooks/utils/useQueryParams";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TokensPageContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data: tokenRegistry, isPending: fetchingRegistry } =
    useTokenRegistry();
  const { data: list, isPending } = useTokenList(address);

  const { setQueryParams, getQueryParams } = useQueryParams();
  const [offset = "0", limit = "25", registryFilter = "All"] = getQueryParams([
    "offset",
    "limit",
    "registry",
  ]);

  const [filter, setFilter] = useState("");
  const [registryStatus, setRegistryStatus] = useState(registryFilter);

  const isLoading = isResolving || isPending || fetchingRegistry;

  const formatted =
    list?.map((item) => {
      const registryData = tokenRegistry
        ? (tokenRegistry as any).tokenByPath[item.path]
        : null;
      return {
        ...item,
        registryData,
      };
    }) || [];

  const filtered = formatted.filter((token) => {
    const name = token?.registryData?.name || "";
    const symbol = token?.registryData?.symbol || "";
    const displayName = name || symbol || token.path.split("/")[2];

    const matchesFilter =
      displayName.toLowerCase().includes(filter.toLowerCase()) ||
      token.path.toLowerCase().includes(filter.toLowerCase());

    let matchesRegistry = true;
    if (registryStatus === "Registered") {
      matchesRegistry = Boolean(token.registryData);
    } else if (registryStatus === "Unknown") {
      matchesRegistry = !Boolean(token.registryData);
    }

    return matchesFilter && matchesRegistry;
  });

  const items = filtered.slice(
    parseInt(offset),
    parseInt(offset) + parseInt(limit),
  );

  const haveItemsButHidden =
    filtered.length === 0 && Boolean(formatted) && formatted.length > 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <TypeLabel>Account Tokens:</TypeLabel>

      <div
        className={
          "flex w-full flex-row items-center justify-start gap-4 max-md:flex-wrap"
        }
      >
        <SearchBar
          value={filter}
          onChange={setFilter}
          placeholder={"Filter by name or path"}
        />
        <Select
          value={registryStatus}
          className={"min-w-[160px] max-md:grow"}
          initialValue={"All"}
          options={["All", "Registered", "Unknown"]}
          onChange={(val) => {
            setRegistryStatus(val);
            setQueryParams({ registry: val }, { push: false });
          }}
        />
      </div>

      {isLoading && (
        <LoadingBlock title={`Loading tokens for ${address}... `} />
      )}
      {haveItemsButHidden && (
        <p className={"text-md opacity-50"}>
          There are {formatted.length} tokens, but all of them are hidden. Try to
          relax filter criteria
        </p>
      )}
      {filtered.length > 0 && !isLoading && (
        <SimpleClientPagination totalItems={filtered.length} />
      )}
      {items.length > 0 && (
        <div className="fat-row-column flex flex-col gap-px">
          {items.map((token) => {
            return <SingleToken token={token} key={token.path} />;
          })}
        </div>
      )}
    </div>
  );
}

function SingleToken(props: { token: any }) {
  const { token } = props;

  const symbol = token?.registryData?.symbol || "";
  const name = token?.registryData?.name || "";
  const imageSrc = token?.registryData?.logoURI || "";
  const displayName = name || symbol || token.path.split("/")[2];
  const unknown = !(name || symbol);

  const previewImage = imageSrc ? (
    <Image
      src={imageSrc}
      alt={""}
      width={20}
      height={20}
      unoptimized
      className={"h-6 w-6 rounded-full flex-0"}
    />
  ) : (
    <div
      className={
        "flex h-full w-full flex-row flex-0 items-center justify-center bg-prism-level-2 text-prism-text-muted font-bold"
      }
    >
      ?
    </div>
  );

  return (
    <FatRow
      id={"token"}
      details={<SingleTokenDetails token={token} />}
      className={[]}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2 p-4">
        <div
          className={
            "flex w-full flex-col items-start justify-start gap-4 lg:items-center flex-row"
          }
        >
          <div
            className={
              "h-8 w-8 overflow-hidden rounded-full flex flex-col items-center justify-center"
            }
          >
            {previewImage}
          </div>

          <div
            className={cn(
              "flex flex-row flex-wrap items-start justify-start font-bold truncate w-full gap-2 lg:gap-4",
              unknown && "opacity-50 font-normal",
            )}
          >
            <span>{displayName}</span>
            {token?.registryData?.tags && (
              <div className={"flex flex-row flex-wrap gap-0 lg:gap-2"}>
                {token?.registryData?.tags.map((tag: string) => {
                  return (
                    <SimpleTag
                      label={tag}
                      className={"text-gray-500/75 text-xs"}
                    />
                  );
                })}
              </div>
            )}
          </div>
          <VaultBalance balance={token?.balance} symbol={symbol} />
        </div>
      </div>
    </FatRow>
  );
}

function SingleTokenDetails(props: any) {
  const { token } = props;
  const { network } = useParams();

  const networkPrefix = network === "testnet" ? "testnet." : "";
  const hasRegistryName = token?.registryData?.name;
  const hasSymbol = token?.registryData?.symbol;
  const contractId = `A.${token?.registryData?.address.slice(2)}.${token?.registryData?.contractName}`;
  const contractUrl = token?.registryData
    ? `https://${networkPrefix}flowscan.io/contract/${contractId}`
    : "";
  const publicPathReceiver = token.registryData?.path?.receiver;
  const publicPathBalance = token.registryData?.path?.balance;

  const imageSrc = token.registryData?.logoURI || "";

  return (
    <FatRowDetails>
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={""}
          width={20}
          height={20}
          unoptimized
          className={"h-12 w-12 rounded-full"}
        />
      )}
      {hasRegistryName && (
        <div className={"flex flex-row gap-2"}>
          <TypeLabel>Name:</TypeLabel>
          <span className={"text-sm font-bold"}>{token.registryData.name}</span>
        </div>
      )}

      {hasSymbol && (
        <div className={"flex flex-row gap-2"}>
          <TypeLabel>Symbol:</TypeLabel>
          <span className={"text-sm font-bold"}>
            {token.registryData.symbol}
          </span>
        </div>
      )}

      <hr className={"w-full border-gray-400/50 "} />
      <div className={"flex flex-row gap-2 items-center truncate w-full"}>
        <TypeLabel>Storage path:</TypeLabel>
        <span className={"text-sm font-bold truncate"}>{token.path}</span>
        <CopyText text={token.path} />
      </div>

      {publicPathBalance && (
        <div className={"flex flex-row gap-2 items-center truncate w-full"}>
          <TypeLabel>Balance path:</TypeLabel>
          <span className={"text-sm font-bold truncate"}>
            {publicPathBalance}
          </span>
          <CopyText text={publicPathBalance} />
        </div>
      )}

      {publicPathReceiver && (
        <div className={"flex flex-row gap-2 items-center truncate w-full"}>
          <TypeLabel>Receiver path:</TypeLabel>
          <span className={"text-sm font-bold truncate"}>
            {publicPathReceiver}
          </span>
          <CopyText text={publicPathReceiver} />
        </div>
      )}
      <hr className={"w-full border-gray-400/50 "} />

      {contractUrl && (
        <div className={"flex flex-row gap-2 items-center truncate w-full"}>
          <TypeLabel>Contract:</TypeLabel>
          <a
            href={contractUrl}
            target={"_blank"}
            className={"text-sm font-bold underline truncate"}
          >
            {contractUrl}
          </a>
        </div>
      )}
    </FatRowDetails>
  );
}
