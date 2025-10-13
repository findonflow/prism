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

  const keyStatus = revoked ? "Inactive" : "Active";
  const inactive = revoked && "text-colors-gray-medium line-through opacity-35";

  const keyWeight = formatNumberToAccounting(weight || 0);

  return (
    <div className="flex w-full flex-shrink-0 flex-row items-center justify-start gap-4 overflow-hidden bg-gray-100 p-4 hover:bg-gray-200">
      <div className="flex h-6 w-6 flex-shrink-0 flex-row items-center justify-center rounded-full border-1 border-current/50 text-xs font-bold text-gray-500">
        <span className={"translate-y-[1px]"}>{index}</span>
      </div>

      <div
        className={cn(
          "flex flex-row items-center justify-start gap-1 overflow-hidden text-copy text-colors-gray-medium w-full",
          "@md/page:flex-row @md/page:gap-2",
          inactive,
        )}
      >
        <div
          className={cn(
            "flex items-center justify-center px-1.5 py-0.5 text-sm round-md",
            revoked
              ? "border-[1px] border-current bg-none text-colors-gray-medium"
              : "bg-green-300",
          )}
        >
          {keyStatus}
        </div>
        <SimpleTag
          className={"text-gray-500 text-sm"}
          label={signatureAlgorithm}
        />
        <SimpleTag className={"text-gray-500 text-sm"} label={hashAlgorithm} />
        <div className="flex flex-row items-center gap-1 overflow-hidden">
          <p className={cn("truncate", inactive)}>
            {key?.slice(0, 10) + "..." + key?.slice(-10)}
          </p>
          <CopyText text={key || ""} />
        </div>
      </div>

      <div className="flex flex-row items-center justify-end gap-4 flex-shrink-0">
        {keyInfo.sequenceNumber && (
          <div className={"flex flex-row items-center gap-2 text-sm"}>
            <TypeLabel>Sequence #:</TypeLabel>
            <SimpleTag
              title={`Sequence number: ${keyInfo.sequenceNumber}`}
              category={<Hash className={"h-4 w-4"} />}
              label={keyInfo.sequenceNumber}
              className={"text-gray-500"}
            />
          </div>
        )}

        <div className={"flex flex-row items-center gap-2 text-sm"}>
          <TypeLabel>Weight:</TypeLabel>
          <SimpleTag
            title={`Key Weight: ${keyWeight}`}
            category={<Weight className={"h-4 w-4"} />}
            label={keyWeight}
            className={"text-gray-500"}
          />
        </div>
      </div>
    </div>
  );
}
