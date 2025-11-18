/*--------------------------------------------------------------------------------------------------------------------*/
import AccountStoredItemsContent from "@/app/[network]/account/[id]/stored-items/content";
import PageLayout from "@/components/ui/layout";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorage() {
  return (
    <PageLayout title={"Account Storage"}>
      <AccountStoredItemsContent />
    </PageLayout>
  );
}
