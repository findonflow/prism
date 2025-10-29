/*--------------------------------------------------------------------------------------------------------------------*/
import {Suspense} from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import SingleCollectionItemPage from "./content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function SingleItemPage() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <SingleCollectionItemPage />
      </Suspense>
    </div>
  );
}
