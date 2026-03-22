import { SystemDesignTopic } from '../models/system-design.model';

export const SYSTEM_DESIGN_TOPICS: SystemDesignTopic[] = [
  // ─────────────────────────────────────────────────────────────────
  // Foundation Topics (Building Blocks & Core Concepts)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'sd-interview-approach',
    title: 'How to Approach a System Design Interview',
    type: 'foundation',
    category: 'Interview Framework',
    order: 1,
    overview: `The system design interview is not about memorizing architectures — it is about demonstrating structured thinking, trade-off analysis, and the ability to lead a technical conversation under ambiguity. Interviewers care less about the "right" answer and more about how you reason through the problem. Think of yourself as a Tech Lead pitching a design to your team: you clarify requirements, estimate constraints, sketch a high-level architecture, then zoom into the hardest parts.

The biggest mistake candidates make is diving into components immediately. Instead, spend the first 5 minutes on requirements and estimation. This grounds the conversation and prevents you from over-engineering or under-designing. Ask clarifying questions: "What's the expected scale? Read-heavy or write-heavy? What consistency guarantees do we need? What are the most important features for V1?" These questions show maturity and give you the constraints needed to make informed design decisions.

A strong interview follows a predictable arc: requirements gathering (functional + non-functional), back-of-the-envelope estimation, API design, data model, high-level architecture diagram, then a deep dive into 1-2 critical components. Leave breadcrumbs as you go — mention things you plan to come back to ("I'll address caching when we get to the read path"). This shows the interviewer you see the full picture even when you're focused on one part.

Don't panic if you don't know a topic perfectly. The interviewer wants to see how you think, not what you've memorized. If you get stuck, talk through your thought process: "I'm not sure of the exact algorithm here, but I know we need something that minimizes latency for reads while handling this write volume, so let me reason through the options..." This is infinitely better than silence.`,
    framework: [
      'Step 1 — Clarify functional requirements: What does the system do? List the core use cases. Ask about the most important features for a V1. Don\'t assume — ask.',
      'Step 2 — Clarify non-functional requirements: Scale (users, requests/sec), latency targets, availability (99.9%? 99.99%?), consistency model, durability, read/write ratio.',
      'Step 3 — Back-of-the-envelope estimation: Estimate QPS, storage, bandwidth, and memory. This grounds your design in reality. Show the math — "100M DAU × 10 requests/day = 1B requests/day ≈ 12K QPS."',
      'Step 4 — Define the API: List the core endpoints (REST or RPC). This forces you to think about the system\'s interface before internal design. Include request/response shapes.',
      'Step 5 — Design the data model: Define the key entities and their relationships. Choose SQL vs. NoSQL with justification. Identify the access patterns that drive your schema decisions.',
      'Step 6 — Draw the high-level architecture: Clients → Load Balancer → Application Servers → Cache → Database. Add message queues, CDNs, and other components as needed. Keep it simple first.',
      'Step 7 — Deep dive into critical components: Pick the 1-2 hardest parts (the interviewer may guide you). Discuss algorithms, data structures, consistency trade-offs, failure modes.',
      'Step 8 — Address bottlenecks and scaling: Identify single points of failure. Discuss horizontal scaling, caching strategies, database sharding, and monitoring. Wrap up with trade-offs you made.'
    ],
    keyComponents: [
      'Functional Requirements — what the system does; the core features and use cases',
      'Non-Functional Requirements — scale, latency, availability, consistency, durability targets',
      'API Design — the system\'s external interface; REST endpoints, request/response contracts',
      'Data Model — entities, relationships, schema design, SQL vs. NoSQL decision',
      'High-Level Architecture — the component diagram showing how data flows through the system',
      'Deep Dive Component — the hardest part of the system, discussed in detail with trade-offs'
    ],
    scaleConsiderations: [
      'Always estimate scale before designing — a system for 1K users is fundamentally different from one for 1B users.',
      'Identify the read/write ratio early — it drives caching strategy, database choice, and replication topology.',
      'Think about what happens when your system 10x\'s — which component breaks first? That\'s where you should focus.',
      'Time management: spend ~5 min on requirements, ~5 min on estimation + API, ~20 min on design + deep dive, ~5 min on scaling and wrap-up.'
    ],
    commonMistakes: [
      'Jumping into components without clarifying requirements — you might design for the wrong problem entirely.',
      'Not estimating scale — this leads to over-engineered designs for small problems or under-designed systems for massive scale.',
      'Monologuing without checking in — pause periodically and ask "Does this direction make sense?" or "Should I go deeper here?"',
      'Trying to design everything perfectly — it\'s better to cover the full system at a reasonable depth than to over-optimize one component and ignore the rest.'
    ],
    resources: [
      { label: 'HelloInterview — System Design Fundamentals', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction' },
      { label: 'ByteByteGo — System Design Interview Framework', url: 'https://www.youtube.com/watch?v=i7twT3x5yv8' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 3 (Framework)', url: '' }
    ],
    relatedTopics: ['availability-reliability', 'cap-theorem', 'scalability-performance']
  },

  {
    id: 'availability-reliability',
    title: 'Availability & Reliability',
    type: 'foundation',
    category: 'Core Principles',
    order: 2,
    overview: `Availability measures the percentage of time a system is operational and accessible. It is expressed in "nines" — 99.9% availability (three nines) means up to 8.77 hours of downtime per year, while 99.99% (four nines) allows only 52.6 minutes. The formula is simple: Availability = Uptime / (Uptime + Downtime). Most consumer services target three to four nines; financial and healthcare systems often require five nines (5.26 minutes/year downtime).

Understanding how components combine is critical. When components are in sequence (both must work), overall availability is A1 × A2 — so two components at 99.9% each give you 99.8%. When components are in parallel (either can serve), availability is 1 - (1-A1) × (1-A2) — two 99.9% components in parallel give 99.9999%. This is why redundancy is the primary tool for improving availability: if one server dies, another takes over.

Availability and reliability are related but distinct. A system can be highly available but unreliable (it's always accessible but sometimes returns wrong answers), or highly reliable but not highly available (it returns correct answers but has planned maintenance windows). Fault tolerance means the system continues operating correctly even when components fail. High availability means the system remains accessible. You achieve both through redundancy, replication, graceful degradation, and automated failover.

In interviews, when you say "high availability," be specific: state your target (e.g., 99.99%), explain what fails (single server, entire datacenter), and describe how the system recovers (automated failover, health checks, redundancy). Vague claims of "high availability" without a concrete mechanism are a red flag to interviewers.`,
    framework: [
      'Define your target: state the availability SLA in nines (99.9%, 99.99%) and translate it to acceptable downtime per year/month.',
      'Identify failure modes: what can fail? Single server, rack, entire datacenter, network partition, software bug, dependency outage.',
      'Design redundancy: eliminate single points of failure. Replicate critical components. Use multiple availability zones or regions.',
      'Implement failover: active-passive (standby takes over on failure) or active-active (both serve traffic, one absorbs the other\'s load). Automate failover detection via health checks.',
      'Add health checks and monitoring: heartbeat signals between components, automated alerting, and self-healing (restart crashed processes, reroute traffic from unhealthy nodes).',
      'Plan for graceful degradation: when partial failure occurs, serve reduced functionality rather than complete outage (e.g., serve cached data when the database is down).'
    ],
    keyComponents: [
      'Failover — active-passive (standby server takes over) vs. active-active (multiple servers share load, one absorbs the other\'s on failure)',
      'Replication — master-slave (one writer, multiple readers) vs. master-master (multiple writers, conflict resolution needed)',
      'Redundancy — duplicate critical components (servers, databases, network paths) so no single failure causes an outage',
      'Health Checks — periodic probes (HTTP, TCP, custom) that detect unhealthy instances and trigger failover or replacement',
      'Heartbeats — periodic signals between distributed components to detect crashes; absence of heartbeat triggers recovery',
      'Load Balancers — distribute traffic across healthy instances; automatically remove unhealthy ones from the rotation',
      'Circuit Breakers — prevent cascading failures by short-circuiting calls to failing dependencies; allow graceful degradation',
      'Chaos Engineering — intentionally inject failures (kill servers, drop packets) to verify that availability mechanisms actually work'
    ],
    scaleConsiderations: [
      'Each additional nine of availability is exponentially harder and more expensive — going from 99.9% to 99.99% requires fundamentally different architecture.',
      'Multi-region deployment is necessary for disaster recovery but introduces data replication latency and consistency trade-offs.',
      'Dependent service availability multiplies: if your system depends on 5 services each at 99.9%, your theoretical availability is 99.5% unless you design for dependency failure.',
      'Automated failover is essential at scale — humans cannot respond fast enough to meet four-nines SLAs. Mean Time To Recovery (MTTR) must be seconds, not minutes.',
      'Test your failover mechanisms regularly — untested failover is worse than no failover because it gives false confidence.'
    ],
    commonMistakes: [
      'Claiming "high availability" without specifying the target or the mechanism — always state the SLA and explain how you achieve it.',
      'Ignoring dependent service availability — your system is only as available as its weakest dependency (unless you design for dependency failure with caching, circuit breakers, etc.).',
      'Confusing redundancy with backups — a backup restored in 4 hours does not provide high availability. Redundancy means a standby that takes over in seconds.',
      'Not testing failover — if you\'ve never killed a server in production and verified the system recovers, your failover design is theoretical, not proven.'
    ],
    resources: [
      { label: 'HelloInterview — Delivery & Core Concepts', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Availability & Reliability', url: 'https://www.youtube.com/watch?v=lGFKpBTnRbg' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (Scaling)', url: '' }
    ],
    relatedTopics: ['cap-theorem', 'scalability-performance', 'load-balancing']
  },

  {
    id: 'cap-theorem',
    title: 'CAP Theorem & Consistency Models',
    type: 'foundation',
    category: 'Core Principles',
    order: 3,
    overview: `The CAP theorem states that a distributed data store can provide at most two of three guarantees: Consistency (every read receives the most recent write), Availability (every request receives a response), and Partition Tolerance (the system continues operating despite network partitions). Since network partitions are inevitable in distributed systems, the real choice is between consistency and availability when a partition occurs.

A simple analogy: imagine two librarians in different buildings maintaining the same catalog. A network partition means they can't communicate. They have two choices: (1) Pause and refuse to answer catalog queries until they can sync (choosing Consistency over Availability — the CP path), or (2) Keep answering queries using their local copy, which may be stale (choosing Availability over Consistency — the AP path). Neither is universally right — it depends on the use case.

Real-world examples make this concrete. MongoDB (CP): during a partition, the minority side stops accepting writes to prevent inconsistency. Cassandra (AP): all nodes continue serving reads and writes, resolving conflicts later with last-write-wins or vector clocks. Traditional RDBMS like MySQL on a single server is effectively CA, but this breaks down when you distribute it. The PACELC theorem extends CAP: even when there is no partition (the normal case), you must choose between latency and consistency. DynamoDB, for example, chooses availability during partitions AND low latency during normal operation, accepting eventual consistency.

Consistency models exist on a spectrum. Strong consistency: after a write completes, all subsequent reads return that value (as if there's one copy). Eventual consistency: given enough time without new writes, all replicas converge to the same value. Causal consistency: reads respect the causal order of writes (if A caused B, you never see B without A). Linearizability is the strongest guarantee — operations appear to happen atomically at a single point in time. Each level trades latency/availability for correctness guarantees.`,
    framework: [
      'Understand the three properties: C = every read gets the latest write, A = every request gets a non-error response, P = system works despite network splits.',
      'Remember: P is not optional in distributed systems. The real choice is CP (consistent but unavailable during partition) vs. AP (available but potentially stale during partition).',
      'Map to real systems: Banking/payments → CP (wrong balance is worse than temporary unavailability). Social media feeds → AP (stale post is acceptable, downtime is not).',
      'Know the consistency spectrum: Strong → Linearizable → Sequential → Causal → Eventual. Each step trades correctness for performance.',
      'Discuss PACELC: even without partitions, there\'s a latency vs. consistency trade-off. Synchronous replication = consistent but slow. Async replication = fast but eventually consistent.',
      'In interviews, always justify your consistency choice: "I chose eventual consistency here because a user seeing a slightly stale follower count is acceptable, and it lets us serve reads from any replica with low latency."'
    ],
    keyComponents: [
      'Consistency — all nodes see the same data at the same time; after a write completes, all reads reflect it',
      'Availability — every non-failing node returns a response for every request in a reasonable time',
      'Partition Tolerance — the system continues to function when network messages between nodes are lost or delayed',
      'Strong Consistency — reads always return the most recent write; achieved via synchronous replication or consensus (Paxos, Raft)',
      'Eventual Consistency — given enough time, all replicas converge; writes propagate asynchronously; temporary staleness is acceptable',
      'Causal Consistency — operations that are causally related are seen in the same order by all nodes; concurrent operations may be seen in different orders',
      'Linearizability — the strongest consistency model; all operations appear to execute atomically in real-time order',
      'Quorum — read and write quorums (W + R > N) provide tunable consistency in replicated systems'
    ],
    scaleConsiderations: [
      'Strong consistency limits write throughput — all replicas must acknowledge before a write is complete, adding latency proportional to the slowest replica.',
      'Eventual consistency enables massive read scalability — reads can be served from any replica, anywhere in the world, with local latency.',
      'Conflict resolution is the cost of AP systems — you need strategies like last-write-wins, vector clocks, or CRDTs to handle concurrent writes.',
      'Most real systems are not purely CP or AP — they make different trade-offs for different operations (e.g., strong consistency for account balance, eventual consistency for profile photo).',
      'Network partitions are rare but catastrophic — your design must handle them even if they happen once a year.'
    ],
    commonMistakes: [
      'Saying "we\'ll use a distributed database that provides all three" — the CAP theorem proves this is impossible during a partition. Pick your trade-off.',
      'Treating CAP as a permanent choice — it only applies during a partition. During normal operation, you can have both consistency and availability.',
      'Not connecting consistency choice to the business requirement — always explain WHY eventual consistency is acceptable (or why strong consistency is necessary) for your specific use case.',
      'Confusing consistency in CAP (all nodes agree) with consistency in ACID (database invariants are maintained) — they are different concepts that share a name.'
    ],
    resources: [
      { label: 'HelloInterview — CAP Theorem', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — CAP Theorem Simplified', url: 'https://www.youtube.com/watch?v=BHqjEjzAicA' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 6 (Consistency)', url: '' }
    ],
    relatedTopics: ['availability-reliability', 'databases-deep-dive', 'data-partitioning']
  },

  {
    id: 'scalability-performance',
    title: 'Scalability & Performance',
    type: 'foundation',
    category: 'Core Principles',
    order: 4,
    overview: `Scalability is a system's ability to handle increased load by adding resources. Performance is how fast the system responds under a given load. A useful diagnostic: if the system is slow for a single user, that's a performance problem. If it's fast for one user but slow under load, that's a scalability problem. You need to understand both, but the solutions are different — performance is often algorithmic or architectural, while scalability is about distributing work.

Horizontal scaling (scale out) adds more machines to share the load — this is how the web scales. Vertical scaling (scale up) adds more CPU, RAM, or disk to a single machine — simpler but has a ceiling. Almost every system design answer should involve horizontal scaling at some point. The key insight is that horizontal scaling requires your application to be stateless (no session stored on a single server) or to have state externalized (sessions in Redis, data in a shared database). Stateful servers make horizontal scaling painful.

The three key performance metrics are latency (how long a single request takes), throughput (how many requests the system handles per second), and response time (latency as experienced by the user, including queue wait time). In interviews, always discuss latency in percentiles: p50 (median), p95, and p99. Why? Because the average hides the worst cases. If your p50 is 50ms but your p99 is 5 seconds, 1% of your users are having a terrible experience — and at scale, 1% of a million users is 10,000 unhappy people.

SLAs (Service Level Agreements) define the performance contract: "99% of requests will complete within 200ms." Auto-scaling adjusts resources based on metrics (CPU utilization, queue depth, request rate) to maintain SLAs during traffic fluctuations. The goal is to handle peak load without over-provisioning for average load. Understanding these concepts lets you make informed decisions about caching, database choice, async processing, and architectural patterns in every design question.`,
    framework: [
      'Diagnose the problem: is it slow for one user (performance) or slow under load (scalability)? The solutions are fundamentally different.',
      'Choose scaling direction: horizontal (add servers) for stateless services and read-heavy workloads; vertical (bigger machine) for databases and stateful workloads as a short-term fix.',
      'Define performance targets: state latency in percentiles — "p99 < 200ms." Use throughput targets: "10K requests/sec." These drive your design decisions.',
      'Identify bottlenecks: CPU-bound (compute-heavy) → add more servers or optimize algorithms. I/O-bound (disk/network) → add caching, use async I/O, or batch operations. Memory-bound → increase RAM or reduce working set.',
      'Apply scaling patterns: caching (reduce repeated work), load balancing (distribute work), async processing (defer non-critical work), database read replicas (scale reads), sharding (scale writes).',
      'Measure and iterate: instrument everything. Monitor p50/p95/p99 latency, throughput, error rates, and resource utilization. Identify the bottleneck before optimizing.'
    ],
    keyComponents: [
      'Horizontal Scaling — add more machines to handle more load; requires stateless application design',
      'Vertical Scaling — add more resources (CPU, RAM) to a single machine; simpler but has a ceiling',
      'Latency (p50/p95/p99) — time for a single request; use percentiles, not averages, to understand the user experience',
      'Throughput — requests per second the system can handle; limited by the slowest component in the pipeline',
      'Response Time — total time the user waits, including queue time + processing time + network time',
      'SLAs — contractual performance targets; e.g., "99.9% of requests < 200ms"; drive architectural decisions',
      'Auto-Scaling — automatically adjust server count based on metrics (CPU, queue depth); handle traffic spikes without over-provisioning',
      'Backpressure — when a system is overwhelmed, push back on producers rather than accepting and dropping requests; prevents cascading failures'
    ],
    scaleConsiderations: [
      'Amdahl\'s Law: the speedup from parallelism is limited by the sequential portion of the workload. If 10% of your code is serial, you can never get more than 10x speedup regardless of how many servers you add.',
      'At massive scale, every optimization matters: 1ms of added latency × 1B requests/day = 11.5 server-days of compute wasted.',
      'Scale reads and writes separately: reads scale easily (caching, replicas, CDN). Writes are harder (sharding, async, batching).',
      'Think about data size: a system that works at 1TB may not work at 1PB. Storage, indexing, and query patterns all change.',
      'Geographic distribution adds latency: a round trip from New York to London is ~70ms at the speed of light. CDNs and regional deployments mitigate this.'
    ],
    commonMistakes: [
      'Using averages instead of percentiles for latency — an average of 100ms hides the fact that 1% of requests take 10 seconds.',
      'Vertical scaling as the long-term solution — "just get a bigger server" has a ceiling and a single point of failure.',
      'Not identifying the bottleneck before optimizing — adding more app servers doesn\'t help if the database is the bottleneck.',
      'Ignoring the cost of horizontal scaling — more servers means more operational complexity, more network hops, and distributed system challenges (consistency, coordination).'
    ],
    resources: [
      { label: 'HelloInterview — Scalability Concepts', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Vertical vs Horizontal Scaling', url: 'https://www.youtube.com/watch?v=dvRFHG2-uYs' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (Scaling)', url: '' }
    ],
    relatedTopics: ['load-balancing', 'caching-in-sd', 'availability-reliability']
  },

  {
    id: 'load-balancing',
    title: 'Load Balancing',
    type: 'foundation',
    category: 'Building Blocks',
    order: 5,
    overview: `A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much load. Think of it like a restaurant host directing customers to available tables — without the host, everyone would crowd the first table and the rest would sit empty. Load balancers are one of the most fundamental building blocks in system design and appear in virtually every architecture diagram.

Load balancers operate at two primary layers. L4 (transport layer) load balancers route based on IP address and TCP port — they're fast because they don't inspect packet contents, but they can't make decisions based on HTTP headers, URLs, or cookies. L7 (application layer) load balancers understand HTTP and can route based on URL path, headers, cookies, or request content — this enables advanced patterns like routing /api/users to User Service and /api/orders to Order Service. Most modern architectures use L7 load balancers (Nginx, HAProxy, ALB) because the routing flexibility outweighs the small performance overhead.

The choice of algorithm determines how traffic is distributed. Round-robin is the simplest (each server gets the next request in rotation). Least connections routes to the server with the fewest active connections (good for variable request processing times). IP hash routes the same client IP to the same server consistently (useful for session affinity). Weighted round-robin assigns more traffic to more powerful servers. Consistent hashing distributes traffic evenly and handles server addition/removal gracefully. Each algorithm has trade-offs — round-robin is simple but ignores server load; least connections is smarter but requires real-time tracking.

Additional load balancer responsibilities include health checks (periodically probe backend servers and remove unhealthy ones from rotation), SSL termination (decrypt HTTPS at the load balancer so backend servers handle plain HTTP, reducing their CPU load), sticky sessions (route the same user to the same server using a cookie, useful for stateful applications), and connection draining (gracefully stop sending new requests to a server being removed, while allowing existing requests to complete).`,
    framework: [
      'Explain why: load balancers prevent overloading any single server, improve availability (route around failures), and enable horizontal scaling.',
      'Choose the layer: L4 for simple high-throughput routing (e.g., TCP connections to a database cluster). L7 for HTTP-aware routing (e.g., path-based routing to microservices).',
      'Select the algorithm: Round-robin for uniform servers and requests. Least connections for variable-length requests. Consistent hashing for cache-friendly routing. IP hash for session affinity.',
      'Configure health checks: HTTP health check endpoint (e.g., /healthz) every 10-30 seconds. Remove servers that fail 3 consecutive checks. Add them back when they pass.',
      'Discuss SSL termination: decrypt HTTPS at the load balancer. Backend servers communicate over plain HTTP on the internal network. This simplifies certificate management and reduces backend CPU.',
      'Consider redundancy: a single load balancer is a single point of failure. Deploy active-passive or active-active load balancer pairs with floating IP (virtual IP) failover.'
    ],
    keyComponents: [
      'L4 Load Balancer — routes based on IP/port; high throughput, low latency; no HTTP awareness (e.g., NLB, HAProxy in TCP mode)',
      'L7 Load Balancer — routes based on HTTP attributes (URL, headers, cookies); enables path-based routing and content-aware decisions (e.g., ALB, Nginx, Envoy)',
      'Round-Robin — simplest algorithm; rotates through servers sequentially; assumes all servers and requests are equal',
      'Least Connections — routes to the server with the fewest active connections; adapts to variable processing times',
      'Consistent Hashing — maps requests and servers to a hash ring; minimizes redistribution when servers are added/removed',
      'Health Checks — periodic probes to detect unhealthy servers; automatically remove and re-add servers from the rotation',
      'SSL Termination — decrypt HTTPS at the load balancer; backend communicates over HTTP; centralizes certificate management',
      'Sticky Sessions — route the same client to the same server using cookies or IP; useful for stateful applications but hinders horizontal scaling'
    ],
    scaleConsiderations: [
      'DNS-based load balancing: use DNS to distribute across multiple load balancers globally (Route53, Cloudflare). Each geographic region gets its own load balancer cluster.',
      'The load balancer itself can become a bottleneck: modern L7 LBs handle 100K+ connections/sec, but at extreme scale, use L4 LBs in front of L7 LBs (two-tier architecture).',
      'Health check tuning: too aggressive (check every 1s) wastes resources; too lenient (every 60s) means slow failure detection. 10-30 second intervals with 2-3 failure threshold is typical.',
      'Connection draining: when scaling down or deploying, stop sending new requests to the server but allow existing in-flight requests to complete (typically 30-60 second drain period).',
      'Sticky sessions vs. externalized state: sticky sessions seem convenient but break horizontal scaling. Prefer externalizing state to Redis/database so any server can handle any request.'
    ],
    commonMistakes: [
      'Not including a load balancer in your design — even the simplest system design needs traffic distribution for availability and scaling.',
      'Using sticky sessions when stateless design is possible — sticky sessions create uneven load distribution and make scaling harder.',
      'Forgetting that the load balancer is a single point of failure — always mention redundant LBs with failover.',
      'Choosing an algorithm without justification — explain why you chose round-robin vs. least connections vs. consistent hashing for your specific workload.'
    ],
    resources: [
      { label: 'HelloInterview — Load Balancing', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Load Balancing Algorithms', url: 'https://www.youtube.com/watch?v=dBmxNsS3BGE' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (Load Balancer)', url: '' }
    ],
    relatedTopics: ['availability-reliability', 'scalability-performance', 'consistent-hashing']
  },

  {
    id: 'databases-deep-dive',
    title: 'Databases & Storage',
    type: 'foundation',
    category: 'Building Blocks',
    order: 6,
    overview: `Choosing the right database is one of the most impactful decisions in system design. The fundamental divide is between relational (SQL) databases — MySQL, PostgreSQL — and non-relational (NoSQL) databases — MongoDB, Cassandra, DynamoDB, Redis. SQL databases enforce schemas, provide ACID transactions (Atomicity, Consistency, Isolation, Durability), and excel at complex queries with joins. NoSQL databases trade some of these guarantees for horizontal scalability, flexible schemas, and optimized access patterns.

The decision framework is straightforward. Need multi-table joins, complex queries, and strong consistency? Use SQL (PostgreSQL, MySQL). Need to store massive amounts of data with simple lookups at low latency? Use NoSQL (DynamoDB, Cassandra). Need time-series data with high write throughput? Use a time-series database (TimescaleDB, InfluxDB). Need to model relationships like social graphs? Use a graph database (Neo4j). Need full-text search? Use a search engine (Elasticsearch). Most real systems use multiple databases, each optimized for its access pattern — this is called polyglot persistence.

Indexing is what makes databases fast. Without indexes, every query scans the entire table (O(n)). A B-tree index provides O(log n) lookups and is the default for most relational databases — great for range queries and sorted access. A hash index provides O(1) lookups but only for exact match queries. Composite indexes cover multiple columns (useful for WHERE clauses with multiple conditions). Understanding when and why to add indexes (and the write-performance cost they incur) is essential.

Scaling databases involves several strategies. Read replicas handle read-heavy workloads by distributing reads across copies. Federation splits databases by function (users DB, orders DB, products DB). Sharding splits a single table across multiple servers by a shard key (user_id, geographic region). Denormalization trades storage and write complexity for read performance by pre-computing joins. Each strategy has trade-offs — sharding adds enormous operational complexity, so don't propose it until you've exhausted simpler options (indexing, caching, read replicas).`,
    framework: [
      'Start with the access pattern: what queries will you run? How often? What\'s the read/write ratio? This drives your database choice.',
      'SQL vs. NoSQL decision: need joins + transactions → SQL. Need scale + simple lookups → NoSQL. Need both → use both (polyglot persistence).',
      'Design your schema: for SQL, normalize to 3NF, then selectively denormalize for read performance. For NoSQL, design around access patterns (the query defines the schema).',
      'Add indexes strategically: index columns used in WHERE, JOIN, and ORDER BY. Composite indexes for multi-column queries. Don\'t over-index — each index slows writes.',
      'Scale reads first: add caching (Redis), then read replicas. This handles 90% of scaling needs without the complexity of sharding.',
      'Shard when necessary: choose a shard key that distributes data evenly and matches your query patterns. Hash-based sharding for even distribution; range-based for queries on the shard key.'
    ],
    keyComponents: [
      'ACID Properties — Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes)',
      'BASE Properties — Basically Available, Soft state, Eventually consistent; the NoSQL trade-off for scalability',
      'B-tree Index — balanced tree for O(log n) lookups and range queries; the default index type in SQL databases',
      'Composite Index — index on multiple columns; crucial for queries filtering on multiple fields; column order matters',
      'Replication — master-slave (one writer, many readers) or master-master (multiple writers with conflict resolution)',
      'Sharding — horizontal partitioning across servers; strategies include hash-based, range-based, and directory-based',
      'Denormalization — store redundant data to avoid joins at read time; trades write complexity for read performance',
      'Connection Pooling — reuse database connections across requests; essential for performance (creating connections is expensive)'
    ],
    scaleConsiderations: [
      'Read replicas are the first scaling lever: replicate the primary database to read-only copies. Route reads to replicas. This scales read throughput linearly.',
      'Sharding is the nuclear option: it makes joins across shards difficult, transactions complex, and operations painful. Exhaust caching and read replicas first.',
      'Choose the shard key carefully: a bad shard key creates hot spots (one shard gets all the traffic). user_id is usually a good choice for user-centric applications.',
      'Cross-shard queries are expensive: if you shard by user_id but need to query across all users (analytics, leaderboards), you need a separate aggregation pipeline or search index.',
      'Database connection limits: a typical database handles 500-5000 concurrent connections. With 100 app servers × 20 connections each = 2000 connections. Use connection pooling (PgBouncer, ProxySQL).'
    ],
    commonMistakes: [
      'Choosing NoSQL because "it scales better" without understanding that SQL databases scale very well with proper indexing, caching, and read replicas.',
      'Not discussing indexing — an unindexed query on a million-row table is a full table scan. Always mention which columns you\'d index and why.',
      'Jumping to sharding before considering simpler solutions — sharding adds massive complexity. Caching and read replicas solve most scaling problems.',
      'Using a single database for everything — use the right tool for the right job. Relational for transactional data, Redis for caching, Elasticsearch for search.'
    ],
    resources: [
      { label: 'HelloInterview — Databases', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — SQL vs NoSQL', url: 'https://www.youtube.com/watch?v=Q2Z6NtBB_GY' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (Database)', url: '' }
    ],
    relatedTopics: ['caching-in-sd', 'data-partitioning', 'cap-theorem']
  },

  {
    id: 'caching-in-sd',
    title: 'Caching in System Design',
    type: 'foundation',
    category: 'Building Blocks',
    order: 7,
    overview: `Caching stores copies of frequently accessed data in a faster storage layer to reduce latency and database load. It is the single most effective optimization in system design — a well-placed cache can reduce database load by 90%+ and cut response times from hundreds of milliseconds to single-digit milliseconds. The famous quote applies: "There are only two hard things in computer science: cache invalidation and naming things."

Caches exist at every layer of the stack. Browser cache (HTTP cache headers like Cache-Control), CDN cache (static assets and API responses at edge locations), application-level cache (Redis/Memcached storing query results, session data, computed values), and database-level cache (query cache, buffer pool). Each layer addresses a different latency concern: CDN eliminates network round trips; application cache eliminates database queries; database cache eliminates disk I/O.

The four caching strategies each have different consistency and performance characteristics. Cache-aside (lazy loading): the application checks the cache first; on miss, it reads from the database, writes to the cache, and returns the result. Write-through: every write goes to both cache and database synchronously. Write-behind (write-back): writes go to the cache immediately and are asynchronously flushed to the database (risky if cache crashes). Read-through: the cache itself fetches from the database on a miss (the application only talks to the cache). Cache-aside is the most common because it's simple and the application controls the logic.

Cache invalidation — deciding when cached data is stale — is genuinely hard. TTL (time-to-live) is the simplest approach: set an expiration time and accept that data may be stale for up to that duration. Active invalidation deletes cache entries when the underlying data changes (requires knowing all affected cache keys). The thundering herd problem occurs when a popular cache key expires and hundreds of concurrent requests simultaneously hit the database to refill it. Solutions include locking (only one request refills, others wait), probabilistic early expiration (refresh slightly before TTL), and cache warming (pre-populate cache before it's needed).`,
    framework: [
      'Identify what to cache: read-heavy data, expensive computations, frequently accessed but rarely changed data. Don\'t cache data that changes on every request.',
      'Choose the caching layer: CDN for static assets, Redis/Memcached for application data, in-process cache (like Guava) for ultra-low-latency needs.',
      'Select the strategy: Cache-aside for most cases (simple, flexible). Write-through when you can\'t tolerate stale reads. Write-behind for write-heavy workloads (risk of data loss on cache crash).',
      'Set TTL appropriately: short TTL (seconds) for frequently changing data (stock prices). Long TTL (hours) for rarely changing data (user profiles). No TTL for immutable data (historical records).',
      'Handle cache invalidation: invalidate on write (delete the cache key when the database is updated). Never update the cache on write — delete it and let the next read refill it.',
      'Prevent thundering herd: use a lock so only one request refills the cache on a miss. Or use probabilistic early expiration to stagger refills.'
    ],
    keyComponents: [
      'Cache-Aside (Lazy Loading) — app checks cache → on miss, read DB → write to cache → return. Most common pattern.',
      'Write-Through — every write goes to cache AND database synchronously. Consistent but adds write latency.',
      'Write-Behind (Write-Back) — writes go to cache, asynchronously flushed to DB. Fast writes but risk data loss on cache crash.',
      'Read-Through — cache fetches from DB on miss automatically. App only talks to cache. Simplifies application code.',
      'TTL (Time-to-Live) — automatic cache expiration after a set duration. Simple but data may be stale up to TTL.',
      'Cache Invalidation — delete cache entries when underlying data changes. Harder than it sounds because you need to know all affected keys.',
      'Thundering Herd Prevention — lock-based refill (one request fills, others wait) or probabilistic early expiration to prevent all-at-once DB hits.',
      'Cache Warming — pre-populate cache with expected hot data before traffic arrives (e.g., before a product launch or after a deploy).'
    ],
    scaleConsiderations: [
      'Cache hit ratio is the key metric: target > 95%. Below 80%, the cache adds overhead without much benefit. Monitor and tune.',
      'Memory is finite: use LRU or LFU eviction policies to keep the working set in cache. Size your cache based on the hot data set, not total data.',
      'Distributed cache (Redis Cluster) for large-scale: partition keys across multiple Redis nodes using consistent hashing. Replicate for availability.',
      'Local cache + distributed cache: use a small in-process cache (LRU, 1000 entries) for ultra-hot keys, backed by Redis for the broader working set. This avoids network round trips for the hottest data.',
      'Cache stampede at scale is dangerous: one expired popular key can cause thousands of simultaneous DB queries. At 100K QPS, even a single cache miss on a hot key can overwhelm the database.'
    ],
    commonMistakes: [
      'Updating the cache on write instead of invalidating it — concurrent writes can race and leave stale data permanently. Always delete the cache key and let the next read refill it.',
      'Caching everything without considering hit rate — caching rarely-accessed data wastes memory and adds complexity without benefit.',
      'Not discussing cache invalidation strategy — "we\'ll use Redis" is incomplete without explaining how stale data is handled.',
      'Ignoring the thundering herd problem — when a hot key expires, thousands of requests can overwhelm the database. Always mention your mitigation strategy.'
    ],
    resources: [
      { label: 'HelloInterview — Caching', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Top Caching Strategies', url: 'https://www.youtube.com/watch?v=dGAgxozNWFE' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (Cache)', url: '' }
    ],
    relatedTopics: ['distributed-cache', 'cdn-proxy', 'databases-deep-dive']
  },

  {
    id: 'cdn-proxy',
    title: 'CDN & Proxies',
    type: 'foundation',
    category: 'Building Blocks',
    order: 8,
    overview: `A Content Delivery Network (CDN) is a geographically distributed network of servers (edge locations/PoPs) that cache and serve content from locations close to users, reducing latency dramatically. Without a CDN, a user in Tokyo requesting a page from a server in Virginia experiences ~150ms of network latency per round trip. With a CDN edge server in Tokyo, that same request takes ~5ms. CDNs serve 50-90% of global web traffic and are essential for any system serving users across multiple geographies.

CDNs use two content distribution models. Push CDN: the origin server proactively pushes content to edge servers (good for static content that changes infrequently — images, CSS, JS bundles). You control exactly what's cached, but you're responsible for updating edges when content changes. Pull CDN: edge servers fetch content from the origin on the first request and cache it (good for dynamic or long-tail content). The first user experiences origin latency; subsequent users get edge-cached responses. Most CDNs use pull with configurable cache-control headers (Cache-Control: max-age=3600, s-maxage=86400, stale-while-revalidate).

A forward proxy sits between clients and the internet, acting on behalf of clients (e.g., corporate proxy that filters outbound requests, VPN). A reverse proxy sits between the internet and your servers, acting on behalf of your servers (e.g., Nginx, HAProxy). Reverse proxies provide load balancing, SSL termination, caching, compression, rate limiting, and security (hiding the internal server topology from the outside world). In practice, every production web service sits behind a reverse proxy.

CDN cache invalidation is an important operational concern. When you deploy a new version of your JavaScript bundle, you need users to get the new version, not the cached old one. Solutions include cache busting (append a version hash to filenames: app.abc123.js), cache purge APIs (tell the CDN to drop specific URLs), and short TTLs for frequently changing content combined with stale-while-revalidate to avoid latency spikes.`,
    framework: [
      'Place the CDN: static assets (images, CSS, JS, fonts, videos) should always be served from a CDN. Consider CDN for API responses that are cacheable (e.g., product catalog, public profiles).',
      'Choose push vs. pull: push for predictable static content (marketing site, app bundles). Pull for dynamic/long-tail content (user-uploaded images, API responses).',
      'Configure cache headers: use Cache-Control headers to control what\'s cached, for how long, and how revalidation works. s-maxage for CDN TTL, max-age for browser TTL.',
      'Plan cache invalidation: use content-hashed filenames for immutable assets (app.abc123.js). Use short TTL + stale-while-revalidate for mutable content. Use purge APIs for urgent updates.',
      'Explain reverse proxy role: Nginx/HAProxy in front of your application servers for load balancing, SSL termination, request buffering, and rate limiting.',
      'Consider multi-CDN: for critical applications, use multiple CDN providers with DNS-based failover to avoid single-provider outages.'
    ],
    keyComponents: [
      'CDN Edge Server (PoP) — geographically distributed cache server that serves content to nearby users with low latency',
      'Push CDN — origin proactively sends content to edge; full control but requires explicit management of cache contents',
      'Pull CDN — edge fetches from origin on cache miss; automatic but first request is slow; most common model',
      'Cache-Control Headers — HTTP headers (max-age, s-maxage, stale-while-revalidate, no-cache) that control CDN and browser caching behavior',
      'Cache Invalidation / Purge — mechanism to remove stale content from CDN edges; via API call, TTL expiry, or content-hashed filenames',
      'Forward Proxy — acts on behalf of clients; filters outbound requests, provides anonymity (e.g., VPN, corporate proxy)',
      'Reverse Proxy — acts on behalf of servers; provides load balancing, SSL termination, caching, compression, security (e.g., Nginx, Envoy)',
      'Origin Server — your actual application/web server that the CDN fetches content from on cache misses'
    ],
    scaleConsiderations: [
      'CDN dramatically reduces origin load: for static-heavy sites, 95%+ of requests are served from edge, reducing origin traffic to a trickle.',
      'Cache hit ratio depends on content distribution: popular content (head) has near-100% hit rates. Long-tail content (user-specific) may have low hit rates and frequent origin fetches.',
      'Edge computing: modern CDNs (Cloudflare Workers, Lambda@Edge) can run custom code at edge locations, enabling dynamic content generation without hitting the origin.',
      'Cost consideration: CDN bandwidth is cheaper than origin bandwidth, but CDN costs scale with total bytes served. Compress assets (gzip, brotli) and optimize images to reduce costs.',
      'Global consistency: after a purge, it takes seconds to minutes for all edge servers worldwide to drop the cached content. During this window, some users see old content.'
    ],
    commonMistakes: [
      'Not using a CDN at all — even a basic CDN for static assets reduces latency by 10-100x for geographically distributed users.',
      'Caching user-specific or authenticated content on the CDN without proper cache keys — this can serve User A\'s data to User B (a security disaster).',
      'Not having a cache invalidation strategy — deploying a new version and hoping users get it eventually is not a strategy.',
      'Confusing forward proxy and reverse proxy — they face opposite directions. Forward proxy serves clients, reverse proxy serves servers. Most system designs involve a reverse proxy.'
    ],
    resources: [
      { label: 'HelloInterview — CDN & Delivery', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — CDN Explained', url: 'https://www.youtube.com/watch?v=RI9np1LWzqw' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (CDN)', url: '' }
    ],
    relatedTopics: ['caching-in-sd', 'load-balancing', 'scalability-performance']
  },

  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    type: 'foundation',
    category: 'Building Blocks',
    order: 9,
    overview: `Consistent hashing solves the fundamental problem of distributing data across a dynamic set of servers. With simple modular hashing (key % N), adding or removing a server reshuffles almost every key to a different server — if you have a cache cluster with 10 servers and add an 11th, approximately 90% of cached keys are now mapped to the wrong server, causing a massive cache miss storm. Consistent hashing reduces this to roughly K/N key movements (where K is total keys and N is the number of servers), making it practical to scale clusters up and down.

The concept uses a hash ring: imagine a circle (0 to 2^32). Both servers and keys are hashed onto this ring using the same hash function. Each key is assigned to the first server encountered when walking clockwise from the key's position on the ring. When a server is added, only the keys between it and the previous server (counter-clockwise) are reassigned. When a server is removed, its keys move to the next server clockwise. This means only a fraction of keys are affected by membership changes.

A simple analogy: imagine servers placed on a clock face — each key goes to the next server clockwise. If you add a new server between 3 o'clock and 6 o'clock, only the keys between 3 and the new server move; everything else stays put.

The naive implementation has a problem: with few servers, the distribution is uneven (some servers get much more data than others depending on where they land on the ring). Virtual nodes fix this: instead of one point per server, each server gets 100-200 points (virtual nodes) spread around the ring. This provides much more even distribution. In practice, DynamoDB, Cassandra, Akamai CDN, and Discord all use consistent hashing for data distribution. It's also used in load balancers for cache-friendly request routing.`,
    framework: [
      'Explain the problem: simple hash mod N fails because adding/removing servers remaps almost all keys, causing cache avalanches or massive data movement.',
      'Introduce the hash ring: hash both keys and servers onto a circular space (0 to 2^32). Keys are assigned to the next server clockwise on the ring.',
      'Show how server changes are graceful: adding a server only moves keys between it and the previous server. Removing a server only moves its keys to the next server. Minimal disruption.',
      'Address uneven distribution: with few servers, some get disproportionate load. Virtual nodes (100-200 per server) spread each server across the ring for even distribution.',
      'Discuss replication: store data on N consecutive servers clockwise from the key\'s position. If server A dies, data is still on servers B and C.',
      'Connect to real systems: "I\'d use consistent hashing for the cache cluster so that adding nodes during peak traffic only causes a small fraction of cache misses."'
    ],
    keyComponents: [
      'Hash Ring — circular hash space (0 to 2^32) onto which both servers and keys are mapped',
      'Hash Function — maps server IDs and keys to positions on the ring; must be uniform and deterministic (e.g., MD5, MurmurHash)',
      'Virtual Nodes — multiple points on the ring per physical server (100-200); ensures even key distribution regardless of the number of physical servers',
      'Key Assignment — each key walks clockwise on the ring to the first server node; this determines which server owns that key',
      'Node Addition — new server takes ownership of keys between it and its counter-clockwise predecessor; only those keys are remapped',
      'Node Removal — removed server\'s keys are reassigned to its clockwise successor; all other keys are unaffected',
      'Replication — keys are replicated to N consecutive servers on the ring for fault tolerance; typically N=3',
      'Bounded Load — variant where servers have a maximum load threshold; overflow keys are forwarded to the next server to prevent hotspots'
    ],
    scaleConsiderations: [
      'Virtual node count: too few (10) → uneven distribution. Too many (1000) → high memory for the ring metadata and slow lookups. 100-200 per server is the sweet spot.',
      'Hash function choice: must be fast and produce uniform distribution. MurmurHash3 or xxHash are common. Cryptographic hashes (SHA-256) work but are unnecessarily slow.',
      'Ring metadata propagation: all clients need an up-to-date view of the ring. Use a coordination service (ZooKeeper, etcd) to publish ring changes and notify clients.',
      'Heterogeneous servers: assign more virtual nodes to more powerful servers (proportional to capacity). This naturally routes more traffic to beefier machines.',
      'During scaling events: even with consistent hashing, the K/N keys that move create a temporary load spike on the receiving server. Use warm-up periods and gradual key migration.'
    ],
    commonMistakes: [
      'Proposing simple hash mod N for a distributed cache — this causes a cache avalanche when servers are added or removed, as nearly all keys are remapped.',
      'Forgetting virtual nodes — without them, a small number of servers creates wildly uneven distribution on the ring.',
      'Not explaining WHY it\'s better — just saying "use consistent hashing" without contrasting it with naive modular hashing doesn\'t demonstrate understanding.',
      'Assuming zero key movement — consistent hashing minimizes but doesn\'t eliminate key redistribution. K/N keys still move when a node joins or leaves.'
    ],
    resources: [
      { label: 'HelloInterview — Consistent Hashing', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Consistent Hashing Explained', url: 'https://www.youtube.com/watch?v=UF9Ez_-GFhk' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 5 (Consistent Hashing)', url: '' }
    ],
    relatedTopics: ['distributed-cache', 'load-balancing', 'data-partitioning']
  },

  {
    id: 'api-design',
    title: 'API Design & Communication',
    type: 'foundation',
    category: 'Building Blocks',
    order: 10,
    overview: `API design is how services communicate with each other and with clients. In a system design interview, you'll define APIs for your core operations, and the choices you make (REST vs. gRPC, pagination strategy, authentication method) reveal your experience level. The four main API paradigms each serve different purposes, and knowing when to use each is a key differentiator.

REST (Representational State Transfer) uses HTTP methods on resources: GET /users/123, POST /orders, PUT /users/123, DELETE /users/123. It's the default for client-facing APIs because it's simple, cacheable, and universally understood. Use standard HTTP status codes (200 OK, 201 Created, 400 Bad Request, 404 Not Found, 429 Too Many Requests, 500 Internal Server Error). GraphQL lets clients request exactly the data they need in a single query, solving the over-fetching (getting fields you don't need) and under-fetching (needing multiple round trips) problems of REST. It's ideal for mobile clients with bandwidth constraints and UIs that need flexible data shapes.

gRPC uses Protocol Buffers (binary serialization) over HTTP/2, providing much higher throughput and lower latency than JSON-based REST. It supports streaming (server-streaming, client-streaming, bidirectional) and is the standard for internal microservice communication. WebSocket provides full-duplex bidirectional communication over a single TCP connection — essential for real-time features (chat, live updates, collaborative editing). Server-Sent Events (SSE) is a simpler alternative for one-way server-to-client push (notifications, live scores).

Pagination is crucial for any endpoint returning lists. Offset-based pagination (page=3&limit=20) is simple but breaks with concurrent writes (items shift between pages). Cursor-based pagination (cursor=abc123&limit=20, where cursor is the last item's ID or timestamp) is stable under concurrent writes and more efficient for large datasets. Rate limiting (e.g., 100 requests/min per API key) protects your service from abuse. Idempotency (the same request produces the same result regardless of how many times it's sent) is essential for any mutating operation — use idempotency keys so that retries after network timeouts don't create duplicate resources.`,
    framework: [
      'Choose the right protocol: client-facing → REST (simple, cacheable, universal). Internal microservices → gRPC (fast, typed, streaming). Real-time → WebSocket or SSE. Flexible queries → GraphQL.',
      'Define resources and endpoints: for REST, model nouns not verbs. /users, /orders, /products — not /getUser, /createOrder. Use HTTP methods (GET, POST, PUT, DELETE) for actions.',
      'Design pagination: cursor-based for feeds and large datasets (stable under concurrent writes). Offset-based for simple UIs with numbered pages. Always include a limit parameter with a max cap.',
      'Handle errors consistently: use standard HTTP status codes. Return structured error responses: { error: { code: "INVALID_INPUT", message: "...", field: "email" } }.',
      'Plan for rate limiting: define rate limits per API key/user/IP. Return 429 with Retry-After header. Use X-RateLimit-Limit and X-RateLimit-Remaining headers for transparency.',
      'Implement idempotency: for POST/PUT endpoints, accept an Idempotency-Key header. Store the key and response; on retry, return the stored response. This prevents duplicate operations.'
    ],
    keyComponents: [
      'REST — resource-oriented HTTP API; uses GET/POST/PUT/DELETE; stateless; cacheable; the default for external APIs',
      'GraphQL — query language for APIs; clients request exactly the fields they need; single endpoint; solves over/under-fetching',
      'gRPC — binary Protocol Buffers over HTTP/2; strongly typed; supports streaming; 2-10x faster than REST; ideal for microservice-to-microservice',
      'WebSocket — full-duplex bidirectional communication over a persistent TCP connection; essential for real-time features (chat, live updates)',
      'Server-Sent Events (SSE) — one-way server-to-client push over HTTP; simpler than WebSocket for notifications, live feeds, progress updates',
      'Pagination — cursor-based (stable, efficient for large data) vs. offset-based (simple, familiar); always limit max page size',
      'Rate Limiting — protect APIs from abuse; token bucket or sliding window; return 429 Too Many Requests with retry guidance',
      'Idempotency — ensure repeated requests have the same effect; use idempotency keys for mutating operations; critical for payment and order APIs'
    ],
    scaleConsiderations: [
      'API versioning: use URL path versioning (/v1/users) or header versioning (Accept: application/vnd.api.v1+json). Never break existing clients — always support backward compatibility.',
      'gRPC for internal communication reduces serialization overhead by 5-10x compared to JSON. At high call volumes between services, this saves significant CPU and bandwidth.',
      'WebSocket connection limits: each WebSocket connection holds a TCP socket. A single server may handle 50K-100K concurrent connections. Plan for connection-per-user scaling.',
      'GraphQL N+1 problem: a naive GraphQL resolver may issue one DB query per field per item. Use DataLoader to batch and deduplicate database queries.',
      'API gateway: centralize authentication, rate limiting, logging, and routing at the gateway level (Kong, Envoy, AWS API Gateway) instead of implementing in each service.'
    ],
    commonMistakes: [
      'Using verbs in REST URLs (/getUser, /deleteOrder) instead of resources with HTTP methods (GET /users/123, DELETE /orders/456).',
      'Not implementing pagination — returning all results for a list endpoint will crash at scale. Always paginate and enforce a maximum page size.',
      'Choosing WebSocket for everything — WebSocket adds connection management complexity. Use it only for real-time bidirectional communication. REST or SSE is sufficient for most APIs.',
      'Ignoring idempotency — without idempotency keys, a network timeout followed by a retry can create duplicate orders, payments, or records.'
    ],
    resources: [
      { label: 'HelloInterview — API Design', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Top 6 API Architectural Styles', url: 'https://www.youtube.com/watch?v=4vLxWqE94l4' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (API)', url: '' }
    ],
    relatedTopics: ['rate-limiter', 'load-balancing', 'microservices-patterns']
  },

  {
    id: 'networking-basics',
    title: 'Networking Fundamentals',
    type: 'foundation',
    category: 'Building Blocks',
    order: 11,
    overview: `You won't be asked to implement TCP in a system design interview, but you need to understand networking concepts well enough to make informed architectural decisions. When you say "we'll use WebSocket for real-time communication," the interviewer expects you to understand that WebSocket runs over TCP (reliable, ordered delivery) and that TCP's three-way handshake adds connection setup latency. When you say "we'll use a CDN," you should know that DNS resolution determines which edge server the user connects to.

The practical networking model for interviews simplifies the 7-layer OSI model into 4 layers. Application layer (HTTP, WebSocket, gRPC, DNS) — this is where your APIs live. Transport layer (TCP, UDP) — TCP provides reliable, ordered delivery with congestion control (good for web, APIs, databases); UDP provides fast, unreliable delivery (good for video streaming, gaming, DNS lookups). Network layer (IP) — handles routing packets between machines. Link layer (Ethernet, Wi-Fi) — handles communication within a local network.

DNS (Domain Name System) resolution is the first step of every web request. The browser checks its local cache, then the OS cache, then queries a recursive resolver (ISP or 8.8.8.8), which checks root servers → TLD servers (.com) → authoritative nameserver for the domain. DNS supports load balancing (return different IPs per query), geographic routing (return the nearest server's IP), and failover (health-checked DNS records). Understanding DNS is essential because it's the entry point to your system.

HTTP/1.1 uses one request per TCP connection (or pipelining, which has head-of-line blocking issues). HTTP/2 multiplexes multiple requests over a single TCP connection using binary framing, dramatically reducing latency for web applications. HTTP/3 uses QUIC (built on UDP) instead of TCP, eliminating TCP's head-of-line blocking at the transport layer and reducing connection setup time (0-RTT handshake). TLS (the S in HTTPS) adds a handshake that adds 1-2 round trips of latency on connection setup — this is why connection reuse (keep-alive, HTTP/2 multiplexing) is so important.`,
    framework: [
      'Know TCP vs. UDP: TCP for reliable delivery (APIs, databases, file transfer). UDP for speed and tolerance of packet loss (video streaming, real-time gaming, DNS).',
      'Understand DNS flow: browser cache → OS cache → recursive resolver → root → TLD → authoritative. DNS responses are cached at each level (TTL-based).',
      'Know HTTP versions: HTTP/1.1 (one request per connection), HTTP/2 (multiplexing over single TCP connection), HTTP/3 (QUIC/UDP, no TCP head-of-line blocking).',
      'Understand TLS latency: HTTPS adds 1-2 round trips for TLS handshake on new connections. Connection reuse and HTTP/2 amortize this cost.',
      'Use networking knowledge in design: "We\'ll use DNS-based geographic routing to direct users to the nearest datacenter" or "We\'ll use UDP for the live video stream to avoid TCP retransmission delays."',
      'Think about latency budget: a typical web request = DNS (50ms) + TCP handshake (1 RTT) + TLS (1-2 RTT) + HTTP request/response (1 RTT) + server processing. Optimize each step.'
    ],
    keyComponents: [
      'TCP — reliable, ordered, connection-oriented protocol; used for HTTP, databases, file transfer; three-way handshake adds latency',
      'UDP — unreliable, unordered, connectionless protocol; used for DNS, video streaming, real-time gaming; no handshake overhead',
      'DNS — translates domain names to IP addresses; hierarchical resolution (root → TLD → authoritative); supports load balancing and geographic routing',
      'HTTP/HTTPS — application protocol for web communication; HTTPS adds TLS encryption; stateless request-response model',
      'HTTP/2 — binary framing, multiplexing multiple requests over one TCP connection, header compression; major latency improvement over HTTP/1.1',
      'HTTP/3 (QUIC) — HTTP over UDP; eliminates TCP head-of-line blocking; 0-RTT connection resumption; the future of web transport',
      'TLS Handshake — establishes encrypted connection; adds 1-2 round trips; TLS 1.3 reduces to 1 round trip (or 0-RTT for resumption)',
      'IP Addressing — IPv4 (32-bit, ~4B addresses) and IPv6 (128-bit, practically unlimited); subnets and CIDR for network segmentation'
    ],
    scaleConsiderations: [
      'Connection setup latency: TCP + TLS = 2-3 round trips before any data is sent. At 150ms RTT (cross-continent), that\'s 300-450ms just to connect. HTTP/2 and connection pooling mitigate this.',
      'DNS is a potential bottleneck: DNS resolution adds 50-200ms for uncached lookups. Use low-TTL DNS for failover agility, but higher TTL for reduced resolution latency.',
      'TCP congestion control: new TCP connections start with a small window (10 segments) and grow it. Large responses on fresh connections are slow (slow start). Connection reuse avoids this.',
      'Bandwidth vs. latency: bandwidth is how much data you can transfer (like a pipe\'s diameter). Latency is how long it takes (like the pipe\'s length). Caching and CDNs improve latency. Compression improves effective bandwidth.',
      'Keep-alive and connection pooling: reuse TCP connections to amortize handshake overhead. HTTP/2 inherently multiplexes. For backend services, use connection pools to databases and other services.'
    ],
    commonMistakes: [
      'Ignoring networking latency in design — cross-region calls add 50-200ms per round trip. If your critical path has 5 serial cross-region calls, that\'s 250ms-1s just in network latency.',
      'Not understanding the difference between TCP and UDP — proposing TCP for a live video stream (where retransmission delays cause visible stuttering) or UDP for a financial transaction (where packet loss means lost money).',
      'Forgetting DNS in your architecture — DNS is the entry point. If your DNS provider goes down (like the 2016 Dyn attack), your entire service is unreachable.',
      'Treating HTTP/2 and HTTP/3 as the same — HTTP/2 still suffers from TCP head-of-line blocking (one lost packet blocks all multiplexed streams). HTTP/3/QUIC fixes this by using UDP.'
    ],
    resources: [
      { label: 'HelloInterview — Networking Fundamentals', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Top 8 Network Protocols', url: 'https://www.youtube.com/watch?v=P6SZLcGE4us' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (DNS & Networking)', url: '' }
    ],
    relatedTopics: ['load-balancing', 'cdn-proxy', 'api-design']
  },

  {
    id: 'microservices-patterns',
    title: 'Microservices & Distributed Patterns',
    type: 'foundation',
    category: 'Building Blocks',
    order: 12,
    overview: `Microservices architecture decomposes a system into small, independently deployable services, each owning its own data and business logic. Contrast this with a monolith, where all functionality lives in a single codebase and is deployed as one unit. The trade-off is real: monoliths are simpler to develop, test, and debug, but become unwieldy as the team and codebase grow. Microservices enable independent scaling, technology choice per service, and team autonomy, but add operational complexity (networking, monitoring, debugging distributed systems).

The golden rule: start with a monolith and extract microservices as pain points emerge. Don't microservice a startup. A 5-person team doesn't need 20 services — the coordination overhead will kill velocity. Extract a service when: a component needs to scale independently, a team wants to deploy independently, or a component has fundamentally different technology requirements. Amazon, Netflix, and Uber started as monoliths and migrated to microservices as they scaled.

Key patterns in microservice architectures include: Service Discovery (how services find each other — DNS-based or registry-based with Consul/Eureka), API Gateway (single entry point for clients; handles routing, auth, rate limiting), Circuit Breaker (prevent cascading failures — if Service B is down, Service A stops calling it after N failures and returns a fallback response), and Saga Pattern (manage distributed transactions across services — since you can't use a single database transaction spanning services).

The Saga pattern deserves special attention. In choreography, each service publishes events that trigger the next step (Order Created → Payment Charged → Inventory Reserved → Order Confirmed). Each service also handles its compensating action on failure (Payment Failed → Cancel Order). In orchestration, a central saga orchestrator coordinates the steps and handles failures. Choreography is more decoupled but harder to track; orchestration is easier to understand but creates a central coordination point.`,
    framework: [
      'Start with the question: "Does this need to be a microservice?" Start monolith, split when there\'s a concrete scaling, deployment, or team-autonomy need.',
      'Define service boundaries: each service owns its data and business logic. Services communicate via APIs (REST, gRPC), not shared databases.',
      'Add an API gateway: single entry point for external clients. Handles auth, rate limiting, routing, request aggregation. Internal services communicate directly.',
      'Implement service discovery: services register themselves (Consul, Eureka) and discover others dynamically. Alternatively, use DNS-based discovery (Kubernetes services).',
      'Add resilience patterns: circuit breakers (stop calling failing services), retries with exponential backoff, timeouts (never wait forever), bulkheads (isolate resources per dependency).',
      'Handle distributed transactions: use Saga pattern. Choreography for loosely coupled flows (events). Orchestration for complex multi-step workflows. Always define compensating actions for rollback.'
    ],
    keyComponents: [
      'API Gateway — single entry point for external traffic; routes to services; handles auth, rate limiting, request transformation (e.g., Kong, Envoy, AWS API Gateway)',
      'Service Discovery — mechanism for services to find each other; registry-based (Consul, Eureka) or DNS-based (Kubernetes); enables dynamic scaling',
      'Circuit Breaker — stops calling a failing dependency after N consecutive failures; returns fallback response; prevents cascading failures (e.g., Hystrix, resilience4j)',
      'Saga Pattern — manages distributed transactions; choreography (events) or orchestration (coordinator); each step has a compensating action for rollback',
      'Service Mesh — infrastructure layer (Istio, Linkerd) handling service-to-service communication; provides mTLS, load balancing, observability without application code changes',
      'Sidecar Pattern — deploy auxiliary capabilities (logging, metrics, proxy) as a co-located process alongside each service; the basis of service mesh architecture',
      'Event Bus — asynchronous communication between services via events (Kafka, RabbitMQ); enables loose coupling and eventual consistency',
      'Distributed Tracing — track a request across multiple services (Jaeger, Zipkin); essential for debugging in microservices; uses correlation IDs'
    ],
    scaleConsiderations: [
      'Each service can scale independently: a write-heavy Order Service and a read-heavy Product Service have different scaling needs. This is a primary advantage of microservices.',
      'Data consistency is the hardest challenge: without shared transactions, you must embrace eventual consistency. Use idempotent operations and compensating transactions.',
      'Operational overhead is real: monitoring, logging, tracing, deployment pipelines, and incident response are N times more complex with N services. Invest in observability (metrics, logs, traces).',
      'Network calls replace function calls: a method call that took nanoseconds in a monolith becomes a network call taking milliseconds. Minimize synchronous call chains; prefer async events.',
      'Testing complexity: integration testing microservices requires contract testing (Pact), service virtualization, or end-to-end tests in staging. Unit tests alone are insufficient.'
    ],
    commonMistakes: [
      'Starting with microservices for a new project — the overhead of distributed systems kills early-stage velocity. Start monolith, extract services when you have a specific need.',
      'Creating a distributed monolith — services that share a database, deploy together, and can\'t function independently. This has all the downsides of both architectures.',
      'Not implementing circuit breakers — without them, one failing service can cascade failures through the entire system as services wait on timeouts.',
      'Synchronous chains of service calls — Service A calls B calls C calls D synchronously. Latency adds up and any failure cascades. Use async events where possible.'
    ],
    resources: [
      { label: 'HelloInterview — Microservices Patterns', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Top 5 Microservices Patterns', url: 'https://www.youtube.com/watch?v=d0moqhkmLQY' },
      { label: 'Martin Fowler — Microservices Guide', url: 'https://martinfowler.com/microservices/' }
    ],
    relatedTopics: ['api-design', 'message-queues-in-sd', 'load-balancing']
  },

  {
    id: 'data-partitioning',
    title: 'Data Partitioning & Replication',
    type: 'foundation',
    category: 'Building Blocks',
    order: 13,
    overview: `When a single database server can no longer handle the data volume or query load, you partition (shard) the data across multiple servers. Data partitioning is one of the most complex topics in system design but also one of the most important — every large-scale system (Facebook, Google, Amazon) relies on it. Understanding when to partition, how to choose a partition strategy, and the trade-offs involved separates senior-level from junior-level answers.

Horizontal partitioning (sharding) splits rows across multiple databases — rows 1-1M go to Shard 1, rows 1M-2M go to Shard 2. Each shard holds a complete table schema but only a subset of the data. Vertical partitioning splits columns — frequently accessed columns (name, email) in one store, rarely accessed large columns (profile_photo_blob) in another. Horizontal partitioning is far more common and is what people usually mean by "sharding."

Partition strategies determine which rows go to which shard. Range-based: partition by a range of the shard key (user_id 1-100K → Shard 1, 100K-200K → Shard 2). Simple but creates hotspots if recent data is accessed more (new users all hit the last shard). Hash-based: hash(shard_key) % num_shards distributes data evenly but makes range queries impossible. Directory-based: a lookup table maps each key to its shard. Flexible but the directory is a single point of failure and a potential bottleneck. Consistent hashing is a variant of hash-based partitioning that handles adding/removing shards gracefully.

Replication ensures data survives server failures and enables read scaling. Single-leader replication: one primary accepts writes, replicas asynchronously copy the data and serve reads. Simple but the leader is a write bottleneck. Multi-leader replication: multiple servers accept writes and replicate to each other. Higher write throughput but requires conflict resolution (what happens when two leaders update the same row?). Leaderless replication: clients write to multiple replicas; reads query multiple replicas and use quorum (W + R > N) for consistency. Used by Cassandra and DynamoDB.`,
    framework: [
      'First, exhaust simpler options: caching, read replicas, and vertical scaling solve most scaling problems. Shard only when a single database can\'t handle the write volume or data size.',
      'Choose the shard key carefully: it should distribute data evenly AND match your primary access pattern. For a user-centric app, user_id is usually the best shard key.',
      'Understand the trade-offs: hash-based = even distribution but no range queries. Range-based = range queries work but risk hotspots. Choose based on your query patterns.',
      'Plan for cross-shard queries: any query that spans shards (e.g., "all orders from the last hour" when sharded by user_id) is expensive. Create a separate analytics pipeline for such queries.',
      'Choose a replication model: single-leader for simplicity and strong consistency. Multi-leader for multi-region writes. Leaderless for high availability with eventual consistency.',
      'Understand quorum: in a system with N replicas, if you write to W replicas and read from R replicas, you get consistency when W + R > N. Common configurations: N=3, W=2, R=2.'
    ],
    keyComponents: [
      'Horizontal Partitioning (Sharding) — split rows across multiple databases; each shard holds a subset of data with the full schema',
      'Vertical Partitioning — split columns across stores; put frequently accessed columns together and large/rare columns separately',
      'Range-Based Partitioning — assign rows to shards by key range (e.g., A-M → Shard 1, N-Z → Shard 2); supports range queries but risks hotspots',
      'Hash-Based Partitioning — assign rows by hash(key) % N; even distribution but no range queries; vulnerable to reshuffling when N changes',
      'Single-Leader Replication — one primary handles writes, replicas serve reads; simple but leader is a bottleneck; async replication adds read staleness',
      'Multi-Leader Replication — multiple primaries accept writes; requires conflict resolution (last-write-wins, CRDTs); used for multi-region deployments',
      'Leaderless Replication — clients write to and read from multiple replicas; quorum (W + R > N) determines consistency; used by Cassandra, DynamoDB',
      'Leader Election — process for choosing a new leader when the current one fails; uses consensus algorithms (Raft, Paxos) to prevent split-brain'
    ],
    scaleConsiderations: [
      'Resharding is painful: if you outgrow your initial number of shards, redistributing data across more shards requires careful planning, dual-writes, and migration. Use consistent hashing to minimize resharding impact.',
      'Cross-shard joins don\'t work: once data is sharded, you can\'t JOIN across shards in a single SQL query. Denormalize data or maintain materialized views for cross-shard queries.',
      'Replication lag: asynchronous replication means replicas may serve stale data. For reads that require the latest data, route to the leader. For others, any replica is fine.',
      'Conflict resolution in multi-leader: last-write-wins (LWW) is simple but loses data. CRDTs (Conflict-free Replicated Data Types) merge concurrent updates without data loss but are complex to implement.',
      'Partition-aware application: your application code must know how to route queries to the correct shard. Use a library (Vitess for MySQL, Citus for PostgreSQL) to abstract this.'
    ],
    commonMistakes: [
      'Jumping to sharding before trying caching and read replicas — sharding adds enormous complexity and should be a last resort for write scaling.',
      'Choosing a bad shard key — sharding by created_at creates a hot shard (all new writes go to the latest shard). Shard by a high-cardinality, evenly-distributed key like user_id.',
      'Forgetting about cross-shard queries — if your main query pattern doesn\'t align with your shard key, every query becomes a scatter-gather across all shards.',
      'Confusing partitioning with replication — partitioning splits data across servers (each server has different data). Replication copies data across servers (each server has the same data). They solve different problems and are often used together.'
    ],
    resources: [
      { label: 'HelloInterview — Data Partitioning', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Database Sharding Explained', url: 'https://www.youtube.com/watch?v=hdxdhCpgYo8' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 1 (Sharding)', url: '' }
    ],
    relatedTopics: ['consistent-hashing', 'databases-deep-dive', 'cap-theorem']
  },

  {
    id: 'message-queues-in-sd',
    title: 'Message Queues & Async Processing',
    type: 'foundation',
    category: 'Building Blocks',
    order: 14,
    overview: `Message queues decouple producers (services that create work) from consumers (services that process work) by introducing an intermediary buffer. Instead of Service A calling Service B directly (synchronous, coupled, both must be online), Service A puts a message on the queue and moves on. Service B picks it up when ready. This decoupling is foundational — it handles traffic spikes (queue absorbs bursts), enables independent scaling (add more consumers when queue grows), allows retry of failed operations (message stays in queue until successfully processed), and improves reliability (if a consumer crashes, another picks up the message).

The two primary messaging patterns are point-to-point (one message consumed by exactly one consumer, like a task queue) and publish/subscribe (one message delivered to all subscribed consumers, like an event bus). A Dead Letter Queue (DLQ) stores messages that repeatedly fail processing, preventing them from blocking the queue. Back-pressure mechanisms detect when consumers can't keep up and signal producers to slow down, preventing unbounded queue growth.

Delivery semantics determine how reliably messages are processed. At-most-once: messages may be lost but are never processed twice (fire and forget — consumer acknowledges before processing). At-least-once: messages are never lost but may be processed multiple times (consumer acknowledges after processing — if it crashes before acknowledging, the message is redelivered). Exactly-once: messages are processed exactly one time — this is extremely hard to achieve and often requires idempotent consumers (processing a message twice produces the same result as processing it once). Most systems use at-least-once delivery with idempotent consumers because it's the most practical balance.

Tool selection depends on your needs. Kafka: distributed log with high throughput (millions of messages/sec), message replay (consumers can rewind to any offset), and strong ordering within partitions. Best for event streaming, activity tracking, and log aggregation. RabbitMQ: traditional message broker with complex routing (exchanges, bindings, routing keys), multiple protocols (AMQP, MQTT), and message-level acknowledgment. Best for task queues and complex routing. SQS: fully managed, serverless queue from AWS. Zero operational overhead. Best for simple decoupling when you don't need ordering or replay.`,
    framework: [
      'Identify when to use async: any operation that doesn\'t need an immediate response. Email sending, image processing, analytics events, order fulfillment — all should be async.',
      'Choose the pattern: point-to-point for task distribution (exactly one consumer processes each task). Pub/sub for event broadcasting (all subscribers get every event).',
      'Select the tool: Kafka for high-throughput streaming with replay. RabbitMQ for complex routing and task queues. SQS for simple serverless decoupling.',
      'Design for failure: what happens when a consumer crashes? Use at-least-once delivery with idempotent consumers. Set up a DLQ for messages that fail repeatedly.',
      'Handle ordering: Kafka guarantees order within a partition. Use the same partition key (e.g., order_id) for messages that must be ordered. RabbitMQ and SQS don\'t guarantee ordering by default.',
      'Monitor queue depth: growing queue depth means consumers can\'t keep up. Auto-scale consumers based on queue depth. Alert when depth exceeds a threshold.'
    ],
    keyComponents: [
      'Producer — service that creates messages and publishes them to the queue/topic',
      'Consumer — service that reads messages from the queue/topic and processes them',
      'Point-to-Point — one message is consumed by exactly one consumer; used for task distribution (work queues)',
      'Publish/Subscribe — one message is delivered to all subscribers; used for event broadcasting (notifications, analytics)',
      'Dead Letter Queue (DLQ) — stores messages that fail processing repeatedly; prevents poison messages from blocking the queue; enables manual inspection',
      'Back-Pressure — mechanism to slow producers when consumers can\'t keep up; prevents unbounded queue growth and memory exhaustion',
      'Idempotent Consumer — processing the same message twice produces the same result; essential for at-least-once delivery; use unique message IDs for deduplication',
      'Consumer Group — group of consumers that share the work of processing a topic\'s partitions; each partition is assigned to exactly one consumer in the group'
    ],
    scaleConsiderations: [
      'Kafka partitions are the unit of parallelism: more partitions = more consumers can process in parallel. But too many partitions increase broker overhead. Start with 3-10 per topic.',
      'Consumer lag monitoring: track the gap between the latest message and the consumer\'s current position. Growing lag means the consumer is falling behind. Auto-scale consumers based on lag.',
      'Message size limits: keep messages small (< 1 MB). For large data, put the data in object storage (S3) and send the reference (URL) in the message.',
      'Exactly-once is expensive: Kafka supports exactly-once semantics with idempotent producers and transactional writes, but it reduces throughput. Most systems use at-least-once + idempotent consumers.',
      'Queue as a buffer during traffic spikes: instead of scaling your entire backend to handle peak load, let the queue absorb the spike and process messages at a sustainable rate. This is much more cost-effective.'
    ],
    commonMistakes: [
      'Making everything synchronous — if the caller doesn\'t need an immediate result, use a queue. Sending an email synchronously during user signup adds 1-3 seconds to the response for no reason.',
      'Not handling message processing failures — if a consumer crashes, the message should be retried, not lost. Use acknowledgments and DLQs.',
      'Assuming messages are processed in order — most queue systems don\'t guarantee global ordering. If ordering matters, use Kafka with a consistent partition key.',
      'Not designing for idempotency — with at-least-once delivery, a consumer WILL receive duplicate messages. If processing a message twice creates duplicate records or double-charges, you have a bug.'
    ],
    resources: [
      { label: 'HelloInterview — Message Queues', url: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery' },
      { label: 'ByteByteGo — Kafka vs RabbitMQ vs SQS', url: 'https://www.youtube.com/watch?v=sdjT99H8gYI' },
      { label: 'Alex Xu — System Design Interview Vol. 2, Chapter 4 (Message Queue)', url: '' }
    ],
    relatedTopics: ['distributed-message-queue', 'microservices-patterns', 'notification-system']
  },

  // ─────────────────────────────────────────────────────────────────
  // HLD Topics (High-Level Design)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'url-shortener',
    title: 'URL Shortener (TinyURL)',
    type: 'hld',
    category: 'Classic HLD',
    order: 15,
    overview: `A URL shortener converts long URLs into compact, shareable aliases (e.g., tinyurl.com/abc123) and redirects users who visit the short link back to the original URL. At scale, services like Bitly handle billions of shortened URLs and tens of thousands of redirections per second, making this one of the most frequently asked system design questions because it touches on hashing, storage, caching, and analytics.

The core challenge is generating unique short codes efficiently without collisions while maintaining low-latency reads (redirects vastly outnumber writes). The system must handle a heavy read-to-write ratio (typically 100:1 or more), support optional custom aliases, enforce TTL-based expiration, and track click analytics. A naive auto-increment approach leaks information and creates a single point of failure, so candidates must reason about distributed ID generation or hash-based encoding.

Secondary concerns include preventing abuse (rate limiting, spam URL detection), supporting analytics dashboards for link creators, and handling cache invalidation when URLs expire. The design naturally extends into discussions about consistent hashing, database sharding strategies, and CDN-level caching for the redirect layer.`,
    framework: [
      'Step 1 — Clarify requirements: read-heavy vs. write-heavy ratio, custom aliases, expiration/TTL, analytics tracking, URL length constraints (6-8 chars).',
      'Step 2 — Estimate scale: 100M new URLs/month, 10B redirects/month, ~3,800 redirects/sec, storage growing ~500 GB/year for metadata.',
      'Step 3 — Define API: POST /shorten (longUrl, customAlias?, expiry?) -> shortUrl; GET /{shortCode} -> 301/302 redirect.',
      'Step 4 — Design short code generation: Base62 encoding of a counter (Snowflake/Zookeeper-based distributed ID) or MD5/SHA256 hash truncation with collision resolution.',
      'Step 5 — Design storage: Key-value store (shortCode -> longUrl + metadata). NoSQL like DynamoDB for high throughput or sharded MySQL/Postgres for relational needs.',
      'Step 6 — Add caching layer: Redis/Memcached in front of the database for hot URLs; LRU eviction; cache-aside pattern. Most redirects served from cache.',
      'Step 7 — Handle redirect flow: Application server looks up cache first, then DB. Return 301 (permanent, browser caches) or 302 (temporary, allows analytics tracking).',
      'Step 8 — Discuss scaling: Horizontal scaling of stateless app servers behind a load balancer, database sharding by hash of short code, read replicas, CDN for popular links.'
    ],
    keyComponents: [
      'API Gateway / Load Balancer — distributes incoming requests across app server fleet',
      'Application Servers — stateless service handling shorten and redirect logic',
      'Short Code Generator — distributed unique ID service (Snowflake, Zookeeper counter range, or hash-based)',
      'Database (Primary Store) — stores shortCode -> longUrl mapping with metadata (creator, expiry, created_at)',
      'Cache Layer (Redis/Memcached) — caches frequently accessed short-to-long mappings for sub-ms redirect latency',
      'Analytics Service — async event pipeline (Kafka) for tracking clicks, referrers, geo, device info'
    ],
    scaleConsiderations: [
      'Read-heavy optimization: 100:1 read/write ratio means caching is critical. A well-sized Redis cluster can serve 90%+ of redirects without hitting the DB.',
      'Database sharding: Shard by hash of shortCode for even distribution. Range-based sharding on creation time causes hot partitions for recent URLs.',
      'ID generation without coordination: Pre-allocate counter ranges to each app server (e.g., server 1 gets 1-10M, server 2 gets 10M-20M) to avoid a central bottleneck.',
      'Expiration cleanup: Background job scans for expired URLs and removes them from cache and DB. Lazy deletion on read is also effective — check TTL on redirect.',
      '301 vs 302 trade-off: 301 is faster for users (browser caches) but you lose analytics visibility. 302 forces every click through your servers for tracking.'
    ],
    commonMistakes: [
      'Using a single auto-increment counter without discussing how to distribute ID generation across multiple servers.',
      'Ignoring the read-to-write ratio and spending too much time on the write path instead of optimizing the redirect (read) path with caching.',
      'Choosing 301 redirects without acknowledging you lose the ability to track click analytics since browsers cache the redirect.',
      'Not discussing collision handling when using hash truncation — what happens when two different URLs produce the same 7-char code.'
    ],
    resources: [
      { label: 'HelloInterview — URL Shortener', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/tinyurl' },
      { label: 'ByteByteGo — System Design: Design A URL Shortener', url: 'https://www.youtube.com/watch?v=fMZMm_0ZhK4' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 8', url: '' }
    ],
    relatedTopics: ['distributed-cache', 'rate-limiter', 'key-value-store']
  },

  {
    id: 'twitter-news-feed',
    title: 'Twitter / News Feed',
    type: 'hld',
    category: 'Social & Feed',
    order: 16,
    overview: `Designing a social media news feed (Twitter timeline, Facebook feed, Instagram feed) requires building a system that aggregates posts from followed users and presents them in a personalized, chronological or ranked order. Twitter processes ~500 million tweets per day and must render each user's home timeline within hundreds of milliseconds, even for users following thousands of accounts.

The central design tension is the fan-out problem: when a user with 10 million followers tweets, do you push that tweet into 10 million timelines immediately (fan-out on write), or do you assemble the timeline on-demand when each follower requests it (fan-out on read)? Most production systems use a hybrid: fan-out on write for normal users and fan-out on read for celebrity accounts. This avoids both the write amplification problem and the read latency problem.

Beyond the core feed, the system must support real-time delivery of new tweets, handle mixed media (text, images, videos, links with preview cards), provide search and trending topics, and support interactions (likes, retweets, replies). The data model involves a social graph (follow relationships), a tweet store, and a timeline cache — each with distinct scaling characteristics.`,
    framework: [
      'Step 1 — Clarify requirements: posting tweets, viewing home timeline, following/unfollowing users, likes/retweets, media attachments, real-time updates vs. polling.',
      'Step 2 — Estimate scale: 500M tweets/day (~5,800/sec), 300M daily active users, average user follows 200 accounts, timeline fetches ~10B/day.',
      'Step 3 — Define core APIs: POST /tweet, GET /feed?cursor=X, POST /follow/{userId}, GET /user/{id}/tweets.',
      'Step 4 — Design the social graph: adjacency list in a graph DB or sharded relational table (follower_id, followee_id). Cache hot follow lists.',
      'Step 5 — Design the feed generation: hybrid fan-out model. On tweet creation, push to follower timelines in cache for users with < 10K followers; for celebrities, merge on read.',
      'Step 6 — Timeline cache: per-user sorted set in Redis (tweet IDs scored by timestamp). Keep last 800 tweets. On read, merge cached timeline with celebrity tweets.',
      'Step 7 — Add ranking layer: ML-based ranking service re-orders the candidate set by relevance (engagement probability, recency, affinity) before returning to client.',
      'Step 8 — Discuss media pipeline: images/videos uploaded to object storage (S3), processed by a media service (thumbnail generation, transcoding), CDN for delivery.'
    ],
    keyComponents: [
      'Tweet Service — handles tweet creation, storage, and retrieval; writes to tweet store and publishes events',
      'Fan-out Service — consumes tweet events and writes tweet IDs to followers\' timeline caches',
      'Timeline Service — reads and merges cached timeline with on-demand celebrity tweets; applies ranking',
      'Social Graph Service — manages follow/unfollow relationships; provides follower/following lists',
      'Timeline Cache (Redis) — per-user sorted sets of tweet IDs; the primary read path for feed',
      'Tweet Store (Database) — persistent storage for tweet content, metadata, and media references',
      'Media Service — handles upload, processing (resize, transcode), and CDN integration',
      'Notification Service — push notifications for mentions, likes, retweets, and new followers'
    ],
    scaleConsiderations: [
      'Hybrid fan-out: Fan-out on write for regular users (pre-compute timelines) and fan-out on read for celebrity users (> 10K followers) to avoid massive write amplification.',
      'Timeline cache sizing: 300M users x 800 tweet IDs x 8 bytes ~ 2 TB of Redis. Partition across a Redis cluster by user ID hash.',
      'Hot partition mitigation: Celebrity tweets and viral content create thundering-herd reads. Cache tweet content aggressively and use request coalescing.',
      'Consistency trade-offs: Timeline is eventually consistent — a new tweet may take a few seconds to appear in all follower feeds. This is acceptable for social media.',
      'Global distribution: Multi-region deployment with geo-routing. User data is sharded by region; cross-region follows use async replication.'
    ],
    commonMistakes: [
      'Choosing only fan-out on write without discussing how celebrity accounts (millions of followers) make this approach prohibitively expensive.',
      'Ignoring the ranking/relevance layer — modern feeds are not purely chronological; interviewers expect discussion of how to order tweets.',
      'Storing full tweet content in the timeline cache instead of just tweet IDs — this wastes memory and makes updates (deletes, edits) harder.',
      'Not addressing how deletes propagate: when a user deletes a tweet, you must remove it from potentially millions of cached timelines.'
    ],
    resources: [
      { label: 'HelloInterview — Twitter Feed', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/twitter' },
      { label: 'ByteByteGo — Design a News Feed System', url: 'https://www.youtube.com/watch?v=R22GfhMPMlk' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 11', url: '' }
    ],
    relatedTopics: ['notification-system', 'distributed-cache', 'distributed-message-queue']
  },

  {
    id: 'chat-system',
    title: 'Chat System (WhatsApp/Slack)',
    type: 'hld',
    category: 'Real-Time',
    order: 17,
    overview: `A chat system like WhatsApp or Slack enables real-time messaging between users in 1:1 conversations and group channels. WhatsApp handles over 100 billion messages per day across 2 billion users, requiring persistent connections, reliable message delivery, and strong consistency guarantees (messages must arrive in order and exactly once from the user's perspective).

The core architectural challenge is maintaining millions of concurrent persistent connections (WebSockets or long polling) and routing messages to the correct recipient's connection in real time. When the recipient is offline, messages must be durably stored and delivered when they reconnect (store-and-forward). Group messaging adds fan-out complexity — a message to a 500-person group must be delivered to all online members immediately and queued for offline members.

Additional considerations include end-to-end encryption (WhatsApp uses Signal Protocol), read receipts and typing indicators (ephemeral real-time signals), media message handling (images, videos, documents via object storage), message search, and presence/online status. The system must gracefully handle network partitions, device switching, and multi-device sync.`,
    framework: [
      'Step 1 — Clarify requirements: 1:1 chat, group chat (max group size?), online/offline delivery, read receipts, typing indicators, media messages, message history, E2E encryption.',
      'Step 2 — Estimate scale: 100B messages/day (~1.15M/sec), 500M concurrent connections, average message size ~200 bytes, ~20 TB/day of message storage.',
      'Step 3 — Define APIs and protocols: WebSocket for real-time bidirectional communication. REST for non-real-time ops (create group, fetch history). Define message schema (msgId, senderId, chatId, content, timestamp, status).',
      'Step 4 — Design connection management: WebSocket servers maintain persistent connections. A connection/session service maps userId -> server/connectionId. Use consistent hashing to assign users to WS servers.',
      'Step 5 — Design message flow: sender -> WS server -> message service (persist to DB, enqueue) -> lookup recipient connection -> route to recipient WS server -> deliver. If offline, store in pending queue.',
      'Step 6 — Design storage: Message table partitioned by chatId. Use a time-series optimized store (Cassandra, HBase) for write-heavy workload. Index by (chatId, timestamp) for history retrieval.',
      'Step 7 — Handle group messaging: Fan-out message to all group members. For small groups (< 500), push to each member. Maintain group membership in a fast lookup store.',
      'Step 8 — Add presence and delivery guarantees: Heartbeat-based online detection. Message states: sent -> delivered -> read. Acknowledge at each stage. Idempotency via message IDs to prevent duplicates.'
    ],
    keyComponents: [
      'WebSocket Gateway — maintains persistent connections with clients; handles connection lifecycle, heartbeats, and message routing',
      'Session/Presence Service — tracks which users are connected and to which WS server; powers online/offline status',
      'Message Service — validates, persists, and routes messages; ensures ordering within a conversation',
      'Message Store (Cassandra/HBase) — write-optimized storage partitioned by chatId for message persistence and history',
      'Offline Message Queue — stores messages for offline users; drains when user reconnects',
      'Group Service — manages group membership, metadata, and fan-out of group messages',
      'Media Service — handles upload/download of images, videos, documents via object storage with CDN',
      'Push Notification Service — sends mobile push (APNs/FCM) for offline users'
    ],
    scaleConsiderations: [
      'Connection scalability: Each WS server handles ~50K-100K concurrent connections. A fleet of 5,000-10,000 servers for 500M concurrent users. Stateful connection routing requires a session registry.',
      'Message ordering: Messages within a single chat must be ordered. Use a per-chat sequence number or Lamport timestamp. Cross-chat global ordering is unnecessary.',
      'Storage partitioning: Partition messages by chatId (not userId) so all messages in a conversation are co-located. Time-based secondary partitioning for archival.',
      'Delivery guarantees: At-least-once delivery with client-side deduplication using message IDs. The sender retries until it receives a server ACK; the server retries delivery until the recipient ACKs.',
      'Multi-device sync: Each device maintains a cursor of last-seen message. On connect, device fetches messages after its cursor. Shared inbox model rather than per-device queues.'
    ],
    commonMistakes: [
      'Using HTTP polling instead of WebSockets for the real-time path — this introduces unacceptable latency and wastes resources at scale.',
      'Ignoring the offline delivery problem: assuming all recipients are always online and not designing the store-and-forward mechanism.',
      'Partitioning messages by userId instead of chatId, which splits a conversation across multiple partitions and makes history retrieval expensive.',
      'Not discussing how to handle message ordering in the presence of network delays and retries — clients can send messages out of order.'
    ],
    resources: [
      { label: 'HelloInterview — WhatsApp', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/whatsapp' },
      { label: 'ByteByteGo — Design WhatsApp', url: 'https://www.youtube.com/watch?v=vvhC64hQZMk' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 12', url: '' }
    ],
    relatedTopics: ['notification-system', 'distributed-message-queue', 'rate-limiter']
  },

  {
    id: 'rate-limiter',
    title: 'Rate Limiter',
    type: 'hld',
    category: 'Infrastructure',
    order: 18,
    overview: `A rate limiter controls the rate of requests a client can send to an API within a given time window. It is a critical infrastructure component that protects services from abuse, prevents resource starvation, manages costs, and ensures fair usage across tenants. Every major API provider (Stripe, GitHub, Twitter) implements rate limiting, typically returning HTTP 429 (Too Many Requests) when thresholds are exceeded.

The design involves choosing an appropriate algorithm (token bucket, sliding window log, sliding window counter, fixed window counter, or leaky bucket), each with distinct trade-offs around memory usage, burst handling, and accuracy. Token bucket is the most common in production because it allows controlled bursts while maintaining an average rate. The rate limiter must operate with minimal added latency (< 1 ms per check) since it sits in the critical request path.

In a distributed environment, the challenge intensifies: multiple API servers must share rate limit state, which typically lives in a fast in-memory store like Redis. Race conditions arise when concurrent requests from the same client hit different servers simultaneously. Solutions include Lua scripting in Redis for atomic operations, or accepting slight over-counting with eventual consistency. The system must also handle multi-tier limiting (per-user, per-IP, per-API-key, global) and provide clear rate limit headers (X-RateLimit-Remaining, X-RateLimit-Reset) for client transparency.`,
    framework: [
      'Step 1 — Clarify requirements: client-side or server-side? Rate limit by user, IP, API key, or endpoint? Hard vs. soft limits? What response on throttle (429, queuing, degraded response)?',
      'Step 2 — Discuss algorithms: Token bucket (allows bursts, simple), sliding window log (precise, memory-heavy), sliding window counter (good balance), fixed window (simplest, boundary burst problem), leaky bucket (smooth output rate).',
      'Step 3 — Choose token bucket for most cases: each user gets a bucket with capacity C and refill rate R tokens/sec. Each request consumes 1 token. If bucket empty, reject with 429.',
      'Step 4 — Design centralized counter store: Redis is the standard choice. Key = "rate:{userId}:{endpoint}", value = token count and last refill timestamp. Use Redis MULTI/Lua scripts for atomicity.',
      'Step 5 — Place the limiter: as middleware/filter before the application logic. In a microservices architecture, deploy at the API gateway layer (Kong, Envoy) for centralized enforcement.',
      'Step 6 — Handle distributed race conditions: concurrent requests to different servers reading the same counter. Use Redis Lua script to make check-and-decrement atomic. Alternatively, use sorted sets for sliding window log.',
      'Step 7 — Add rate limit response headers: X-RateLimit-Limit (max requests), X-RateLimit-Remaining (tokens left), X-RateLimit-Reset (UTC epoch when bucket refills). Include Retry-After on 429 responses.',
      'Step 8 — Discuss rule configuration: rules stored in config (YAML/DB) defining rate per endpoint, per tier. Support dynamic updates without redeployment.'
    ],
    keyComponents: [
      'Rate Limiter Middleware — intercepts every request, checks counter, allows or rejects before reaching application logic',
      'Redis Cluster — centralized in-memory store for rate limit counters; sub-millisecond reads/writes',
      'Rules Engine — stores and evaluates rate limit rules (per user tier, per endpoint, per IP); supports dynamic configuration',
      'API Gateway Integration — rate limiting logic embedded in the gateway (Kong, Envoy, AWS API Gateway) for edge enforcement',
      'Monitoring & Alerting — tracks throttle rates, identifies abusive clients, alerts on anomalies'
    ],
    scaleConsiderations: [
      'Latency budget: rate limiter adds overhead to every request. Redis round-trip must be < 1 ms. Co-locate Redis with application servers in the same availability zone.',
      'Atomic operations: use Redis Lua scripts (EVAL) to make the check-and-decrement atomic. Without atomicity, concurrent requests can over-consume tokens.',
      'Local + global hybrid: each server maintains a local counter and periodically syncs with the central Redis. Allows slight over-limit but dramatically reduces Redis load.',
      'Failure mode: if Redis is unavailable, fail open (allow requests) or fail closed (reject all)? Most systems fail open to avoid blocking legitimate traffic during an outage.',
      'Multi-tier limiting: apply cascading limits — per-second burst limit AND per-hour sustained limit AND per-day quota. Each tier uses its own counter.'
    ],
    commonMistakes: [
      'Choosing the fixed window algorithm without acknowledging the boundary burst problem — a client can send 2x the limit by timing requests at the window boundary.',
      'Ignoring race conditions in distributed deployments — two servers checking and decrementing the same counter simultaneously can allow double the intended rate.',
      'Placing the rate limiter after expensive processing (authentication, input validation) instead of as early as possible in the request pipeline.',
      'Not discussing what happens when the counter store (Redis) goes down — the limiter must have a defined failure mode.'
    ],
    resources: [
      { label: 'HelloInterview — Rate Limiter', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/rate-limiter' },
      { label: 'ByteByteGo — Rate Limiting', url: 'https://www.youtube.com/watch?v=FU4WlwfS3G0' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 4', url: '' }
    ],
    relatedTopics: ['distributed-cache', 'url-shortener', 'notification-system']
  },

  {
    id: 'notification-system',
    title: 'Notification System',
    type: 'hld',
    category: 'Infrastructure',
    order: 19,
    overview: `A notification system delivers messages to users across multiple channels — push notifications (iOS APNs, Android FCM), SMS, email, and in-app notifications. Companies like Uber, Amazon, and Facebook send billions of notifications daily, each requiring reliable delivery, user preference management, rate limiting (to prevent notification fatigue), and template-based content generation.

The system must be channel-agnostic at the ingestion layer: internal services publish notification events with a recipient, content, and priority, and the notification system handles channel selection, template rendering, user preference filtering, and delivery via the appropriate third-party provider. The architecture is inherently asynchronous — notifications are queued and processed in the background since blocking the caller on email/SMS delivery would be unacceptable.

Key challenges include handling provider failures with retry logic and fallback providers, de-duplicating notifications to avoid spamming users, respecting per-user opt-out preferences and quiet hours, tracking delivery status across channels, and A/B testing notification content. The system must also support prioritization: a 2FA OTP must be delivered within seconds, while a marketing email can tolerate minutes of delay.`,
    framework: [
      'Step 1 — Clarify requirements: which channels (push, SMS, email, in-app)? Priority levels? User preference opt-outs? Rate limiting per user? Template system? Delivery tracking?',
      'Step 2 — Estimate scale: 10B notifications/day, ~115K/sec. Email ~40%, push ~40%, SMS ~15%, in-app ~5%. Peak traffic 3x average.',
      'Step 3 — Define API: POST /notify (userId, templateId, params, channel?, priority). Internal services call this API. Also: batch endpoint for marketing campaigns.',
      'Step 4 — Design the ingestion layer: notification requests are validated and enqueued into a message queue (Kafka/SQS) partitioned by priority (high, medium, low). This decouples callers from delivery.',
      'Step 5 — Design the processing pipeline: workers dequeue messages, resolve user preferences (opt-outs, preferred channel, quiet hours), render templates, and route to channel-specific queues.',
      'Step 6 — Channel delivery: separate worker pools per channel. Push: call APNs/FCM APIs. Email: call SendGrid/SES. SMS: call Twilio. Each has its own retry logic and rate limits.',
      'Step 7 — Deduplication and throttling: use a dedup cache (Redis) with notification hash + userId + time window to prevent duplicate sends. Per-user throttle limits notification frequency.',
      'Step 8 — Tracking and analytics: track delivery status (queued, sent, delivered, read, failed). Store events in a data warehouse for engagement analytics and A/B test evaluation.'
    ],
    keyComponents: [
      'Notification Service (API) — ingestion layer that validates requests, enriches with user data, and publishes to the message queue',
      'Message Queue (Kafka/SQS) — decouples ingestion from processing; partitioned by priority for ordered, reliable delivery',
      'Preference Service — stores per-user channel preferences, opt-outs, quiet hours, and notification frequency limits',
      'Template Engine — renders notification content from templates + parameters; supports localization and A/B variants',
      'Channel Workers — per-channel worker pools (push, email, SMS, in-app) that call third-party provider APIs with retry/circuit-breaker logic',
      'Third-Party Providers — APNs, FCM, SendGrid/SES, Twilio; abstracted behind provider interfaces for fallback switching',
      'Dedup/Throttle Service — Redis-backed service preventing duplicate notifications and enforcing per-user rate limits',
      'Analytics Pipeline — tracks delivery events (sent, delivered, opened, clicked) for engagement metrics'
    ],
    scaleConsiderations: [
      'Priority queues: separate Kafka topics or SQS queues for high/medium/low priority. High-priority (OTP, security alerts) gets dedicated worker capacity to guarantee low latency.',
      'Provider failover: if SendGrid is down, automatically route email through SES. Implement circuit breakers per provider to detect failures quickly.',
      'Batch campaign handling: marketing blasts of millions of notifications must be rate-limited to avoid overwhelming providers. Use a separate slow queue with controlled throughput.',
      'Horizontal scaling of workers: each channel worker pool scales independently. SMS workers may need fewer instances than push workers. Auto-scale based on queue depth.',
      'Delivery guarantee: at-least-once delivery with idempotent sends. Use unique notification IDs for dedup at the provider level when supported.'
    ],
    commonMistakes: [
      'Designing a synchronous system where the calling service blocks until the notification is delivered — this creates coupling and latency. The system must be asynchronous with a queue.',
      'Ignoring user preferences and quiet hours — sending notifications at 3 AM or to opted-out users damages trust and may violate regulations (CAN-SPAM, GDPR).',
      'Not handling third-party provider failures — providers go down; the system needs retry with exponential backoff and fallback to alternative providers.',
      'Treating all notifications with equal priority — a password reset OTP and a marketing email have vastly different latency requirements.'
    ],
    resources: [
      { label: 'HelloInterview — Notification System', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/notification-system' },
      { label: 'ByteByteGo — Notification System Design', url: 'https://www.youtube.com/watch?v=bBTPZ9NdSk8' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 10', url: '' }
    ],
    relatedTopics: ['distributed-message-queue', 'rate-limiter', 'chat-system']
  },

  {
    id: 'youtube-netflix',
    title: 'YouTube / Netflix',
    type: 'hld',
    category: 'Media & Streaming',
    order: 20,
    overview: `A video streaming platform like YouTube or Netflix involves two fundamentally different systems: a video upload/processing pipeline (write path) and a video streaming/playback system (read path). YouTube serves over 1 billion hours of video per day across 2 billion monthly active users, while Netflix accounts for ~15% of global internet bandwidth during peak hours. The scale of data transfer is staggering — petabytes per day.

The upload pipeline must handle large file uploads (multi-part, resumable), transcode videos into multiple resolutions and codecs (adaptive bitrate streaming with HLS/DASH), generate thumbnails, run content moderation, extract metadata, and make the video available for search. Transcoding is the most computationally intensive step — a single video may produce 10-20 renditions (360p to 4K, multiple codecs), taking minutes to hours on dedicated encoding hardware.

The playback system leverages a global CDN to serve video chunks from edge servers close to users. Adaptive bitrate streaming allows the player to switch quality levels based on network conditions. The system must minimize startup latency (time to first byte), rebuffering events, and deliver consistent quality. Recommendation engines, search, user engagement tracking, and content licensing add further complexity. Netflix's architecture separates the control plane (APIs, metadata, recommendations) from the data plane (video delivery via Open Connect CDN).`,
    framework: [
      'Step 1 — Clarify requirements: video upload and processing, streaming/playback, search, recommendations, comments/likes, live streaming or VOD only?',
      'Step 2 — Estimate scale: 500 hours of video uploaded per minute (YouTube). 1B hours watched/day. Average video size 500 MB pre-encoding. Storage growing by PBs/year.',
      'Step 3 — Design upload flow: client uploads to object storage (S3) via pre-signed URL (resumable multipart upload). On completion, publish event to trigger processing pipeline.',
      'Step 4 — Design the transcoding pipeline: message queue triggers transcoding workers. Split video into segments, transcode each into multiple resolution/codec combinations in parallel (DAG of tasks). Use FFmpeg on GPU instances.',
      'Step 5 — Generate adaptive streaming manifests: produce HLS (.m3u8) or DASH (.mpd) manifests that list available quality levels and segment URLs. Player uses these to fetch appropriate quality.',
      'Step 6 — Design CDN-based delivery: video segments served from edge CDN nodes. Popular content is proactively pushed to edge caches. Origin serves long-tail content on cache miss.',
      'Step 7 — Design the metadata layer: video metadata (title, description, thumbnails, views, likes) in a relational DB or document store. Separate from video binary data. Search index (Elasticsearch) for discovery.',
      'Step 8 — Discuss recommendations: collaborative filtering + content-based models. Pre-compute personalized lists offline. Serve from a fast cache per user.'
    ],
    keyComponents: [
      'Upload Service — handles multipart resumable uploads, validates format, stores raw video in object storage',
      'Transcoding Pipeline — distributed encoding system (DAG scheduler) that produces multiple bitrate/resolution renditions using FFmpeg',
      'Object Storage (S3) — stores raw uploads, transcoded segments, thumbnails, and manifests; petabyte-scale',
      'CDN (CloudFront / Open Connect) — global edge network serving video segments with < 50 ms latency to most users',
      'Metadata Service — stores and serves video metadata, user interactions (views, likes, comments)',
      'Search & Discovery — Elasticsearch-based search with ranking; recommendation engine for personalized content',
      'Video Player (Client) — adaptive bitrate player that switches quality based on bandwidth estimation',
      'Content Moderation — ML pipeline for detecting policy violations in uploaded content before publishing'
    ],
    scaleConsiderations: [
      'CDN is king: 90%+ of video bytes are served from CDN edge caches, not origin servers. Popular content is pre-positioned; long-tail content uses pull-through caching.',
      'Transcoding cost optimization: use spot/preemptible instances for encoding. Prioritize popular upload formats. Defer encoding rare codecs until first request (lazy transcoding).',
      'Adaptive bitrate streaming: video is split into 2-10 second chunks at multiple quality levels. The player dynamically selects chunk quality based on measured bandwidth and buffer level.',
      'Storage tiering: hot content on SSD-backed storage/CDN, warm content on standard S3, cold content (rarely viewed) on S3 Glacier/archive tier.',
      'Global distribution: multi-region origin servers with CDN edge PoPs. Netflix Open Connect deploys custom appliances directly inside ISP networks for ultra-low latency.'
    ],
    commonMistakes: [
      'Treating video serving like a regular web application — video delivery is dominated by CDN architecture, not application server design.',
      'Ignoring the transcoding pipeline and jumping straight to playback. The upload/processing path is often the more interesting design challenge.',
      'Not mentioning adaptive bitrate streaming (HLS/DASH) — serving a single resolution is unacceptable for modern video platforms.',
      'Underestimating storage costs and not discussing tiered storage strategies for content with different access patterns.'
    ],
    resources: [
      { label: 'HelloInterview — YouTube', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/youtube' },
      { label: 'ByteByteGo — Design YouTube', url: 'https://www.youtube.com/watch?v=jPKTo1iGQiE' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 14', url: '' }
    ],
    relatedTopics: ['google-drive-dropbox', 'distributed-cache', 'distributed-message-queue']
  },

  {
    id: 'distributed-cache',
    title: 'Distributed Cache (Redis)',
    type: 'hld',
    category: 'Infrastructure',
    order: 21,
    overview: `A distributed cache stores frequently accessed data in memory across multiple nodes to reduce database load and improve read latency from milliseconds (database) to microseconds (cache). Redis and Memcached are the two dominant solutions, with Redis offering richer data structures (strings, hashes, sorted sets, lists, streams) and persistence options. At scale, companies like Twitter and Instagram run Redis clusters with terabytes of cached data serving millions of requests per second.

The core design challenges revolve around cache consistency (how stale can data be?), eviction policies (what to remove when memory is full), partitioning strategies (how to distribute keys across nodes), replication (how to provide high availability), and failure handling (what happens when a cache node dies). The choice between cache-aside, read-through, write-through, and write-behind patterns has significant implications for consistency and performance.

The design becomes especially interesting in a distributed context: consistent hashing determines key placement across nodes, replication provides fault tolerance at the cost of consistency, and cache stampede (thundering herd) must be handled when a popular key expires and thousands of concurrent requests hit the database simultaneously. Understanding these trade-offs is essential because distributed caching appears as a component in nearly every other system design question.`,
    framework: [
      'Step 1 — Clarify requirements: read/write ratio, data size, latency targets (< 1 ms reads), consistency requirements (eventual vs. strong), persistence needs, data types (simple KV vs. complex structures).',
      'Step 2 — Choose caching pattern: cache-aside (application manages cache), read-through/write-through (cache manages DB), write-behind (async writes to DB). Cache-aside is most common for flexibility.',
      'Step 3 — Design key partitioning: consistent hashing distributes keys across N cache nodes. Virtual nodes ensure even distribution. Adding/removing a node only redistributes K/N keys.',
      'Step 4 — Design replication: primary-replica per shard for high availability. Async replication for performance (slight staleness acceptable). Promote replica on primary failure.',
      'Step 5 — Choose eviction policy: LRU (least recently used) is the default. LFU (least frequently used) for workloads with stable hot keys. TTL-based expiration for time-sensitive data.',
      'Step 6 — Handle cache stampede: when a hot key expires, use locking (only one thread refills, others wait) or probabilistic early expiration (each request has a small chance of refreshing before TTL).',
      'Step 7 — Design client library: connection pooling, automatic retries, circuit breaker for unavailable nodes, consistent hashing ring for key routing.',
      'Step 8 — Discuss monitoring: cache hit ratio (target > 95%), memory utilization, eviction rate, latency percentiles (p50, p99), slow log analysis.'
    ],
    keyComponents: [
      'Cache Nodes (Redis Instances) — in-memory data store instances, each holding a partition of the key space',
      'Consistent Hash Ring — maps keys to nodes; virtual nodes ensure balanced distribution; handles node addition/removal gracefully',
      'Replication Manager — maintains primary-replica topology per shard; handles failover and replica promotion',
      'Client Library — application-side component handling connection pooling, key routing, retries, and serialization',
      'Configuration Service (ZooKeeper/etcd) — stores cluster topology; notifies clients of membership changes',
      'Monitoring & Alerting — tracks hit rate, memory, latency, evictions; critical for operational health'
    ],
    scaleConsiderations: [
      'Partitioning with consistent hashing: ensures minimal key redistribution when nodes are added/removed. Use 100-200 virtual nodes per physical node for balance.',
      'Memory management: set maxmemory policy. Monitor eviction rates — high evictions mean under-provisioned cluster. Consider compression for large values.',
      'Hot key mitigation: replicate hot keys across multiple nodes. Client-side caching (local LRU) for ultra-hot keys. Key-level metrics to detect hotspots.',
      'Cache-aside consistency: write to DB first, then invalidate cache (not update). On read miss, read DB and populate cache. Eventual consistency window equals cache TTL.',
      'Failure handling: detect node failure via heartbeat, redirect traffic to replica, rehash keys from failed node. During recovery, increased DB load (cold cache) must be absorbed.'
    ],
    commonMistakes: [
      'Updating cache on write instead of invalidating — this creates a race condition where concurrent writes can leave stale data in cache permanently.',
      'Not discussing cache stampede/thundering herd — when a hot key expires, thousands of concurrent requests can overwhelm the database.',
      'Treating the cache as a primary data store without persistence — cache loss means data loss. Always design with the assumption that cache can be fully cleared.',
      'Ignoring consistent hashing and proposing simple modular hashing (key % N) — adding or removing a node reshuffles almost all keys, causing a cache avalanche.'
    ],
    resources: [
      { label: 'HelloInterview — Distributed Cache', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/distributed-cache' },
      { label: 'ByteByteGo — Redis System Design', url: 'https://www.youtube.com/watch?v=DUbEgNw-F9c' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 5', url: '' }
    ],
    relatedTopics: ['rate-limiter', 'url-shortener', 'lru-cache', 'key-value-store']
  },

  {
    id: 'search-autocomplete',
    title: 'Search Autocomplete',
    type: 'hld',
    category: 'Search & Discovery',
    order: 22,
    overview: `Search autocomplete (typeahead) suggests query completions as users type, enabling faster search and discovery. Google processes billions of autocomplete requests per day with suggestions appearing within 100 ms of each keystroke. The system must return the top K most relevant suggestions for a given prefix from a corpus of billions of possible queries.

The primary data structure is a trie (prefix tree) that stores all searchable terms with their frequencies/scores. Each node in the trie represents a character, and paths from root to nodes represent prefixes. To avoid traversing the entire subtree for top-K results, each node caches the top K suggestions for its prefix. This pre-computation trades storage for query-time performance, enabling O(prefix_length) lookups instead of O(subtree_size).

The trie must be updated with fresh data — trending queries, new products, seasonal terms — without affecting serving latency. This leads to an offline/online architecture: the offline pipeline aggregates query logs, rebuilds or updates the trie periodically, and publishes new versions. The online serving layer uses the latest trie snapshot. Additional challenges include handling multi-language support, personalization, filtering offensive/sensitive suggestions, and supporting phrase completions and spelling corrections.`,
    framework: [
      'Step 1 — Clarify requirements: top K suggestions per prefix, max latency (< 100 ms per keystroke), data freshness (how quickly new terms appear), personalization, multi-language, filtering inappropriate terms.',
      'Step 2 — Estimate scale: 5B searches/day, average 4 characters typed per query -> 20B autocomplete requests/day (~230K/sec). Corpus of 5B unique queries.',
      'Step 3 — Design the trie data structure: each node stores a character and pointers to children. Leaf nodes store the full term and its score. Each internal node caches top-K completions for its prefix.',
      'Step 4 — Optimize for top-K queries: pre-compute and cache top 10-15 suggestions at every trie node. Lookup becomes O(prefix_length) — just walk down to the prefix node and return cached results.',
      'Step 5 — Design the data collection pipeline: aggregate search query logs (MapReduce/Spark). Count query frequencies over sliding windows (last 7 days, weighted by recency). Apply filtering for offensive terms.',
      'Step 6 — Design the trie build pipeline: offline job builds a new trie from aggregated query data. Serialize and distribute to serving nodes. Atomic swap of old trie with new version.',
      'Step 7 — Design the serving layer: trie loaded into memory on each serving node. Requests routed by consistent hashing on prefix (shard by first 2 characters). Replicas per shard for availability.',
      'Step 8 — Handle real-time trending: maintain a separate small trie for trending/recent queries (updated in near-real-time via streaming). Merge trending results with the main trie results at query time.'
    ],
    keyComponents: [
      'Trie Serving Nodes — hold the in-memory trie and serve autocomplete queries; sharded by prefix range',
      'Data Collection Service — aggregates and counts query logs from search services via streaming (Kafka) and batch (Spark)',
      'Trie Builder — offline pipeline that constructs the trie from aggregated query frequencies; produces serialized trie snapshots',
      'Trie Distribution Service — pushes new trie snapshots to serving nodes with zero-downtime atomic swaps',
      'Trending/Real-Time Layer — small, frequently updated trie or sorted set for trending queries; merged with main results at serving time',
      'Filter Service — removes offensive, sensitive, or low-quality suggestions based on blocklists and ML classifiers'
    ],
    scaleConsiderations: [
      'Trie sharding: partition the trie by prefix range (a-f on shard 1, g-m on shard 2, etc.) to distribute memory and query load. Uneven distribution requires careful range assignment.',
      'Memory optimization: trie for 5B queries can be huge. Compress common prefixes (radix/Patricia trie). Store only top-K at each node instead of full term lists.',
      'Client-side optimization: debounce keystrokes (wait 100-200 ms after last keystroke before sending request). Cache prefix results on client — typing "goo" then "goog" only needs the "goog" request if "goo" results are cached.',
      'Freshness vs. cost: rebuilding the entire trie hourly is expensive. Use incremental updates — adjust scores at existing nodes and insert new nodes without full rebuild.',
      'Personalization: maintain a small per-user trie or recent queries list. Merge personalized results (weighted higher) with global results at query time.'
    ],
    commonMistakes: [
      'Querying the database on every keystroke instead of using a pre-built in-memory data structure — database queries are too slow for sub-100ms autocomplete.',
      'Not pre-computing top-K at each trie node and instead traversing the subtree at query time — this turns a fast lookup into an expensive tree traversal.',
      'Ignoring client-side optimizations like debouncing and local caching, which can reduce server load by 50-70%.',
      'Building the trie synchronously in the serving path instead of using an offline build pipeline with atomic swaps.'
    ],
    resources: [
      { label: 'HelloInterview — Typeahead / Autocomplete', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/typeahead' },
      { label: 'ByteByteGo — Design Autocomplete / Typeahead', url: 'https://www.youtube.com/watch?v=us0qySiUsGU' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 13', url: '' }
    ],
    relatedTopics: ['web-crawler', 'distributed-cache', 'distributed-message-queue']
  },

  {
    id: 'web-crawler',
    title: 'Web Crawler',
    type: 'hld',
    category: 'Data Processing',
    order: 23,
    overview: `A web crawler (spider) systematically browses the internet to download web pages for indexing, archiving, or data mining. Google's crawler (Googlebot) discovers and indexes hundreds of billions of pages, visiting tens of thousands of pages per second across millions of domains. The crawler is foundational to search engines, SEO tools, price comparison sites, and web archives like the Wayback Machine.

The core challenge is achieving high throughput (pages/second) while being a good internet citizen — respecting robots.txt, implementing politeness policies (not hammering a single domain), handling duplicate content, managing an enormous frontier of URLs to visit, and dealing with the web's infinite variety of content types, encodings, and pathological pages (spider traps, infinite calendars, dynamically generated URLs).

The crawler operates as a pipeline: start with seed URLs, fetch pages, parse HTML to extract new URLs, filter duplicates and already-visited URLs, prioritize the frontier, and repeat. In a distributed crawler, the frontier (URL queue) is partitioned across workers, typically by domain, to enforce per-domain politeness. A URL deduplication system (Bloom filter or hash set) prevents revisiting pages. The system must handle DNS resolution efficiently, manage concurrent HTTP connections, retry transient failures, and store crawled content for downstream processing.`,
    framework: [
      'Step 1 — Clarify requirements: scope (entire web vs. specific domains), crawl frequency (one-time vs. continuous recrawl), content types (HTML only or also PDFs, images?), politeness, robots.txt compliance, crawl rate.',
      'Step 2 — Estimate scale: 15B known web pages, target 1B pages/week → ~1,650 pages/sec. Average page 500 KB → ~800 MB/sec bandwidth. Storage: 500 TB per full crawl.',
      'Step 3 — Design the URL frontier: priority queue of URLs to crawl. Prioritize by page importance (PageRank, domain authority), freshness requirements, and change frequency. Partition by domain for politeness.',
      'Step 4 — Design the fetcher: multi-threaded HTTP client fetching pages. Per-domain rate limiting (max 1 request/sec per domain). DNS resolver cache to avoid repeated lookups. Handle redirects, timeouts, retries.',
      'Step 5 — Design content processing: parse HTML, extract links (absolute URL resolution), extract text content, detect language and encoding. Store raw HTML and parsed content in object storage.',
      'Step 6 — URL deduplication: Bloom filter or hash set of visited URLs to prevent re-crawling. URL canonicalization (normalize query params, remove fragments, lowercase) before dedup check.',
      'Step 7 — Content deduplication: compute content fingerprint (SimHash, MinHash) to detect near-duplicate pages served at different URLs (www vs. non-www, HTTP vs. HTTPS).',
      'Step 8 — Design distributed architecture: partition the frontier by domain hash. Each worker handles a set of domains. Coordinator assigns domain partitions and monitors worker health.'
    ],
    keyComponents: [
      'URL Frontier — distributed priority queue of URLs to crawl; partitioned by domain for politeness enforcement',
      'Fetcher Workers — multi-threaded HTTP clients that download pages, respecting rate limits, robots.txt, and retry policies',
      'DNS Resolver Cache — local DNS cache to avoid redundant DNS lookups; resolves hostnames in batch',
      'HTML Parser & Link Extractor — parses downloaded pages, extracts and normalizes outgoing URLs, identifies content type',
      'URL Dedup Service (Bloom Filter) — probabilistic data structure that prevents revisiting already-crawled URLs',
      'Content Store (Object Storage) — stores raw HTML and parsed content; indexed by URL hash for retrieval',
      'Robots.txt Cache — fetches and caches robots.txt per domain; enforces crawl-delay and disallow rules',
      'Crawl Scheduler — determines recrawl priority and frequency based on page change rate and importance'
    ],
    scaleConsiderations: [
      'Politeness: enforce per-domain rate limits (1-2 req/sec per domain). Partition URL frontier by domain so each worker manages a set of domains and naturally enforces politeness.',
      'Bloom filter sizing: for 10B URLs with 1% false positive rate, need ~12 GB. Distributed Bloom filter partitioned across nodes or use a counting Bloom filter for URL removal support.',
      'Crawl priority: not all pages are equal. Use a multi-queue priority system — high priority for frequently changing pages (news), medium for important static pages, low for deep/obscure pages.',
      'Spider trap detection: detect and avoid infinite URL spaces (calendars, session IDs in URLs, paginated infinite loops). Limit max depth per domain and max pages per domain per crawl cycle.',
      'Incremental recrawl: track page change frequency using content hashes. Recrawl frequently changing pages more often (adaptive crawl scheduling).'
    ],
    commonMistakes: [
      'Not implementing politeness/rate limiting per domain — this can get your crawler blocked or cause denial-of-service on small websites.',
      'Using a single centralized URL queue instead of a distributed, domain-partitioned frontier — creates a bottleneck and prevents per-domain politeness.',
      'Ignoring URL canonicalization before deduplication — the same page at http://example.com and https://www.example.com/ appears as two different URLs.',
      'Not handling spider traps — without depth limits and URL pattern detection, the crawler can get stuck in infinite loops.'
    ],
    resources: [
      { label: 'HelloInterview — Web Crawler', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/web-crawler' },
      { label: 'ByteByteGo — Design a Web Crawler', url: 'https://www.youtube.com/watch?v=BKZxZwUgL3Y' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 9', url: '' }
    ],
    relatedTopics: ['search-autocomplete', 'distributed-message-queue', 'distributed-cache']
  },

  {
    id: 'google-drive-dropbox',
    title: 'Google Drive / Dropbox',
    type: 'hld',
    category: 'Storage & Sync',
    order: 24,
    overview: `A cloud file storage and sync service like Google Drive or Dropbox allows users to upload, store, share, and synchronize files across multiple devices. Dropbox has over 700 million users storing exabytes of data, with the core challenge being real-time synchronization — when a user edits a file on their laptop, the change should appear on their phone and shared collaborators' devices within seconds.

The most interesting design challenge is the sync protocol. Rather than uploading entire files on every change, the system uses block-level deduplication: files are split into fixed or variable-size blocks (typically 4 MB), each identified by a content hash (SHA-256). When a file changes, only the modified blocks are uploaded. This dramatically reduces bandwidth usage — editing a single paragraph in a 100 MB document uploads only the ~4 MB block that changed. The server maintains a file metadata tree (block list per file version) and a block store. Deduplication across users is natural — if two users upload the same file, the blocks are stored once.

Additional challenges include conflict resolution (two users editing the same file offline), versioning (maintaining file history for undo/recovery), sharing and permissions (ACLs for files and folders), real-time collaboration (Google Docs-style concurrent editing via OT or CRDT), and notification of changes across devices. The system must handle files ranging from tiny text files to multi-gigabyte videos, each with different sync characteristics.`,
    framework: [
      'Step 1 — Clarify requirements: file upload/download, sync across devices, sharing with permissions, versioning/history, conflict resolution, file size limits, real-time collaboration (optional).',
      'Step 2 — Estimate scale: 500M users, 100M DAU, average 100 files/user (50B total files), average file size 1 MB (50 PB storage), 1B file operations/day.',
      'Step 3 — Design block-level sync: split files into 4 MB blocks (content-defined chunking with Rabin fingerprinting for variable-size blocks). Hash each block (SHA-256). Upload only new/modified blocks.',
      'Step 4 — Design metadata service: stores file tree (folder hierarchy), file-to-block-list mapping, version history, sharing permissions. Relational DB (sharded by userId) for metadata.',
      'Step 5 — Design block storage: content-addressable storage keyed by block hash. Object storage (S3) backend. Deduplication is automatic — same content hash = same block stored once.',
      'Step 6 — Design sync protocol: client maintains local block index. On change, compute new block hashes, compare with server, upload only changed blocks, update metadata. Server notifies other devices via long-poll or WebSocket.',
      'Step 7 — Handle conflicts: if two devices modify the same file offline, detect conflict on sync (both have changes since last common version). Create a conflict copy and let user resolve.',
      'Step 8 — Design notification service: when a file changes, notify all devices with access. Use WebSocket for connected devices, push notification for mobile. Include changed file metadata so client can selectively sync.'
    ],
    keyComponents: [
      'Sync Client (Desktop/Mobile) — monitors local file system, computes block hashes, uploads changed blocks, applies remote changes',
      'Block Storage Service — content-addressable store backed by S3; stores and retrieves file blocks by content hash; handles deduplication',
      'Metadata Service — manages file/folder hierarchy, block lists per file version, sharing permissions, and version history',
      'Notification Service — pushes file change events to connected devices via WebSocket/long-polling to trigger sync',
      'Upload/Download Service — handles chunked upload (pre-signed URLs to S3), resumable transfers, and download assembly',
      'Sharing & Permission Service — manages ACLs, generates shareable links, enforces access control on file operations',
      'Versioning Service — maintains version history (list of block lists per version); supports rollback and recovery',
      'Conflict Resolver — detects edit conflicts during sync and creates conflict copies for user resolution'
    ],
    scaleConsiderations: [
      'Block-level deduplication: across all users, identical blocks are stored once. This can reduce storage by 30-50% for common documents, code repos, and shared files.',
      'Content-defined chunking (CDC): using Rabin fingerprinting to determine block boundaries means inserting a byte at the start of a file does not change all block boundaries, unlike fixed-size chunking.',
      'Metadata database sharding: shard by userId so all of a user\'s file metadata is co-located. Cross-user operations (shared folders) require cross-shard reads.',
      'Bandwidth optimization: compress blocks before upload, skip blocks already present on server (dedup check by hash), use delta sync for small changes within blocks.',
      'Cold storage tiering: files not accessed in 90+ days move to cheaper storage tiers (S3 Infrequent Access, Glacier). Retrieve on demand with slightly higher latency.'
    ],
    commonMistakes: [
      'Uploading entire files on every change instead of using block-level differencing — this wastes bandwidth and makes large file sync impractical.',
      'Not discussing conflict resolution for concurrent edits — assuming all edits happen online and sequentially is unrealistic.',
      'Storing file content in the metadata database instead of using separate object storage — mixing metadata and binary storage creates scaling problems.',
      'Ignoring the notification/sync protocol — the system needs a way to push change events to other devices in near-real-time, not just rely on periodic polling.'
    ],
    resources: [
      { label: 'HelloInterview — Dropbox', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/dropbox' },
      { label: 'ByteByteGo — Design Google Drive / Dropbox', url: 'https://www.youtube.com/watch?v=U0xTu6E2CT8' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 15', url: '' }
    ],
    relatedTopics: ['youtube-netflix', 'notification-system', 'distributed-message-queue']
  },

  {
    id: 'distributed-message-queue',
    title: 'Distributed Message Queue',
    type: 'hld',
    category: 'Infrastructure',
    order: 25,
    overview: `A distributed message queue (Kafka, RabbitMQ, Amazon SQS) provides asynchronous communication between services by decoupling producers from consumers. Kafka processes trillions of messages per day at companies like LinkedIn, Netflix, and Uber, handling peak throughputs of millions of messages per second with millisecond latencies. Message queues are the backbone of event-driven architectures and appear as a component in nearly every large-scale system design.

The core design involves topics (logical channels), partitions (units of parallelism within a topic), producers (publish messages), consumers (read messages), and brokers (servers storing messages). Messages within a partition are strictly ordered and assigned a monotonically increasing offset. Consumers track their position via offsets and can replay messages by resetting their offset. This append-only, immutable log design enables both real-time streaming and batch replay.

Key design decisions include delivery semantics (at-most-once, at-least-once, exactly-once), message retention (time-based or size-based), partition assignment to consumer groups, replication for durability, and handling consumer failures (rebalancing). The system must balance throughput (batching, compression) against latency (how quickly a produced message is available to consumers). Exactly-once semantics require idempotent producers and transactional writes, adding complexity but eliminating the duplicate processing burden on consumers.`,
    framework: [
      'Step 1 — Clarify requirements: message ordering guarantees (per-partition or global), delivery semantics (at-least-once, exactly-once), retention period, throughput and latency targets, message size limits.',
      'Step 2 — Estimate scale: 1M messages/sec at peak, average message 1 KB, retention 7 days → ~600 TB storage. Consumer lag target < 100 ms for real-time consumers.',
      'Step 3 — Design the broker architecture: each broker stores a subset of partitions. Messages within a partition are appended to an immutable log (append-only file). Each message gets a sequential offset.',
      'Step 4 — Design topic and partition model: topics are logical channels. Each topic has N partitions for parallelism. Producers choose partition by message key hash (ordering within key) or round-robin.',
      'Step 5 — Design replication: each partition has 1 leader and K-1 follower replicas across brokers. Producers write to the leader. Followers replicate via pull. ISR (in-sync replica) set for durability guarantees.',
      'Step 6 — Design consumer groups: consumers in a group split partitions among themselves (each partition assigned to exactly one consumer). On consumer failure, partitions rebalance to remaining consumers.',
      'Step 7 — Design offset management: consumers commit offsets to indicate processed messages. On crash, consumer resumes from last committed offset. At-least-once: commit after processing. At-most-once: commit before processing.',
      'Step 8 — Discuss exactly-once: idempotent producers (producer ID + sequence number) eliminate duplicates. Transactions allow atomic writes across partitions. Consumers use read_committed isolation.'
    ],
    keyComponents: [
      'Brokers — servers that store partition data on disk; handle produce and fetch requests; manage replication',
      'Topics & Partitions — logical channels divided into ordered, append-only logs; partitions are the unit of parallelism',
      'Producers — publish messages to topics; select partition by key hash or round-robin; support batching and compression',
      'Consumers & Consumer Groups — read messages from partitions; consumer groups enable parallel processing with automatic partition assignment',
      'Replication Manager — maintains leader-follower replication per partition; manages ISR set and leader election on failure',
      'ZooKeeper / KRaft Controller — cluster coordination: broker registration, partition leader election, consumer group coordination',
      'Offset Store — tracks consumer group offsets; enables resume-from-failure and message replay',
      'Schema Registry — stores and validates message schemas (Avro, Protobuf) for producer-consumer contract enforcement'
    ],
    scaleConsiderations: [
      'Partition count drives parallelism: more partitions = more consumers can read in parallel, but too many partitions increase metadata overhead and leader election time. Start with 3-10 partitions per topic.',
      'Sequential disk I/O: append-only log design leverages sequential writes (600 MB/s on HDD) and OS page cache for reads. This is why Kafka matches or exceeds in-memory queue throughput.',
      'Zero-copy data transfer: use sendfile() system call to transfer data directly from disk page cache to network socket, bypassing user-space copies. Critical for high-throughput consumers.',
      'Consumer lag monitoring: track the offset gap between the latest message and each consumer group\'s committed offset. Alert when lag grows — indicates consumers cannot keep up with production rate.',
      'Multi-datacenter replication: MirrorMaker or similar tool asynchronously replicates topics across datacenters for disaster recovery. Accept higher latency for cross-DC consumers.'
    ],
    commonMistakes: [
      'Proposing a single global queue without partitioning — this limits throughput to a single server and consumer, and does not scale.',
      'Confusing message ordering: Kafka guarantees order within a partition, not across partitions. If total ordering is needed, use a single partition (sacrificing parallelism).',
      'Not discussing what happens when a consumer crashes mid-processing — offset management strategy determines whether messages are lost (at-most-once) or reprocessed (at-least-once).',
      'Ignoring disk-based storage — many candidates assume message queues are purely in-memory. Kafka\'s disk-based append-only log is key to its durability and cost efficiency.'
    ],
    resources: [
      { label: 'HelloInterview — Message Queue', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/message-queue' },
      { label: 'ByteByteGo — System Design: Message Queue', url: 'https://www.youtube.com/watch?v=W4_aGb_MOls' },
      { label: 'Alex Xu — System Design Interview Vol. 2, Chapter 4', url: '' }
    ],
    relatedTopics: ['notification-system', 'chat-system', 'twitter-news-feed']
  },

  {
    id: 'uber-lyft',
    title: 'Uber / Lyft',
    type: 'hld',
    category: 'Location-Based',
    order: 26,
    overview: `A ride-sharing platform like Uber or Lyft matches riders with nearby drivers in real-time, computes optimal routes, manages pricing, and processes payments for millions of trips per day. Uber completes ~25 million trips daily across 10,000+ cities, with the matching engine running at sub-second latency to minimize rider wait times and maximize driver utilization.

The central design challenge is the location matching system: given a rider's pickup location, find the nearest available drivers and match them efficiently. This requires a spatial index (geohash, quadtree, or S2 geometry cells) that can handle millions of driver location updates per second (drivers report their GPS every 3-5 seconds) and answer nearest-neighbor queries in milliseconds. The matching algorithm must consider not just proximity but also driver heading/direction, estimated time of arrival (ETA via routing), driver ratings, and trip type preferences.

Beyond matching, the system handles dynamic pricing (surge pricing based on supply-demand imbalance), trip lifecycle management (request -> match -> pickup -> in-trip -> dropoff -> payment), real-time ETA computation, driver earnings and rider billing, safety features (trip sharing, emergency contacts), and regulatory compliance across jurisdictions. The location tracking, trip management, and payment systems have very different consistency and availability requirements, making this a rich architecture discussion.`,
    framework: [
      'Step 1 — Clarify requirements: ride matching (nearest driver), real-time location tracking, trip management (lifecycle), dynamic pricing, ETA computation, payments, driver/rider apps.',
      'Step 2 — Estimate scale: 25M trips/day, 5M concurrent drivers sending location every 4 sec → 1.25M location updates/sec. Peak matching: 500K requests/hour.',
      'Step 3 — Design location service: drivers send GPS coordinates every 3-5 seconds. Store in a spatial index (geohash-based grid or quadtree) in memory. Key = geohash cell, value = list of driver IDs in that cell.',
      'Step 4 — Design matching service: on ride request, query spatial index for drivers in nearby geohash cells (expanding radius search). Rank candidates by ETA (not just distance), availability, rating. Send match request to top driver.',
      'Step 5 — Design trip service: manages the trip state machine (requested → matched → driver_en_route → arrived → in_trip → completed → billed). Persists trip data to database.',
      'Step 6 — Design pricing service: compute fare based on distance, time, base fare, and surge multiplier. Surge pricing: divide city into hexagonal zones, compute supply/demand ratio per zone, apply multiplier when demand exceeds supply.',
      'Step 7 — Design ETA and routing: use a graph-based routing engine (OSRM, Valhalla) with real-time traffic data. Pre-compute ETA matrices for driver-rider pairs during matching.',
      'Step 8 — Design payment service: charge rider after trip completion. Handle driver payout. Integrate payment gateway (Stripe, Braintree). Maintain ledger for accounting.'
    ],
    keyComponents: [
      'Location Service — ingests driver GPS updates at high frequency; maintains spatial index (geohash grid or quadtree) for proximity queries',
      'Matching Service — finds optimal driver-rider matches considering proximity, ETA, driver status, and preferences; handles match acceptance/rejection flow',
      'Trip Service — manages trip lifecycle (state machine), stores trip data, coordinates between rider, driver, and backend services',
      'Pricing Service — computes fares using distance/time models; implements dynamic (surge) pricing based on real-time supply-demand',
      'Routing/ETA Service — computes routes and ETAs using road network graphs with real-time traffic; powers driver navigation',
      'Payment Service — handles rider charges, driver payouts, refunds, promotions; integrates payment gateways',
      'Notification Service — sends real-time updates to rider and driver apps (match found, driver arriving, trip completed)',
      'Analytics & Safety — trip monitoring, anomaly detection, safety features (trip sharing, emergency SOS, route deviation alerts)'
    ],
    scaleConsiderations: [
      'Spatial indexing: geohash divides the world into grid cells. Use a compound key (geohash + driverId) in Redis for fast spatial queries. Expanding ring search: query cell, then 8 neighbors, then 24 next neighbors.',
      'Location update throughput: 1.25M updates/sec is a write-heavy workload. Use an in-memory store (Redis) for current locations; persist historical tracks to a time-series DB for analytics.',
      'Matching latency: the matching algorithm must complete in < 1 second including ETA computation. Pre-compute ETA for top candidates using the routing engine. Use a greedy matching algorithm with periodic batch optimization.',
      'Supply-demand forecasting: predict demand per zone per time window using ML models trained on historical trip data. Pre-position drivers to high-demand areas to reduce wait times.',
      'City-level sharding: shard the location service and matching service by city/region. A trip never spans two cities, so cross-shard coordination is rarely needed.'
    ],
    commonMistakes: [
      'Using straight-line (Euclidean) distance for matching instead of ETA — a driver 1 km away across a river may take 15 minutes, while one 3 km away on the highway takes 5 minutes.',
      'Not discussing how the spatial index is updated in real-time — 1M+ location updates per second require careful design of the index update path.',
      'Designing a global matching service instead of sharding by city — ride matching is inherently local, and a global service adds unnecessary complexity and latency.',
      'Ignoring the match acceptance flow — the first-choice driver may decline; the system needs a timeout and cascade to the next best driver.'
    ],
    resources: [
      { label: 'HelloInterview — Uber', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/uber' },
      { label: 'ByteByteGo — Design Uber', url: 'https://www.youtube.com/watch?v=lsKU38RKQSo' },
      { label: 'Alex Xu — System Design Interview Vol. 2, Chapter 1', url: '' }
    ],
    relatedTopics: ['google-maps', 'notification-system', 'payment-system']
  },

  {
    id: 'ticket-booking',
    title: 'Ticket Booking System (BookMyShow)',
    type: 'hld',
    category: 'E-Commerce',
    order: 27,
    overview: `A ticket booking system like BookMyShow, Ticketmaster, or movie theater booking platforms handles the discovery, seat selection, and purchase of tickets for events (movies, concerts, sports). These systems must handle extreme concurrency — when a popular concert goes on sale, millions of users may simultaneously attempt to book from a limited inventory of seats, creating intense write contention on a finite resource.

The central design challenge is preventing double-booking while maintaining a responsive user experience. When User A selects seats 5-6 in Row C, those seats must be temporarily locked so User B cannot also select them. This requires a distributed locking mechanism with TTL-based expiration (if User A doesn't complete payment within 10 minutes, seats are released). The seat inventory is a finite, non-fungible resource — unlike e-commerce where you can add more inventory, a venue has exactly N seats.

The system must also handle search and discovery (browsing events by city, genre, date), venue and seat map management, pricing tiers, promotional codes, waitlisting, and integration with payment gateways. The read path (browsing events, viewing seat availability) is much heavier than the write path (booking), but the write path has strict consistency requirements. This creates a natural split between an eventually consistent read layer (cached event listings) and a strongly consistent booking layer.`,
    framework: [
      'Step 1 — Clarify requirements: browse events, view seat map with availability, select and temporarily hold seats, complete booking with payment, cancellation/refund, waiting list for sold-out events.',
      'Step 2 — Estimate scale: 10M daily users, 50K events active at any time, 500K bookings/day, peak flash sale: 100K concurrent users for a single event with 50K seats.',
      'Step 3 — Design event and seat data model: Event (id, name, venue, datetime, pricing_tiers). Seat (id, event_id, row, number, tier, status: available/held/booked). Seats are the finite inventory.',
      'Step 4 — Design seat selection with locking: when user selects seats, set status to "held" with a TTL (e.g., 10 min). Use optimistic locking (version column) or SELECT FOR UPDATE to prevent race conditions.',
      'Step 5 — Design booking flow: Browse → Select seats → Temporary hold → Redirect to payment → On payment success: mark seats "booked" → Generate ticket. On payment failure/timeout: release hold.',
      'Step 6 — Design payment integration: after seat hold, create a payment session (Stripe/Razorpay). On webhook callback confirming payment, finalize booking atomically. Handle payment timeouts and failures.',
      'Step 7 — Design the read path: event listings cached in Redis/CDN, filtered by city, date, genre. Seat availability map updated on every booking/release. Use a separate read-optimized view.',
      'Step 8 — Handle high-demand events: virtual queue (waiting room) to control admission rate. Only N users enter the booking flow at a time. Fair lottery for extremely popular events.'
    ],
    keyComponents: [
      'Event Service — manages event CRUD, scheduling, venue mapping, and pricing tiers',
      'Inventory/Seat Service — manages seat availability with locking semantics; the core consistency-critical component',
      'Booking Service — orchestrates the booking flow (hold → payment → confirm/release); maintains booking records',
      'Payment Service — integrates payment gateways; handles payment initiation, webhook callbacks, refunds',
      'Search & Discovery — event search by city, date, genre, artist; uses Elasticsearch with cached aggregations',
      'Queue/Waiting Room — traffic control for high-demand events; limits concurrent booking sessions',
      'Notification Service — sends booking confirmations, e-tickets, reminders, and cancellation notices via email/push',
      'Seat Map Renderer — generates and serves the interactive seat map UI with real-time availability overlay'
    ],
    scaleConsiderations: [
      'Seat-level locking granularity: lock at the individual seat level, not the event level. Use database row-level locks (SELECT ... FOR UPDATE) or Redis distributed locks with TTL per seat.',
      'TTL-based hold expiration: seats held but not purchased within 10 minutes auto-release. Implement via scheduled task or lazy evaluation (check hold expiry on next access).',
      'Hot event partitioning: a single popular event with 100K concurrent users creates a database hot spot. Shard seat data by section/zone of the venue to distribute write load.',
      'Virtual queue for flash sales: when demand exceeds capacity, put users in a queue and admit them in batches. This converts a thundering herd into a controlled flow.',
      'Read-write separation: event listings and search are read-heavy (cache aggressively). Seat availability and booking are write-heavy (strong consistency, no caching of seat status).'
    ],
    commonMistakes: [
      'Not implementing temporary seat holds — without holds, two users can simultaneously select the same seat and both proceed to payment, causing a double-booking.',
      'Locking at the event level instead of seat level — this serializes all bookings for an event when only conflicting seat selections need serialization.',
      'Not handling the timeout/failure case in the payment flow — if the user abandons payment, held seats must be released back to available inventory.',
      'Caching seat availability too aggressively — stale cache causes users to see available seats that are actually held/booked, leading to frustration.'
    ],
    resources: [
      { label: 'HelloInterview — Ticketmaster', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/ticketmaster' },
      { label: 'ByteByteGo — Ticket Booking System Design', url: 'https://www.youtube.com/watch?v=lBAwJgoSzHg' },
      { label: 'Alex Xu — System Design Interview Vol. 2, Chapter 8', url: '' }
    ],
    relatedTopics: ['payment-system', 'distributed-cache', 'rate-limiter']
  },

  {
    id: 'payment-system',
    title: 'Payment System',
    type: 'hld',
    category: 'E-Commerce',
    order: 28,
    overview: `A payment system processes financial transactions between buyers, sellers, and financial institutions. Stripe processes hundreds of billions of dollars annually, handling the complexity of multiple payment methods (credit cards, bank transfers, digital wallets), multi-currency support, fraud detection, regulatory compliance (PCI DSS), and exactly-once processing guarantees. Unlike most distributed systems where "at-least-once with idempotency" is acceptable, payment systems must guarantee that money is moved exactly once — a duplicate charge or a lost payment is a critical business failure.

The core design principle is the double-entry ledger: every transaction creates at least two entries (debit from one account, credit to another) that must sum to zero. This provides a built-in consistency check — if debits and credits don't balance, something went wrong. The payment flow involves authorization (can the customer pay?), capture (actually move the money), settlement (batch reconciliation with banks), and payout (transfer funds to the merchant).

Key challenges include idempotency (retries must not create duplicate charges — use idempotency keys), distributed transaction management (coordinating between your system and external payment processors), handling partial failures (payment authorized but capture failed), reconciliation (matching your ledger against bank statements), and fraud detection (real-time risk scoring on every transaction). The system must be highly available (downtime = lost revenue) while maintaining strong consistency for financial data.`,
    framework: [
      'Step 1 — Clarify requirements: payment methods supported (cards, bank transfer, wallets), currencies, transaction types (charge, refund, payout), fraud detection, regulatory compliance (PCI DSS), reconciliation.',
      'Step 2 — Estimate scale: 10M transactions/day, $100M daily volume. Peak: 5K transactions/sec. 99.99% availability target. Zero tolerance for duplicate charges or lost payments.',
      'Step 3 — Design the payment flow: Checkout → Create payment intent → Authorize (hold funds) → Capture (charge) → Settle (reconcile with bank). Each step is idempotent and recoverable.',
      'Step 4 — Design idempotency: client sends an idempotency key with each request. Server stores (idempotency_key → response) in DB. On retry, return stored response. This prevents duplicate charges.',
      'Step 5 — Design the ledger: double-entry bookkeeping. Every payment creates a debit entry and credit entry. Entries are immutable (append-only). Reversals create new counter-entries, never modify existing ones.',
      'Step 6 — Design payment state machine: states: created → processing → authorized → captured → settled → paid_out. Also: failed, refunded, disputed. State transitions are atomic and logged.',
      'Step 7 — Design integration with payment processors: abstract payment gateway interface (Stripe, Adyen, Braintree). Support fallback: if primary gateway is down, route to secondary. Handle async webhooks for status updates.',
      'Step 8 — Design reconciliation: nightly batch job compares internal ledger against bank settlement files. Flag discrepancies for manual review. Track every penny.'
    ],
    keyComponents: [
      'Payment Service — orchestrates the payment lifecycle; handles authorization, capture, refund, and payout flows',
      'Ledger Service — maintains the double-entry ledger; all financial mutations are append-only entries',
      'Idempotency Store — maps idempotency keys to responses; prevents duplicate processing on retries',
      'Payment Gateway Adapter — abstracts external payment processors (Stripe, Adyen); handles API calls, retries, and webhook consumption',
      'Fraud Detection Service — real-time risk scoring using ML models; evaluates velocity, device fingerprint, geo anomalies',
      'Reconciliation Engine — batch job matching internal records against bank/processor settlement files; flags discrepancies',
      'Wallet/Account Service — manages internal account balances for merchants, platforms, and stored-value wallets',
      'Audit & Compliance — immutable audit log of all financial operations; PCI DSS tokenization of card data'
    ],
    scaleConsiderations: [
      'Idempotency is non-negotiable: every mutation endpoint must accept an idempotency key. Store the key and result atomically. Without this, network retries will create duplicate charges.',
      'Exactly-once via saga pattern: payment involves multiple services (payment, ledger, processor). Use a saga with compensating transactions — if capture fails after authorization, release the auth hold.',
      'Event sourcing for the ledger: store events (payment_created, payment_authorized, payment_captured) as the source of truth. Derive current state by replaying events. This provides a complete audit trail.',
      'PCI DSS compliance: never store raw card numbers. Use tokenization (Stripe tokens, vault services). Minimize the cardholder data environment (CDE) scope.',
      'Multi-currency handling: store amounts in the smallest currency unit (cents, paisa). Record both source and target currency with the exchange rate at transaction time. Never compute amounts from floating-point.'
    ],
    commonMistakes: [
      'Not implementing idempotency keys — without them, network timeouts and retries will inevitably cause duplicate charges or lost payments in production.',
      'Using floating-point arithmetic for money — floating-point introduces rounding errors. Always use integer cents/paisa or a Decimal type.',
      'Modifying ledger entries instead of appending — the ledger must be immutable (append-only). Refunds create new counter-entries; they never update or delete the original charge entry.',
      'Synchronously calling the payment processor and blocking the user — payment processing can take seconds. Use async processing with webhooks and poll for status.'
    ],
    resources: [
      { label: 'HelloInterview — Payment System', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/payment-system' },
      { label: 'ByteByteGo — Design a Payment System', url: 'https://www.youtube.com/watch?v=olfaBgJrUBI' },
      { label: 'Alex Xu — System Design Interview Vol. 2, Chapter 11', url: '' }
    ],
    relatedTopics: ['ticket-booking', 'distributed-message-queue', 'rate-limiter']
  },

  {
    id: 'google-maps',
    title: 'Google Maps',
    type: 'hld',
    category: 'Location-Based',
    order: 29,
    overview: `Google Maps provides mapping, routing, navigation, and location search for over 1 billion monthly active users. The system serves map tiles (rendered images of geographic areas), computes routes between locations (shortest path, fastest path, multi-modal), provides real-time traffic information, supports location search (find "coffee shops near me"), and powers turn-by-turn navigation. It processes billions of routing requests daily and ingests real-time location data from millions of devices to compute live traffic conditions.

The map rendering challenge involves a tiled approach: the world is divided into tiles at multiple zoom levels (typically 0-21), and the client requests only the tiles visible in the current viewport. At zoom level 0, the entire world fits in one 256x256 pixel tile; at zoom level 21, there are 4^21 (~4 trillion) tiles. Pre-rendering all tiles at all zoom levels is impractical for the highest zoom levels, so a combination of pre-rendered (lower zooms) and on-demand rendered (higher zooms) tiles is used, served via CDN.

The routing engine uses a weighted graph representation of the road network (nodes = intersections, edges = road segments) with algorithms like Contraction Hierarchies or A* with landmarks for fast shortest-path queries. Real-time traffic is incorporated by adjusting edge weights based on live speed data. ETA prediction combines the graph-based shortest path with ML models trained on historical and real-time traffic patterns.`,
    framework: [
      'Step 1 — Clarify requirements: map display (pan, zoom, search), point-to-point routing (car, walking, transit), real-time navigation with traffic, location search (POI), ETA estimation.',
      'Step 2 — Estimate scale: 1B monthly users, 1B routing requests/day, 50B map tile requests/day, 100M location data points/day from user devices for traffic.',
      'Step 3 — Design map tile serving: pre-render tiles at zoom levels 0-14 (world to city level). Serve from CDN. Higher zoom levels rendered on-demand or from vector data on client.',
      'Step 4 — Design the road network graph: model roads as a weighted directed graph. Nodes = intersections, edges = road segments with attributes (distance, speed limit, one-way, road type). Store in adjacency list format.',
      'Step 5 — Design the routing engine: use Contraction Hierarchies for fast shortest-path queries (millisecond response after preprocessing). Preprocess the graph offline; query online with bidirectional search.',
      'Step 6 — Incorporate real-time traffic: ingest GPS/speed data from devices. Aggregate by road segment in time windows. Adjust edge weights in the routing graph. Serve traffic layer as colored tiles.',
      'Step 7 — Design location/POI search: geocoding (address → coordinates) and reverse geocoding (coordinates → address). POI database indexed by geohash for "near me" queries. Elasticsearch for text search.',
      'Step 8 — Design navigation: client receives route (polyline + turn-by-turn instructions). Client tracks GPS and re-routes if user deviates. Server provides periodic traffic updates.'
    ],
    keyComponents: [
      'Map Tile Service — pre-renders and serves map tiles at various zoom levels; backed by CDN for global low-latency delivery',
      'Routing Engine — computes shortest/fastest paths using Contraction Hierarchies on the road network graph; supports car, walking, transit',
      'Traffic Service — ingests real-time location/speed data, computes road segment speeds, updates routing graph weights, serves traffic overlay tiles',
      'Geocoding Service — converts addresses to coordinates (geocoding) and coordinates to addresses (reverse geocoding)',
      'POI/Search Service — stores and searches points of interest (restaurants, gas stations, etc.) with geospatial and text indexing',
      'Navigation Service — provides turn-by-turn directions, rerouting on deviation, and real-time traffic updates to the client during a trip',
      'Road Network Graph Store — stores and serves the preprocessed road graph used by the routing engine; updated periodically with new road data',
      'ETA Prediction Service — ML model combining graph-based distance with historical traffic patterns for accurate arrival time estimates'
    ],
    scaleConsiderations: [
      'Tile caching via CDN: the same map tile is served to all users viewing that area at that zoom level. CDN caching is extremely effective — cache hit rates > 99% for popular areas.',
      'Contraction Hierarchies: preprocess the graph by contracting less-important nodes and adding shortcut edges. Reduces query time from seconds (Dijkstra) to milliseconds at the cost of hours of preprocessing.',
      'Traffic data aggregation: raw GPS points are map-matched to road segments and aggregated in 5-minute windows. Current speed = weighted average of recent reports. Historical patterns fill gaps where live data is sparse.',
      'Graph partitioning: the road network graph is partitioned geographically. Routing queries within a region use the local partition; cross-region queries use a coarser overlay graph.',
      'Vector tiles vs. raster tiles: modern maps shift to vector tiles (send raw geometry + styling rules to client) which are smaller, support smooth zoom, and enable client-side rendering. Reduces tile count dramatically.'
    ],
    commonMistakes: [
      'Proposing Dijkstra\'s algorithm for routing without optimization — vanilla Dijkstra is too slow for a continental road network (millions of nodes). Must use Contraction Hierarchies, A*, or similar.',
      'Ignoring the tile-based rendering model and trying to render the entire map on the server for each request — tile-based serving is fundamental to map scalability.',
      'Not incorporating real-time traffic into routing — a shortest-distance route may have terrible traffic. Modern routing must use live edge weights.',
      'Forgetting about the map data pipeline — roads change, new buildings appear, POIs open/close. The map must be continuously updated from satellite imagery, user reports, and partner data.'
    ],
    resources: [
      { label: 'HelloInterview — Google Maps', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/google-maps' },
      { label: 'ByteByteGo — Design Google Maps', url: 'https://www.youtube.com/watch?v=jk3yvVfNvds' },
      { label: 'Alex Xu — System Design Interview Vol. 2, Chapter 2', url: '' }
    ],
    relatedTopics: ['uber-lyft', 'distributed-cache', 'search-autocomplete']
  },

  // ─────────────────────────────────────────────────────────────────
  // LLD Topics (Low-Level Design)
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    type: 'lld',
    category: 'Data Structures',
    order: 30,
    overview: `An LRU (Least Recently Used) cache is a data structure that stores a fixed number of items and evicts the least recently accessed item when the cache reaches capacity. It is the most common eviction policy in caching systems (CPU caches, database buffer pools, web caches, CDNs). The LRU cache must support two operations in O(1) time: get(key) — retrieve a value and mark it as recently used, and put(key, value) — insert or update a value and evict the LRU item if at capacity.

The classic implementation combines a hash map with a doubly linked list. The hash map provides O(1) key lookups, mapping keys to linked list nodes. The doubly linked list maintains access order — the most recently accessed item is at the head, and the least recently accessed is at the tail. On get(), the node is moved to the head. On put(), a new node is added at the head; if capacity is exceeded, the tail node is removed and its key deleted from the hash map.

This is a foundational LLD question because it tests understanding of data structure composition, pointer manipulation, thread safety (adding a mutex or using concurrent data structures for multi-threaded access), and the ability to write clean, bug-free code under time pressure. Extensions include LRU with TTL, thread-safe LRU, LFU (least frequently used) cache, and LRU with size-aware eviction (items have varying sizes).`,
    framework: [
      'Step 1 — Clarify requirements: what operations? (get, put). O(1) time for both? Fixed capacity? Single-threaded or thread-safe? TTL support?',
      'Step 2 — Identify the data structure combination: hash map for O(1) lookup + doubly linked list for O(1) insertion/removal and access order tracking.',
      'Step 3 — Define the node structure: Node { key, value, prev, next }. The key is stored in the node so we can remove it from the hash map during eviction.',
      'Step 4 — Implement get(key): look up key in hash map → if found, move node to head of list, return value. If not found, return -1/null.',
      'Step 5 — Implement put(key, value): if key exists, update value and move to head. If new: create node, add to head, add to hash map. If over capacity, remove tail node from list and hash map.',
      'Step 6 — Implement helper methods: addToHead(node), removeNode(node), moveToHead(node) = removeNode + addToHead. Use dummy head/tail sentinels to simplify edge cases.',
      'Step 7 — Discuss thread safety: wrap get/put in a mutex for basic thread safety. For higher concurrency, use read-write locks or segment the cache (like ConcurrentHashMap).',
      'Step 8 — Discuss extensions: TTL per entry (lazy expiration on access + background cleanup), LFU variant (frequency counter per node), size-aware eviction (track total bytes, evict until under limit).'
    ],
    keyComponents: [
      'Hash Map — maps keys to doubly linked list nodes for O(1) lookup',
      'Doubly Linked List — maintains access order; head = most recent, tail = least recent; O(1) insert/remove',
      'Sentinel Nodes (dummy head/tail) — simplify boundary conditions by eliminating null checks for head/tail',
      'Node Structure — contains key, value, prev pointer, next pointer; key needed for hash map cleanup on eviction',
      'Capacity Tracker — current size vs. max capacity; triggers eviction when size exceeds capacity'
    ],
    scaleConsiderations: [
      'Thread safety: a simple mutex serializes all operations. For high-concurrency, shard the cache into N segments (each with its own lock and LRU list) to reduce contention.',
      'Memory overhead: each entry carries two pointers (prev, next) plus hash map entry overhead. For small values, this overhead can be significant — consider whether LRU is worth it vs. simpler random eviction.',
      'Cache size tuning: too small → frequent evictions and low hit rate; too large → wasted memory. Monitor hit rate and adjust. Target > 90% hit rate for effective caching.',
      'TTL integration: store expiry timestamp in each node. On get(), check if expired (lazy deletion). Run a background thread periodically scanning for expired entries (active deletion).',
      'Distributed LRU: a single-machine LRU doesn\'t scale. For distributed caching, use consistent hashing to partition keys across nodes, each running its own LRU (like Redis cluster).'
    ],
    commonMistakes: [
      'Using a singly linked list instead of a doubly linked list — removal from the middle requires O(n) traversal with a singly linked list, breaking the O(1) guarantee.',
      'Not storing the key in the linked list node — when evicting the tail, you need the key to remove the entry from the hash map. Without it, eviction becomes O(n).',
      'Forgetting sentinel (dummy) head and tail nodes — without sentinels, every insert/remove must handle null head/tail edge cases, leading to bugs.',
      'Not handling the "update existing key" case in put() — if the key already exists, the value should be updated and the node moved to head, not a duplicate entry created.'
    ],
    resources: [
      { label: 'LeetCode 146 — LRU Cache', url: 'https://leetcode.com/problems/lru-cache/' },
      { label: 'ByteByteGo — LRU Cache Explained', url: 'https://www.youtube.com/watch?v=7ABFKPK2hD4' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 5 (Caching)', url: '' }
    ],
    relatedTopics: ['distributed-cache', 'key-value-store']
  },

  {
    id: 'parking-lot',
    title: 'Parking Lot System',
    type: 'lld',
    category: 'OOP Design',
    order: 31,
    overview: `The Parking Lot system is a classic object-oriented design problem that tests the ability to model a real-world domain with clean class hierarchies, manage state transitions, and handle concurrent access to shared resources. The system manages a multi-level parking structure with different spot sizes (compact, regular, large), supports multiple vehicle types (motorcycle, car, bus), tracks occupancy, computes parking fees based on duration, and handles entry/exit gate operations.

The design requires careful application of OOP principles: the Vehicle class hierarchy (abstract Vehicle → Car, Motorcycle, Bus), the ParkingSpot hierarchy (CompactSpot, RegularSpot, LargeSpot), and the strategy pattern for parking fee calculation (hourly, daily, flat rate). The core algorithm is the parking assignment strategy — finding the best available spot for a given vehicle type (nearest to entrance, specific floor preference, or smallest-fit to maximize utilization).

Beyond the basic OOP modeling, interviewers probe for concurrency handling (two cars arriving at the same gate simultaneously), the singleton pattern for the ParkingLot instance, the observer pattern for display boards showing available spots per floor, and extensibility (adding electric vehicle spots with chargers, handicap-accessible spots, or valet parking). The design naturally leads into discussions about SOLID principles, particularly Single Responsibility and Open/Closed principles.`,
    framework: [
      'Step 1 — Clarify requirements: how many levels/floors? Spot types (compact, regular, large)? Vehicle types? Payment methods? Entry/exit gates? Display showing availability?',
      'Step 2 — Identify core entities: ParkingLot, ParkingFloor, ParkingSpot, Vehicle, Ticket, Payment, EntryGate, ExitGate, DisplayBoard.',
      'Step 3 — Design class hierarchies: Vehicle (abstract) → Car, Motorcycle, Bus. ParkingSpot (abstract) → CompactSpot, RegularSpot, LargeSpot. Each spot knows if it can fit a given vehicle type.',
      'Step 4 — Design the ParkingLot class: singleton. Contains list of ParkingFloors. Methods: getAvailableSpot(vehicleType), parkVehicle(vehicle), unparkVehicle(ticket). Tracks total/available counts.',
      'Step 5 — Design the parking flow: vehicle arrives → entry gate generates Ticket (vehicleInfo, entryTime, spotAssigned) → vehicle parks. On exit: calculate fee from duration, process payment, release spot.',
      'Step 6 — Design the parking strategy: find the nearest available spot that fits the vehicle. CompactSpot fits motorcycles and compact cars. RegularSpot fits cars. LargeSpot fits all including buses.',
      'Step 7 — Design the fee calculation: Strategy pattern — HourlyRateStrategy, FlatRateStrategy, WeekendRateStrategy. Fee = strategy.calculate(entryTime, exitTime, spotType).',
      'Step 8 — Handle concurrency: synchronize access to spot assignment (two vehicles cannot be assigned the same spot). Use locks on ParkingFloor or ParkingSpot level.'
    ],
    keyComponents: [
      'ParkingLot (Singleton) — top-level class managing floors, gates, and overall capacity',
      'ParkingFloor — manages spots on a single floor; tracks availability per spot type; provides nearest-available-spot lookup',
      'ParkingSpot (Abstract) → CompactSpot, RegularSpot, LargeSpot — individual spots with size, status (available/occupied), and assigned vehicle reference',
      'Vehicle (Abstract) → Car, Motorcycle, Bus — vehicle types with license plate, type, and size attributes',
      'Ticket — issued at entry; contains vehicle info, assigned spot, entry timestamp; used for fee calculation at exit',
      'ParkingFeeStrategy (Interface) — strategy pattern for fee calculation; implementations for hourly, daily, flat-rate pricing',
      'EntryGate / ExitGate — handles vehicle arrival (issue ticket, assign spot) and departure (calculate fee, process payment, release spot)',
      'DisplayBoard (Observer) — per-floor display showing available spots by type; updated via observer pattern on spot status changes'
    ],
    scaleConsiderations: [
      'Concurrency control: multiple entry gates must synchronize spot assignment. Use a concurrent data structure (ConcurrentHashMap) or fine-grained locking per floor to avoid assigning the same spot twice.',
      'Spot lookup optimization: maintain a free list per spot type per floor for O(1) availability check. A bitmap per floor (1 = available, 0 = occupied) enables fast scanning.',
      'Extensibility via strategy pattern: adding a new pricing model (e.g., EV charging surcharge) only requires a new ParkingFeeStrategy implementation, no changes to existing code (Open/Closed principle).',
      'Observer pattern for displays: when a spot status changes, notify all registered DisplayBoards. Decouples spot management from display rendering.',
      'Database persistence: for a real system, store tickets, payments, and spot status in a database. In-memory state is rebuilt on startup from the persistent store.'
    ],
    commonMistakes: [
      'Not using abstraction for Vehicle and ParkingSpot — hardcoding vehicle types and spot types makes the design rigid and violates the Open/Closed principle.',
      'Making the ParkingLot class a god object that handles everything — parking, payment, display, and gate logic should be separated into distinct classes (Single Responsibility).',
      'Ignoring thread safety when assigning spots — in a multi-gate scenario, two vehicles can be assigned the same spot without proper synchronization.',
      'Hardcoding the fee calculation logic instead of using a strategy pattern — this makes it difficult to support multiple pricing models or change pricing rules.'
    ],
    resources: [
      { label: 'HelloInterview — Parking Lot LLD', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/parking-lot' },
      { label: 'ByteByteGo — OOP Design Parking Lot', url: 'https://www.youtube.com/watch?v=tVRyb4HaHgw' },
      { label: 'Grokking the Object-Oriented Design Interview — Parking Lot', url: '' }
    ],
    relatedTopics: ['elevator-system', 'tic-tac-toe']
  },

  {
    id: 'elevator-system',
    title: 'Elevator System',
    type: 'lld',
    category: 'OOP Design',
    order: 32,
    overview: `Designing an elevator system is a classic OOP and state machine problem that tests the ability to model concurrent, stateful components with a scheduling algorithm. A building has N elevators serving M floors, and the system must efficiently dispatch elevators to serve both hall calls (user presses up/down on a floor) and car calls (user selects a destination floor inside the elevator). The goal is to minimize average wait time and travel time while handling concurrent requests from multiple floors.

The elevator itself is a state machine with states: IDLE, MOVING_UP, MOVING_DOWN, and DOOR_OPEN. State transitions are driven by the scheduling algorithm and sensor events (arrived at floor, door opened/closed, weight sensor). The scheduling algorithm is the most interesting design decision — options range from simple FCFS (first come, first served), to SCAN/elevator algorithm (serve all requests in one direction before reversing), to LOOK (like SCAN but reverses at the last request rather than the end of the shaft), to more sophisticated algorithms that consider elevator load and destination alignment.

The dispatcher component decides which elevator to assign to a new hall call. A naive approach assigns the nearest elevator, but a better strategy considers the elevator's current direction and existing stops. An elevator already moving up toward floor 7 is a better match for a floor-8 up-call than an idle elevator on floor 2. The design must also handle edge cases: overweight detection, emergency stops, maintenance mode, and priority floors (VIP or fire service modes).`,
    framework: [
      'Step 1 — Clarify requirements: number of elevators, number of floors, types of calls (hall call up/down, car call), scheduling strategy, capacity/weight limits, emergency mode.',
      'Step 2 — Identify core entities: ElevatorSystem (controller), Elevator, Floor, Request (HallCall, CarCall), Door, DisplayPanel, Button.',
      'Step 3 — Design the Elevator class: state machine with states (IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN). Attributes: currentFloor, direction, destinationQueue (sorted set of target floors), current load.',
      'Step 4 — Design the request model: HallCall (floor, direction: UP/DOWN) vs. CarCall (elevator, destinationFloor). Both are enqueued into the scheduling system.',
      'Step 5 — Design the scheduling algorithm (LOOK): elevator moves in one direction, stopping at all requested floors. Reverses direction when no more requests ahead in current direction. Better than FCFS for throughput.',
      'Step 6 — Design the dispatcher: when a new HallCall arrives, evaluate each elevator by cost function: cost = |elevator.currentFloor - requestFloor| + direction alignment bonus. Assign to lowest-cost elevator.',
      'Step 7 — Design the door controller: open door on arrival at requested floor. Wait for configured time (or until close button pressed). Do not close if weight sensor detects obstruction. Emergency open override.',
      'Step 8 — Handle edge cases: overweight alarm (don\'t move until weight reduced), emergency stop (halt all elevators, open doors), maintenance mode (take one elevator offline), fire mode (all elevators go to ground floor).'
    ],
    keyComponents: [
      'ElevatorController — the central dispatcher that receives requests and assigns them to elevators based on the scheduling algorithm',
      'Elevator — state machine managing current floor, direction, door state, load, and a sorted queue of destination floors',
      'Request (HallCall / CarCall) — represents a user\'s request; HallCall has floor + direction, CarCall has elevator + destination floor',
      'Scheduling Algorithm (Strategy) — pluggable strategy for elevator dispatch (FCFS, SCAN, LOOK); determines which elevator serves which request',
      'Door Controller — manages door open/close with safety checks (obstruction detection, timeout, emergency open)',
      'Floor Panel — hall call buttons (up/down) on each floor; sends HallCall requests to the controller',
      'Elevator Panel — car call buttons (floor numbers) inside the elevator; sends CarCall requests; displays current floor and direction',
      'Sensor System — floor arrival sensor, weight sensor, door obstruction sensor; provides input to the elevator state machine'
    ],
    scaleConsiderations: [
      'Algorithm selection: LOOK algorithm provides the best average wait time for general use. For peak traffic (morning arrival at offices), use zoning — assign elevator groups to floor ranges.',
      'Multi-elevator coordination: the dispatcher must consider all elevators together, not independently. Avoid sending multiple elevators to the same floor by tracking pending assignments.',
      'Concurrency: requests arrive concurrently from multiple floors. The controller must synchronize access to the elevator state and destination queue to prevent race conditions.',
      'Destination dispatch: advanced systems (like Otis Compass) let users enter their destination floor at the lobby, enabling pre-grouping of passengers going to similar floors for fewer stops.',
      'Simulation and testing: elevator systems are best validated through simulation. Model arrival patterns (morning rush, lunch, evening departure) and measure average wait/travel time per algorithm.'
    ],
    commonMistakes: [
      'Always assigning the nearest idle elevator without considering direction — an elevator already moving toward the requested floor in the right direction is often a better choice.',
      'Not modeling the elevator as a state machine — this leads to tangled if/else logic for movement, door control, and request handling instead of clean state transitions.',
      'Ignoring concurrent requests — the system must handle requests from multiple floors simultaneously without corrupting the elevator\'s destination queue.',
      'Forgetting edge cases like overweight, door obstruction, and emergency mode — interviewers expect discussion of safety scenarios even if not fully implemented.'
    ],
    resources: [
      { label: 'HelloInterview — Elevator System', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/elevator' },
      { label: 'ByteByteGo — Elevator System Design', url: 'https://www.youtube.com/watch?v=siqiJAJWUVg' },
      { label: 'Grokking the Object-Oriented Design Interview — Elevator System', url: '' }
    ],
    relatedTopics: ['parking-lot', 'tic-tac-toe']
  },

  {
    id: 'tic-tac-toe',
    title: 'Design Tic-Tac-Toe',
    type: 'lld',
    category: 'Game Design',
    order: 33,
    overview: `Designing a Tic-Tac-Toe game tests the ability to model game state, validate moves, check win conditions efficiently, and apply clean OOP principles to a seemingly simple problem. While the game itself is trivial, the design challenge lies in creating an extensible architecture that could support variants: different board sizes (N x N), more than 2 players, different win conditions, AI opponents, and networked multiplayer.

The core design involves a Board class (2D grid of cells), a Player abstraction (human or AI), a Game class (manages turns, validates moves, checks win conditions), and a GameResult (win, draw, in-progress). The most interesting algorithmic component is the win condition checker: a naive approach checks all rows, columns, and diagonals after each move (O(N) per check). An optimized approach maintains running counts per row, column, and diagonal for each player — a move increments the count, and a win is detected when any count equals N (O(1) per check).

Extensions that interviewers explore include: supporting N x N boards (general win condition K-in-a-row), implementing an AI opponent (minimax with alpha-beta pruning for optimal play), undo/redo (command pattern), move history and replay, and a networked version with a game server. The design should demonstrate SOLID principles, particularly the Single Responsibility Principle (Board doesn't know about Players, Game doesn't know about UI) and the Open/Closed Principle (adding an AI player doesn't change the game logic).`,
    framework: [
      'Step 1 — Clarify requirements: standard 3x3 or N x N? 2 players or more? Human vs. human, human vs. AI? Undo/redo? Move history? CLI or GUI?',
      'Step 2 — Identify core entities: Game, Board, Player (HumanPlayer, AIPlayer), Cell, Move, GameStatus (IN_PROGRESS, X_WINS, O_WINS, DRAW).',
      'Step 3 — Design the Board class: N x N grid of Cells. Methods: placeMove(row, col, symbol), isValidMove(row, col), isFull(). Cells can be EMPTY, X, or O.',
      'Step 4 — Design the Game class: manages player turns, validates moves, delegates to board, checks win condition after each move. Returns GameStatus after each move.',
      'Step 5 — Optimize win checking: maintain arrays rowCount[N], colCount[N], diagCount, antiDiagCount per player. Increment on move. Win when any count == N. O(1) per move instead of O(N).',
      'Step 6 — Design the Player abstraction: interface Player { makeMove(board): Move }. HumanPlayer gets input from UI. AIPlayer uses minimax algorithm to compute optimal move.',
      'Step 7 — Add undo/redo: Command pattern — each Move is a command object with execute() and undo(). Maintain a stack of executed moves for undo and a redo stack.',
      'Step 8 — Discuss extensibility: N x N boards with K-in-a-row win condition, multiplayer (> 2 players with different symbols), tournament mode, networked play via game server.'
    ],
    keyComponents: [
      'Game — orchestrates the game loop: alternates turns, validates moves, checks win/draw conditions, manages game lifecycle',
      'Board — N x N grid of cells; handles move placement and board state queries; independent of game rules',
      'Cell — represents a single position; states: EMPTY, X, O (or generic symbol)',
      'Player (Interface) → HumanPlayer, AIPlayer — abstracts the move-making behavior; AI uses minimax for optimal play',
      'Move — value object containing row, column, and player symbol; used for validation, execution, and undo',
      'WinChecker — optimized win detection using row/column/diagonal counters; O(1) check after each move',
      'GameHistory (Command Pattern) — stack of Move commands supporting undo/redo functionality'
    ],
    scaleConsiderations: [
      'O(1) win checking: maintain per-player counters for each row, column, and both diagonals. A move increments the relevant counters; check if any equals N. This avoids scanning the board after each move.',
      'AI with minimax: for 3x3, the game tree is small enough for exhaustive minimax. For N x N with larger N, use alpha-beta pruning to cut branches, reducing the effective branching factor significantly.',
      'Extensibility to N x N: the win checker, board, and game logic should be parameterized by board size N and win condition K. Avoid hardcoding 3.',
      'Network multiplayer: add a GameServer that maintains game state and validates moves. Players communicate via WebSocket. Server is the source of truth to prevent cheating.',
      'Concurrent games: a game server hosting many concurrent games should isolate each game\'s state. Use a game ID to route requests to the correct Game instance.'
    ],
    commonMistakes: [
      'Checking win conditions by scanning the entire board after each move — this is O(N^2) when an O(1) solution exists using row/column/diagonal counters.',
      'Putting too much logic in the Board class (turn management, win checking, player handling) — Board should only manage the grid; Game orchestrates the rules.',
      'Not using an interface/abstract class for Player — hardcoding human input makes it impossible to add AI players without modifying the Game class.',
      'Hardcoding the 3x3 board size — a well-designed solution should work for any N x N board with minimal changes.'
    ],
    resources: [
      { label: 'LeetCode 348 — Design Tic-Tac-Toe', url: 'https://leetcode.com/problems/design-tic-tac-toe/' },
      { label: 'ByteByteGo — LLD Design Patterns', url: 'https://www.youtube.com/watch?v=tAuRQs_d9F8' },
      { label: 'Grokking the Object-Oriented Design Interview — Game Design', url: '' }
    ],
    relatedTopics: ['parking-lot', 'elevator-system', 'lru-cache']
  },

  {
    id: 'key-value-store',
    title: 'Design a Key-Value Store',
    type: 'lld',
    category: 'Data Structures',
    order: 34,
    overview: `A key-value store is one of the simplest yet most powerful data storage abstractions — it maps keys to values and supports get(key), put(key, value), and delete(key) operations. At the LLD level, this question asks you to design the internal data structures and algorithms for a single-node key-value store that persists data to disk efficiently while serving reads from memory when possible. Think of it as building a simplified version of LevelDB, RocksDB, or Bitcask.

The most common approach uses a Log-Structured Merge-tree (LSM-tree): writes are first recorded in a write-ahead log (WAL) for durability, then inserted into an in-memory sorted structure (memtable, typically a red-black tree or skip list). When the memtable reaches a size threshold, it is flushed to disk as an immutable Sorted String Table (SSTable). Reads check the memtable first, then SSTables from newest to oldest, using Bloom filters to skip SSTables that definitely don't contain the key.

An alternative approach is hash-index based (like Bitcask): an in-memory hash map stores every key with a pointer to its value's location on disk (file ID + offset). Writes append to a log file. This provides O(1) reads (single disk seek) but requires all keys to fit in memory. The LSM-tree approach is more scalable for large key spaces. Both designs involve compaction — periodically merging and cleaning up old data files to reclaim space from deleted/overwritten entries.`,
    framework: [
      'Step 1 — Clarify requirements: single-node or distributed? Persistence (survive restarts)? Data volume (fits in memory or disk-based)? Consistency guarantees? Range queries needed?',
      'Step 2 — Choose the storage engine approach: LSM-tree for write-heavy workloads with range query support. Hash-index (Bitcask) for simpler point lookups when all keys fit in memory.',
      'Step 3 — Design the write path (LSM-tree): write to WAL (append-only log for crash recovery) → insert into memtable (skip list or red-black tree, sorted by key) → when memtable is full, flush to disk as an SSTable.',
      'Step 4 — Design the read path: check memtable → check immutable memtable (being flushed) → check SSTables newest to oldest. Use Bloom filter per SSTable to skip tables that don\'t contain the key.',
      'Step 5 — Design SSTables: immutable, sorted files of key-value pairs. Include an index block (sparse key → offset mapping) for binary search within the file. Compression per data block.',
      'Step 6 — Design compaction: merge overlapping SSTables to remove deleted entries (tombstones) and old versions. Leveled compaction (LevelDB) or size-tiered compaction (Cassandra). Runs in background.',
      'Step 7 — Design crash recovery: on startup, replay the WAL to rebuild the memtable. SSTables on disk are already durable. WAL is truncated after successful memtable flush.',
      'Step 8 — Discuss optimizations: Bloom filters for read performance, block cache for hot SSTable blocks, write batching for throughput, compression (snappy, zstd) for storage efficiency.'
    ],
    keyComponents: [
      'Write-Ahead Log (WAL) — append-only log for durability; every write is logged before memtable insertion; replayed on crash recovery',
      'Memtable — in-memory sorted data structure (skip list or red-black tree); handles all current writes; provides sorted iteration for flush',
      'SSTable (Sorted String Table) — immutable sorted file on disk; contains data blocks, index block, Bloom filter, and metadata block',
      'Bloom Filter — probabilistic data structure per SSTable; quickly determines if a key might exist in the SSTable (no false negatives)',
      'Compaction Engine — background process that merges SSTables to remove tombstones, consolidate versions, and reduce read amplification',
      'Block Cache — LRU cache of recently read SSTable data blocks in memory; reduces disk I/O for hot data',
      'Manifest/Version Manager — tracks the current set of SSTables and their levels; updated atomically during compaction; used for crash recovery'
    ],
    scaleConsiderations: [
      'Write amplification: LSM-trees have write amplification because data is written to WAL, then memtable, then SSTable, then rewritten during compaction. Leveled compaction has ~10x write amplification; size-tiered has less.',
      'Read amplification: in the worst case, a read checks the memtable + all SSTable levels. Bloom filters reduce this dramatically — with a 1% false positive rate, most SSTables are skipped.',
      'Space amplification: without compaction, deleted and overwritten entries consume disk space. Compaction reclaims space but competes with foreground I/O. Schedule compaction during low-traffic periods.',
      'Memtable sizing: larger memtables mean fewer, larger SSTables (better read performance) but more data at risk during crashes (longer WAL replay). Typical size: 64 MB - 256 MB.',
      'Concurrency: reads and writes can be concurrent. Memtable uses a concurrent skip list. SSTable reads are lock-free (immutable files). Compaction runs in background threads without blocking reads.'
    ],
    commonMistakes: [
      'Not including a write-ahead log — without WAL, data in the memtable is lost on crash. The WAL is essential for durability.',
      'Scanning all SSTables for every read — without Bloom filters and a level structure, reads become O(number of SSTables), which is unacceptably slow.',
      'Not implementing compaction — without it, the number of SSTables grows unboundedly, reads get slower, and disk space is never reclaimed from deleted entries.',
      'Confusing LSM-tree with B-tree — B-trees update data in-place (good for read-heavy), LSM-trees use append-only writes (good for write-heavy). The question usually expects LSM-tree for a KV store.'
    ],
    resources: [
      { label: 'HelloInterview — Key-Value Store', url: 'https://www.hellointerview.com/learn/system-design/answer-keys/key-value-store' },
      { label: 'ByteByteGo — Design a Key-Value Store', url: 'https://www.youtube.com/watch?v=rnZmdmlR-2M' },
      { label: 'Alex Xu — System Design Interview Vol. 1, Chapter 6', url: '' }
    ],
    relatedTopics: ['lru-cache', 'distributed-cache', 'distributed-message-queue']
  }
];
