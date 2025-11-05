import TransactionDetails from "@/app/[network]/tx/[hash]/content";

export default async function TransactionDetailsPage(props: { params: any }) {
  const params = await props.params;

  return <TransactionDetails />;
}
