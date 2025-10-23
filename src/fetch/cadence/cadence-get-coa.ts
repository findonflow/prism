export const cadenceGetCoa = `
  import EVM from 0xServiceAddress
  
  access(all) fun main(address: Address): [AnyStruct] {
      let account = getAccount(address)
      
      let coaCapability = account.capabilities
          .borrow<&EVM.CadenceOwnedAccount>(/public/evm)
      
      if let coa = coaCapability {
          return [
              coa.address().toString(),  // EVM address
              coa.address().balance().inFLOW()   // Balance in attoFLOW
          ]
      }
      
      return []
  }
`;
