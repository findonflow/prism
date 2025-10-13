"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { Button } from "@/components/ui/button";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function ConnectWallet() {
  return (
    <Button
      onClick={() => {
        console.log("[Mock] Connecting wallet... (not really...)");
      }}
      title={"Connect wallet of your choosing to have extended functionality"}
    >
      Connect Wallet
    </Button>
  );
}
