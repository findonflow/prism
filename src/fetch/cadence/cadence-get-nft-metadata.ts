export const cadenceGetNftMetadata2 =`
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews
import FindViews from 0xFindViews
import ViewResolver from 0xViewResolver

access(all) struct CollectionData {
  access(all) let storagePath: StoragePath
  access(all) let publicPath: PublicPath
  access(all) let publicCollection: Type
  access(all) let publicLinkedType: Type

  init(
    storagePath: StoragePath,
    publicPath: PublicPath,
    publicCollection: Type,
    publicLinkedType: Type,
  ) {
    self.storagePath = storagePath
    self.publicPath = publicPath
    self.publicCollection = publicCollection
    self.publicLinkedType = publicLinkedType
  }
}

access(all) fun main(address: Address, storagePathID: String, tokenID: UInt64): {String: AnyStruct} {
  let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
  let res: {String: AnyStruct} = {}

  let path = StoragePath(identifier: storagePathID)!
  let collectionRef = account.storage.borrow<&{NonFungibleToken.CollectionPublic, ViewResolver.ResolverCollection}>(from: path)
  if collectionRef == nil {
    panic("Get Collection Failed")
  }

  let type = account.storage.type(at: path)
  if type == nil {
    return res
  }

  let metadataViewType = Type<@{ViewResolver.ResolverCollection}>()
  let conformedMetadataViews = type!.isSubtype(of: metadataViewType)

  if (!conformedMetadataViews) {
    return res
  }

  collectionRef!.borrowNFT(tokenID)

  let resolver = collectionRef!.borrowViewResolver(id: tokenID)
  if resolver == nil {
    return res
  }


  if let rarity = MetadataViews.getRarity(resolver!) {
    res["rarity"] = rarity
  }

  if let display = MetadataViews.getDisplay(resolver!) {
    res["display"] = display
  }

  if let editions = MetadataViews.getEditions(resolver!) {
    res["editions"] = editions
  }

  if let serial = MetadataViews.getSerial(resolver!) {
    res["serial"] = serial
  }

  if let royalties = MetadataViews.getRoyalties(resolver!) {
    res["royalties"] = royalties
  }

  if let license = MetadataViews.getLicense(resolver!) {
    res["license"] = license
  }

  if let medias = MetadataViews.getMedias(resolver!) {
    res["medias"] = medias
  }

  if let externalURL = MetadataViews.getExternalURL(resolver!) {
    res["externalURL"] = externalURL
  }

  if let traits = MetadataViews.getTraits(resolver!) {
    res["traits"] = traits
  }

  if let collectionDisplay = MetadataViews.getNFTCollectionDisplay(resolver!) {
    res["collectionDisplay"] = collectionDisplay
  }

  res["soulbound"] = FindViews.checkSoulBound(resolver!)

  if let collectionData = MetadataViews.getNFTCollectionData(resolver!) {
    let data = CollectionData(
      storagePath: collectionData.storagePath,
      publicPath: collectionData.publicPath,
      publicCollection: collectionData.publicCollection,
      publicLinkedType: collectionData.publicLinkedType,
    )
    res["collectionData"] = data
  }

  res["tokenId"] = tokenID

  return res
}
`

export const cadenceGetNftMetadata = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews

access(all) fun main(address: Address, path: String, id: UInt64): NFTInfo? {

    let storagePath = StoragePath(identifier:path)!
    let account = getAuthAccount<auth(BorrowValue) &Account>(address)
    let collection =account.storage.borrow<&{NonFungibleToken.Collection}>(from: storagePath)

    if let nftRef = collection!.borrowNFT(id) {
        return NFTInfo(nftRef, owner: address, storagePath: path, detail:true)
    }
    
    return nil
}

access(all) struct NFTInfo {
    access(all) let id: UInt64
    access(all) let uuid:UInt64
    access(all) var name:String
    access(all) var thumbnail:String
    access(all) var serial:UInt64?
    access(all) let storagePath:String
    access(all) let owner:Address

    access(all) var type: String
    access(all) var description: String?
    access(all) var externalUrl: String?
    access(all) var rarity:String?
    access(all) var editionNumber: UInt64?
    access(all) var totalInEdition: UInt64?
    access(all) var tags : {String:AnyStruct}
    access(all) var traits : [MetadataViews.Trait]
    access(all) var collectionName: String?
    access(all) var collectionImage: String?
    access(all) var collectionBanner: String?
    access(all) var collectionDescription: String?
    access(all) var views: [String]
    access(all) var medias: [Media]
    access(all) var editions: [MetadataViews.Edition]
    access(all) var royalties: [Royalty]

    init(_ item: &{NonFungibleToken.NFT}, owner:Address, storagePath: String, detail: Bool){

        self.serial=nil
        self.medias=[]
        self.editions=[]
        self.owner=owner
        self.id=item.id
        self.uuid=item.uuid
        self.tags = {}
        self.royalties=[]
        self.views=[]
        self.traits=[]
        self.description=nil

        self.collectionName=nil
        self.collectionDescription=nil
        self.collectionImage=nil
        self.collectionBanner=nil
        self.rarity= nil
        self.externalUrl=nil
        self.editionNumber=nil
        self.totalInEdition=nil
        self.storagePath=storagePath
        self.type=item.getType().identifier
        let parts = self.type.split(separator:".")
        self.name=parts[2].concat(" #").concat(item.id.toString())
        self.thumbnail=""

        let d = MetadataViews.getDisplay(item) 
        if d == nil{
            return
        } 

        let display=d!
        self.name=display.name
        self.thumbnail=display.thumbnail.uri()

        if let ncd = MetadataViews.getNFTCollectionDisplay(item) {
            self.collectionName=ncd.name
            self.collectionImage=ncd.squareImage.file.uri()
        }
        if let rarity = MetadataViews.getRarity(item) {
            if rarity.description != nil {
                self.rarity=rarity.description!
            }else {

                var r=""
                if rarity.score != nil {
                    r = rarity.score!.toString()
                    if rarity.max != nil {
                        r = r.concat("/").concat(rarity.max!.toString())
                    }
                    self.rarity=r
                }
            }
        }


        let editions : [MetadataViews.Edition] = []
        if let view = item.resolveView(Type<MetadataViews.Edition>()) {
            if let e = view as? MetadataViews.Edition {
                editions.append(e)
            }
        }

        if let e = MetadataViews.getEditions(item) {
            editions.appendAll(e.infoList)
        }

        if editions.length == 1 {
            self.editionNumber=editions[0].number
            self.totalInEdition=editions[0].max
        } else {
            for edition in editions {
                if edition.name == nil {
                    self.editionNumber=edition.number
                    self.totalInEdition=edition.max
                }
            }
        }

        if let serial = MetadataViews.getSerial(item) {
            self.serial=serial.number
        }
        if let url = MetadataViews.getExternalURL(item) {
            self.externalUrl=url.url
        }
        if !detail{
            return 
        }

        self.editions=editions


        if let ncd = MetadataViews.getNFTCollectionDisplay(item) {
            self.collectionDescription=ncd.description
            self.collectionBanner=ncd.bannerImage.file.uri()
        }

        if let medias= MetadataViews.getMedias(item)  {
            for m in medias.items {
                self.medias.append(Media(m))
            }
        }

        if let royalties = MetadataViews.getRoyalties(item) {
            for ci in royalties.getRoyalties() {
                self.royalties.append(Royalty(ci))
            }
        }


        self.description=display.description


        self.views=[]
        for v in item.getViews(){
            self.views.append(v.identifier)
        }

        var singleTrait : MetadataViews.Trait? = nil
        let traits : [MetadataViews.Trait] = []
        if let view = item.resolveView(Type<MetadataViews.Trait>()) {
            if let t = view as? MetadataViews.Trait {
                singleTrait = t
                traits.append(t)
            }
        }

        if let t =  MetadataViews.getTraits(item) {
            traits.appendAll(t.traits)
        }
        self.traits=traits
    }
}

access(all) struct Media {
    access(all) let uri :String
    access(all) let contentType :String

    init(_ m : MetadataViews.Media) {
        self.uri =m.file.uri()
        self.contentType=m.mediaType
    }
}

access(all) struct Royalty {
    access(all) let owner :Address
    access(all) let cut :UFix64
    access(all) let description: String

    init(_ mvr : MetadataViews.Royalty) {
        self.owner=mvr.receiver.address
        self.cut=mvr.cut
        self.description=mvr.description
    }
}
`