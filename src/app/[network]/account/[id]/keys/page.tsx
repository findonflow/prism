/*--------------------------------------------------------------------------------------------------------------------*/
import AccountKeysContent from "@/app/[network]/account/[id]/keys/content";
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";

interface AccountKeysProps {
  params: Promise<{ id: string }>;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default async function AccountKeys(props: AccountKeysProps) {
  const params = await props.params;
  const { id } = params;

  return (
    <div className={"w-full"}>
      <Suspense fallback={<JumpingDots />}>
        <AccountKeysContent address={id} />
      </Suspense>
    </div>
  );
}
