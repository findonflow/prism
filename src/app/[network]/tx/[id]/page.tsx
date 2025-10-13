export default async function TransactionDetailsPage(props: { params: any }) {
  const params = await props.params;

  return <div>Show details for transaction {params.id}</div>;
}
