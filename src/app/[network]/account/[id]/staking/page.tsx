import JumpingDots from "@/components/flowscan/JumpingDots";
import { Suspense } from "react";
import AccountStakingContent from "./content";

export default function Page() {
  return (
    <Suspense fallback={<JumpingDots />}>
      <AccountStakingContent />
    </Suspense>
  );
}
