---
title: Alchemy's L&D Sessions
type: tech
description: Technical learning journey and knowledge sharing
---

## [Blockchain Basics]

- **Proof of Work (PoW)** and **Proof of Stake (PoS)** are two types of **consensus mechanisms** used in blockchain networks to validate transactions and secure the network.
    
    ### **Proof of Work (PoW)**
    
    **Used by:** Bitcoin, Ethereum (before The Merge)
    
    **How it works:**
    
    - Miners compete to solve a complex mathematical puzzle.
    - The first one to solve it gets to add the next block to the blockchain and receives a reward.
    - Solving the puzzle requires **massive computational power**, hence the term “work.”
    
    **Pros:**
    
    - Highly secure due to the high cost of attacking the network.
    - Battle-tested, especially with Bitcoin.
    
    **Cons:**
    
    - **Energy-intensive** and environmentally unfriendly.
    - Expensive hardware required.
    - Slower transaction speeds.
    
    ---
    
    ### **Proof of Stake (PoS)**
    
    **Used by:** Ethereum (post-Merge), Solana, Cardano, Polkadot
    
    **How it works:**
    
    - Validators are chosen to create the next block based on how much cryptocurrency they **“stake”** (lock up) as collateral.
    - The more coins staked, the higher the chance to be selected.
    - Malicious behavior results in loss of the staked amount (called **slashing**).
    
    **Pros:**
    
    - **Energy-efficient** — no need for intense computing.
    - Faster transaction processing.
    - Lower barrier to entry than PoW mining.
    
    **Cons:**
    
    - Wealthy participants have more influence.
    - Less proven over long periods compared to PoW.
- Block Explorers - like google for blockchain-related stuff
    - eg., etherscan
- [Digicash](https://decrypt.co/resources/digicash-what-is-cryptocurrency-explainer)(first electronic payment systems with private signing) and [Hashcash](http://www.hashcash.org/)(proof of work algorithm)
- Scammy context - [Mt.Gox](https://en.wikipedia.org/wiki/Mt._Gox)
- Usecases
    - Microsoft Hardware Supply Chain
    - Shell oil rigs automated signing - by Alchemy
- [Ethereum vs Solana](https://phantom.com/learn/crypto-101/solana-vs-ethereum)
    - **Ethereum vs Solana: Architecture Comparison**
    
    | **Feature** | **Ethereum** | **Solana** |
    | --- | --- | --- |
    | **Consensus Mechanism** | 🪙 Proof of Stake (PoS) using **Casper** + **Finality via Ethereum 2.0 Beacon Chain** | 🕰 Proof of Stake (PoS) + **Proof of History (PoH)** (a Verifiable Delay Function) |
    | **Block Time** | ~12 seconds | ~400 milliseconds |
    | **Throughput** | ~15–30 TPS (Layer 1), thousands with Layer 2 (e.g. rollups) | ~2,000+ TPS (Layer 1), theoretically up to 65,000 TPS |
    | **Smart Contracts Language** | Solidity (EVM-compatible) | Rust (via Solana runtime) or C |
    | **Execution Model** | **Account-based** with global state; single-threaded execution | **Parallel execution** via Sealevel runtime (transactions processed in parallel if not overlapping state) |
    | **State Storage** | Global state stored in LevelDB (via clients like Geth, Prysm, etc.) | Account-based but highly optimized using in-memory storage & Merkle tries |
    | **Scalability Approach** | Rollups (Layer 2s), Sharding planned (future) | Monolithic chain with high-performance validator nodes |
    | **Finality** | Probabilistic but ~12 mins for strong confidence | Fast finality, within seconds |
    | **Network Design** | Modular (Layer 2s, rollups, modular DA in future) | Monolithic (everything on Layer 1) |
    | **Client Diversity** | Multiple clients (e.g., Geth, Nethermind, Prysm, Lighthouse) | Mostly one official client (solana-validator) — less diversity |
    | **Security Model** | Decentralized validators, economic security via ETH staking | High-performance but fewer validators, more centralized (though improving) |
    | **Energy Efficiency** | High (after PoS) | High |
    | **Developer Ecosystem** | Massive, mature, EVM-based tooling | Growing, but smaller; more performant, but less EVM compatible |
- **Scaling** refers to increasing the number of transactions a blockchain can handle **per second (TPS)** without sacrificing: **Decentralization, Security, User experience (fees, speed)**
- **Solana: Vertical Scaling (Monolithic) -** Solana scales by **making Layer 1 extremely fast and powerful** — like scaling a supercomputer.
    1. **Proof of History (PoH):**
        - Creates a global, cryptographic timestamp to order transactions **before consensus**.
        - Reduces communication overhead between validators.
    2. **Parallel Execution with Sealevel:**
        - Solana analyzes which accounts a transaction touches.
        - If no overlap, they are run **in parallel** on separate cores — unlike Ethereum which is single-threaded.
    3. **High-Performance Validators:**
        - Validators must run on **powerful hardware** (SSD, 128+ GB RAM, GPU acceleration).
        - Helps process **thousands of TPS** on-chain.
    4. **Unified Layer 1:**
        - No rollups or external execution environments.
        - Everything is executed natively.
    
    ### **Pros:**
    
    - High throughput.
    - Low latency and cheap transactions.
    
    ### **Cons:**
    
    - Less decentralized (due to validator cost).
    - Harder for individuals to run a node.
    - Single point of failure risk (monolithic).
- **Ethereum: Horizontal Scaling (Modular) -** Ethereum scales by **splitting responsibilities across layers and networks**.
    1. **Layer 2 Rollups (Optimistic & ZK):**
        - Execute transactions **off-chain**.
        - Post proofs (ZK or fraud proofs) back to Ethereum L1 for **security**.
        - Examples: **Arbitrum, Optimism, zkSync, Scroll**.
    2. **Sharding (Future):**
        - Ethereum will split data availability across 64+ shards.
        - Execution remains on Layer 2.
        - Shards won’t execute transactions — they’ll store and serve data for rollups.
    3. **Danksharding / Proto-Danksharding (EIP-4844):**
        - Introduces **data blobs** for rollups to post cheaper data.
        - Massive throughput improvement without changing Ethereum’s security assumptions.
    
    ### **Pros:**
    
    - Strong decentralization and security.
    - Modular and flexible scaling strategy.
    
    ### **Cons:**
    
    - Complex for developers (multiple layers to consider).
    - Slower base layer (without rollups).
    - Relies on external protocols for scalability
- Different kinds of nodes like archival nodes, validators etc

# Alchemy Architecture

![AGV_vUc76-N8G4hJYyo80wFr4wHf_g8UOawxvclByH2Q3lPkR7UeyvblAW9dJtNNAwY8fAj3jYr8HfUWKWVGydGxbzs4sII4be9i_fPcojNYTWj87_RkeZ5fW8WP.png](attachment:ba652858-1bbf-4575-83fe-eee891d634aa:AGV_vUc76-N8G4hJYyo80wFr4wHf_g8UOawxvclByH2Q3lPkR7UeyvblAW9dJtNNAwY8fAj3jYr8HfUWKWVGydGxbzs4sII4be9i_fPcojNYTWj87_RkeZ5fW8WP.png)

- AWS data centres vs OVH (bare metal)
    - more control and less expense on the latter
    - we have moved on to the latter except for the first
    - no availability zones in OVH - so in the same physical location per region - helps with latency
    - Use Istio data mesh on top of Envoy proxy to service requests in OVH
        - https://www.apptio.com/topics/kubernetes/devops-tools/istio-envoy/
    - We have one aws (mega) data center and the rest 4 managed using OVH
        - OVH runs core RPC traffic
        - AWS - has non core RPC logic - wallet services, NFT APIs, chainlake
        - 2 in us-east-1 - one AWS and other OVH
    - data centers operate on near-complete isolation
        - reliable in the face of one of these data centers failing
        - might face latency
- Edge CDN Provider - providers like Cloudflare has 100s of data centers all across the globe, and try to make compute physically close to the users and manages traffic
    - these are points of presence - PoPs, which accept requests
    - logic is deployed to these PoPs, which states what kind of service accepts these requests
    - do we also deploy some frequently accessed logic in pops - how much redundancy are we accepting here
        
        For edge compute (in cloudflare), we do the following logic:
        
        1. route to regions based on cloudflare computed locality (e.g. Country codes)
        2. retry requests if the origin (aka alchemy infra) responded with a 5xx HTTP Code, to a third party (3P) provider, like dRPC
        3. we parse the request, look at the method, and if its one of the static response methods from evm spec (e.g. eth_chainId), we respond directly
    - regional routing is decided by Cloudflare - which region to go to
    - additional features - firewall rules, automatic DDOS, block IPs
    - another feature - forwarding
        - on a request failure for enterprise users, a retry request is made with a competitor under the hood, service those requests and return that response - this improves reliability
- A data center has a load balancer
    - envoy proxy is run on each server in the dedicated machines in the region
    - Use Istio data mesh (managed/abstracted envoy) on top of Envoy proxy to service requests in OVH
        - service that accepts an http request and sends it over to another server
    - can use “routing” templates to specify where requests matching a certain pattern go
    - AWS has managed load balancers like ALBs, ELBs etc
    - Authorization is also present in this layer - teamapp
    - Business level protections are also done in this level
        - ensure Compute Units are present and managed
        - rate limiting
- Node gateway
    - Alchemy has support for 100s of networks
        - each of them have a lot of machines running nodes for these machines
        - we need to route to them meaningfully
        - hence we need something that sits in front of them, has the business context and do the right thing
        - this is the node gateway
    - node gateway has many responsibilities
    - one responsibility is shuffle sharding
        - take all the incoming traffic and distribute it evenly across all the nodes
        - cannot divide the traffic evenly - not a good idea when a user has a heavy request/s
            - results in killing all/many of the nodes
            - affecting other customers who did not cause this
        - ways to manage this
            - priority in requests where we reject some requests
                - like prioritize enterprise level
                - or prioritize writes, since reads can be retried
            - partitioning of machines across customers
                - ensure restricted access to a certain customer
                - but this is very expensive as the customers increase
                - shuffle sharding - each customer gets a shard of nodes, randomly assign nodes to a shard deterministically ( so the same customer hits the same customer again)
                    - if a customer blows up their shard of nodes, then only that customer is affected
        - there are overlapping shards - a user gets assigned to more than one shard so that incase of a shard going under, the other shard is available
            - this becomes useful when multiple users gets assigned shards, and as long as the same set of users dont get the same entire set of shards, the surviving shards of the unproblematic users can support their requests
        - https://aws.amazon.com/builders-library/workload-isolation-using-shuffle-sharding/
        - aggregate observability - for testing
- Consistency manager
    - with nodes in a distributed system, it is difficult to ensure consistency in serviced requests
    - consistency manager queries all the nodes for the latest, and gets their responses every 50 ms to get what the latest block is to build a quorum of nodes
        - we need at least 30% of nodes to agree on the latest
        - is the latest block the only thing that we need to get the 30% quorum for? asking since a block “effectively” has its entire history, so it should be able to obtain any other data we might want from the blockchain, so latest node should have all the data that is available at that point of time. do we need consistency manager (or the 30% agreement) for anything else?
        - do we also need the consistency manager for anything else?
            
            2.a. loading the latest committed block is not only usecase for latest. you can also request to execute smart contracts based on the state from that block. That's why we wait for 30%, it ensures we have enough nodes to answer those state/contract execution calls.
            2,b, consistency manager plays two roles. 1) to determine "canonical chain" aka that 30%. and 2) from canonical chain, store very common request answers for serving from redis/caching etc. (like loading the block)
            
            the block doesnt have ***state*** in it, only what ***transactions were included in that block***
            
            the node client aggegates alll of transactions, logs from those transactions, etc. from every block, into a single view of "state", and *that* is what is answers the above type of question (along with some smart contract execution)
            
    - we explicitly introduce latency here to ensure consistency instead of responding back with the result from any random node
    - why 30% - because we have 4 nodes currently and 30% of 4 is 2 nodes
        - isnt that 50% effectively
        - keep in mind traffic asking for latest vs nodes that know latest
        - practically there is also a delay from when we receive the request for latest vs the time by when the response reaches the customer - by this time, the percent actually goes higher than 30%
            - there’s even more delay as once this response is received by the user, then their subsequent request also needs to to reach our server
            - the blockchain will eventually agree
            - so on getting a quorum regarding whats latest - is there a write or any operation that happens at the node level (like letting the nodes not in the quorum know that a block was the agreed upon latest)? but this introduces new errors/problems, as what if latest changes by then
                
                all blocks are discovered by all nodes, nature of it being a chain etc.
                you can request a block in the past (or execute a smart contract in the past) as well
                latest is a moving target, which is why consistency manager is what gathers what 30% is and keeps other services updated on which node knows about said 30%
                
                the node clients inform each other themselves
                
                they all gossip to peers etc. exchanging block info etc.
                
    - there is also a possibility that the consistency was wrong
        - so the perceived latest block is not actually the latest
        - then we have to reorganize
        - what things do we do on reorg, do we actually reach back to our customers
            - https://www.alchemy.com/overviews/what-is-a-reorg
            - customers need to account for it either way
            the canonical number never regresses
            but what block hash is associated with a number, can change
            most use cases can ignore reorgs for the most part though
            E.g. a token price ticker repeatedly calls a smart contract for the latest price of it
            even if a reorg occurs, the latest price is still the latest after the next poll
        - on average how much delay is there between the incorrect latest response and reorg
            - it depends on the network, some see it all the time
- [Route 53](https://aws.amazon.com/route53/) - DNS used in alchemy
    - Amazon Route 53 provides highly available and scalable [Domain Name System (DNS)](https://aws.amazon.com/route53/what-is-dns/), [domain name registration](https://aws.amazon.com/blogs/networking-and-content-delivery/benefits-of-domain-registration-with-amazon-route-53/), and [health-checking](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html) cloud services. It is designed to give developers and businesses an extremely reliable and cost-effective way to route end users to internet applications by translating names like example.com into the numeric IP addresses, such as 192.0.2.1, that computers use to connect to each other. You can combine your Route 53 DNS with health-checking services to route traffic to healthy endpoints or to independently monitor and alarm on endpoints. You can also use the [Traffic Flow](https://aws.amazon.com/route53/traffic-flow/) visual policy builder to simplify the implementation of your routing policies, and you can purchase and manage domain names such as example.com and automatically configure DNS settings for your domains.
    - In addition, [Route 53 Resolver](https://aws.amazon.com/route53/resolver/) provides a regional DNS service that performs recursive DNS lookups for names hosted in Amazon Elastic Compute Cloud (EC2), as well as public names on the internet. Lastly, the [Route 53 Resolver DNS Firewall](https://aws.amazon.com/route53/resolver-dns-firewall/) allows you to block queries made for known or suspected malicious domains, and to allow queries for trusted domains when using the Route 53 Resolver for recursive DNS resolution.
- gRPC vs RPC

# Engineering Principles

- https://gist.github.com/chitchcock/1281611
    - Build a platform for devs and use it for your product - this is sustainable

L&D

- Coinbase named after miner’s reward in bitcoin
    - this decreases with time - bitcoin halving schedule
- bitcoin difficulty chart
    - every 2 weeks difficulty is set
- merkle trees
    - patricia merkle tree
- ethereum the first global singleton computer
- EOA - externally owned accounts
    - owned by a human
    - have private key
    - not a smart contract
- Bitcoin’s balance system - UTXOs while Ethereum’s - account model
- What are uncle blocks
-