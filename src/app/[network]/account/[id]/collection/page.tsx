/*--------------------------------------------------------------------------------------------------------------------*/
import AccountKeysContent from "@/app/[network]/account/[id]/keys/content";
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import ViewPrismCollectionList from "./content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountCollection() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <ViewPrismCollectionList />
      </Suspense>
    </div>
  );
}
