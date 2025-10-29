// eslint-disable-file
export const cadenceGetNftDisplays = `
  import NonFungibleToken from 0xNonFungibleToken
  import MetadataViews from 0xNonFungibleToken
  import FindViews from 0xFIND
  import Flowmap from 0xFlowMap
  import ViewResolver from 0xNonFungibleToken
  
  access(all) struct ViewInfo {
    access(all) let name: String
    access(all) let description: String
    access(all) let thumbnail: {MetadataViews.File}
    access(all) let rarity: String?
    access(all) let transferrable: Bool
    access(all) let collectionDisplay: MetadataViews.NFTCollectionDisplay?
    access(all) let inscription: String
    access(all) let tokenId: UInt64
  
    init(name: String, description: String, thumbnail: {MetadataViews.File}, rarity: String?, transferrable: Bool, collectionDisplay: MetadataViews.NFTCollectionDisplay?, inscription: String, tokenId: UInt64) {
      self.name = name
      self.description = description
      self.thumbnail = thumbnail
      self.rarity = rarity
      self.transferrable = transferrable
      self.collectionDisplay = collectionDisplay
      self.inscription = inscription
      self.tokenId = tokenId
    }
  }
  
  access(all) fun main(address: Address, storagePathID: String, tokenIDs: [UInt64]): {UInt64: ViewInfo} {
    let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
    let res: {UInt64: ViewInfo} = {}
    var collectionDisplayFetched = false
  
    if tokenIDs.length == 0 {
      return res
    }
  
    let path = StoragePath(identifier: storagePathID)!
    let type = account.storage.type(at: path)
    if type == nil {
      return res
    }
  
    let metadataViewType = Type<@{ViewResolver.ResolverCollection}>()
  
    let conformedMetadataViews = type!.isSubtype(of: metadataViewType)
    if !conformedMetadataViews {
      for tokenID in tokenIDs {
        var inscription = ""
        if storagePathID == "flowmapCollection" {
          let collectionRef = account.storage.borrow<&{Flowmap.CollectionPublic}>(from: path)
          if let c = collectionRef {
            if let nft = c.borrowFlowmap(id: tokenID) {
              inscription = nft.inscription
            }
          }
        }
        res[tokenID] = ViewInfo(
          name: storagePathID,
          description: "",
          thumbnail: MetadataViews.HTTPFile(url: ""),
          rarity: nil,
          transferrable: true,
          collectionDisplay: nil,
          inscription: inscription,
          tokenId: tokenID
        )
      }
      return res
    }
  
    let collectionRef = account.storage.borrow<&{ViewResolver.ResolverCollection, NonFungibleToken.CollectionPublic}>(from: path)
    for tokenID in tokenIDs {
      let placeholder = ViewInfo(
          name: storagePathID,
          description: "",
          thumbnail: MetadataViews.HTTPFile(url: ""),
          rarity: nil,
          transferrable: true,
          collectionDisplay: nil,
          inscription: "",
          tokenId: tokenID
        )
      let viewResolver = collectionRef!.borrowViewResolver(id: tokenID)
      if let resolver = viewResolver {
          if let display = MetadataViews.getDisplay(resolver) {
              var rarityDesc: String? = nil
              if let rarityView = MetadataViews.getRarity(resolver) {
                  rarityDesc = rarityView.description
              }
              let transferrable = !FindViews.checkSoulBound(resolver)
  
              var collectionDisplay: MetadataViews.NFTCollectionDisplay? = nil
              if (!collectionDisplayFetched) {
                  if let cDisplay = MetadataViews.getNFTCollectionDisplay(resolver) {
                  collectionDisplay = cDisplay
                  collectionDisplayFetched = true
                  }
              }
  
              res[tokenID] = ViewInfo(
                  name: display.name,
                  description: display.description,
                  thumbnail: display.thumbnail,
                  rarity: rarityDesc,
                  transferrable: transferrable,
                  collectionDisplay: collectionDisplay,
                  inscription: "",
                  tokenId: tokenID
              )
          } else {
              res[tokenID] = placeholder
          }
      } else {
        res[tokenID] = placeholder
      }
    }
    return res
  }
`;
