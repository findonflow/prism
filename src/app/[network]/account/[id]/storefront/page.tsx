import { Suspense } from "react";
import ViewAccountListings from "./content";

export default function Page() {
  return (
    <Suspense>
      <ViewAccountListings />
    </Suspense>
  );
}
