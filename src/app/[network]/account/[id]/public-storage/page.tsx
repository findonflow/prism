/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import AccountPublicStorageContent from "@/app/[network]/account/[id]/public-storage/content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorage() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <AccountPublicStorageContent />
      </Suspense>
    </div>
  );
}
