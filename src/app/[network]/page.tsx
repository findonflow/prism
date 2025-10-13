export default async function NetworkPage(props: { params: any }) {
  const params = (await props.params) || {};

  return (
    <div>
      <h2>{params.network} Details</h2>
      <p>Page is aware about it's context as well</p>
    </div>
  );
}
