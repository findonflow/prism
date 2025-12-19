"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { TypeH1, TypeP } from "@/components/ui/typography";
import { BigButton, hoverClasses } from "@/components/ui/button";
import { CircleX, CloudUpload, Globe, Loader2, OctagonX } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePicker } from "@/components/ui/file-picker";
import CodeBlock from "@/components/flowscan/CodeBlock";
import { useMemo, useRef, useState } from "react";
import * as fcl from "@onflow/fcl";
import { Panel } from "@/components/ui/primitive";
import { extractCadenceContractName } from "@/lib/cadenceContract";
import useCanDeploy from "@/hooks/useCanDeploy";
import { useParams, useRouter } from "next/navigation";
import SimpleTag from "@/components/flowscan/SimpleTag";
import Link from "next/link";

// Transaction to deploy a new contract
const deployContractTransaction = `
  transaction(name: String, code: String) {
    prepare(signer: auth(AddContract) &Account) {
          signer.contracts.add(name: name, code: code.decodeHex())
    }
  }
`;

/*--------------------------------------------------------------------------------------------------------------------*/
const contractTemplate =
  "// Type your code here or import using button above\naccess(all) contract Template(){}";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DeployContractPage() {
  const { id, network } = useParams();
  const router = useRouter();
  const [fileCode, setFileCode] = useState<string>("");
  const [contractName, setContractName] = useState<string | null>();
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentError, setDeploymentError] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const contractUrl = `/${network}/account/${id}/contracts/${contractName}`;

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
      setDeploymentError(null);
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
        editorRef.current.setValue(contractTemplate);
      }
      router.push(contractUrl);
    } catch (error: any) {
      console.error("Deployment failed:", error);
      setDeploymentError(error);
      // toast.error(`Deployment failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    const code =
      editorRef.current?.getValue() || fileCode.replace(/^\/\/.*\n/, "");

    const contractName = extractCadenceContractName(code);
    setContractName(contractName);
  };

  const check = useCanDeploy(contractName);
  const { canDeploy } = check;

  const cleanError = useMemo(() => {
    return () => setDeploymentError(null);
  }, []);

  return (
    <div className={"w-full space-y-6"}>
      <Panel>
        <TypeH1 className={"text-left"}>
          Contract: <b>{contractName}</b>
        </TypeH1>
        <TypeP>
          Paste or upload your contract code and click "Deploy" to deploy it to
          the blockchain.
        </TypeP>

        <div
          className={cn(
            "bg-prism-level-3 border-prism-level-4 space-y-2 border-2 p-4 shadow-2xl",
            canDeploy ? "text-teal-50" : "text-orange-500",
          )}
        >
          <h4 className={"text-prism-text-muted opacity-50"}>Requirements</h4>

          {canDeploy && (
            <>
              <p className={"opacity-50"}>
                <b>Good to go!</b> All requirements are fulfilled
              </p>

              <p className={"mt-6 text-sm text-purple-300 opacity-50"}>
                Please, note that editor doesn't provide lexical analysis. We
                simply check there are no name collisions with currently
                deployed contracts
              </p>
            </>
          )}

          {!contractName && (
            <p className={"text-sm"}>
              <b>Name</b>: Contract declaration should have a name
            </p>
          )}
          {!check.isLoggedIn && (
            <p className={"text-sm"}>You are not logged in</p>
          )}
          {check.nameCollision && (
            <p className={"inline-flex gap-2"}>
              <b>Name collision:</b>{" "}
              <Link key={contractName} href={contractUrl}>
                <SimpleTag
                  title={`View ${contractName} contract`}
                  label={contractName}
                  category={<Globe className={"h-3 w-3"} />}
                />
              </Link>{" "}
              is already deployed
            </p>
          )}
        </div>

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
                canDeploy
                  ? "Deploy contract to the chain"
                  : "Can't upload contract: contract name is not specified"
              }
              onClick={handleDeploy}
              disabled={isDeploying || !canDeploy}
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deploying...</span>
                </>
              ) : (
                <>
                  {canDeploy ? (
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

      <DeploymentError error={deploymentError} cleanError={cleanError} />

      <CodeBlock
        code={contractTemplate}
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

function DeploymentError(props: { error: any; cleanError: () => void }) {
  const { error, cleanError } = props;

  console.log({ error });

  if (!error) {
    return null;
  }

  return (
    <div
      className={
        "relative w-full rounded-xs border-1 border-red-400 bg-red-400/20 p-6 text-red-400"
      }
    >
      <button
        onClick={cleanError}
        className={"absolute top-4 right-4 cursor-pointer"}
      >
        <CircleX className={"h-5 w-5"} />
      </button>
      <p className={"text-md whitespace-pre"}>{error}</p>
    </div>
  );
}
