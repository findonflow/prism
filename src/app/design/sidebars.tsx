"use client";

/*--------------------------------------------------------------------------------------------------------------------*/
import { TransactionSidebarProvider } from "@/components/ui/transaction-sidebar/TransactionSidebarProvider";
import { TransactionSidebarDisplay } from "@/components/ui/transaction-sidebar/TransactionSidebarDisplay";
import { Divider } from "@/components/ui/primitive";
import { TypeH2, TypeP } from "@/components/ui/typography";

/*--------------------------------------------------------------------------------------------------------------------*/
const examples = [
  "57a1ee6c918b33d13c34e18ed8f1fe9db8f3fffc51df36f21f3ec3b02bfb1577",
  "733f04fa5c395b070376098f361163492fd1a70e7ea560c21af1ecb59ebe318f",
  //"a5846dcd5779368c7465ce3217d313e93171408f3e5463ebe61a661e5649a7e3", // multisig
  // "7155780825f0c2034932c48d8127af9cf21a44b020dc5230b7c9dc354625a2ce",


  // THIS IS BROKEN "BY DESIGN" - REST API returns non-compatible values
  // "263ae6234ad8537e62affc3cbfac844566bfdb2f2b20b4cdd63475c8e03e1b74", // system transaction spoiled by EVM ????
];

export default function Sidebars() {
  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-6"}>
      <Divider />

      <div className={"flex flex-col items-start space-y-2"}>
        <TypeH2 className={"flex flex-row items-end gap-2"}>
          <span>Tags</span>
        </TypeH2>
        <TypeP>
          Simple components that bring variations in monotonous textual display
        </TypeP>
      </div>

      <div className={"flex flex-row gap-10"}>
        {examples.map((hash) => (
          <div className="h-[600px]">
            <TransactionSidebarProvider
              key={hash}
              hash={hash}
              render={(props) => <TransactionSidebarDisplay {...props} />}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
