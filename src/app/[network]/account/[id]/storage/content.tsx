"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import AccountStoredItemsContent from "@/app/[network]/account/[id]/stored-items/content";
import AccountPublicStorageContent from "@/app/[network]/account/[id]/public-storage/content";
import { NavigationGroup } from "@/app/[network]/account/[id]/navigation";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TypeLabel } from "@/components/ui/typography";
import Select from "@/components/flowscan/Select";

/*--------------------------------------------------------------------------------------------------------------------*/
export function NavigationLink(props: { to: string; children: ReactNode }) {
  const { to } = props;
  const { children } = props;

  const params = useParams();
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") || "public";
  const { id, network } = params;

  const href = `/${network}/account/${id}/storage?domain=${to}`;
  const isActive = to === domain;

  return (
    <Link
      href={href}
      className={cn(
        "bg-prism-level-3 hover:bg-prism-interactive/75 px-4 py-2 whitespace-nowrap",
        isActive && "bg-prism-interactive hover:bg-prism-interactive",
      )}
    >
      {children}
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function SelectNavigation() {
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter();
  const { id, network } = params;

  const baseUrl = `/${network}/account/${id}/storage?domain=`;

  // Navigation items mapping: label -> route
  const navigationItems: Record<string, string> = {
    Public: "public",
    Storage: "storage",
  };

  const labels = Object.keys(navigationItems);

  // Determine current active label from pathname
  const getCurrentLabel = () => {
    for (const [label, route] of Object.entries(navigationItems)) {
      if (route === "" && pathName === baseUrl) {
        return label;
      }
      if (route !== "" && pathName.endsWith(route)) {
        return label;
      }
    }
    return labels[0]; // Default to first option
  };

  const handleChange = (label: string) => {
    const route = navigationItems[label];
    router.push(`${baseUrl}${route}`);
  };

  return (
    <Select
      className={"h-[3rem] w-full px-4"}
      initialValue={getCurrentLabel()}
      options={labels}
      onChange={handleChange}
    />
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountStorageContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") || "public";

  return (
    <div>
      <div
        className={
          "mb-6 flex w-full items-center justify-between gap-8 lg:hidden"
        }
      >
        <TypeLabel>Domain:</TypeLabel>
        <SelectNavigation />
      </div>
      <div
        className={
          "mb-6 hidden flex-row flex-nowrap items-center gap-4 max-md:flex-wrap lg:flex"
        }
      >
        <TypeLabel>Domain:</TypeLabel>
        <NavigationGroup>
          <NavigationLink to={"public"}>Public</NavigationLink>
          <NavigationLink to={"storage"}>Storage</NavigationLink>
        </NavigationGroup>
      </div>

      {domain === "public" && <AccountPublicStorageContent />}
      {domain === "storage" && <AccountStoredItemsContent />}
    </div>
  );
}
