"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useAccountDetails } from "@/hooks/useAccountDetails";
import { useState } from "react";
import KeyRow from "@/components/flowscan/rows/KeyRow";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { AnimatePresence, motion } from "motion/react";
import { variants } from "@/lib/animate";
import { TypeLabel } from "@/components/ui/typography";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountKeysContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isLoading } = useAccountDetails(address);

  const keys =
    data?.keys.map((key) => {
      return {
        hashAlgorithm: key.hashAlgoString,
        index: key.index.toString(),
        key: key.publicKey,
        revoked: key.revoked,
        signatureAlgorithm: key.signAlgoString,
        weight: key.weight,
        sequenceNumber: key.sequenceNumber,
      };
    }) || ([] as Array<FlowKeyFormatted>);

  const [filter, setFilter] = useState("");
  const [showRevoked, setShowRevoked] = useState(true);

  const filteredList = keys.filter((key) => {
    const matchesFilter = key.key?.toLowerCase().includes(filter.toLowerCase());
    const matchesRevokeFilter = !key.revoked || showRevoked;
    return matchesFilter && matchesRevokeFilter;
  });

  const dataReady = !isLoading && Boolean(data);
  const noKeysToShow = filteredList.length === 0;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      {isLoading && <LoadingBlock title={"Loading account keys "} />}
      {dataReady && (
        <>
          <div className={"flex flex-row justify-between gap-4"}>
            <input
              className={"border-1 border-gray-300 p-2 px-3 w-full round-md"}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={"Enter query to filter keys"}
            />
            <label
              className={
                "flex select-none flex-row items-center gap-1 whitespace-nowrap text-colors-white"
              }
            >
              <input
                type={"checkbox"}
                checked={showRevoked}
                onChange={(e) => setShowRevoked(e.target.checked)}
              />
              Show revoked
            </label>
          </div>

          <motion.div
            className={"flex flex-col gap-px items-start justify-start"}
          >
            <AnimatePresence mode="popLayout">
              {filteredList.map((key) => (
                <motion.div
                  layout
                  variants={variants}
                  className={"w-full"}
                  exit={{ opacity: 0, height: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`key-${key.key}`}
                >
                  <KeyRow keyInfo={key} />
                </motion.div>
              ))}
              {noKeysToShow && (
                <motion.div
                  layout
                  variants={variants}
                  className={"w-full"}
                  animate={{ opacity: 1, scale: 1 }}
                  key={"no-keys-to-show"}
                >
                  <TypeLabel className={"opacity-50"}>
                    No keys to show.
                  </TypeLabel>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}
