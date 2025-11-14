"use client";
/* --------------------------------------------------------------------------------------------- */
import { useParams } from "next/navigation";
import { withPrefix } from "@/lib/validate";
import { truncateHash } from "@/components/ui/connect-wallet";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

/*--------------------------------------------------------------------------------------------------------------------*/
export function TagFlowAccount(props: {
  address?: string | null;
  findName?: string | null;
}) {
  const { address, findName } = props;
  const { network } = useParams();

  if (!address) {
    return null;
  }
  const fixedAddress = withPrefix(address);

  const short = truncateHash(fixedAddress, 4);

  if (findName) {
    return (
      <SimpleTag
        label={findName}
        hoverLabel={address}
        title={`${findName}:${address}`}
        className={cn("text-prism-interactive")}
        category={<UserRound />}
      />
    );
  }

  return (
    <a href={`/${network}/account/${fixedAddress}`} target={"_blank"}>
      <SimpleTag
        label={short}
        title={fixedAddress}
        className={cn("text-prism-primary")}
        category={<UserRound />}
      />
    </a>
  );
}

/*--------------------------------------------------------------------------------------------------------------------*/
export function TagDomain(props: { name?: string; address?: string }) {
  const { name, address } = props;

  const { network } = useParams();

  if (!name && !address) {
    return null;
  }
  return (
    <a href={`/${network}/account/${name}`} target={"_blank"}>
      <SimpleTag
        label={
          <span>
            <b>{name}</b>.find
          </span>
        }
        className={"text-prism-primary"}
      />
    </a>
  );
}
