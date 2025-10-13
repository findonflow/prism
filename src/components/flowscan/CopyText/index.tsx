"use client";
/* --------------------------------------------------------------------------------------------- */
import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------------------------------- */
export interface CopyTextProps {
  text: string;
  className?: string;
  title?: string;
}

/* --------------------------------------------------------------------------------------------- */
export default function CopyText(props: CopyTextProps) {
  const { text, className } = props;
  const { title = "Copy hash" } = props;
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Set isCopied to false after 3 seconds
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  return (
    <div
      className={cn(
        "flex h-5 w-5 cursor-pointer items-center justify-between",
        className,
      )}
    >
      <CopyToClipboard text={text} onCopy={() => setIsCopied(true)}>
        <button
          className="relative cursor-pointer border-none bg-transparent p-0"
          title={title}
        >
          {/*          <div className="tooltip absolute bottom-full left-0 z-10 -translate-x-[40%] -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-1 text-sm">
            {isCopied ? "Copied!" : title}
            <div className="absolute left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#3E3E3E]" />
          </div>*/}
          {/*--  Icon --*/}
          {isCopied && <Check className={"w-[1em] aspect-square"} />}
          {!isCopied && <Copy className={"w-[1em] aspect-square"} />}
        </button>
      </CopyToClipboard>
    </div>
  );
}
