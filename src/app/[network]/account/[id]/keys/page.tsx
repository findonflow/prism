/*--------------------------------------------------------------------------------------------------------------------*/
import AccountKeysContent from "@/app/[network]/account/[id]/keys/content";
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountKeys() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <AccountKeysContent />
      </Suspense>
    </div>
  );
}
