import { WeekPlan } from '../models/schedule.model';

export const WEEKLY_SCHEDULE: WeekPlan[] = [
  // ===== WEEK 1 — DSA Foundations + Go Basics + SD Foundations Start =====
  {
    week: 1,
    theme: 'DSA Foundations + Go Basics + SD Foundations Start',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w1-d1-t1', section: 'dsa', topicId: 'two-pointers', title: 'Two Pointers — pattern intro, container with most water, 3sum', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w1-d2-t1', section: 'system-design', topicId: 'sd-interview-approach', title: 'SD Interview Approach — framework, requirement gathering, estimation, trade-offs', estimatedMinutes: 45, type: 'study' },
          { id: 'w1-d2-t2', section: 'system-design', topicId: 'availability-reliability', title: 'Availability & Reliability — nines of uptime, failover, redundancy, SLAs', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w1-d3-t1', section: 'dsa', topicId: 'two-pointers', title: 'Two Pointers — trapping rain water, remove duplicates, pair sum', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w1-d4-t1', section: 'golang', topicId: 'go-basics', title: 'Go fundamentals — types, structs, control flow, functions', estimatedMinutes: 45, type: 'study' },
          { id: 'w1-d4-t2', section: 'golang', topicId: 'pointers-memory', title: 'Pointers, stack vs heap, value vs reference semantics', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w1-d5-t1', section: 'dsa', topicId: 'sliding-window', title: 'Sliding Window — fixed window, max sum subarray, anagram search', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w1-d6-t1', section: 'dsa', topicId: 'sliding-window', title: 'Sliding Window — variable window, longest substring without repeating chars', estimatedMinutes: 60, type: 'practice' },
          { id: 'w1-d6-t2', section: 'system-design', topicId: 'cap-theorem', title: 'CAP Theorem — consistency, availability, partition tolerance, real-world trade-offs', estimatedMinutes: 60, type: 'study' },
          { id: 'w1-d6-t3', section: 'golang', topicId: 'error-handling', title: 'Error handling — error interface, custom errors, wrapping, sentinel errors', estimatedMinutes: 60, type: 'study' },
          { id: 'w1-d6-t4', section: 'dsa', topicId: 'two-pointers', title: 'Review two pointers + sliding window problems from the week', estimatedMinutes: 60, type: 'review' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w1-d7-t1', section: 'system-design', topicId: 'scalability-performance', title: 'Scalability & Performance — vertical vs horizontal scaling, latency, throughput, bottlenecks', estimatedMinutes: 75, type: 'study' },
          { id: 'w1-d7-t2', section: 'golang', topicId: 'slices-maps', title: 'Slices internals, maps, make vs new, range gotchas', estimatedMinutes: 60, type: 'study' },
          { id: 'w1-d7-t3', section: 'dsa', topicId: 'sliding-window', title: 'Sliding Window — minimum window substring, fruit into baskets', estimatedMinutes: 60, type: 'practice' },
          { id: 'w1-d7-t4', section: 'golang', topicId: 'interfaces-composition', title: 'Interfaces, embedding, composition over inheritance', estimatedMinutes: 45, type: 'study' },
        ],
      },
    ],
  },

  // ===== WEEK 2 — DSA Core + Go Concurrency + SD Foundations =====
  {
    week: 2,
    theme: 'DSA Core + Go Concurrency + SD Foundations',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w2-d1-t1', section: 'dsa', topicId: 'binary-search', title: 'Binary Search — standard, rotated array, search insert position', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w2-d2-t1', section: 'system-design', topicId: 'load-balancing', title: 'Load Balancing — L4 vs L7, algorithms (round robin, least connections), health checks', estimatedMinutes: 45, type: 'study' },
          { id: 'w2-d2-t2', section: 'system-design', topicId: 'databases-deep-dive', title: 'Databases Deep Dive — SQL vs NoSQL, ACID, replication, sharding strategies', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w2-d3-t1', section: 'dsa', topicId: 'binary-search', title: 'Binary Search — search space reduction, koko eating bananas, capacity to ship', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w2-d4-t1', section: 'golang', topicId: 'goroutines', title: 'Goroutines — launching, waitgroups, goroutine lifecycle', estimatedMinutes: 45, type: 'study' },
          { id: 'w2-d4-t2', section: 'golang', topicId: 'channels', title: 'Channels — buffered/unbuffered, directional, select statement', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w2-d5-t1', section: 'dsa', topicId: 'hashmap-frequency', title: 'HashMap/Frequency — two sum, group anagrams, top K frequent', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w2-d6-t1', section: 'dsa', topicId: 'hashmap-frequency', title: 'HashMap — subarray sum equals K, longest consecutive sequence', estimatedMinutes: 60, type: 'practice' },
          { id: 'w2-d6-t2', section: 'system-design', topicId: 'caching-in-sd', title: 'Caching in System Design — cache-aside, write-through, write-back, CDN caching, cache invalidation', estimatedMinutes: 75, type: 'study' },
          { id: 'w2-d6-t3', section: 'system-design', topicId: 'cdn-proxy', title: 'CDN & Proxy — edge servers, reverse proxy, forward proxy, CDN invalidation, PoPs', estimatedMinutes: 60, type: 'study' },
          { id: 'w2-d6-t4', section: 'dsa', topicId: 'monotonic-stack', title: 'Monotonic Stack — next greater element, daily temperatures', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w2-d7-t1', section: 'system-design', topicId: 'consistent-hashing', title: 'Consistent Hashing — hash ring, virtual nodes, rebalancing, use in distributed systems', estimatedMinutes: 75, type: 'study' },
          { id: 'w2-d7-t2', section: 'golang', topicId: 'sync-primitives', title: 'Sync primitives — Mutex, RWMutex, Once, WaitGroup patterns', estimatedMinutes: 60, type: 'study' },
          { id: 'w2-d7-t3', section: 'dsa', topicId: 'monotonic-stack', title: 'Monotonic Stack — largest rectangle in histogram, stock span', estimatedMinutes: 60, type: 'practice' },
          { id: 'w2-d7-t4', section: 'dsa', topicId: 'binary-search', title: 'Review binary search + hashmap patterns', estimatedMinutes: 60, type: 'review' },
        ],
      },
    ],
  },

  // ===== WEEK 3 — DSA Lists & Trees + SD Foundations (API, Networking) =====
  {
    week: 3,
    theme: 'DSA Lists & Trees + SD Foundations (API, Networking)',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w3-d1-t1', section: 'dsa', topicId: 'linked-list', title: 'Linked List — reverse, detect cycle, merge two sorted lists', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w3-d2-t1', section: 'system-design', topicId: 'api-design', title: 'API Design — REST principles, versioning, pagination, rate limiting, idempotency', estimatedMinutes: 45, type: 'study' },
          { id: 'w3-d2-t2', section: 'system-design', topicId: 'networking-basics', title: 'Networking Basics — TCP/UDP, HTTP/HTTPS, WebSockets, DNS resolution, TLS', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w3-d3-t1', section: 'dsa', topicId: 'linked-list', title: 'Linked List — remove Nth from end, copy with random pointer, LRU basics', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w3-d4-t1', section: 'golang', topicId: 'context-package', title: 'Context package — cancellation, timeouts, value propagation', estimatedMinutes: 45, type: 'study' },
          { id: 'w3-d4-t2', section: 'golang', topicId: 'concurrency-patterns', title: 'Concurrency patterns — fan-in/fan-out, worker pools, pipeline', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w3-d5-t1', section: 'dsa', topicId: 'tree-bfs-dfs', title: 'Tree BFS/DFS — level order, max depth, invert binary tree', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w3-d6-t1', section: 'dsa', topicId: 'tree-bfs-dfs', title: 'Tree DFS — validate BST, lowest common ancestor, path sum', estimatedMinutes: 60, type: 'practice' },
          { id: 'w3-d6-t2', section: 'system-design', topicId: 'microservices-patterns', title: 'Microservices Patterns — service discovery, API gateway, saga, circuit breaker, sidecar', estimatedMinutes: 75, type: 'study' },
          { id: 'w3-d6-t3', section: 'dsa', topicId: 'heap-top-k', title: 'Heap/Top-K — kth largest element, merge K sorted lists, top K frequent words', estimatedMinutes: 60, type: 'practice' },
          { id: 'w3-d6-t4', section: 'golang', topicId: 'channels', title: 'Advanced channels — fan-in multiplexer, timeout patterns, done channel', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w3-d7-t1', section: 'system-design', topicId: 'data-partitioning', title: 'Data Partitioning — horizontal/vertical, range vs hash, rebalancing, hot spots', estimatedMinutes: 75, type: 'study' },
          { id: 'w3-d7-t2', section: 'system-design', topicId: 'message-queues-in-sd', title: 'Message Queues in SD — async processing, pub/sub, point-to-point, backpressure, delivery guarantees', estimatedMinutes: 75, type: 'study' },
          { id: 'w3-d7-t3', section: 'dsa', topicId: 'heap-top-k', title: 'Heap — find median from data stream, task scheduler, reorganize string', estimatedMinutes: 60, type: 'practice' },
          { id: 'w3-d7-t4', section: 'dsa', topicId: 'tree-bfs-dfs', title: 'Review trees + linked list — serialize/deserialize, zigzag traversal', estimatedMinutes: 60, type: 'review' },
        ],
      },
    ],
  },

  // ===== WEEK 4 — DSA Graphs + Caching Intro + First HLD Problems =====
  {
    week: 4,
    theme: 'DSA Graphs + Caching Intro + First HLD Problems',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w4-d1-t1', section: 'dsa', topicId: 'graph-bfs-dfs', title: 'Graph BFS/DFS — number of islands, clone graph, flood fill', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w4-d2-t1', section: 'caching', topicId: 'caching-basics', title: 'Caching fundamentals — why cache, cache hit/miss, latency hierarchy', estimatedMinutes: 45, type: 'study' },
          { id: 'w4-d2-t2', section: 'caching', topicId: 'caching-strategies', title: 'Caching strategies — write-through, write-back, write-around, read-through', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w4-d3-t1', section: 'dsa', topicId: 'graph-bfs-dfs', title: 'Graph — rotting oranges, course schedule, pacific atlantic water flow', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w4-d4-t1', section: 'caching', topicId: 'eviction-policies', title: 'Eviction policies — LRU, LFU, FIFO, TTL-based expiration', estimatedMinutes: 45, type: 'study' },
          { id: 'w4-d4-t2', section: 'caching', topicId: 'redis-architecture', title: 'Redis architecture — single-threaded model, persistence (RDB/AOF), replication', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w4-d5-t1', section: 'dsa', topicId: 'backtracking', title: 'Backtracking — permutations, combinations, subsets', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w4-d6-t1', section: 'system-design', topicId: 'url-shortener', title: 'URL Shortener — requirements, hashing, base62 encoding, DB design, caching', estimatedMinutes: 90, type: 'study' },
          { id: 'w4-d6-t2', section: 'system-design', topicId: 'rate-limiter', title: 'Rate Limiter — token bucket, sliding window, distributed rate limiting, Redis-based', estimatedMinutes: 75, type: 'study' },
          { id: 'w4-d6-t3', section: 'dsa', topicId: 'backtracking', title: 'Backtracking — N-Queens, word search, palindrome partitioning', estimatedMinutes: 60, type: 'practice' },
          { id: 'w4-d6-t4', section: 'caching', topicId: 'caching-basics', title: 'Review caching fundamentals — when to cache, trade-offs', estimatedMinutes: 45, type: 'review' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w4-d7-t1', section: 'system-design', topicId: 'lru-cache', title: 'LRU Cache design — data structures, O(1) get/put, system-level caching', estimatedMinutes: 75, type: 'study' },
          { id: 'w4-d7-t2', section: 'golang', topicId: 'gorm-basics', title: 'GORM basics — models, AutoMigrate, CRUD operations, hooks', estimatedMinutes: 60, type: 'study' },
          { id: 'w4-d7-t3', section: 'dsa', topicId: 'graph-bfs-dfs', title: 'Review graphs + backtracking — mixed problem set', estimatedMinutes: 60, type: 'review' },
          { id: 'w4-d7-t4', section: 'dsa', topicId: 'linked-list', title: 'Week 1-4 DSA Tier 1 review — mixed problem set', estimatedMinutes: 60, type: 'review' },
        ],
      },
    ],
  },

  // ===== WEEK 5 — DP Foundations + Redis Deep Dive + HLD Problems =====
  {
    week: 5,
    theme: 'DP Foundations + Redis Deep Dive + HLD Problems',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w5-d1-t1', section: 'dsa', topicId: 'dp-1d', title: 'DP 1D — climbing stairs, house robber, coin change', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w5-d2-t1', section: 'caching', topicId: 'redis-data-structures', title: 'Redis data structures — strings, lists, sets, sorted sets, hashes, streams', estimatedMinutes: 45, type: 'study' },
          { id: 'w5-d2-t2', section: 'caching', topicId: 'redis-commands-hands-on', title: 'Redis hands-on — CLI commands, SET/GET/HSET/ZADD, expiry, pipelining', estimatedMinutes: 45, type: 'practice' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w5-d3-t1', section: 'dsa', topicId: 'dp-1d', title: 'DP 1D — longest increasing subsequence, word break, decode ways', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w5-d4-t1', section: 'queues', topicId: 'message-queue-basics', title: 'Message queue fundamentals — pub/sub, point-to-point, use cases', estimatedMinutes: 45, type: 'study' },
          { id: 'w5-d4-t2', section: 'queues', topicId: 'event-driven-architecture', title: 'Event-driven architecture — event sourcing, CQRS, eventual consistency', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w5-d5-t1', section: 'dsa', topicId: 'dp-2d', title: 'DP 2D — unique paths, minimum path sum, edit distance intro', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w5-d6-t1', section: 'system-design', topicId: 'twitter-news-feed', title: 'Twitter/News Feed — fan-out on write vs read, timeline generation, ranking', estimatedMinutes: 90, type: 'study' },
          { id: 'w5-d6-t2', section: 'system-design', topicId: 'chat-system', title: 'Chat System — WebSocket, message delivery, presence, group chat scaling', estimatedMinutes: 90, type: 'study' },
          { id: 'w5-d6-t3', section: 'caching', topicId: 'redis-pub-sub', title: 'Redis Pub/Sub — publish/subscribe, channels, real-time notifications', estimatedMinutes: 45, type: 'study' },
          { id: 'w5-d6-t4', section: 'dsa', topicId: 'dp-2d', title: 'DP 2D — longest common subsequence, 0/1 knapsack', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w5-d7-t1', section: 'queues', topicId: 'kafka-architecture', title: 'Kafka architecture — brokers, topics, partitions, offsets, consumer groups', estimatedMinutes: 75, type: 'study' },
          { id: 'w5-d7-t2', section: 'caching', topicId: 'cache-patterns', title: 'Cache patterns — cache-aside, read-through, write-behind, refresh-ahead', estimatedMinutes: 60, type: 'study' },
          { id: 'w5-d7-t3', section: 'caching', topicId: 'cache-invalidation', title: 'Cache invalidation — TTL strategies, event-based, versioning, stampede prevention', estimatedMinutes: 60, type: 'study' },
          { id: 'w5-d7-t4', section: 'dsa', topicId: 'dp-1d', title: 'Review DP 1D/2D — identify state, transition, base cases', estimatedMinutes: 60, type: 'review' },
        ],
      },
    ],
  },

  // ===== WEEK 6 — DP & Greedy + Kafka Patterns + Docker =====
  {
    week: 6,
    theme: 'DP & Greedy + Kafka Patterns + Docker',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w6-d1-t1', section: 'dsa', topicId: 'prefix-sum', title: 'Prefix Sum — range sum query, subarray sum, product of array except self', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w6-d2-t1', section: 'queues', topicId: 'kafka-producers', title: 'Kafka producers — acks, retries, idempotence, batching, compression', estimatedMinutes: 45, type: 'study' },
          { id: 'w6-d2-t2', section: 'queues', topicId: 'kafka-consumers', title: 'Kafka consumers — consumer groups, rebalancing, offset management', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w6-d3-t1', section: 'dsa', topicId: 'intervals', title: 'Intervals — merge intervals, insert interval, non-overlapping intervals', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w6-d4-t1', section: 'devops', topicId: 'docker-fundamentals', title: 'Docker fundamentals — images, containers, layers, registries, volumes', estimatedMinutes: 45, type: 'study' },
          { id: 'w6-d4-t2', section: 'devops', topicId: 'dockerfile-best-practices', title: 'Dockerfile best practices — multi-stage builds, caching, security', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w6-d5-t1', section: 'dsa', topicId: 'greedy', title: 'Greedy — jump game, gas station, task scheduler, meeting rooms', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w6-d6-t1', section: 'system-design', topicId: 'notification-system', title: 'Notification System — push/pull, priority, templates, delivery tracking', estimatedMinutes: 90, type: 'study' },
          { id: 'w6-d6-t2', section: 'system-design', topicId: 'youtube-netflix', title: 'YouTube/Netflix — video upload, transcoding pipeline, CDN, adaptive streaming', estimatedMinutes: 90, type: 'study' },
          { id: 'w6-d6-t3', section: 'queues', topicId: 'kafka-setup-hands-on', title: 'Kafka hands-on — local setup, produce/consume messages, consumer groups', estimatedMinutes: 60, type: 'practice' },
          { id: 'w6-d6-t4', section: 'dsa', topicId: 'greedy', title: 'Greedy — partition labels, minimum platforms, activity selection', estimatedMinutes: 45, type: 'practice' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w6-d7-t1', section: 'devops', topicId: 'docker-compose-networking', title: 'Docker Compose — multi-container apps, networking, environment config', estimatedMinutes: 75, type: 'study' },
          { id: 'w6-d7-t2', section: 'caching', topicId: 'redis-performance', title: 'Redis performance — memory optimization, benchmarking, slow log, best practices', estimatedMinutes: 60, type: 'study' },
          { id: 'w6-d7-t3', section: 'dsa', topicId: 'intervals', title: 'Review prefix sum + intervals + greedy patterns', estimatedMinutes: 60, type: 'review' },
          { id: 'w6-d7-t4', section: 'queues', topicId: 'messaging-patterns', title: 'Messaging patterns — request-reply, competing consumers, dead letter queues', estimatedMinutes: 60, type: 'study' },
        ],
      },
    ],
  },

  // ===== WEEK 7 — Advanced DSA + Kafka Production + K8s =====
  {
    week: 7,
    theme: 'Advanced DSA + Kafka Production + K8s',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w7-d1-t1', section: 'dsa', topicId: 'trie', title: 'Trie — implement trie, word search II, auto-complete system', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w7-d2-t1', section: 'queues', topicId: 'ordering-guarantees', title: 'Ordering guarantees — partition key strategy, exactly-once semantics', estimatedMinutes: 45, type: 'study' },
          { id: 'w7-d2-t2', section: 'queues', topicId: 'kafka-production', title: 'Kafka production — monitoring, lag, ISR, partition rebalancing, tuning', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w7-d3-t1', section: 'dsa', topicId: 'union-find', title: 'Union-Find — number of provinces, redundant connection, accounts merge', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w7-d4-t1', section: 'devops', topicId: 'k8s-architecture', title: 'K8s architecture — control plane, nodes, etcd, API server, kubelet', estimatedMinutes: 45, type: 'study' },
          { id: 'w7-d4-t2', section: 'devops', topicId: 'k8s-core-objects', title: 'K8s core objects — Pods, Deployments, Services, ConfigMaps, Secrets', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w7-d5-t1', section: 'dsa', topicId: 'topological-sort', title: 'Topological Sort — course schedule II, alien dictionary, build order', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w7-d6-t1', section: 'system-design', topicId: 'distributed-cache', title: 'Distributed Cache — consistent hashing, replication, eviction at scale', estimatedMinutes: 90, type: 'study' },
          { id: 'w7-d6-t2', section: 'system-design', topicId: 'search-autocomplete', title: 'Search Autocomplete — trie-based, ranking, typeahead, query logging', estimatedMinutes: 75, type: 'study' },
          { id: 'w7-d6-t3', section: 'queues', topicId: 'queue-comparison', title: 'Queue comparison — Kafka vs RabbitMQ vs SQS, when to use which', estimatedMinutes: 60, type: 'study' },
          { id: 'w7-d6-t4', section: 'dsa', topicId: 'trie', title: 'Trie + Union-Find review — design add-and-search-words', estimatedMinutes: 45, type: 'review' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w7-d7-t1', section: 'devops', topicId: 'k8s-networking-ingress', title: 'K8s networking — ClusterIP, NodePort, LoadBalancer, Ingress controllers', estimatedMinutes: 75, type: 'study' },
          { id: 'w7-d7-t2', section: 'devops', topicId: 'k8s-scaling-health', title: 'K8s scaling — HPA, VPA, liveness/readiness probes, resource limits', estimatedMinutes: 60, type: 'study' },
          { id: 'w7-d7-t3', section: 'dsa', topicId: 'topological-sort', title: 'Review topological sort + advanced graph problems', estimatedMinutes: 60, type: 'review' },
          { id: 'w7-d7-t4', section: 'system-design', topicId: 'distributed-cache', title: 'Practice distributed cache design — whiteboard walkthrough', estimatedMinutes: 60, type: 'practice' },
        ],
      },
    ],
  },

  // ===== WEEK 8 — Advanced DSA + AWS Core + DevOps =====
  {
    week: 8,
    theme: 'Advanced DSA + AWS Core + DevOps',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w8-d1-t1', section: 'dsa', topicId: 'bit-manipulation', title: 'Bit Manipulation — single number, counting bits, power of two, hamming distance', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w8-d2-t1', section: 'aws', topicId: 'ec2', title: 'EC2 — instance types, AMIs, security groups, placement groups, auto-scaling', estimatedMinutes: 45, type: 'study' },
          { id: 'w8-d2-t2', section: 'aws', topicId: 'lambda', title: 'Lambda — cold starts, triggers, layers, concurrency, pricing model', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w8-d3-t1', section: 'dsa', topicId: 'dp-strings', title: 'DP Strings — longest palindromic substring, regular expression matching', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w8-d4-t1', section: 'devops', topicId: 'dns-internet', title: 'DNS & Internet — DNS resolution, TCP/IP, TLS handshake, HTTP/2', estimatedMinutes: 45, type: 'study' },
          { id: 'w8-d4-t2', section: 'devops', topicId: 'request-lifecycle', title: 'Request lifecycle — browser to server, proxy, load balancer, app server', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w8-d5-t1', section: 'dsa', topicId: 'graph-advanced', title: 'Graph Advanced — Dijkstra, shortest path, network delay time', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w8-d6-t1', section: 'system-design', topicId: 'web-crawler', title: 'Web Crawler — URL frontier, politeness, dedup, distributed crawling', estimatedMinutes: 90, type: 'study' },
          { id: 'w8-d6-t2', section: 'system-design', topicId: 'google-drive', title: 'Google Drive — file sync, conflict resolution, chunking, metadata service', estimatedMinutes: 90, type: 'study' },
          { id: 'w8-d6-t3', section: 'aws', topicId: 's3', title: 'S3 — storage classes, lifecycle policies, versioning, cross-region replication', estimatedMinutes: 60, type: 'study' },
          { id: 'w8-d6-t4', section: 'aws', topicId: 'rds', title: 'RDS — multi-AZ, read replicas, backup/restore, parameter groups', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w8-d7-t1', section: 'aws', topicId: 'aurora', title: 'Aurora — architecture, storage, serverless, global database', estimatedMinutes: 60, type: 'study' },
          { id: 'w8-d7-t2', section: 'aws', topicId: 'dynamodb', title: 'DynamoDB — partition keys, GSI/LSI, capacity modes, DynamoDB Streams', estimatedMinutes: 75, type: 'study' },
          { id: 'w8-d7-t3', section: 'dsa', topicId: 'graph-advanced', title: 'Graph Advanced — Bellman-Ford, minimum spanning tree, cheapest flights', estimatedMinutes: 60, type: 'practice' },
          { id: 'w8-d7-t4', section: 'dsa', topicId: 'dp-strings', title: 'Review bit manipulation + DP strings + advanced graphs', estimatedMinutes: 60, type: 'review' },
        ],
      },
    ],
  },

  // ===== WEEK 9 — Design Problems + AWS Networking + Observability Start =====
  {
    week: 9,
    theme: 'Design Problems + AWS Networking + Observability Start',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w9-d1-t1', section: 'dsa', topicId: 'design-oop', title: 'Design/OOP — implement LRU cache, min stack, design HashMap', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w9-d2-t1', section: 'aws', topicId: 'vpc', title: 'VPC — subnets, route tables, NAT gateway, security groups vs NACLs', estimatedMinutes: 45, type: 'study' },
          { id: 'w9-d2-t2', section: 'aws', topicId: 'route53', title: 'Route 53 — routing policies, health checks, DNS failover', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w9-d3-t1', section: 'dsa', topicId: 'design-oop', title: 'Design/OOP — implement iterator, serialize/deserialize, design Twitter', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w9-d4-t1', section: 'devops', topicId: 'cdn-caching', title: 'CDN & Caching — edge servers, cache headers, invalidation, CloudFront', estimatedMinutes: 45, type: 'study' },
          { id: 'w9-d4-t2', section: 'devops', topicId: 'load-balancing', title: 'Load Balancing — L4 vs L7, algorithms, health checks, sticky sessions', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w9-d5-t1', section: 'dsa', topicId: 'heap-top-k', title: 'DSA mixed practice — heap, graph, DP problems timed', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w9-d6-t1', section: 'system-design', topicId: 'uber-lyft', title: 'Uber/Lyft — location service, matching, ETA, surge pricing, geospatial indexing', estimatedMinutes: 90, type: 'study' },
          { id: 'w9-d6-t2', section: 'system-design', topicId: 'payment-system', title: 'Payment System — idempotency, ledger, reconciliation, fraud detection', estimatedMinutes: 90, type: 'study' },
          { id: 'w9-d6-t3', section: 'aws', topicId: 'cloudfront', title: 'CloudFront — distributions, origins, behaviors, signed URLs, Lambda@Edge', estimatedMinutes: 45, type: 'study' },
          { id: 'w9-d6-t4', section: 'observability', topicId: 'golden-signals', title: 'Golden Signals — latency, traffic, errors, saturation for monitoring', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w9-d7-t1', section: 'aws', topicId: 'iam', title: 'IAM — policies, roles, cross-account access, least privilege, STS', estimatedMinutes: 60, type: 'study' },
          { id: 'w9-d7-t2', section: 'devops', topicId: 'api-gateway-reverse-proxy', title: 'API Gateway & Reverse Proxy — Nginx, Kong, rate limiting, auth offloading', estimatedMinutes: 60, type: 'study' },
          { id: 'w9-d7-t3', section: 'devops', topicId: 'pipeline-design', title: 'CI/CD pipeline design — stages, artifacts, rollback, GitOps principles', estimatedMinutes: 60, type: 'study' },
          { id: 'w9-d7-t4', section: 'observability', topicId: 'red-use-methods', title: 'RED/USE methods — Rate-Errors-Duration, Utilization-Saturation-Errors', estimatedMinutes: 45, type: 'study' },
        ],
      },
    ],
  },

  // ===== WEEK 10 — SD Finals + AWS Messaging + Observability =====
  {
    week: 10,
    theme: 'SD Finals + AWS Messaging + Observability',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w10-d1-t1', section: 'dsa', topicId: 'dp-1d', title: 'DSA timed practice — 2 medium problems in 45 min', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w10-d2-t1', section: 'aws', topicId: 'sqs', title: 'SQS — standard vs FIFO, visibility timeout, dead letter queues, long polling', estimatedMinutes: 45, type: 'study' },
          { id: 'w10-d2-t2', section: 'aws', topicId: 'sns', title: 'SNS — topics, subscriptions, fan-out pattern, message filtering', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w10-d3-t1', section: 'dsa', topicId: 'backtracking', title: 'DSA timed practice — 1 medium + 1 hard in 50 min', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w10-d4-t1', section: 'observability', topicId: 'prometheus-grafana', title: 'Prometheus + Grafana — metrics collection, PromQL, dashboards, alerting', estimatedMinutes: 45, type: 'study' },
          { id: 'w10-d4-t2', section: 'observability', topicId: 'structured-logging', title: 'Structured logging — JSON logs, correlation IDs, log levels, context', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w10-d5-t1', section: 'dsa', topicId: 'graph-bfs-dfs', title: 'DSA timed practice — graph + tree problems in 45 min', estimatedMinutes: 60, type: 'practice' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w10-d6-t1', section: 'system-design', topicId: 'distributed-message-queue', title: 'Distributed Message Queue — partitioning, replication, delivery guarantees', estimatedMinutes: 90, type: 'study' },
          { id: 'w10-d6-t2', section: 'system-design', topicId: 'ticket-booking', title: 'Ticket Booking — seat locking, concurrency, payment flow, overbooking prevention', estimatedMinutes: 75, type: 'study' },
          { id: 'w10-d6-t3', section: 'aws', topicId: 'eventbridge', title: 'EventBridge — event buses, rules, targets, schema registry, event patterns', estimatedMinutes: 45, type: 'study' },
          { id: 'w10-d6-t4', section: 'aws', topicId: 'cloudwatch', title: 'CloudWatch — metrics, logs, alarms, dashboards, custom metrics, Log Insights', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w10-d7-t1', section: 'system-design', topicId: 'parking-lot', title: 'Parking Lot LLD — OOP design, classes, state machine, payment', estimatedMinutes: 75, type: 'study' },
          { id: 'w10-d7-t2', section: 'system-design', topicId: 'key-value-store', title: 'Key-Value Store — LSM trees, SSTables, compaction, bloom filters, replication', estimatedMinutes: 75, type: 'study' },
          { id: 'w10-d7-t3', section: 'observability', topicId: 'elk-stack', title: 'ELK Stack — Elasticsearch, Logstash, Kibana, log aggregation pipeline', estimatedMinutes: 60, type: 'study' },
          { id: 'w10-d7-t4', section: 'observability', topicId: 'distributed-tracing', title: 'Distributed tracing — OpenTelemetry, Jaeger, span context, trace propagation', estimatedMinutes: 60, type: 'study' },
        ],
      },
    ],
  },

  // ===== WEEK 11 — Mock Week 1 =====
  {
    week: 11,
    theme: 'Mock Week 1',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w11-d1-t1', section: 'dsa', topicId: 'two-pointers', title: 'Timed DSA mock — 2 problems in 40 min (arrays/strings)', estimatedMinutes: 60, type: 'mock' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w11-d2-t1', section: 'system-design', topicId: 'twitter-news-feed', title: 'SD mock — design a social media feed from scratch, 45 min', estimatedMinutes: 60, type: 'mock' },
          { id: 'w11-d2-t2', section: 'golang', topicId: 'testing-go', title: 'Go testing — table-driven tests, mocks, benchmarks, test coverage', estimatedMinutes: 30, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w11-d3-t1', section: 'dsa', topicId: 'tree-bfs-dfs', title: 'Timed DSA mock — 2 problems in 40 min (trees/graphs)', estimatedMinutes: 60, type: 'mock' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w11-d4-t1', section: 'golang', topicId: 'project-structure', title: 'Go project structure — clean architecture, dependency injection, modules', estimatedMinutes: 45, type: 'study' },
          { id: 'w11-d4-t2', section: 'golang', topicId: 'testing-go', title: 'Go testing practice — write tests for a REST API handler', estimatedMinutes: 45, type: 'practice' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w11-d5-t1', section: 'dsa', topicId: 'dp-1d', title: 'Timed DSA mock — 1 medium + 1 hard in 50 min (DP focus)', estimatedMinutes: 60, type: 'mock' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w11-d6-t1', section: 'system-design', topicId: 'chat-system', title: 'SD mock — design a real-time chat system, 45 min timed', estimatedMinutes: 60, type: 'mock' },
          { id: 'w11-d6-t2', section: 'observability', topicId: 'cloudwatch-logs', title: 'CloudWatch Logs — log groups, metric filters, Logs Insights queries', estimatedMinutes: 60, type: 'study' },
          { id: 'w11-d6-t3', section: 'observability', topicId: 'frontend-performance', title: 'Frontend performance — Core Web Vitals, LCP, FID, CLS, lighthouse', estimatedMinutes: 45, type: 'study' },
          { id: 'w11-d6-t4', section: 'aws', topicId: 'ecs', title: 'ECS — task definitions, services, Fargate vs EC2, service discovery', estimatedMinutes: 60, type: 'study' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w11-d7-t1', section: 'observability', topicId: 'backend-profiling', title: 'Backend profiling — pprof, flame graphs, memory/CPU profiling in Go', estimatedMinutes: 60, type: 'study' },
          { id: 'w11-d7-t2', section: 'observability', topicId: 'database-performance', title: 'Database performance — slow query analysis, EXPLAIN plans, index tuning', estimatedMinutes: 60, type: 'study' },
          { id: 'w11-d7-t3', section: 'devops', topicId: 'blue-green-canary', title: 'Blue-green & canary deployments — strategies, rollback, feature flags', estimatedMinutes: 60, type: 'study' },
          { id: 'w11-d7-t4', section: 'aws', topicId: 'elasticache', title: 'ElastiCache — Redis vs Memcached, cluster mode, failover, sizing', estimatedMinutes: 60, type: 'study' },
        ],
      },
    ],
  },

  // ===== WEEK 12 — Mock Week 2 + Final Review =====
  {
    week: 12,
    theme: 'Mock Week 2 + Final Review',
    days: [
      {
        day: 1,
        dayLabel: 'Monday',
        tasks: [
          { id: 'w12-d1-t1', section: 'dsa', topicId: 'binary-search', title: 'Full DSA mock — 3 problems in 60 min (mixed difficulty)', estimatedMinutes: 60, type: 'mock' },
        ],
      },
      {
        day: 2,
        dayLabel: 'Tuesday',
        tasks: [
          { id: 'w12-d2-t1', section: 'system-design', topicId: 'uber-lyft', title: 'SD mock — design a ride-sharing service, 45 min timed', estimatedMinutes: 60, type: 'mock' },
          { id: 'w12-d2-t2', section: 'observability', topicId: 'sli-slo-sla', title: 'SLI/SLO/SLA — defining indicators, error budgets, alerting thresholds', estimatedMinutes: 30, type: 'study' },
        ],
      },
      {
        day: 3,
        dayLabel: 'Wednesday',
        tasks: [
          { id: 'w12-d3-t1', section: 'dsa', topicId: 'graph-bfs-dfs', title: 'Full DSA mock — 3 problems in 60 min (graphs + DP)', estimatedMinutes: 60, type: 'mock' },
        ],
      },
      {
        day: 4,
        dayLabel: 'Thursday',
        tasks: [
          { id: 'w12-d4-t1', section: 'golang', topicId: 'concurrency-patterns', title: 'Go mock — implement concurrent pipeline with error handling, 30 min', estimatedMinutes: 45, type: 'mock' },
          { id: 'w12-d4-t2', section: 'aws', topicId: 'api-gateway', title: 'API Gateway — REST vs HTTP APIs, Lambda integration, throttling, caching', estimatedMinutes: 45, type: 'study' },
        ],
      },
      {
        day: 5,
        dayLabel: 'Friday',
        tasks: [
          { id: 'w12-d5-t1', section: 'dsa', topicId: 'heap-top-k', title: 'Full DSA mock — 3 problems in 60 min (final simulation)', estimatedMinutes: 60, type: 'mock' },
        ],
      },
      {
        day: 6,
        dayLabel: 'Saturday',
        tasks: [
          { id: 'w12-d6-t1', section: 'system-design', topicId: 'payment-system', title: 'SD mock — design a payment platform, full 45 min simulation', estimatedMinutes: 60, type: 'mock' },
          { id: 'w12-d6-t2', section: 'system-design', topicId: 'distributed-message-queue', title: 'SD review — revisit distributed systems concepts, CAP theorem, consistency', estimatedMinutes: 60, type: 'review' },
          { id: 'w12-d6-t3', section: 'golang', topicId: 'project-structure', title: 'Go review — clean architecture patterns, dependency injection recap', estimatedMinutes: 45, type: 'review' },
          { id: 'w12-d6-t4', section: 'aws', topicId: 'vpc', title: 'AWS review — VPC networking, security architecture, well-architected pillars', estimatedMinutes: 60, type: 'review' },
        ],
      },
      {
        day: 7,
        dayLabel: 'Sunday',
        tasks: [
          { id: 'w12-d7-t1', section: 'dsa', topicId: 'dp-2d', title: 'Final DSA review — weak areas, top 10 hardest problems redo', estimatedMinutes: 75, type: 'review' },
          { id: 'w12-d7-t2', section: 'system-design', topicId: 'key-value-store', title: 'Final SD review — design principles, trade-offs cheat sheet', estimatedMinutes: 75, type: 'review' },
          { id: 'w12-d7-t3', section: 'devops', topicId: 'pipeline-design', title: 'Final DevOps/AWS review — architecture patterns, common interview questions', estimatedMinutes: 60, type: 'review' },
          { id: 'w12-d7-t4', section: 'caching', topicId: 'cache-patterns', title: 'Final review — caching + queues + observability key concepts', estimatedMinutes: 45, type: 'review' },
        ],
      },
    ],
  },
];
