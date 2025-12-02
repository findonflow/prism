export default async function getTokenRegistry(network: string): Promise<any> {
  const prefix = network === "testnet" ? "testnet-": "";
  let url = `https://${prefix}token-list.fixes.world/api/token-list`
  const raw = await fetch(url).then(t => t.json())

  const tokenByPath = raw.tokens.reduce((acc: any, item: any) => {
    acc[item.path.vault] = item;
    return acc
  },{})

  return {
    ...raw,
    tokenByPath
  }
}
/*--------------------------------------------------------------------------------------------------------------------*/
export async function getCollectionRegistry(network: string): Promise<any> {
  const prefix = network === "testnet" ? "testnet-": "";
  let url = `https://${prefix}token-list.fixes.world/api/nft-list`
  const raw = await fetch(url).then(t => t.json())

  const tokenByPath = raw.tokens.reduce((acc: any, item: any) => {
    acc[item.path.storage] = item;
    return acc
  },{})

  return {
    ...raw,
    tokenByPath
  }
}