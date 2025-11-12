"use client";

import { ChevronDown, ChevronRight, LogOut, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLoginContext } from "@/fetch/provider";
import { useParams, usePathname } from "next/navigation";
import "./styles.css";
import { Divider } from "@/components/ui/primitive";

/* --------------------------------------------------------------------------------------------- */

export function truncateHash(hash?: string, steps: number = 4): string {
  return hash?.slice(0, steps) + "..." + hash?.slice(-steps);
}

/* --------------------------------------------------------------------------------------------- */

export function HorizontalLine({ className }: { className?: string }) {
  return <div className={cn("bg-prism-border h-px w-full", className)} />;
}

/*--------------------------------------------------------------------------------------------- */
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
  safeTarget: any,
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !safeTarget.current.contains(event.target as Node)
      ) {
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

  if (user.address) {
    return <LoggedInWalletButton className={className} />;
  }

  return (
    <button
      onClick={() => (user.address ? logoutUser() : loginUser())}
      className={cn(
        "bg-prism-primary text-prism-level-1 z-20 cursor-pointer rounded-xs px-4 py-3 font-semibold",
        "flex-none",
        "hover:brightness-110",
        className,
      )}
    >
      Connect Wallet
    </button>
  );
}

function LoggedInWalletButton(props: {
  className?: string;
  overrideNetwork?: string;
}) {
  const pathname = usePathname();
  const { className, overrideNetwork } = props;
  const { user, logoutUser } = useLoginContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const oldPathName = useRef(pathname);
  const { network = overrideNetwork || "mainnet" } = useParams() as Record<
    string,
    string
  >;

  const buttonRef = useRef<HTMLButtonElement>(null);
  const targetRef = useClickOutside<HTMLDivElement>(
    () => setShowDropdown(false),
    buttonRef,
  );

  useEffect(() => {
    if (oldPathName.current !== pathname) {
      oldPathName.current = pathname;
      setShowDropdown(false);
    }
  }, [pathname]);

  return (
    <>
      {showDropdown && (
        <div
          className={
            "bg-prism-level-1/20 fixed top-0 right-0 bottom-0 left-0 z-20 backdrop-blur-sm"
          }
        />
      )}
      <button
        ref={buttonRef}
        onClick={(e) => {
          setShowDropdown(!showDropdown);
        }}
        className={cn(
          "relative z-20 cursor-pointer rounded-xs border px-4 py-3",
          "bg-prism-level-1 border-prism-primary text-prism-primary flex-none",
          "hover:brightness-110",
          "connect-anchor",
          className,
        )}
      >
        {/* Text Label*/}
        <span>{truncateHash(user.address)}</span>
        <ChevronDown
          className={cn(
            "ml-2 inline h-6 w-6 transition-all",
            showDropdown && "-rotate-180",
          )}
        />
      </button>
      {/* Menu Items*/}
      {showDropdown && (
        <div
          ref={targetRef}
          className={cn(
            "bg-prism-level-2 absolute mt-2",
            "border-prism-primary rounded-xs border border-solid p-2",
            "z-20 transition-all duration-200 ease-in-out",
            "flex flex-col text-white",
            "connect-dropdown",
          )}
        >
          <Link href={`/${network}/account/${user.address}`} className="">
            <div
              className={cn(
                "flex w-full flex-row items-center justify-between p-3 text-left",
                "hover:bg-prism-primary/20",
              )}
            >
              <span>View Account</span>
              <ChevronRight className={"h-4 w-4 opacity-50"} />
            </div>
          </Link>
          <Link
            href={`/${network}/account/${user.address}/contracts`}
            className=""
          >
            <div
              className={cn(
                "flex w-full flex-row items-center justify-between p-3 text-left",
                "hover:bg-prism-primary/20",
              )}
            >
              <span>Deploy new contract</span>
              <Plus className={"h-4 w-4 opacity-50"} />
            </div>
          </Link>

          <div className={"px-3 py-1"}>
            <Divider className={"opacity-50"} />
          </div>

          <button
            onClick={() => {
              logoutUser();
            }}
            className={cn(
              "flex w-full cursor-pointer flex-row items-center justify-between p-3 text-left",
              "hover:bg-prism-primary/20",
            )}
          >
            <span>Log out</span>
            <LogOut className={"h-4 w-4 opacity-50"} />
          </button>
        </div>
      )}
    </>
  );
}
