## `Ownable`



The Ownable contract has an owner address, and provides basic authorization control
functions, this simplifies the implementation of "user permissions".

### `onlyOwner()`



Throws if called by any account other than the owner.


### `constructor()` (public)



The Ownable constructor sets the original `owner` of the contract to the sender
account.

### `transferOwnership(address newOwner)` (public)



Allows the current owner to transfer control of the contract to a newOwner.





