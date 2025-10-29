"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import { useParams } from "next/navigation";
import {useNFTMetadata} from "@/hooks/useNFTMetadata";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function SingleCollectionItemPage() {
  const { itemId, collectionName, id } = useParams();
  const {data, isPending} = useNFTMetadata(id, collectionName, itemId)

  console.log({data})

  return <p>Show collection details here for {itemId}</p>;
}
