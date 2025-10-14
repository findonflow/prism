import { ReactNode, Suspense } from "react";
import AccountHeader from "@/components/ui/account-header";
import AccountNavigation from "@/app/[network]/account/[id]/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
interface AccountProps {
  children: ReactNode;
  params: Promise<{ id: string; network: string }>;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountDetailsLayout(props: AccountProps) {
  const { children } = props;

  return (
    <div className={"flex w-full flex-col gap-4 items-start justify-start"}>
      <Suspense>
        <AccountHeader/>
        <AccountNavigation/>
      </Suspense>

      {children}
    </div>
  );
}
