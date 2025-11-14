"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import useAccountResolver from "@/hooks/useAccountResolver";
import { useBasicDetails } from "@/hooks/useBasicDetails";
import AccountSidebarDisplay from "@/components/ui/account-sidebar/display";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountSidebar(props: { id: string }) {
  const { id } = props;
  const { network } = useParams();

  const { data: resolved, isPending: isResolving } = useAccountResolver(
    id as string,
  );
  const address = resolved?.owner;

  const { data: details, isPending: loadingDetails } = useBasicDetails(address);
  const isLoading = isResolving || loadingDetails;

  return (
    <AccountSidebarDisplay
      id={id}
      network={network}
      details={details}
      address={address}
      isLoading={isLoading}
    />
  );
}
