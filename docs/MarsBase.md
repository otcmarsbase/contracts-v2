## `MarsBase`






### `contractType(enum MarsBaseCommon.OfferType offerType) → enum MarsBaseCommon.ContractType` (public)





### `price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) → uint256` (public)





### `setOfferProperties(struct MarsBaseCommon.MBOffer offer, struct MarsBaseCommon.OfferParams offerParams) → struct MarsBaseCommon.MBOffer` (public)





### `getOfferType(uint256 amountAlice, struct MarsBaseCommon.OfferParams offerParameters) → enum MarsBaseCommon.OfferType` (public)





### `initOffer(uint256 nextOfferId, address tokenAlice, address[] tokenBob, uint256 amountAlice, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters) → struct MarsBaseCommon.MBOffer` (public)





### `createOffer(uint256 nextOfferId, address tokenAlice, address[] tokenBob, uint256 amountAlice, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters) → struct MarsBaseCommon.MBOffer` (public)





### `changeOfferParams(struct MarsBaseCommon.MBOffer offer, address[] tokenBob, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters) → struct MarsBaseCommon.MBOffer` (public)





### `acceptOfferPartWithMinimum(struct MarsBaseCommon.MBOffer offer, address tokenBob, uint256 amountBob) → struct MarsBaseCommon.MBOffer` (public)





### `cancelExpiredMinimumOffer(struct MarsBaseCommon.MBOffer offer) → struct MarsBaseCommon.MBOffer` (public)





### `cancelOffer(struct MarsBaseCommon.MBOffer offer) → struct MarsBaseCommon.MBOffer` (public)





### `cancelBid(struct MarsBaseCommon.MBOffer offer) → struct MarsBaseCommon.MBOffer` (public)





### `acceptOffer(struct MarsBaseCommon.MBOffer offer, address tokenBob, uint256 amountBob) → struct MarsBaseCommon.MBOffer` (public)





### `acceptOfferPart(struct MarsBaseCommon.MBOffer offer, address tokenBob, uint256 amountBob) → struct MarsBaseCommon.MBOffer` (public)





### `cancelExpiredOffer(struct MarsBaseCommon.MBOffer offer) → struct MarsBaseCommon.MBOffer` (public)








