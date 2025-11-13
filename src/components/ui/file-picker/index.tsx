"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useRef, useState } from "react";
import {
  BigButton,
  Button,
  buttonClasses,
  hoverClasses,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileUp } from "lucide-react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function FilePicker() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  return (
    <div className={"flex flex-row gap-4 items-center"}>
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
          hoverClasses,
        )}
        onClick={() => inputRef.current?.click()}
      >
        <FileUp className={"h-[1.35em] w-[1.35em]"} />
        <span>Pick file</span>
      </BigButton>

      <span id="file-help" className="sr-only">
        Opens a file picker dialog
      </span>

      {fileName && <div>Selected: {fileName}</div>}
    </div>
  );
}
