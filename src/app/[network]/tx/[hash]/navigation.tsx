/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { buttonClasses } from "@/components/ui/button";

/*--------------------------------------------------------------------------------------------------------------------*/
function NavigationLink(props: {
  to: string;
  children: ReactNode;
  baseUrl: string;
}) {
  const { to, baseUrl, children } = props;
  const pathName = usePathname();
  const isActive = to === "" ? pathName === baseUrl : pathName.endsWith(to);

  return (
    <Link
      href={`${baseUrl}/${to}`}
      className={cn(buttonClasses, isActive && "bg-prism-interactive")}
    >
      {children}
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionNavigation() {
  const params = useParams();
  const { hash, network } = params;
  const baseUrl = `/${network}/tx/${hash}`;

  return (
    <div className="mb-6 flex flex-row flex-wrap items-center gap-2">
      <NavigationLink to="" baseUrl={baseUrl}>
        Script
      </NavigationLink>
      <NavigationLink to="events" baseUrl={baseUrl}>
        Events
      </NavigationLink>
    </div>
  );
}
