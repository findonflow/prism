import { ReactNode, Suspense } from "react";
import AccountHeader from "@/components/ui/account-header";

/*--------------------------------------------------------------------------------------------------------------------*/
interface AccountProps {
  children: ReactNode;
  params: Promise<{ id: string; network: string }>;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default async function AccountDetailsLayout(props: AccountProps) {
  const { children } = props;
  const { id, network } = await props.params;

  return (
    <div className={"flex w-full flex-col gap-4"}>
      <Suspense>
        <AccountHeader address={id} network={network} />
      </Suspense>

      {children}
    </div>
  );
}
