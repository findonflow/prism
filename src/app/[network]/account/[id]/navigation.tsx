/*--------------------------------------------------------------------------------------------------------------------*/
"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Select from "@/components/flowscan/Select";

/*--------------------------------------------------------------------------------------------------------------------*/
function NavigationLink(props: { to: string; children: ReactNode }) {
  const { to } = props;
  const { children } = props;

  const pathName = usePathname();
  const params = useParams();
  const { id, network } = params;

  const baseUrl = `/${network}/account/${id}`;

  const isActive = to === "" ? pathName === baseUrl : pathName.endsWith(to);

  return (
    <Link
      href={`${baseUrl}/${to}`}
      className={cn(
        "bg-prism-level-3 hover:bg-prism-interactive/75 px-4 py-3 whitespace-nowrap",
        isActive && "bg-prism-interactive hover:bg-prism-interactive",
      )}
    >
      {children}
    </Link>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
function NavigationGroup(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <div
      className={
        "bg-prism-level-2 flex flex-row gap-[2px] overflow-hidden rounded-sm"
      }
    >
      {children}
    </div>
  );
}

function SelectNavigation() {
  const pathName = usePathname();
  const params = useParams();
  const router = useRouter();
  const { id, network } = params;

  const baseUrl = `/${network}/account/${id}`;

  // Navigation items mapping: label -> route
  const navigationItems: Record<string, string> = {
    Collections: "collections",
    Contracts: "contracts",
    Tokens: "",
    "Public Keys": "keys",
    "Public Storage": "public-storage",
    Staking: "staking",
    "Stored Items": "stored-items",
    Storefront: "storefront",
    "Linked Accounts": "Linked Accounts",
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
    router.push(`${baseUrl}/${route}`);
  };

  return (
    <Select
      className={"mb-6 h-[3rem] w-full px-4"}
      initialValue={getCurrentLabel()}
      options={labels}
      onChange={handleChange}
    />
  );
}

export default function FlatAccountNavigation() {
  return (
    <div className={"w-full"}>
      <div className={"flex lg:hidden"}>
        <SelectNavigation />
      </div>
      <div
        className={
          "mb-6 hidden flex-row flex-nowrap items-center gap-4 max-md:flex-wrap lg:flex"
        }
      >
        <NavigationGroup>
          <NavigationLink to={""}>Tokens</NavigationLink>
          <NavigationLink to={"collections"}>Collections</NavigationLink>
          <NavigationLink to={"staking"}>Staking</NavigationLink>
        </NavigationGroup>

        {/* Second Group*/}
        <NavigationGroup>
          <NavigationLink to={"public-storage"}>Public Storage</NavigationLink>
          <NavigationLink to={"stored-items"}>Stored Items</NavigationLink>

          <NavigationLink to={"linked-accounts"}>
            Linked Accounts
          </NavigationLink>
        </NavigationGroup>

        {/* Third Group*/}
        <NavigationGroup>
          <NavigationLink to={"keys"}>Public Keys</NavigationLink>
          <NavigationLink to={"contracts"}>Contracts</NavigationLink>
          <NavigationLink to={"storefront"}>Storefront</NavigationLink>
        </NavigationGroup>
      </div>
    </div>
  );
}
