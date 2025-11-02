"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLoginContext } from "@/fetch/provider";
import { useParams } from "next/navigation";

/* --------------------------------------------------------------------------------------------- */

export function truncateHash(hash?: string, steps: number = 4): string {
  return hash?.slice(0, steps) + "..." + hash?.slice(-steps);
}

/* --------------------------------------------------------------------------------------------- */

export function HorizontalLine({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-prism-border", className)} />;
}

/* --------------------------------------------------------------------------------------------- */
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [callback]);

  return ref;
};

/* --------------------------------------------------------------------------------------------- */

export default function ConnectWallet(props: { className?: string }) {
  const { className } = props;
  const { user, loginUser, logoutUser } = useLoginContext();
  const connectWalletButton = (
    <div
      onClick={() => (user.address ? logoutUser() : loginUser())}
      className={cn(
        "cursor-pointer rounded-sm border-[1.5px] border-solid border-current px-3 py-2 text-[1rem] font-semibold whitespace-nowrap",
        "z-20 flex items-center justify-center",
        className,
      )}
    >
      Connect Wallet
    </div>
  );

  return user.address ? (
    <LoggedInWalletButton className={className} />
  ) : (
    connectWalletButton
  );
}

function LoggedInWalletButton(props: { className?: string }) {
  const { className } = props;
  const { user, logoutUser } = useLoginContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const { network } = useParams() as Record<string, string>;

  const targetRef = useClickOutside(() => setShowDropdown(false));

  return (
    <div
      ref={targetRef}
      onClick={() => setShowDropdown((prev) => !prev)}
      className={cn(
        "relative flex cursor-pointer gap-2 rounded-[10px] border border-solid border-prism-border bg-prism-level-2 px-4 py-2.5 text-[16px] font-semibold text-prism-text shadow-xs select-none",
        "z-20",
        className,
      )}
    >
      {truncateHash(user.address)}
      <ChevronDown
        className={cn(
          "ml-2 inline h-6 w-6 transition-all",
          showDropdown && "-rotate-180",
        )}
      />
      <div
        className={cn(
          `absolute top-full right-0 mt-2 hidden w-full rounded-sm border border-solid border-prism-border bg-prism-level-3 p-[inherit] shadow-lg transition-all duration-200 ease-in-out`,
          showDropdown && "flex flex-col gap-2",
        )}
      >
        <Link
          href={`/${network}/account/${user.address}`}
          className="rounded-md p-1 text-green-400 hover:bg-prism-interactive"
        >
          View Account
        </Link>
        <HorizontalLine className="opacity-30" />

        <button
          onClick={() => logoutUser()}
          className="cursor-pointer rounded-md p-1 text-left hover:bg-prism-interactive"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
