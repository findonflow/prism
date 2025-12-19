/*--------------------------------------------------------------------------------------------------------------------*/
import PageLayout from "@/components/ui/layout";
import AccountPublicStorageContent from "./content";
import { useSearchParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorage() {
  const searchParams = useSearchParams();
  console.log({searchParams});

  return (
    <PageLayout title={"Public Storage"}>
      <AccountPublicStorageContent />
    </PageLayout>
  );
}
