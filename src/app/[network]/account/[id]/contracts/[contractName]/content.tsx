"use client";
/*--------------------------------------------------------------------------------------------------------------------*/

export default function ContractDetailsContent(props: {
  contractName: string;
}) {
  const { contractName } = props;
  return <div>{contractName}</div>;
}
