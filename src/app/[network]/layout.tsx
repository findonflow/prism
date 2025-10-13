import { Suspense } from "react";

export default async function NetworkSpecificLayout(props: {
  params: any;
  children: any;
}) {
  const { children } = props;
  const params = (await props.params) || {};
  return (
    <div>
      <h1 className={"text-xl font-bold"}>{params.network}</h1>
      <Suspense>{children}</Suspense>
    </div>
  );
}
