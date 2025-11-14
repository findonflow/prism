/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import JumpingDots from "@/components/flowscan/JumpingDots";
import ContractDetailsContent from "./content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function ContractDetailsPage(props: {
  params: Promise<{ contractName: string }>;
}) {
  const { params } = props;
  const { contractName } = await params;
  return (
      <Suspense fallback={<JumpingDots />}>
        <ContractDetailsContent contractName={contractName} />
      </Suspense>
  );
}
