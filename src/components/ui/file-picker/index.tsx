"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useMemo, useRef, useState } from "react";
import { BigButton, hoverClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUp, RefreshCcw } from "lucide-react";
import { TypeFineprint } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
async function readFile(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      resolve(content);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsText(file);
  });
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function FilePicker(props: {
  useFile: (code: string) => void;
  disabled?: boolean;
  title?: string;
}) {
  const { useFile, disabled, title } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (fileName && fileName.endsWith(".cdc")) {
      const file = inputRef.current?.files?.[0];
      if (file) {
        readFile(file).then((code) => {
          setCode(code);
          useFile(code);
        });
      }
    }
  }, [fileName]);

  const reloadFile = useMemo(() => {
    return () => useFile(code);
  }, [code]);

  return (
    <div className={"flex flex-row items-center gap-4"}>
      <input
        ref={inputRef}
        id="file"
        type="file"
        className="sr-only"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
      />

      <BigButton
        className={cn(
          "flex flex-row items-center gap-2 px-6 text-lg",
          disabled ? "cursor-not-allowed opacity-50" : hoverClasses,
        )}
        title={title}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
      >
        <FileUp className={"h-[1.35em] w-[1.35em]"} />
        <span>Pick file</span>
      </BigButton>

      <span id="file-help" className="sr-only">
        Opens a file picker dialog
      </span>

      {code && (
        <BigButton
          title={disabled ? title : "Reload"}
          onClick={disabled ? undefined : reloadFile}
          className={cn(
            disabled ? "cursor-not-allowed opacity-50" : hoverClasses,
            "self-stretch px-4",
          )}
        >
          <RefreshCcw className={"h-5 w-5"} />
        </BigButton>
      )}
      {fileName && <TypeFineprint className={"text-prism-primary"}>Selected: {fileName}</TypeFineprint>}
    </div>
  );
}
