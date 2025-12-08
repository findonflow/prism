PUBLIC_KEY := c07af4e973875c4224f7ae2c512743c7e81e77651cecf77d42af204bffc1e4af6fd8135e7cd9829358653d973f6807c88e81e2b8f4d42f8ead24bc06adbd2658
NFT_FT_FACTORY := 0x1b7fa5972fcb8af5
ALLOW_ALL := 0xe2664be06bb0fe62
PARENT := 0x36ebe2a951853875
PARENT_TO_REMOVE := 0xed0f17ed584f5253
TARGET_PARENT := 0xed0f17ed584f5253

.PHONY: create-new-account
create-new-account:
	flow transactions send ./cadence/transactions/create-new-account.cdc $(PUBLIC_KEY) 1.0 $(NFT_FT_FACTORY) $(ALLOW_ALL) $(PARENT) --signer manager --network testnet

.PHONY: remove-parent
remove-parent:
	flow transactions send ./cadence/transactions/remove-parent.cdc $(PARENT_TO_REMOVE) --signer child --network testnet

.PHONY: destroy-child
destroy-child:
	flow transactions send ./cadence/transactions/destroy-child.cdc $(PARENT_TO_REMOVE) --signer child --network testnet


.PHONY: publish-to-parent
publish-to-parent:
	flow transactions send ./cadence/transactions/publish-to-parent.cdc $(TARGET_PARENT) $(NFT_FT_FACTORY) $(ALLOW_ALL) --signer child --network testnet


.PHONY: setup-factory-nft-manager
setup-factory-nft-manager:
	flow transactions send ./cadence/transactions/setup-factory-nft-manager.cdc --signer manager --network testnet


.PHONY: setup-filter-allow-all
setup-filter-allow-all:
	flow transactions send ./cadence/transactions/setup-filter-allow-all.cdc --signer manager --network testnet


# This one is for manual clean up if necessary
.PHONY: unlink-child
unlink-child:
	flow transactions send ./cadence/transactions/unlink-child.cdc --signer child --network testnet
