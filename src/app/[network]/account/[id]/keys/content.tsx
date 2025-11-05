"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import { useState } from "react";

import KeyRow from "@/components/flowscan/rows/KeyRow";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeLabel } from "@/components/ui/typography";
import { Checkbox } from "@/components/ui/checkbox";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useAccountDetails } from "@/hooks/useAccountDetails";
import { variants } from "@/lib/animate";
import { SearchBar } from "@/components/flowscan/SearchBar";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountKeysContent() {
  const { id } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data, isLoading } = useAccountDetails(address);

  const keys =
    data?.keys.map((key: FlowKey): FlowKeyFormatted => {
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
      <TypeLabel>Account Keys:</TypeLabel>
      {isLoading && <LoadingBlock title={"Loading account keys "} />}
      {dataReady && (
        <>
          <div className={"flex flex-row items-center justify-between gap-4"}>
            <SearchBar
              value={filter}
              onChange={setFilter}
              placeholder={"Enter query to filter keys"}
              className={"min-h-[40px]"}
            />
            <Checkbox
              label="Show revoked"
              checked={showRevoked}
              onChange={(e) => setShowRevoked(e.target.checked)}
            />
          </div>

          <motion.div
            className={"flex flex-col items-start justify-start gap-px"}
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
