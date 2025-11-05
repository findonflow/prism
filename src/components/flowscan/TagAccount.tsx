/*--------------------------------------------------------------------------------------------------------------------*/
import Link from "next/link";
import { useParams } from "next/navigation";
import { UserRound } from "lucide-react";
import SimpleTag from "@/components/flowscan/SimpleTag";

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
  const href = `/${network}/account/${address}`;

  return (
    <Link href={href}>
      <SimpleTag
        label={address}
        category={<UserRound className="h-4 w-4" />}
        className={className}
        title={title || `View account ${address}`}
      />
    </Link>
  );
}
