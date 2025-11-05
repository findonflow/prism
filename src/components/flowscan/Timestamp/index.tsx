/* --------------------------------------------------------------------------------------------- */
import { formatTimestamp } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function Timestamp(props: { time?: string | Date; titlePrefix?: string }) {
  const { time, titlePrefix } = props;

  const formattedTimestamp = time
    ? formatTimestamp(new Date(time), {
      timeStyle: "medium",
      dateStyle: "long",
    })
      .split("at")
      .join(" ")
    : null;

  const titleMessage = `${titlePrefix || ""}${formattedTimestamp}`;

  return (
    <div
      className={cn(
        "flex shrink-0 flex-row items-center justify-start gap-1",
        "text-bsn-label hover:text-bsn-text-full transition-colors",
      )}
      title={titleMessage}>
      <Clock className={"h-3 w-3 shrink-0"} />
      <span className={cn("text-fineprint")}>{formattedTimestamp}</span>
    </div>
  );
}