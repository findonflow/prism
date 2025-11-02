"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function BigSearch() {
  const params = useParams();
  const { network } = params;

  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [value, setValue] = useState("");

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  });

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      className={cn(
        "w-full",
        "p-4 pr-12 text-main border-2 border-prism-border bg-prism-level-3 w-full rounded-md font-bold text-lg text-prism-text",
        "focus:border-prism-interactive focus:bg-prism-level-4",
        "truncate",
      )}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push(`/${network}/account/${value}`);
        }
      }}
      placeholder={"Type your search query here"}
      autoFocus={true}
      autoComplete="on"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
}
