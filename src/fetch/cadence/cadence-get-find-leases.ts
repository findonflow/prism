export const cadenceGetFindLeases = `
  import FIND from 0xFIND
  
  access(all) fun main(address: Address) : [FIND.LeaseInformation] {
     let account = getAccount(address)
  
     if account.balance == 0.0 {
       return []
     }
  
     let leaseCap = account.capabilities.get<&{FIND.LeaseCollectionPublic}>(FIND.LeasePublicPath)
  
     let leases = leaseCap.borrow()?.getLeaseInformation() ?? []
     return leases
  }
`