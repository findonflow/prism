/*--------------------------------------------------------------------------------------------------------------------*/
import AccountKeysContent from "@/app/[network]/account/[id]/keys/content";
import PageLayout from "@/components/ui/layout";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountKeys() {
  return (
    <PageLayout title={"Account Public Keys"}>
      <AccountKeysContent />
    </PageLayout>
  );
}
