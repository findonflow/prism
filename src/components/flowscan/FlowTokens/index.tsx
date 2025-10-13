/*--------------------------------------------------------------------------------------------------------------------*/
import Odometer from "@/components/flowscan/Odometer";
import FlowIcon from "@/components/ui/icons";
import { formatToFlowValue } from "@/lib/format";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export interface FlowTokensProps {
  value?: number | string;
  digits?: number;
  className?: string;
  iconClassName?: string;
  leftAligned?: boolean;
  logoPosition?: "left" | "right";
  animated?: boolean;
  isFormatted?: boolean;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function FlowTokens(props: FlowTokensProps) {
  const {
    value,
    digits = 2,
    className = value === 0 ? "empty" : "",
    iconClassName = "",
  } = props;
  const { isFormatted } = props;
  const { logoPosition = "right" } = props;
  const { animated } = props;

  if (value === undefined || (typeof value === "number" && isNaN(value))) {
    return null;
  }

  const formattedValue = (
    isFormatted ? value : formatToFlowValue(value as number, digits)
  ) as string;
  const decimal = formattedValue.slice(-digits);
  const integer = formattedValue.slice(0, -digits - 1).replaceAll(" ", "");

  return (
    <div
      className={cn(
        "explorer-svg flex w-full items-center justify-end gap-1 font-semibold",
        className,
      )}
    >
      <div className={"order-2 inline-flex justify-start"}>
        <span className="">
          {animated ? <Odometer value={integer} /> : integer}
        </span>
        <span>.</span>
        <span className="font-normal opacity-75">
          {animated ? <Odometer value={decimal} /> : decimal}
        </span>
      </div>
      <FlowIcon
        className={cn(
          iconClassName,
          logoPosition === "left" ? "order-1" : "order-3",
        )}
      />
    </div>
  );
}
