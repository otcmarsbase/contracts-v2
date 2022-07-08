## `MarsBaseExchange`

This contract contains the public facing elements of the marsbase exchange.




### `constructor()` (public)

Constructor sets owner and commission wallet to the contract creator initially.



### `setCommissionAddress(address wallet)` (public)

Updates the address where the commisions are sent
Can only be called by the owner



### `setMinimumFee(uint256 _minimumFee)` (public)

Updates the minimum fee amount
Can be only called by the owner
Is in the format of an integer, with a maximum of 1000.
For example, 1% fee is 10, 100% is 1000 and 0.1% is 1.



### `getOffer(uint256 offerId) → struct MarsBaseCommon.MBOffer` (public)

Gets an offer by its id



### `getNextOfferId() → uint256` (public)

Gets the next offer ID
This should return the amount of offers that have ever been created, including those that are no longer active.



### `getOwner() → address` (public)

Return the address of the current owner.



### `getAllOffers() → struct MarsBaseCommon.MBOffer[]` (public)





### `createOffer(address tokenAlice, address[] tokenBob, uint256 amountAlice, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters)` (public)

Creates an offer
tokenAlice - the address of the token that will be put up for sale
tokenBob - a list of tokens that we are willing to accept in exchange for token alice.
NOTE: If the user would like to accept native ether, token bob should have an element with a zero address. This indicates that we accept native ether.
amountAlice - the amount of tokenAlice we are putting for sale, in wei.
amountBob - a list of the amounts we are willing to accept for each token bob. This is then compared with amountAlice to generate a fixed exchange rate.
offerParameters - The configureation parameters for the offer to set the conditions for the sale.



### `cancelOffer(uint256 offerId)` (public)

Cancels the offer at the provided ID
Must be the offer creator.



### `price(uint256 amountAlice, uint256 offerAmountAlice, uint256 offerAmountBob) → uint256` (public)

Calculate the price for a given situarion



### `acceptOffer(uint256 offerId, address tokenBob, uint256 amountBob)` (public)

Accepts an offer
This can be either in full or partially. Uses the provided token and amount.
NOTE: for native ether, tokenBob should be a zero address. amountBob is set by the transaction value automatically, but should match the amount provided when calling.
The proper function to handle the proccess is selected automatically.



### `changeOfferParams(uint256 offerId, address[] tokenBob, uint256[] amountBob, struct MarsBaseCommon.OfferParams offerParameters)` (public)

Allows the offer creator to set the offer parameters after creation.



### `cancelBid(uint256 offerId)` (public)

Allows the buyer to cancel his bid in situations where the exchange has not occured yet.
This applys only to offers where minimumSize is greater than zero and the minimum has not been met.



### `cancelExpiredOffers()` (public)

A function callable by the contract owner to cancel all offers where the time has expired.




### `OfferCreated(uint256 offerId, address sender, uint256 blockTimestamp, struct MarsBaseCommon.MBOffer offer)`

Emitted when an offer is created



### `OfferModified(uint256 offerId, address sender, uint256 blockTimestamp, struct MarsBaseCommon.OfferParams offerParameters)`

Emitted when an offer has it's parameters or capabilities modified



### `OfferAccepted(uint256 offerId, address sender, uint256 blockTimestamp, uint256 amountBob, address tokenAddress, enum MarsBaseCommon.OfferType offerType)`

Emitted when an offer is accepted.
This includes partial transactions, where the whole offer is not bought out and those where the exchange is not finallized immediatley.



### `OfferCancelled(uint256 offerId, address sender, uint256 blockTimestamp)`

Emitted when the offer is cancelled either by the creator or because of an unsuccessful auction



### `BidCancelled(uint256 offerId, address sender, uint256 blockTimestamp)`

Emitted when a buyer cancels their bid for a offer were tokens have not been exchanged yet and are still held by the contract.



### `Log(uint256 log)`

Emitted only for testing usage




### `MBAddresses`


address offersContract


address minimumOffersContract



