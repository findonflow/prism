"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BigButton, hoverClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CodeBlock from "@/components/flowscan/CodeBlock";
import { useAccountDetails } from "@/hooks/useAccountDetails";
import useAccountResolver from "@/hooks/useAccountResolver";
import { CloudUpload } from "lucide-react";
import { useLoginContext } from "@/fetch/provider";
import { FilePicker } from "@/components/ui/file-picker";
import { TypeH1, TypeP } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function ContractDetailsContent(props: {
  contractName: string;
}) {
  const { contractName } = props;
  const { id } = useParams();

  const { data: resolved } = useAccountResolver(id as string);
  const address = resolved?.owner || null;

  const { data, isPending } = useAccountDetails(address);
  const haveData = !isPending && Boolean(data?.contracts);

  const shortName = useMemo(() => {
    const parts = (contractName || "").split(".");
    return parts[parts.length - 1] || "";
  }, [contractName]);

  const codeFromApi = haveData ? data?.contracts?.[shortName] || "" : "";

  const [fileCode, setFileCode] = useState<string>("");

  const { user } = useLoginContext();
  const canRedeploy = Boolean(
    user?.address &&
      address &&
      String(user.address).toLowerCase() === String(address).toLowerCase(),
  );
  const redeployTitle = canRedeploy
    ? "Redeploy"
    : `Login with address ${address} in order to redeploy this contract`;

  useEffect(() => {
    // Initialize with the current on-chain code (read-only editor)
    if (!codeFromApi) return;
    const timestamp = new Date().toISOString();
    const stamped = `//#pragma-timestamp-${timestamp}\n${codeFromApi}`;
    setFileCode(stamped);
  }, [codeFromApi]);

  return (
    <div className={"w-full space-y-6"}>
      <div className={"bg-prism-level-2 space-y-6 p-6 text-left"}>
        <TypeH1 className={"text-left"}>{shortName}</TypeH1>
        <TypeP>
          Paste or upload the new contract code here and click "Update" to upgrade the existing contract.
        </TypeP>

        <div
          className={
            "text-prism-primary flex w-full flex-row items-center justify-between"
          }
        >
          <FilePicker
            useFile={(code) => {
              const timestamp = new Date().toISOString();
              const stampedCode = `//#pragma-timestamp-${timestamp}\n${code}`;
              setFileCode(stampedCode);
            }}
            disabled={!canRedeploy}
            title={redeployTitle}
          />
          <BigButton
            className={cn(
              "flex flex-row items-end gap-2 px-6 text-lg",
              canRedeploy ? hoverClasses : "cursor-not-allowed opacity-50",
            )}
            title={redeployTitle}
            onClick={canRedeploy ? () => {} : undefined}
          >
            <CloudUpload className={"h-[1.35em] w-[1.35em]"} />
            <span>Redeploy</span>
          </BigButton>
        </div>
      </div>

      <CodeBlock code={codeFromApi || ""} newCode={fileCode} editable={false} />
    </div>
  );
}
