/*--------------------------------------------------------------------------------------------------------------------*/
import PageLayout from "@/components/ui/layout";
import TokensPageContent from "@/app/[network]/account/[id]/content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function AccountDetailsPage() {
  return (
    <PageLayout title={"Account Tokens"}>
      <TokensPageContent />
    </PageLayout>
  );
}
