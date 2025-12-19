/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { useParams } from "next/navigation";
import { Code, ExternalLink, Globe, Plus } from "lucide-react";

import { AnimatePresence, motion } from "motion/react";
import CodeBlock from "@/components/flowscan/CodeBlock";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import SimpleTag from "@/components/flowscan/SimpleTag";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useAccountDetails } from "@/hooks/useAccountDetails";
import { cn } from "@/lib/utils";
import { TypeLabel } from "@/components/ui/typography";
import { variants } from "@/lib/animate";
import CopyText from "@/components/flowscan/CopyText";
import { sansPrefix } from "@onflow/fcl";
import { useLoginContext } from "@/fetch/provider";
import useResolver from "@/hooks/useResolver";
import { buttonClasses, hoverClasses } from "@/components/ui/button";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountContractsContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isPending } = useAccountDetails(address);
  const haveData = !isPending && Boolean(data?.contracts);

  const contractList = Object.keys(data?.contracts || {});
  const haveContracts = haveData && contractList.length > 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      {(isPending || isResolving) && (
        <LoadingBlock
          className={"text-md"}
          title={"Loading account contracts"}
        />
      )}

      {!isResolving && !address && (
        <p className={"opacity-50"}>Unable to resolve account address.</p>
      )}

      <motion.div
        className={
          "fat-row-column flex w-full flex-col items-start justify-start gap-px"
        }
      >
        <AnimatePresence mode="popLayout">
          {haveContracts &&
            contractList.map((key) => {
              const code = data?.contracts[key];
              return (
                <motion.div
                  layout
                  variants={variants}
                  className={"w-full"}
                  exit={{ opacity: 0, height: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={key}
                >
                  <SingleContract
                    address={address || ""}
                    code={code || ""}
                    name={key}
                  />
                </motion.div>
              );
            })}
          {!haveContracts && !isPending && (
            <motion.div
              layout
              variants={variants}
              className={"w-full"}
              animate={{ opacity: 1, scale: 1 }}
              key={"no-contracts-to-show"}
            >
              <TypeLabel className={"opacity-50"}>
                This account does not have any contracts deployed to it's
                storage
              </TypeLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function DeployContractButton() {
  const { user } = useLoginContext();
  const { address } = useResolver();
  const { id, network } = useParams();

  const href = `/${network}/account/${id}/contracts/deploy`;

  const disabled = user.address !== address;
  const title = disabled
    ? "You can't modify the contract"
    : "Deploy new contract";

  return (
    <Link
      href={href}
      title={title}
      className={cn(
        buttonClasses,
        hoverClasses,
        "text-prism-primary border-prism-primary/30 flex items-center gap-1 px-3 py-2",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <span>Deploy contract</span>
      <Plus className={"h-3.5 w-3.5"} />
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SingleContract(props: {
  address: string;
  code: string;
  name: string;
}) {
  const { address, code, name } = props;
  const { network, id } = useParams();

  const numberOfLines = code?.split(/\r?\n/).length || 0;

  const contractName = `A.${address.slice(2)}.${name}`;

  /* TODO: Refactor out later
  const flowscanRoot =
    network === "mainnet"
      ? "https://flowscan.io"
      : "https://testnet.flowscan.io";
  const flowscanURL = `${flowscanRoot}/contract/${contractName}?tab=deployments`;
   */

  const contractUrl = `/${network}/account/${id}/contracts/${contractName}`;

  return (
    <FatRow
      id={"contract"}
      details={
        <SingleContractDetails code={code} address={address} name={name} />
      }
      className={[]}
      key={name}
    >
      <div
        className={cn(
          "relative flex w-full flex-col items-start justify-start gap-4 p-4",
          "md:gap-3 md:p-4",
        )}
      >
        <div className={"flex w-full flex-row justify-between gap-2"}>
          <Link key={name} href={contractUrl}>
            <SimpleTag
              title={`View ${name} contract`}
              className={"text-orange-400"}
              label={name}
              category={<Globe className={"h-3 w-3"} />}
            />
          </Link>
          <span>
            <SimpleTag
              title={`Lines of code: ${numberOfLines}`}
              label={numberOfLines}
              category={<Code className={"h-4 w-4"} />}
              className={
                "text-orange-400 opacity-50 hover:text-orange-400 hover:opacity-100"
              }
            />
          </span>
        </div>
      </div>
    </FatRow>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SingleContractDetails(props: any) {
  const { code, address, name } = props;
  const { network } = useParams();

  const contractId = `A.${sansPrefix(address)}.${name}`;
  const networkPrefix = network === "testnet." ? "testnet" : "";
  const flowscanLink = `https://${networkPrefix}flowscan.io/contract/${contractId}`;

  return (
    <FatRowDetails>
      <div className={"flex w-full flex-col gap-4"}>
        <div className="flex flex-col items-start justify-start gap-2 lg:flex-row lg:items-center">
          <TypeLabel className={"flex-none"}>Contract Id:</TypeLabel>
          <div className="flex w-full flex-row items-center gap-2">
            <span className="truncate text-sm font-bold">{contractId}</span>
            <CopyText text={contractId} />
          </div>
        </div>

        <div className="flex flex-col items-start justify-start gap-2 lg:flex-row lg:items-center">
          <TypeLabel className={"flex-none"}>External links:</TypeLabel>
          <div className="flex w-full flex-row items-center gap-2">
            <Link
              href={flowscanLink}
              className={
                "text-prism-primary flex flex-row items-center gap-1 underline"
              }
              target={"_blank"}
            >
              <span>
                <b>{name}</b> details on Flowscan
              </span>
              <ExternalLink className={"h-4 w-4"} />
            </Link>
          </div>
        </div>

        <CodeBlock code={code || ""} />
      </div>
    </FatRowDetails>
  );
}
