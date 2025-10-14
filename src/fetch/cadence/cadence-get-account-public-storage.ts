export const cadenceGetAccountPublicStorage = `
    access(all) struct Item {
      access(all) let address: Address
      access(all) let path: String
      access(all) let targetPath: String?

      init(address: Address, path: String, targetPath: String?) {
        self.address = address
        self.path = path
        self.targetPath = targetPath
      }
    }

    access(all) fun main(address: Address): [Item] {
      let account = getAuthAccount<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>(address)
      let items: [Item] = []

      let outdatedPaths: {PublicPath: Bool} = {
        /public/FantastecNFTCollection: true,
        /public/jambbLaunchCollectiblesCollection: true,
        /public/RacingTimeCollection: true,
        /public/MusicBlockCollection: true,
        /public/SupportUkraineCollectionV10: true,
        /public/DropzTokenCollection: true,
        /public/TokenLendingPlaceMinterProxy001: true,
        /public/TokenLendingPlace001: true,
        /public/BnGNFTCollection: true,
        /public/FuseCollectiveCollection: true,
        /public/NFTLXKickCollection: true,
        /public/MindtrixPackCollection: true,
        /public/MindtrixPackSetCollection: true
      }

      for path in account.storage.publicPaths {
        if (outdatedPaths.containsKey(path)) {
          continue
        }

        var targetPath: String? = nil
        // FIXME: This is a workaround to check if the path is a capability
        // There is no getLinkTarget method anymore
        if account.capabilities.exists(path) {
          targetPath = path.toString()
        }

        let item = Item(address: address, path: path.toString(), targetPath: targetPath)
        items.append(item)
      }

      return items
    }
`