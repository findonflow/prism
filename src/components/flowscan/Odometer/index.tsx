"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import "./style.css";
import { formatBytesToStorageString } from "@/lib/format";

/*--------------------------------------------------------------------------------------------------------------------*/
type OdometerValue = "number" | "percent" | "storage";
/*--------------------------------------------------------------------------------------------------------------------*/
interface OdometerProps {
  type?: OdometerValue;
  value?: string | number;
  className?: string;
  minFraction?: number;
  maxFraction?: number;
  suffix?: string;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default function Odometer(props: OdometerProps) {
  const { value, type = "number", className } = props;
  const { minFraction = 2, maxFraction = 2 } = props;
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (value !== undefined && !hasAnimated.current) {
      // Start from 0, then animate to actual value
      setDisplayValue(0);
      setTimeout(() => {
        setDisplayValue(value);
        hasAnimated.current = true;
      }, 25);
    } else if (value !== undefined && hasAnimated.current) {
      // Subsequent updates animate directly
      setDisplayValue(value);
    }
  }, [value]);

  let fixedValue = displayValue;
  let suffix = props.suffix || "";
  if (type === "percent") {
    fixedValue = Number(displayValue) * 100;
    suffix = "%";
  }

  if (type === "storage") {
    const { size, extension } = formatBytesToStorageString(
      Number(displayValue),
    );
    fixedValue = size;
    suffix = extension;
  }

  return (
    <NumberFlow
      value={fixedValue as number}
      format={{
        useGrouping: "false",
        notation: "standard",
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        trailingZeroDisplay: displayValue === 0 ? "auto" : "stripIfInteger",
      }}
      suffix={suffix}
      className={cn(className, type === "percent" && "full")}
      respectMotionPreference={true}
      transformTiming={{ duration: 750, easing: "ease-in-out" }}
      spinTiming={{ duration: 750, easing: "ease-in-out" }}
      opacityTiming={{ duration: 350, easing: "ease-in-out" }}
    />
  );
}
