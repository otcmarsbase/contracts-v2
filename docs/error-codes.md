# MarsBase Smart Contract Error Codes

## Transfer Errors

`T0` --- Zero Address provided
`T1a` --- Error Sending Token Alice From Sender
`T1b` --- Error Sending Token Alice From Contract
`T2a` --- Error Sending Token Bob From Sender
`T2b` --- Error Sending Token Bob From Contract
`T3` --- Found Token Bob does not equal user’s provided Token Bob
`T4` --- Found Amount Bob does not equal user’s provided Amount Bob
`T5` --- Error Sending Fee to Dex

## Math Errors

`M0` --- Fees Too Low
`M1` --- Amount Alice less than Smallest Chunk Size
`M2` --- Deadline in the past
`M3` --- Amount Alice is 0
`M4` --- Minimum Order Amount for Bob is 0
`M5` --- Amounts Bob and Tokens Bob must have the same length
`M6` --- Amount Bob is 0
`M7` --- Fee is 0
`M8` --- Amount Bob after Fee is 0
`M9` --- Amount Bob after Fee is 0
`M10` --- Amount remaining less than Smallest Chunk Size
`M11` --- Minimum fee must be greater than 0
`M12` --- Minimum Size less than smallest Chunk Size
`M13` --- Amount Alice less than Minimum Size

## State Errors

`S0` --- Offer Not Active
`S1` --- Offer Cannot be Cancelled
`S2` --- Message Sent from Non-Owner Address
`S3` --- Offer ID too High
`S4` --- Offer cannot be changed
`S5` --- Offer is wrong Type
`S6` --- Wrong number of Params Provided
`S7` --- Invalid Permissions (not owner)
`S8` --- Invalid Permissions (must be DEX)
`S9` --- Contract locked
