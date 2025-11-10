"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useTransactionDetails } from "@/hooks/useTransactionDetails";
import { LoadingBlock } from "@/components/flowscan/JumpingDots";
import { TypeLabel } from "@/components/ui/typography";
import CodeBlock from "@/components/flowscan/CodeBlock";
import CopyText from "@/components/flowscan/CopyText";
import TransactionErrorBlock from "@/components/flowscan/TransactionErrorBlock";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionScript() {
  const { hash } = useParams();
  const { data, isPending } = useTransactionDetails(hash as string);

  return (
    <div className="flex w-full flex-col gap-4">
      {isPending && <LoadingBlock title="Loading transaction script..." />}

      {data && (
        <div className="flex flex-col gap-6">

          {data.errorMessage && <TransactionErrorBlock error={data.errorMessage}/>}

          {data.args && data.args.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              <TypeLabel>Script Arguments:</TypeLabel>
              <div className="bg-prism-level-2 flex flex-col gap-2 p-4">
                {data.args.map((arg: any, index: number) => (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-start gap-2"
                  >
                    <TypeLabel>Arg {index}:</TypeLabel>
                    <div className="flex flex-row items-center gap-2">
                      <span className="text-sm font-bold">{arg.type}</span>
                      <span className="text-sm">= {JSON.stringify(arg.value)}</span>
                      <CopyText text={JSON.stringify(arg.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.script && (
            <div className="flex flex-col gap-2">
              <TypeLabel>Cadence Script:</TypeLabel>
              <CodeBlock code={data.script} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
