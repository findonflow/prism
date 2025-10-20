"use client";

import { cn } from "@/lib/utils";
import { SquareArrowUpRight } from "lucide-react";

export enum ExtraTagType {
  "success",
  "failure",
  "warning",
  "net_flow",
  "net_evm",
  "net_empty",
  "net_mixed",
  "evm_contract",
  "evm_token",
  "flow_tag",
  "system",
  "system_fee",
  "system_signers",
}

function getTagColor(type: ExtraTagType) {
  const colors: Record<ExtraTagType, string> = {
    [ExtraTagType.success]: "text-green-200",
    [ExtraTagType.failure]: "text-red-600",
    [ExtraTagType.warning]: "text-red-300",

    [ExtraTagType.net_flow]: "text-green-100",
    [ExtraTagType.net_evm]: "text-blue-400",
    [ExtraTagType.net_mixed]: "text-purple-600",
    [ExtraTagType.net_empty]: "text-neutral-100",

    [ExtraTagType.evm_contract]: "text-blue-300",
    [ExtraTagType.evm_token]: "text-red-400",

    [ExtraTagType.flow_tag]: "text-green-800",

    [ExtraTagType.system]: "text-neutral-25",
    [ExtraTagType.system_fee]: "text-neutral-100",
    [ExtraTagType.system_signers]: "text-blue-500",
  };

  return colors[type];
}

export type TagSize = "tiny" | "small" | "medium";

interface CommonTagProps {
  label: string | React.ReactNode;
  title?: string;
  category?: string | React.ReactNode;
  size?: TagSize;
  className?: string;
  labelClassName?: string;
  isLink?: boolean;
  hideLink?: boolean;
  style?: React.CSSProperties;
}

type ExtraTagProps =
  | (CommonTagProps & {
      type: ExtraTagType;
    })
  | (CommonTagProps & { type?: never; customType: string });

const textSize = {
  tiny: "text-tiny",
  small: "text-tiny",
  medium: "text-fineprint",
};

export function ExtraTag(props: ExtraTagProps) {
  const { category } = props;
  const { title, label } = props;
  const { size = "small" } = props;
  const { className, labelClassName } = props;
  const { isLink, hideLink, style } = props;

  let content = (
    <b className={"flex flex-row items-center gap-1"}>
      <span>{label}</span>
      {!hideLink && (
        <SquareArrowUpRight
          className={
            "relative bottom-[0.5px] hidden h-4 w-4 flex-shrink-0 opacity-50 [:where(a)_&]:block"
          }
        />
      )}
    </b>
  );

  if (!!category) {
    content = (
      <div
        style={style}
        className={"flex flex-row items-center justify-start gap-1"}
      >
        <span
          className={cn(
            "inline-grid max-w-[8rem] place-items-center truncate opacity-75",
            "[&>svg]:h-4 [&>svg]:w-4"
          )}
        >
          {category}
        </span>
        <span className={"opacity-75"}>|</span>
        <div
          className={cn(
            "flex items-center justify-start gap-1 px-0.5 font-bold",
            labelClassName
          )}
        >
          <span className={"max-w-[8rem] truncate"}>{label}</span>
          {!hideLink && (
            <SquareArrowUpRight
              className={
                "relative bottom-[0.5px] hidden h-4 w-4 flex-shrink-0 opacity-50 [:where(a)_&]:block"
              }
            />
          )}
        </div>
      </div>
    );
  }
  const colorClass =
    typeof props.type == "undefined"
      ? props.customType
      : getTagColor(props.type);
  const sizeClass = textSize[size as keyof typeof textSize];

  return (
    <span
      className={cn(
        "flex flex-shrink-0 items-center justify-center",
        "border-[1px] border-solid border-current",
        "p-1",
        colorClass,
        sizeClass,
        className
      )}
      title={title || (typeof label === "string" ? label : "")}
    >
      {content}
    </span>
  );
}
