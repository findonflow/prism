"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useState } from "react";
import { useParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeLabel } from "@/components/ui/typography";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import CopyText from "@/components/flowscan/CopyText";
import { SearchBar } from "@/components/flowscan/SearchBar";
import Select from "@/components/flowscan/Select";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { variants } from "@/lib/animate";
import ItemIndex from "@/components/ui/item-index";
import { cn } from "@/lib/utils";
import JsonView from "react18-json-view";
import "@/components/ui/json-view/style.css";

/*--------------------------------------------------------------------------------------------------------------------*/
function extractContractName(eventType: string): string {
  const parts = eventType.split(".");
  if (parts.length >= 3) {
    return parts[2];
  }
  return eventType;
}

/*--------------------------------------------------------------------------------------------------------------------*/
function extractEventName(eventType: string): string {
  return eventType.split(".").pop() || eventType;
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SingleEvent(props: { event: any; index: number }) {
  const { event, index } = props;
  const contractName = extractContractName(event.type);
  const eventName = event.type.split(".").pop();

  return (
    <FatRow
      id={`event-${index}`}
      details={<EventDetails event={event} />}
      className={[]}
    >
      <div className="flex w-full flex-col items-start justify-start gap-2 p-4 md:flex-row md:items-center md:justify-between">
        <div
          className={cn(
            "text-copy text-colors-gray-medium flex w-full flex-row items-center justify-start gap-4 overflow-hidden",
            "md:gap-4 @md/page:flex-row",
          )}
        >
          <ItemIndex index={index} />
          <div className="flex flex-col gap-1 w-full truncate">
            <span className="truncate text-sm font-bold">{event.type}</span>
            <span className="text-prism-text-muted text-xs">
              Contract: {contractName}
            </span>
          </div>
        </div>
      </div>
    </FatRow>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function EventDetails(props: { event: any }) {
  const { event } = props;
  const contractName = extractContractName(event.type);

  return (
    <FatRowDetails>
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-row items-center justify-start gap-2">
          <TypeLabel>Contract:</TypeLabel>
          <span className="text-sm font-bold">{contractName}</span>
        </div>

        <div className="items-start flex flex-col justify-start gap-2">
          <TypeLabel>Event Type:</TypeLabel>
          <div className="flex w-full flex-row items-center gap-2">
            <span className="text-sm font-bold truncate">{event.type}</span>
            <CopyText text={event.type} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <TypeLabel>Event Data:</TypeLabel>
          <div className="bg-prism-level-2 flex flex-col gap-2 p-4 overflow-x-auto">
            <JsonView src={event.data} displaySize={"collapsed"}/>
          </div>
        </div>
      </div>
    </FatRowDetails>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionEvents() {
  const { hash } = useParams();
  const { data, isLoading } = useTransactionDetails(hash as string);

  const [filter, setFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("All");

  const events = data?.events || [];

  const contracts = Array.from(
    new Set<string>(
      events.map((event: { type: string }) => extractContractName(event.type)),
    ).values(),
  );
  const uniqueContracts: Array<string> = ["All", ...contracts];

  const filteredEvents = events.filter((event: any) => {
    const contractName = extractContractName(event.type);
    const eventName = extractEventName(event.type);
    const fullType = event.type;

    const matchesContract =
      contractFilter === "All" || contractName === contractFilter;
    const matchesSearch =
      filter === "" ||
      contractName.toLowerCase().includes(filter.toLowerCase()) ||
      eventName.toLowerCase().includes(filter.toLowerCase()) ||
      fullType.toLowerCase().includes(filter.toLowerCase());

    return matchesContract && matchesSearch;
  });

  const hasEventsButHidden = filteredEvents.length === 0 && events.length > 0;

  return (
    <div className="flex w-full flex-col gap-4">
      <TypeLabel>
        Events ({filteredEvents.length} of {events.length}):
      </TypeLabel>

      {isLoading && <LoadingBlock title="Loading transaction events..." />}

      {events.length > 0 && (
        <>
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-4 md:flex-nowrap">
            <SearchBar
              value={filter}
              onChange={setFilter}
              placeholder="Filter by event type or contract"
            />
            <Select
              value={contractFilter}
              className="min-w-[200px] max-md:grow"
              initialValue="All"
              options={uniqueContracts}
              onChange={setContractFilter}
            />
          </div>

          {hasEventsButHidden && (
            <TypeLabel className="opacity-50">
              All events are hidden by filters. Try adjusting your search.
            </TypeLabel>
          )}

          <motion.div className="fat-row-column flex w-full flex-col gap-px">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event: any, index: number) => (
                <motion.div
                  layout
                  variants={variants}
                  className="w-full"
                  exit={{ opacity: 0, height: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={`event-${event.eventIndex}`}
                >
                  <SingleEvent event={event} index={event.eventIndex} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {data && events.length === 0 && (
        <TypeLabel className="opacity-50">No events emitted.</TypeLabel>
      )}
    </div>
  );
}
