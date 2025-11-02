"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
    <Input
      ref={ref}
      type="text"
      value={value}
      className={cn(
        "p-4 pr-12 text-main border-2 font-bold text-lg",
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
