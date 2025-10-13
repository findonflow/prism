"use client";
/*--------------------------------------------------------------------------------------------------------------------*/
import QueryProvider from "@/fetch/provider";
import { ReactNode } from "react";
import { useParams } from "next/navigation";

/*--------------------------------------------------------------------------------------------------------------------*/
export default function MainContent(props: { children: ReactNode }) {
  const { children } = props;
  const params = useParams();
  const { network } = params;

  return <QueryProvider network={network as string}>{children}</QueryProvider>;
}
