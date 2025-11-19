"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { TypeH1, TypeP } from "@/components/ui/typography";
import { BigButton, hoverClasses } from "@/components/ui/button";
import { CloudUpload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePicker } from "@/components/ui/file-picker";
import CodeBlock from "@/components/flowscan/CodeBlock";
import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import * as fcl from "@onflow/fcl";

// Transaction to deploy a new contract
const deployContractTransaction = `
  transaction(name: String, code: String) {
    prepare(signer: auth(AddContract) &Account) {
          signer.contracts.add(name: name, code: code.decodeHex())
    }
  }
`;

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DeployContractPage() {
  const { network, id } = useParams();
  const [fileCode, setFileCode] = useState<string>("");
  const [contractName, setContractName] = useState<string>("");
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
    console.log({contractName, fileCode})
    if (!contractName) {
      // toast.error("Please enter a contract name");
      return;
    }

    try {
      setIsDeploying(true);

      // Get the latest code from the editor
      const code =
        editorRef.current?.getValue() || fileCode.replace(/^\/\/.*\n/, "");

      console.log({code})

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

  return (
    <div className={"w-full space-y-6"}>
      <div className={"bg-prism-level-2 space-y-6 p-6 text-left"}>
        <TypeH1 className={"text-left"}>Deploy a new contract</TypeH1>
        <TypeP>
          Paste or upload your contract code, enter a name, and click "Deploy"
          to deploy it to the blockchain.
        </TypeP>

        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="contract-name">Contract Name</label>
            <input
              id="contract-name"
              placeholder="MyContract"
              value={contractName}
              onChange={(e) => setContractName(e.target.value)}
              className="input bg-prism-level-1 [&:focus]:outline-prism-text-muted max-w-md"
            />
            <p className="text-muted-foreground text-sm">
              The name of your contract (must match the contract name in the
              code)
            </p>
          </div>

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
                isDeploying && "cursor-not-allowed opacity-70",
              )}
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  <CloudUpload className={"h-[1.35em] w-[1.35em]"} />
                  <span>Deploy</span>
                </>
              )}
            </BigButton>
          </div>
        </div>
      </div>

      <CodeBlock
        code={"// Type your code here or import using button above"}
        newCode={fileCode}
        editable={true}
        setEditorPropLift={handleEditorDidMount}
      />
    </div>
  );
}
