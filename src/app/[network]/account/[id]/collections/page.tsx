/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import AccountCollectionsContent from "./content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountCollection() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <AccountCollectionsContent />
      </Suspense>
    </div>
  );
}
