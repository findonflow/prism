import { query } from "@onflow/fcl";

/*--------------------------------------------------------------------------------------------------------------------*/
export interface AddressOwner {
  status?: string;
  owner: string | null;
}
/*--------------------------------------------------------------------------------------------------------------------*/
const LeaseStatus = {
  "0": "FREE",
  "1": "TAKEN",
  "2": "LOCKED",
};
/*--------------------------------------------------------------------------------------------------------------------*/
export async function fetchFindAddress(
  name: string,
): Promise<AddressOwner | null> {
  let fixedName = name;
  if (name.startsWith("find:")) {
    fixedName = name.slice(5);
  }
  if (name.endsWith(".find")) {
    fixedName = name.slice(0, -5);
  }

  const cadence = `
    import FIND from 0xFIND
  
    access(all) fun main(name:String) : FIND.NameStatus{
      return FIND.status(name)
    }
  `;

  const result = await query({
    cadence,
    args: (arg, t) => [arg(fixedName, t.String)],
  });

  console.log({ result });

  return {
    status: LeaseStatus[result?.status?.rawValue as keyof typeof LeaseStatus],
    owner: result.owner,
  };
}
