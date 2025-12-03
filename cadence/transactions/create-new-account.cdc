#allowAccountLinking

import "FungibleToken"
import "FlowToken"
import "MetadataViews"
import "ViewResolver"

import "HybridCustody"
import "CapabilityFactory"
import "CapabilityFilter"
import "CapabilityDelegator"

// NOTE: "factoryAddress" and "filterAddress" should point to a preconfigured filter and factory
transaction(pubKey: String, initialFundingAmount: UFix64, factoryAddress: Address, filterAddress: Address){
    prepare(parent: auth(Storage, Capabilities, Inbox) &Account){
        let newAccount = Account(payer: parent)

        // convert public key string into PublicKey
        let key = PublicKey(publicKey: pubKey.decodeHex(), signatureAlgorithm: SignatureAlgorithm.ECDSA_P256)
        newAccount.keys.add(
            publicKey: key,
            hashAlgorithm: HashAlgorithm.SHA3_256,
            weight: 1000.0
        )

        if initialFundingAmount > 0.0 {
            // take tokens out of parent
            let fundingProvider = parent.storage.borrow<auth(FungibleToken.Withdraw) &{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
            let funding <- fundingProvider.withdraw(amount: initialFundingAmount)

            // and place them into newly created account
            newAccount.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
                .borrow()!
                .deposit(
                    from: <- funding
                )
        }

        // Create OwnedAccount resource and store it on newly create account
        let accountCapability = newAccount.capabilities.account.issue<auth(Storage, Contracts, Keys, Inbox, Capabilities) &Account>()

        let ownedAccount <- HybridCustody.createOwnedAccount(acct: accountCapability)
        newAccount.storage.save(<-ownedAccount, to: HybridCustody.OwnedAccountStoragePath)

        newAccount.capabilities.storage.issue<&{HybridCustody.BorrowableAccount, HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath)
        newAccount.capabilities.publish(
            newAccount.capabilities.storage.issue<&{HybridCustody.OwnedAccountPublic, ViewResolver.Resolver}>(HybridCustody.OwnedAccountStoragePath),
            at: HybridCustody.OwnedAccountPublicPath
        )

        let ownedRef = newAccount.storage.borrow<auth(HybridCustody.Owner) &HybridCustody.OwnedAccount>(from: HybridCustody.OwnedAccountStoragePath)!

        // Get the CapabilityFactory.Manager Capability
        let factory = getAccount(factoryAddress).capabilities.get<&CapabilityFactory.Manager>(CapabilityFactory.PublicPath)
        assert(factory.check(), message: "factory address is not configured properly")

        // Get the CapabilityFilter.Filter Capability
        let filter = getAccount(filterAddress).capabilities.get<&{CapabilityFilter.Filter}>(CapabilityFilter.PublicPath)
        assert(filter.check(), message: "capability filter is not configured properly")

        // Publish to parent
        ownedRef.publishToParent(parentAddress: parent.address, factory: factory, filter: filter)

        // Add delegation to parent account
        // Check HybridCustody.Manager on parent
        if parent.storage.borrow<&AnyResource>(from: HybridCustody.ManagerStoragePath) == nil{
            let manager <- HybridCustody.createManager(filter: filter)
            parent.storage.save(<- manager, to: HybridCustody.ManagerStoragePath)

            // Clean up existing (if any)
            for cap in parent.capabilities.storage.getControllers(forPath: HybridCustody.ManagerStoragePath){
                cap.delete()
            }

            parent.capabilities.storage.issue<&{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath)
            parent.capabilities.publish(
                parent.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath),
                at: HybridCustody.ManagerPublicPath
            )
        }

        // Claim ChildAccount capability
        let inboxName = HybridCustody.getChildAccountIdentifier(parent.address)
        let childCapability = parent.inbox
            .claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(
                inboxName,
                provider: newAccount.address
            ) ?? panic("ChildAccount capability is not found")

        let managerRef = parent.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
            ?? panic("Manager is not found")
        managerRef.addAccount(cap: childCapability)
    }
}