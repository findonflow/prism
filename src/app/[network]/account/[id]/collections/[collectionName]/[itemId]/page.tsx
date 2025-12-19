/*--------------------------------------------------------------------------------------------------------------------*/
import { Suspense } from "react";
import SingleCollectionItemPage from "./content";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageLayout from "@/components/ui/layout";

/*--------------------------------------------------------------------------------------------------------------------*/
export default async function SingleItemPage(props: {params: Promise<any>}) {
  const params = await props.params;
  const { collectionName, network, id, itemId } = params;

  const backLink = `/${network}/account/${id}/collections/${collectionName}`;

  return (
    <PageLayout
      title={`Item: ${itemId}`}
      extra={
        <Link
          href={backLink}
          className={"text-prism-primary flex items-center gap-1"}
        >
          <ArrowLeft className={"h-4 w-4"} />
          <span className={"underline"}>Back to collection</span>
        </Link>
      }
    >
      <Suspense>
        <SingleCollectionItemPage />
      </Suspense>
    </PageLayout>
  );
}
