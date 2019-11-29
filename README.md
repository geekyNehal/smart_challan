# Traffic Fine Network Construction

> This Project implements Hyperledger Fabric for Traffic Fine System.

This Traffic Fine Network defines:

**Participant**
`Driver` `Police`

**Transaction**
`FineGiven` `FineReceived` `AuthorizeAccess` `RevokeAccess`

**Event**
`FineTransactionEvent` `AccessTransactionEvent`


To test this Traffic Network Definition in the **Test** tab:

Create one `Driver` participant and one `Police` particpant:

```
{
  "$class": "org.example.basic.Driver",
  "participantId": "9541",
  "firstName": "Nehal",
  "lastName": "Kumar"
}
```
```
{
  "$class": "org.example.basic.Police",
  "participantId": "6204",
  "firstName": "Chulbul",
  "lastName": "Pandey"
}
```

Suppose the `Driver` participant have broken some `Rules` of `TrafficRegulation` then they will be asked to pay fine through `FineGiven` transaction. `Driver` participant can submit a `FineGiven` transaction:

```
{
  "$class": "org.example.basic.FineGiven",
  "driverId": "9541",
  "amount": 5000,
  "policeId": "6204"
}
```

After Receiving fine from the `Driver` participant `Police` will do the `FineReceived` Transaction for successfully receiving fine amount from the `Driver` participant:

```
{
  "$class": "org.example.basic.FineReceived",
  "driverId": "9541",
  "amount": 5000,
  "policeId": "6204"
}
```
After submitting this transaction, you should now see the transaction in the Transaction Registry and that a `TransactionEvent` has been emitted successfully. 

Each `Driver` participant can `AuthorizeAccess` of their `Data` to the `Police` participant for `Verification` :

```
{
  "$class": "org.example.AuthorizeAccess.",
  "policeId": "6204"
}
```
Moreover `Driver` participant can also `RevokeAccess` of their `Data` from the `Police` participant:

```
{
  "$class": "org.example.RevokeAccess.",
  "policeId": "6204"
}
```

`A Police officer is also a driver`. With this quote in mind we have developed this project in the way that police officer will have two ID's one as a `Police` and other as a `Driver` if he breaks rule then he will be fined from his `Driver` ID.

