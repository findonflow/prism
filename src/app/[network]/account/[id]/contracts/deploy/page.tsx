"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { TypeH1, TypeP } from "@/components/ui/typography";
import { BigButton, hoverClasses } from "@/components/ui/button";
import { CloudUpload, Loader2, OctagonX } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePicker } from "@/components/ui/file-picker";
import CodeBlock from "@/components/flowscan/CodeBlock";
import { useRef, useState } from "react";
import * as fcl from "@onflow/fcl";
import { Panel } from "@/components/ui/primitive";
import { extractCadenceContractName } from "@/lib/cadenceContract";

// Transaction to deploy a new contract
const deployContractTransaction = `
  transaction(name: String, code: String) {
    prepare(signer: auth(AddContract) &Account) {
          signer.contracts.add(name: name, code: code.decodeHex())
    }
  }
`;

// TODO: Use some regexp to catch contract declaration and extract name - we don't need full package...
/*--------------------------------------------------------------------------------------------------------------------*/
export default function DeployContractPage() {
  const [fileCode, setFileCode] = useState<string>("");
  const [contractName, setContractName] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const editorRef = useRef<any>(null);

  const handleFileUpload = (code: string) => {
    const timestamp = new Date().toISOString();
    const stampedCode = `//#pragma-timestamp-${timestamp}\n${code}`;
    setFileCode(stampedCode);

    // Try to extract contract name from the code
    const contractMatch = code.match(/contract\s+(\w+)/i);
    if (contractMatch && contractMatch[1] && !contractName) {
      setContractName(contractMatch[1]);
    }
  };

  const handleDeploy = async () => {
    try {
      setIsDeploying(true);

      // Get the latest code from the editor
      const code =
        editorRef.current?.getValue() || fileCode.replace(/^\/\/.*\n/, "");

      const contractName = extractCadenceContractName(code);
      setContractName(contractName);

      if (!contractName) {
        throw new Error("No contract name provided");
      }

      // Convert code to hex
      const hexCode = Buffer.from(code).toString("hex");

      // Execute the transaction
      const transactionId = await fcl.mutate({
        cadence: deployContractTransaction,
        args: (arg, t) => [arg(contractName, t.String), arg(hexCode, t.String)],
        limit: 1000,
      });

      // Wait for transaction to be sealed
      const transaction = await fcl.tx(transactionId).onceSealed();

      if (transaction.errorMessage) {
        throw new Error(transaction.errorMessage);
      }

      //toast.success("Contract deployed successfully!");

      // Reset form
      setFileCode("");
      setContractName("");
      if (editorRef.current) {
        editorRef.current.setValue(
          "// Type your code here or import using button above",
        );
      }
    } catch (error: any) {
      console.error("Deployment failed:", error);
      // toast.error(`Deployment failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };


  const canUpload = Boolean(contractName);

  return (
    <div className={"w-full space-y-6"}>
      <Panel>
        <TypeH1 className={"text-left"}>
          Deploy a new contract: <b>{contractName}</b>
        </TypeH1>
        <TypeP>
          Paste or upload your contract code and click "Deploy" to deploy it to
          the blockchain.
        </TypeP>

        <div className="space-y-4">
          <div
            className={"flex w-full flex-row items-center justify-between pt-2"}
          >
            <FilePicker
              useFile={handleFileUpload}
              accept=".cdc,.txt"
              title="Upload Cadence contract file (.cdc)"
            />
            <BigButton
              className={cn(
                "flex flex-row items-center gap-2 px-6 text-lg",
                hoverClasses,
                isDeploying && "cursor-not-allowed",
                "disabled:opacity-30",
              )}
              title={
                canUpload
                  ? "Deploy contract to the chain"
                  : "Can't upload contract: contract name is not specified"
              }
              onClick={handleDeploy}
              disabled={isDeploying || !canUpload}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  {canUpload ? (
                    <CloudUpload className={"h-[1.35em] w-[1.35em]"} />
                  ) : (
                    <OctagonX className={"h-[1.35em] w-[1.35em]"} />
                  )}
                  <span>Deploy</span>
                </>
              )}
            </BigButton>
          </div>
        </div>
      </Panel>

      <CodeBlock
        code={"// Type your code here or import using button above"}
        newCode={fileCode}
        editable={true}
        setEditorPropLift={handleEditorDidMount}
        onChange={(v) => {
          const name = extractCadenceContractName(v);
          setContractName(name);
        }}
      />
    </div>
  );
}
