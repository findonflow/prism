"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function HeaderSearch() {
  const params = useParams();
  const { network } = params;

  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [value, setValue] = useState("");

  function listenForUpdates(e: KeyboardEvent) {
    if (e.key === "/") {
      setValue("");
      e.preventDefault();
      ref.current?.focus();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", listenForUpdates);
    return () => {
      window.removeEventListener("keydown", listenForUpdates);
    };
  }, []);

  return (
    <Input
      ref={ref}
      type="text"
      value={value}
      className={cn(
        "h-full w-full border-1 px-4 text-sm outline-0",
        "focus:text-prism-primary focus:border-current",
        "shadow-prism-primary/50 focus:shadow-[0_0_3rem_0.2rem]",
        "truncate transition-colors duration-300",
      )}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          router.push(`/${network}/account/${value}`);
          setValue("");
          ref.current?.blur();
        }
      }}
      placeholder={
        "Type / to search for account, transaction or find domain name"
      }
      autoComplete="on"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
}
