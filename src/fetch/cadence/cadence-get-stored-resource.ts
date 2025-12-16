export const cadenceGetStoredResource = `
import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken
import ViewResolver from 0xViewResolver
import MetadataViews from 0xMetadataViews

access(all) struct StorageItem {
    access(all) let collectionDetails: CollectionDetails
    access(all) let nftDetails: NFTDetails
    access(all) let vaultDetails: VaultDetails
    access(all) let genericInfo: GenericStorageInfo
    
    init(account: auth(Storage) &Account, path: StoragePath) {
        self.collectionDetails = CollectionDetails(account: account, path: path)
        self.nftDetails = NFTDetails(account: account, path: path)
        self.vaultDetails = VaultDetails(account: account, path: path)
        self.genericInfo = GenericStorageInfo(account: account, path: path)
    }
}

access(all) struct CollectionDetails {
    access(all) let itemIDs: [UInt64]
    access(all) let isCollection: Bool
    
    init(account: auth(Storage) &Account, path: StoragePath) {
        var tempIsCollection = false
        var tempItemIDs: [UInt64] = []
        
        // Check the type before borrowing
        let type = account.storage.type(at: path)
        if type != nil && type!.isSubtype(of: Type<@{NonFungibleToken.Collection}>()) {
            if let ref = account.storage.borrow<&{NonFungibleToken.Collection}>(from: path) {
                tempIsCollection = true
                tempItemIDs = ref.getIDs()
            }
        }
        
        self.isCollection = tempIsCollection
        self.itemIDs = tempItemIDs
    }
}

access(all) struct NFTDetails{
  access(all) let id: UInt64?
  
  init(account: auth(Storage) &Account, path: StoragePath) {
    var tempId: UInt64? = nil
    
    let type = account.storage.type(at: path)
    if type != nil && type!.isSubtype(of: Type<@{NonFungibleToken.NFT}>()) {
        if let ref = account.storage.borrow<&{NonFungibleToken.NFT}>(from: path) {
            tempId = ref.id
        }
    }
    
    self.id = tempId
  }
}

access(all) struct VaultDetails{
  access(all) let balance: UFix64?
  
  init(account: auth(Storage) &Account, path: StoragePath) {
    var tempBalance: UFix64? = nil
    
    let type = account.storage.type(at: path)
    if type != nil && type!.isSubtype(of: Type<@{FungibleToken.Vault}>()) {
        if let ref = account.storage.borrow<&{FungibleToken.Vault}>(from: path) {
            tempBalance = ref.balance
        }
    }
    
    self.balance = tempBalance
  }
}

access(all) struct GenericStorageInfo {
    access(all) let type: Type?
    access(all) let typeIdentifier: String?
    
    init(account: auth(Storage) &Account, path: StoragePath) {
        let storedType = account.storage.type(at: path)
        self.type = storedType
        self.typeIdentifier = storedType?.identifier
    }
}

access(all) fun main(address: Address, pathStr: String): StorageItem {
    let account = getAuthAccount<auth(Storage) &Account>(address)
    let path = StoragePath(identifier: pathStr)!
    
    return StorageItem(account: account, path: path)
}
`

export const cadenceGetStoredResource2 = `
  access(all) fun main(address: Address, pathStr: String): &AnyStruct? {
    let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
    let path = StoragePath(identifier: pathStr)!
    
    return account.storage.borrow<&AnyStruct>(from: path)
  }
`