/*--------------------------------------------------------------------------------------------------------------------*/
import AccountContractsContent, { DeployContractButton } from "./content";
import PageLayout from "@/components/ui/layout";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountContracts() {
  return (
    <PageLayout title={"Deployed Contracts"} extra={<DeployContractButton />}>
      <AccountContractsContent />
    </PageLayout>
  );
}
