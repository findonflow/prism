/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import AccountContractsContent from "./content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountContracts() {
  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <AccountContractsContent />
      </Suspense>
    </div>
  );
}
