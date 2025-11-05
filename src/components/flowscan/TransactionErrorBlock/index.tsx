import React from "react";
import { extractCode, getErrorInfo } from "@/consts/error-codes";
import { cn } from "@/lib/utils";
import { TypeH1 } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
interface ErrorBlockProps {
  error: string;
  errorCode?: string;
  className?: string;
  onlyContent?: boolean;
}

/*--------------------------------------------------------------------------------------------------------------------*/
function TransactionErrorBlock(props: ErrorBlockProps) {
  const { className, onlyContent } = props;

  const { error, errorCode } = props;
  const code = extractCode(error) || errorCode;
  const matchedError = getErrorInfo(code);

  // There might be newline characters at the end of the error string we want to trim
  const tail = 3;
  const formattedError = error.slice(0, -tail);
  const ending = error.slice(-tail, 0).replace(/\n/g, "");
  const finalError = formattedError + ending;

  if (onlyContent) {
    return (
      <div
        className={cn(
          "thin-scrollbar text-md flex w-full flex-col gap-2 overflow-x-auto bg-red-400/10 p-6 text-red-400",
          className,
        )}
      >
        <p className={"text-md w-full font-mono whitespace-pre"}>
          {finalError}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "thin-scrollbar text-md text-orange flex w-full flex-col items-start gap-2 overflow-x-auto bg-red-400/10 p-6",
        className,
      )}
    >
      <TypeH1 className="text-lg font-bold text-red-100">{matchedError.title}</TypeH1>
      <p className="text-md text-red-200">{matchedError.description}</p>
      <pre className={"text-sm font-mono whitespace-pre text-red-400"}>
        {finalError}
      </pre>
    </div>
  );
}

export default TransactionErrorBlock;
