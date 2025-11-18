import AccountStakingContent from "./content";
import PageLayout from "@/components/ui/layout";

export default function Page() {
  return (
    <PageLayout title={"Staking Info"}>
      <AccountStakingContent />
    </PageLayout>
  );
}
