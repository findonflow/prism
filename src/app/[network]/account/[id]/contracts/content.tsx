/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { Code, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import CodeBlock from "@/components/flowscan/CodeBlock";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import JumpingDots from "@/components/flowscan/JumpingDots";
import SimpleTag from "@/components/flowscan/SimpleTag";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useAccountDetails } from "@/hooks/useAccountDetails";
import { cn } from "@/lib/utils";
import { TypeLabel } from "@/components/ui/typography";
import { variants } from "@/lib/animate";

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
      <TypeLabel>Account Contracts:</TypeLabel>
      {isPending || (isResolving && <JumpingDots />)}

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
                This account does not have any contracts deployed to it's storage
              </TypeLabel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SingleContract(props: {
  address: string;
  code: string;
  name: string;
}) {
  const { address, code, name } = props;
  const { network } = useParams();

  const numberOfLines = code?.split(/\r?\n/).length || 0;

  const flowscanRoot =
    network === "mainnet"
      ? "https://flowscan.io"
      : "https://testnet.flowscan.io";
  const flowscanURL = `${flowscanRoot}/contract/A.${address.slice(2)}.${name}?tab=deployments`;

  return (
    <FatRow
      id={"contract"}
      details={<SingleContractDetails code={code} />}
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
          <a key={name} href={flowscanURL}>
            <SimpleTag
              title={`View ${name} contract on Flowscan`}
              className={"text-orange-400"}
              label={name}
              category={<Globe className={"h-3 w-3"} />}
            />
          </a>
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
  const { code } = props;
  return (
    <FatRowDetails>
      <div className={"flex w-full flex-col gap-4"}>
        <CodeBlock code={code || ""} />
      </div>
    </FatRowDetails>
  );
}
