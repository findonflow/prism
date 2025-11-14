"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { Divider } from "@/components/ui/primitive";
import { TypeH2, TypeP } from "@/components/ui/typography";
import { Showcase } from "@/app/design/templates";
import ConnectWallet from "@/components/ui/connect-wallet";
import { SearchBar } from "@/components/flowscan/SearchBar";
import { useState } from "react";

export default function Inputs() {
  const [filter, setFilter] = useState("");
  return (
    <div className={"flex w-full flex-col items-start justify-start space-y-6"}>
      <Divider />

      <div className={"flex flex-col items-start space-y-2"}>
        <TypeH2 className={"flex flex-row items-end gap-2"}>
          <span>Inputs</span>
        </TypeH2>
        <TypeP>
          Atomic inputs available throughout app - input fields, dropdowns, etc.
        </TypeP>
      </div>

      <Showcase title={"Connect Wallet"}>
        <ConnectWallet />
      </Showcase>

      <Showcase title={"SearchBar with icon"} className={"w-1/2"}>
        <SearchBar
          value={filter}
          onChange={setFilter}
          placeholder={"Enter query to filter keys"}
          className={"min-h-[40px]"}
        />
      </Showcase>
    </div>
  );
}
