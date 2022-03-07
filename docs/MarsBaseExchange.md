## `MarsBaseExchange`






### `setDexAddress(address dex)` (public)





### `setCommissionAddress(address wallet)` (public)





### `setMinimumFee(uint256 _minimumFee)` (public)





### `getOffer(uint256 offerId) → struct MarsBaseCommon.MBOffer` (public)





### `getNextOfferId() → uint256` (public)





### `getContractAddresses() → struct MarsBaseExchange.MBAddresses` (public)





### `setContractAddresses(struct MarsBaseExchange.MBAddresses addresses)` (public)





### `getOwner() → address` (public)





### `getAllOffers() → struct MarsBaseCommon.MBOffer[]` (public)





### `createOffer(address tokenAlice, address[] tokenBob, uint256 amountAlice, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters)` (public)





### `cancelOffer(uint256 offerId)` (public)





### `price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) → uint256` (public)





### `acceptOffer(uint256 offerId, address tokenBob, uint256 amountBob)` (public)





### `changeOfferParams(uint256 offerId, address[] tokenBob, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters)` (public)





### `cancelBid(uint256 offerId)` (public)





### `cancelExpiredOffers()` (public)






### `OfferCreated(uint256 offerId, address sender, uint256 blockTimestamp, struct MarsBaseCommon.MBOffer offer)`





### `OfferModified(uint256 offerId, address sender, uint256 blockTimestamp, struct MarsBaseCommon.OfferParams offerParameters)`





### `OfferAccepted(uint256 offerId, address sender, uint256 blockTimestamp, uint256 amountBob, address tokenAddress, enum MarsBaseCommon.OfferType offerType)`





### `OfferCancelled(uint256 offerId, address sender, uint256 blockTimestamp)`





### `BidCancelled(uint256 offerId, address sender, uint256 blockTimestamp)`





### `Log(uint256 log)`






### `MBAddresses`


address offersContract


address minimumOffersContract



