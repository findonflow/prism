export const cadenceMutateClaimChildAccount = `
  import HybridCustody from 0xHybridCustody
  
  transaction(childAccount: Address){
    prepare(singer: auth(Storage, Capabilities, Inbox) &Account){
      
      // Check if signers have HybridCustody Manager before claiming
      if signer.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil{
        let manager <- HybridCustody.createManager(filter: nil)
        signer.save(<- manager, to: HybridCustody.ManagerStoragePath)
        
        acct.unlink(HybridCustody.ManagerPublicPath)
        acct.unlink(HybridCustody.ManagerPrivatePath)

        acct.link<&HybridCustody.Manager{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerPrivatePath, target: HybridCustody.ManagerStoragePath)
        acct.link<&HybridCustody.Manager{HybridCustody.ManagerPublic}>(HybridCustody.ManagerPublicPath, target: HybridCustody.ManagerStoragePath)
      }
      
      let inboxName = HybridCustody.getChildAccountIdentifier(singer.address)
      let childCapability = signer
        .inbox
        .claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(
            inboxName,
            provider: childAccount
        )?? panic("ChildAccount capability is not found")
    }
  }
`