/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserRound } from "lucide-react";
import SimpleTag from "@/components/flowscan/SimpleTag";
import { withPrefix } from "@/lib/validate";

/*--------------------------------------------------------------------------------------------------------------------*/
interface TagAccountProps {
  address: string;
  className?: string;
  title?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TagAccount(props: TagAccountProps) {
  const { address, className, title } = props;
  const { network } = useParams();

  const fixedAddress = withPrefix(address);

  const href = `/${network}/account/${fixedAddress}`;

  return (
    <Link href={href}>
      <SimpleTag
        label={fixedAddress}
        category={<UserRound className="h-4 w-4" />}
        className={className}
        title={title || `View account ${fixedAddress}`}
      />
    </Link>
  );
}
