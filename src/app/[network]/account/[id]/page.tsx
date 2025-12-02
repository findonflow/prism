/*--------------------------------------------------------------------------------------------------------------------*/
import LinkedAccountsContent from "@/app/[network]/account/[id]/content";
import PageLayout from "@/components/ui/layout";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function AccountDetailsPage() {
  return (
    <PageLayout title={"Linked Accounts"}>
      <LinkedAccountsContent />
    </PageLayout>
  );
}
