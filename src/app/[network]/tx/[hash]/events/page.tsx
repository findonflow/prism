"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useState } from "react";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeLabel } from "@/components/ui/typography";
import FatRow, { FatRowDetails } from "@/components/flowscan/FatRow";
import CopyText from "@/components/flowscan/CopyText";
import { AnimatePresence, motion } from "motion/react";
import { variants } from "@/lib/animate";
import { SearchBar } from "@/components/flowscan/SearchBar";
import Select from "@/components/flowscan/Select";

/*--------------------------------------------------------------------------------------------------------------------*/
function extractContractName(eventType: string): string {
  const parts = eventType.split(".");
  if (parts.length >= 3) {
    return parts[2];
  }
  return eventType;
}

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
        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold">{eventName}</span>
          <span className="text-prism-text-muted text-xs">{contractName}</span>
        </div>
        <span className="text-prism-text-muted text-xs">
          Index: {event.eventIndex}
        </span>
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

        <div className="flex flex-row items-center justify-start gap-2">
          <TypeLabel>Event Type:</TypeLabel>
          <div className="flex flex-row items-center gap-2">
            <span className="text-sm font-bold">{event.type}</span>
            <CopyText text={event.type} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <TypeLabel>Event Data:</TypeLabel>
          <div className="bg-prism-level-2 flex flex-col gap-2 p-4">
            {Object.entries(event.data).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-row items-center justify-start gap-2"
              >
                <TypeLabel>{key}:</TypeLabel>
                <div className="flex flex-row items-center gap-2">
                  <span className="text-sm font-bold">
                    {JSON.stringify(value)}
                  </span>
                  <CopyText text={JSON.stringify(value)} />
                </div>
              </div>
            ))}
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
      {isLoading && <LoadingBlock title="Loading transaction events..." />}

      {events.length > 0 && (
        <>
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-4">
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

          <TypeLabel>
            Events ({filteredEvents.length} of {events.length}):
          </TypeLabel>

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
