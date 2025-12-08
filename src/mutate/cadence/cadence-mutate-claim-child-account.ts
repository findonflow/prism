export const cadenceMutateClaimChildAccount = `
  import HybridCustody from 0xHybridCustody
  import ViewResolver from 0xViewResolver
  import CapabilityFilter from 0xCapabilityFilter
  
  transaction(childAccount: Address){
    prepare(signer: auth(Storage, Capabilities, Inbox) &Account){
      
      /*--------------------------------------------------------------------------------------------------------------------*/
      /* Check if signers have HybridCustody Manager before claiming */
      /*--------------------------------------------------------------------------------------------------------------------*/
      var filter: Capability<&{CapabilityFilter.Filter}>? = nil
      
      /*
      if filterAddress != nil && filterPath != nil {
          filter = getAccount(filterAddress!).capabilities.get<&{CapabilityFilter.Filter}>(filterPath!)
      }
      */
  
      if signer.storage.borrow<&HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath) == nil {
          let manager <- HybridCustody.createManager(filter: filter)
          signer.storage.save(<- manager, to: HybridCustody.ManagerStoragePath)
      }
      
      for capability in signer.capabilities.storage.getControllers(forPath: HybridCustody.ManagerStoragePath) {
          capability.delete()
      }
  
      signer.capabilities.unpublish(HybridCustody.ManagerPublicPath)
  
      signer.capabilities.publish(
          signer.capabilities.storage.issue<&{HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath),
          at: HybridCustody.ManagerPublicPath
      )
  
      signer.capabilities.storage.issue<auth(HybridCustody.Manage) &{HybridCustody.ManagerPrivate, HybridCustody.ManagerPublic}>(HybridCustody.ManagerStoragePath)
      
      
      /*--------------------------------------------------------------------------------------------------------------------*/
      /* Claim ChildAccount from Inbox */
      /*--------------------------------------------------------------------------------------------------------------------*/
      let inboxName = HybridCustody.getChildAccountIdentifier(signer.address)
      let childCapability = signer.inbox
        .claim<auth(HybridCustody.Child) &{HybridCustody.AccountPrivate, HybridCustody.AccountPublic, ViewResolver.Resolver}>(
            inboxName,
            provider: childAccount
        )?? panic("ChildAccount capability is not found")
        
      let managerRef = signer.storage.borrow<auth(HybridCustody.Manage) &HybridCustody.Manager>(from: HybridCustody.ManagerStoragePath)
        ?? panic("Manager is not found")
      managerRef.addAccount(cap: childCapability)
    }
  }
`