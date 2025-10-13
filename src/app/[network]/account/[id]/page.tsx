export default async function AccountDetailsPage(props: { params: any }) {
  const params = await props.params;

  return <div>This is account {params.id} details page</div>;
}
