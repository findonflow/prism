"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { isHash } from "@/lib/validate";

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
        "text-main border-2 px-4 py-6 text-lg outline-0",
        "focus:text-prism-primary focus:border-current",
        "shadow-prism-primary/50 focus:shadow-[0_0_3rem_0.2rem]",
        "truncate transition-colors duration-300",
      )}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (isHash(value)) {
            router.push(`/${network}/tx/${value}`);
          } else {
            router.push(`/${network}/account/${value}`);
          }
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
