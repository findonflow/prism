"use client"
/*--------------------------------------------------------------------------------------------------------------------*/
import { TypeH1, TypeP } from "@/components/ui/typography";
import { BigButton, hoverClasses } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePicker } from "@/components/ui/file-picker";
import CodeBlock from "@/components/flowscan/CodeBlock";
import { useState } from "react";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DeployContractPage() {
  const [fileCode, setFileCode] = useState<string>("");

  return (
    <div className={"w-full space-y-6"}>
      <div className={"bg-prism-level-2 space-y-6 p-6 text-left"}>
        <TypeH1 className={"text-left"}>Deploy a new contract</TypeH1>
        <TypeP>
          Paste or upload your contract code here and click "Deploy" to deploy
          it to the blockchain.
        </TypeP>

        <div
          className={
            "text-prism-primary flex w-full flex-row items-center justify-between"
          }
        >
          <FilePicker useFile={(code)=>{
            const timestamp = new Date().toISOString();
            const stampedCode = `//#pragma-timestamp-${timestamp}\n${code}`;
            console.log({stampedCode})
            setFileCode(stampedCode);
          }} />
          <BigButton
            className={cn(
              "flex flex-row items-end gap-2 px-6 text-lg",
              hoverClasses,
            )}
          >
            <CloudUpload className={"h-[1.35em] w-[1.35em]"} />
            <span>Deploy</span>
          </BigButton>
        </div>
      </div>

      <CodeBlock code={"// Type your code here on import using button above"} newCode={fileCode} editable/>
    </div>
  );
}
