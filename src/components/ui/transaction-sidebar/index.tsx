"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { TransactionSidebarProvider } from "./TransactionSidebarProvider";
import { TransactionSidebarDisplay } from "./TransactionSidebarDisplay";
import { useParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
interface TransactionSidebarProps {
  hash?: string;
}

/*--------------------------------------------------------------------------------------------------------------------*/
export default function TransactionSidebar(props: TransactionSidebarProps) {
  const { hash } = useParams();
  return (
    <TransactionSidebarProvider
      id={(hash as string) || ""}
      render={(props) => <TransactionSidebarDisplay {...props} />}
    />
  );
}
