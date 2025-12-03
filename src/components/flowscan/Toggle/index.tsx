"use client";
import useQueryParams from "@/hooks/utils/useQueryParams";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { ReactNode } from "react";

export default function Toggle({
  toggleString,
  text,
  tooltipText,
  className,
}: {
  toggleString: string;
  text?: ReactNode;
  tooltipText?: string;
  className?: string;
}) {
  const { setQueryParams, getQueryParams } = useQueryParams();
  const [toggleVal] = getQueryParams([toggleString]);
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        onClick={() => {
          if (toggleVal) setQueryParams({ [toggleString]: false });
          else setQueryParams({ [toggleString]: true });
        }}
        className={cn(
          "w-11 cursor-pointer rounded-2xl bg-blue-400/30 p-0.5 transition-all",
          toggleVal && "bg-blue-400/85",
        )}
      >
        <div
          className={cn(
            "h-5 w-5 rounded-full bg-gray-300 transition-all duration-300",
            toggleVal && "ml-[calc(100%-1.25rem)]",
          )}
        ></div>
      </div>
      <span className="text-copy text-gray-400">{text}</span>
      {tooltipText && (
        <div className="relative cursor-pointer [&>div]:hover:block">
          <div className="bg-white text-tiny text-gra-400 absolute bottom-full left-0 z-100 line-clamp-2 hidden w-[150px] -translate-x-1/2 p-2">
            {tooltipText}
          </div>
          <Info className="h-3.5 w-3.5 text-gray-400" />
        </div>
      )}
    </div>
  );
}
