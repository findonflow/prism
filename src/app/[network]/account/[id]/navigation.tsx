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
  const { to, baseUrl } = props;
  const { children } = props;

  const pathName = usePathname();

  const isActive = to === "" ? pathName === baseUrl : pathName.endsWith(to);

  return (
    <Link
      href={`${baseUrl}/${to}`}
      className={cn(buttonClasses, isActive && "bg-gray-300")}
    >
      {children}
    </Link>
  );
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountNavigation() {
  const params = useParams();
  const { id, network } = params;

  const baseUrl = `/${network}/account/${id}`;

  return (
    <div className={"flex flex-row gap-2 items-center"}>
      <NavigationLink to={""} baseUrl={baseUrl}>
        Linked Accounts
      </NavigationLink>
      <NavigationLink to={"keys"} baseUrl={baseUrl}>
        Public Keys
      </NavigationLink>
      <NavigationLink to={"public-storage"} baseUrl={baseUrl}>
        Public Storage
      </NavigationLink>
    </div>
  );
}
