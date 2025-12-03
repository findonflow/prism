import SimpleTag from "@/components/flowscan/SimpleTag";
import { KeyRound } from "lucide-react";
/*--------------------------------------------------------------------------------------------------------------------*/
export interface Entitlement {
  fields: any | null;
  initializers?: any | null;
  kind: String | null;
  type?: String | null;
  typeID: string;
}
/*--------------------------------------------------------------------------------------------------------------------*/
export function Entitlement(props: { entitlement: Entitlement }) {
  const { entitlement } = props;
  const parts = entitlement.typeID.split(".");
  const entKind = parts[3];

  const title = `Entitlement: ${entKind}\nContract: A.${parts[1]}.${parts[2]}`;

  return (
    <SimpleTag
      category={<KeyRound />}
      label={entKind}
      title={title}
      className={"text-prism-primary"}
    />
  );
}
