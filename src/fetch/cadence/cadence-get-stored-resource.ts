export const cadenceGetStoredResource = `
import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken
import ViewResolver from 0xViewResolver
import MetadataViews from 0xMetadataViews

access(all) struct StorageItem {
    access(all) let collectionDetails: CollectionDetails
    access(all) let nftDetails: NFTDetails
    access(all) let vaultDetails: VaultDetails
    
    init(account: auth(Storage) &Account, path: StoragePath) {
        self.collectionDetails = CollectionDetails(account: account, path: path)
        self.nftDetails = NFTDetails(account: account, path: path)
        self.vaultDetails = VaultDetails(account: account, path: path)
    }
}

access(all) struct CollectionDetails {
    access(all) let itemIDs: [UInt64]
    access(all) let isCollection: Bool
    
    init(account: auth(Storage) &Account, path: StoragePath) {
        if let ref = account.storage.borrow<&{NonFungibleToken.Collection}>(from: path) {
            self.isCollection = true
            self.itemIDs = ref.getIDs()
        } else {
            self.isCollection = false
            self.itemIDs = []
        }
    }
}

access(all) struct NFTDetails{
  access(all) let id: UInt64?
  
  init(account: auth(Storage) &Account, path: StoragePath) {
    if let ref = account.storage.borrow<&{NonFungibleToken.NFT}>(from: path) {
        self.id = ref.id
    } else {
        self.id = nil
    }
  }
}

access(all) struct VaultDetails{
  access(all) let balance: UFix64?
  
  init(account: auth(Storage) &Account, path: StoragePath) {
    if let ref = account.storage.borrow<&{FungibleToken.Vault}>(from: path) {
        self.balance = ref.balance
    } else {
        self.balance = nil
    }
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