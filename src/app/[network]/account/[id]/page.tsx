/*--------------------------------------------------------------------------------------------------------------------*/
import { Construction } from "lucide-react";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function AccountDetailsPage() {
  return (
    <div className={"flex flex-row gap-2 items-center text-orange-400 font-light"}>
      <Construction className={"w-4 h-4"}/>
      <p>Here we will show information about linked accounts</p>
      <Construction className={"w-4 h-4"}/>
    </div>
  );
}
