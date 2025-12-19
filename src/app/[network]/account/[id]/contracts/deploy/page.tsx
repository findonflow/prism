import DeployContractPage from "@/app/[network]/deploy/content";
import PageLayout from "@/components/ui/layout";

export default function DeployContractPageInner() {
  return (
    <PageLayout title={"Deploy new contract"}>
      <DeployContractPage />
    </PageLayout>
  );
}
