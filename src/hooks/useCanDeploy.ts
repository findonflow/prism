import { useAccountDetails } from "@/hooks/useAccountDetails";
import { useLoginContext } from "@/fetch/provider";

export default function useCanDeploy(contractName?: string | null) {
  const { user } = useLoginContext();
  const { data, isPending } = useAccountDetails(user.address);
  const contractList = Object.keys(data?.contracts || {});

  let nameCollision = false;
  if (contractName) {
    nameCollision = contractList.includes(contractName);
  }

  const isLoggedIn = Boolean(user.address);
  let canDeploy =
    Boolean(contractName) && !isPending && !nameCollision && isLoggedIn;

  return {
    isLoggedIn,
    isPending,
    nameCollision,
    canDeploy,
  };
}
