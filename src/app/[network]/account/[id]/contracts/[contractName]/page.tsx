/*--------------------------------------------------------------------------------------------------------------------*/
import { TypeP } from "@/components/ui/typography";
import JumpingDots from "@/components/flowscan/JumpingDots";
import { Suspense } from "react";
import ContractDetailsContent from "@/app/[network]/account/[id]/contracts/[contractName]/content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function ContractDetailsPage(props: {
  params: Promise<{ contractName: string }>;
}) {
  const { params } = props;
  const { contractName } = await params;
  return (
    <div>
      <TypeP>Show Cadence editor and "Update" button here</TypeP>
      <Suspense fallback={<JumpingDots />}>
        <ContractDetailsContent contractName={contractName} />
      </Suspense>
    </div>
  );
}
