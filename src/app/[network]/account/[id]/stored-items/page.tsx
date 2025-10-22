/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import AccountStoredItemsContent from "@/app/[network]/account/[id]/stored-items/content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountPublicStorage() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <AccountStoredItemsContent />
      </Suspense>
    </div>
  );
}
