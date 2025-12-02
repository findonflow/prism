/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import AccountCollectionsContent from "./content";
import { TypeSubsection } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountCollection() {
  return (
    <div className={"w-full space-y-4"}>
      <TypeSubsection>Account Collections</TypeSubsection>
      <Suspense fallback={<JumpingDots />}>
        <AccountCollectionsContent />
      </Suspense>
    </div>
  );
}
