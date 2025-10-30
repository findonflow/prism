import { ReactNode, Suspense } from "react";
import CollectionPathContent from "./content";

export default function Page() {
  return (
    <Suspense>
      <CollectionPathContent />
    </Suspense>
  );
}
