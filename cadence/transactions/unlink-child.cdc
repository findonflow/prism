transaction{
    prepare(signer: auth(Storage, Capabilities) &Account){
       let path = /public/ChildCapabilityDelegator_0xed0f17ed584f5253

       signer.capabilities.unpublish(path)
    }
}