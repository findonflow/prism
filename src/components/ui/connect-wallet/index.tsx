"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { Button } from "@/components/ui/button";
import { FCLProvider, useLoginContext } from "@/fetch/provider";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function ConnectWallet() {
  const { loginUser, user, logoutUser } = useLoginContext();
  return (
    <Button
      onClick={() => {
        user.address ? logoutUser() : loginUser();
      }}
      title={"Connect wallet of your choosing to have extended functionality"}
    >
      {user.address ? user.address : "Connect Wallet"}
    </Button>
  );
}
