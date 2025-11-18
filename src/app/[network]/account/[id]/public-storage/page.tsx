/*--------------------------------------------------------------------------------------------------------------------*/
import PageLayout from "@/components/ui/layout";
import AccountStoredItemsContent from "@/app/[network]/account/[id]/stored-items/content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorage() {
  return (
    <PageLayout title={"Public Storage"}>
      <AccountStoredItemsContent />
    </PageLayout>
  );
}
