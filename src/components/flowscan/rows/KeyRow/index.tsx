/*--------------------------------------------------------------------------------------------------------------------*/
import { Hash, Weight } from "lucide-react";
import CopyText from "@/components/flowscan/CopyText";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { formatNumberToAccounting } from "@/lib/format";
import { TypeLabel } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
interface FullKeyInfo extends FlowKeyFormatted {
  sequenceNumber?: number;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default function KeyRow(props: { keyInfo: FullKeyInfo }) {
  const { keyInfo } = props;

  const { index, revoked, key } = keyInfo;
  const { hashAlgorithm, signatureAlgorithm } = keyInfo;
  const { weight } = keyInfo;

  const keyStatus = revoked ? "Revoked" : "Active";
  const inactive = revoked && "opacity-50";

  const keyWeight = formatNumberToAccounting(weight || 0);
  const haveNonce = Boolean(keyInfo.sequenceNumber);

  return (
    <div
      className={cn(
        "flex w-full flex-row flex-wrap items-center justify-start gap-4 overflow-hidden bg-prism-level-3 p-4 hover:bg-prism-level-4",
        "md:flex-nowrap",
        revoked && "bg-prism-level-2 hover:bg-prism-level-2 opacity-70"
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-start flex-wrap overflow-hidden text-copy text-colors-gray-medium w-full gap-2",
          "@md/page:flex-row md:gap-2",
          inactive,
        )}
      >
        <div className="flex h-6 w-6 flex-shrink-0 flex-row items-center justify-center rounded-full border-1 border-current/50 text-xs font-bold text-prism-text-muted">
          <span className={"translate-y-[1px]"} title={`Key index: ${index}`}>
            {index}
          </span>
        </div>
        <SimpleTag
          label={keyStatus}
          className={cn(
            "text-sm",
            revoked ? "text-prism-text-muted" : "text-green-600"
          )}
        />

        <div className={"flex flex-row gap-2"}>
          <SimpleTag
            className={"text-prism-text-muted text-sm"}
            label={signatureAlgorithm}
          />
          <SimpleTag
            className={"text-prism-text-muted text-sm"}
            label={hashAlgorithm}
          />
        </div>

        <div
          className={cn(
            "flex flex-row items-center gap-1 overflow-hidden",
            inactive,
          )}
        >
          <CopyText text={key || ""} />
          <p className={cn("truncate max-w-3/4", revoked && "line-through")}>{key}</p>
        </div>
      </div>

      <div
        className={cn(
          "flex flex-row items-center justify-between gap-4 flex-shrink-0 w-full",
          "md:justify-end md:w-auto",
          inactive,
        )}
      >
        {haveNonce && (
          <div className={"flex flex-row items-center gap-2 text-sm"}>
            <TypeLabel>Sequence #:</TypeLabel>
            <SimpleTag
              title={`Sequence number: ${keyInfo.sequenceNumber}`}
              category={<Hash className={"h-4 w-4"} />}
              label={keyInfo.sequenceNumber}
              className={"text-prism-text-muted"}
            />
          </div>
        )}

        <div className={"flex flex-row items-center gap-2 text-sm"}>
          <TypeLabel>Weight:</TypeLabel>
          <SimpleTag
            title={`Key Weight: ${keyWeight}`}
            category={<Weight className={"h-4 w-4"} />}
            label={keyWeight}
            className={"text-prism-text-muted"}
          />
        </div>
      </div>
    </div>
  );
}
