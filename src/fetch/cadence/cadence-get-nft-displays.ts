// eslint-disable-file
export const cadenceGetNftDisplays2 = `
  import NonFungibleToken from 0xNonFungibleToken
  import MetadataViews from 0xMetadataViews
  import FindViews from 0xFindViews
  import Flowmap from 0xFlowMap
  import ViewResolver from 0xViewResolver
  
  access(all) struct ViewInfo {
    access(all) let name: String
    access(all) let description: String
    access(all) let thumbnail: {MetadataViews.File}
    access(all) let rarity: String?
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


export const cadenceGetNftDisplays = `
import NonFungibleToken from 0xNonFungibleToken
import MetadataViews from 0xMetadataViews

access(all) fun main(address: Address, path: String, ids: [UInt64], detail:Bool) : {String:AnyStruct} {

    let res : {String:AnyStruct}={}
    let collection : {String: &{NonFungibleToken.Collection}} = {}
    for i, id in ids {
        let sp = StoragePath(identifier:path)!
        let key = address.toString().concat("-").concat(path).concat("-").concat(id.toString())

        if collection[key] == nil {
            let a = getAuthAccount<auth(BorrowValue) &Account>(address)
            var c =a.storage.borrow<&{NonFungibleToken.Collection}>(from: sp)
            if c != nil{
                collection[key] = c!
            }
        }

        if let c = collection[key] {
            if c.getType().isRecovered {
                continue
            }
            if let nftRef = c.borrowNFT(id) {
                res[key]=NFTInfo(nftRef, owner: address, storagePath: path, detail:detail)
            }
        }
    }
    return res
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
}`