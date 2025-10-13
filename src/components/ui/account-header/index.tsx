/*--------------------------------------------------------------------------------------------------------------------*/
import QRCode from "react-qr-code";
import { TypeH2, TypeLabel } from "@/components/ui/typography";
import CopyText from "@/components/flowscan/CopyText";
import BasicAccountDetails from "@/components/ui/account-details";

/*--------------------------------------------------------------------------------------------------------------------*/
interface AccountHeaderProps {
  address: string;
  network: string;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export default function AccountHeader(props: AccountHeaderProps) {
  const { address, network } = props;
  const qrData = `https://prism.flowscan.io/${network}/account/${address}`;

  return (
    <div
      className={"flex flex-col w-full space-y-6 justify-between items-stretch"}
    >
      <div className={"w-32 aspect-square"}>
        <QRCode
          size={64}
          value={qrData}
          viewBox={"0 0 256 256"}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        />
      </div>
      <div className={"flex flex-col items-start justify-start gap-4"}>
        <div className={"flex flex-col items-start justify-start"}>
          <TypeLabel>Account:</TypeLabel>

          <div className={"flex flex-row items-center justify-start gap-3"}>
            <TypeH2>{address}</TypeH2>
            <CopyText text={address} className={"text-lg"} />
          </div>
        </div>
        <BasicAccountDetails address={address} />
      </div>
    </div>
  );
}
