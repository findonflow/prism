import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"
import "ViewResolver"

transaction(parent: Address, factoryAddress: Address, filterAddress: Address){
    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Configure OwnedAccount if it doesn't exist
        if signer.storage.borrow<&HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath) == nil {
            var acctCap = signer.capabilities.account.issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()
            let ownedAccount <- HybridCustody.createOwnedAccount(acct: acctCap)
            signer.storage.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)

            for c in signer.capabilities.storage.getControllers(forPath: HybridCustody.OwnedAccountStoragePath) {
                c.delete()
            }


            signer.capabilities.storage.issue<&{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath)
            signer.capabilities.publish(
                signer.capabilities.storage.issue<&{HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath),
                at: HybridCustody.OwnedAccountPublicPath
            )
        }

        // Get CapabilityFactory & CapabilityFilter Capabilities
        let factory = getAccount(factoryAddress).capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath)
        assert(factory.check(), message: "factory address is not configured properly")

        let filter = getAccount(filterAddress).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        assert(filter.check(), message: "capability filter is not configured properly")

        let owned = signer.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)
            ?? panic("owned account not found")

        // Finally publish a ChildAccount capability on the signing account to the specified parent
        owned.publishToParent(parentAddress: parent, factory: factory, filter: filter)
    }
}