import { ReactNode, Suspense } from "react";
import AccountHeader from "@/components/ui/account-header";

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
      </Suspense>

      {children}
    </div>
  );
}
