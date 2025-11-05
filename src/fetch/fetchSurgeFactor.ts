/*--------------------------------------------------------------------------------------------------------------------*/
import { cadenceGetSurgeFactor } from "@/fetch/cadence/cadence-get-surge-factor";
import * as fcl from "@onflow/fcl";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function fetchSurgeFactor(blockId?: string) {
  const interaction = blockId
    ? [fcl.script(cadenceGetSurgeFactor), fcl.atBlockId(blockId)]
    : [fcl.script(cadenceGetSurgeFactor)];

  const response = await fcl.send(interaction);
  const result = await fcl.decode(response);
  return parseFloat(result || "-1");
}
