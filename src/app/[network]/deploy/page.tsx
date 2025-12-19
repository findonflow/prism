/*--------------------------------------------------------------------------------------------------------------------*/
import PageLayout from "@/components/ui/layout";
import DeployContractPage from "@/app/[network]/deploy/content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function DeployContractPageSingle() {
  return (
    <div className={"w-full p-8"}>
      <PageLayout title={"Deploy new contract"}>
        <DeployContractPage />
      </PageLayout>
    </div>
  );
}
