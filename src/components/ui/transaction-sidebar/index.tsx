"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { TransactionSidebarProvider } from "./TransactionSidebarProvider";
import { TransactionSidebarDisplay } from "./TransactionSidebarDisplay";

/*--------------------------------------------------------------------------------------------------------------------*/
interface TransactionSidebarProps {
  hash?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionSidebar(props: TransactionSidebarProps) {
  const { hash } = props;
  return (
    <TransactionSidebarProvider
      hash={(hash as string) || ""}
      render={(props) => <TransactionSidebarDisplay {...props} />}
    />
  );
}
