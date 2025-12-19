/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageLayout from "@/components/ui/layout";
import CollectionPathContent from "./content";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function IndividualCollectionPage(props: { params: Promise<any> }) {
  const params = await props.params;
  const { collectionName, network, id } = params;

  const backLink = `/${network}/account/${id}/collections`;

  return (
    <PageLayout
      title={`Collection: ${collectionName}`}
      extra={
        <Link href={backLink} className={"flex items-center gap-1 text-prism-primary"}>
          <ArrowLeft className={"h-4 w-4"} />
          <span className={"underline"}>Back to collections</span>
        </Link>
      }
    >
      <Suspense>
        <CollectionPathContent />
      </Suspense>
    </PageLayout>
  );
}
