var e=[{id:"caching-basics",title:"Caching Fundamentals",category:"fundamentals",order:1,explanation:`Caching is storing copies of frequently accessed data in a faster storage layer so future requests can be served quicker. The cache sits between the consumer and the source of truth (usually a database or remote API). When a request hits the cache and finds the data, it is a cache hit; when the data is missing, it is a cache miss and the system falls through to the origin, fetching the data and typically storing it in the cache for next time.

A cold start happens when a cache is empty (after a deploy or restart) and every request is a miss, causing a temporary spike in origin load. TTL (Time To Live) defines how long a cached entry is valid before it expires and must be refreshed. Short TTLs keep data fresh but increase origin load; long TTLs reduce load but risk serving stale data.

Cache invalidation is famously one of the two hard problems in computer science (along with naming things). The difficulty lies in knowing exactly when cached data becomes stale. If you invalidate too aggressively, you lose the benefit of caching. If you invalidate too lazily, users see outdated data. There is no universal solution; the right strategy depends on how often data changes, how much staleness is tolerable, and how many cache nodes need coordinating.`,useCases:[{title:"Database Query Cache",scenario:"An e-commerce product page makes the same SELECT query thousands of times per second. The product details change only when an admin updates them.",implementation:`# Pseudo-code: cache-aside pattern
key = "product:42"
result = cache.get(key)
if result is None:
    result = db.query("SELECT * FROM products WHERE id = 42")
    cache.set(key, result, ttl=300)  # 5 minutes
return result

# On product update, invalidate:
cache.delete("product:42")`},{title:"API Response Cache",scenario:"A weather API is rate-limited to 100 calls/hour but your app gets 10,000 requests/hour for weather data. Cache the upstream response.",implementation:`# Using Redis as a cache layer
GET weather:london
# => nil (cache miss)

# Fetch from upstream API, then cache
SET weather:london '{"temp":15,"humidity":72}' EX 600
# Cached for 10 minutes

# Next 10,000 requests in 10 min:
GET weather:london
# => {"temp":15,"humidity":72} (cache hit)`}],keyCommands:[{command:"SET key value EX seconds",description:"Store a value with a TTL (expiration in seconds)"},{command:"GET key",description:"Retrieve a cached value (returns nil on miss)"},{command:"DEL key",description:"Explicitly invalidate a cached entry"},{command:"TTL key",description:"Check remaining time-to-live for a key (-1 = no expiry, -2 = expired/missing)"},{command:"EXISTS key",description:"Check if a key exists without fetching the value"}],bestPractices:["Always set a TTL on cached entries to prevent stale data from living forever","Monitor cache hit ratio (aim for >90%); a low ratio means your caching strategy needs tuning","Plan for cold starts: use cache warming for critical paths during deployment","Never cache sensitive data (passwords, tokens) without encryption and short TTLs","Use consistent key naming conventions like entity:id:field (e.g., user:42:profile)"],interviewQuestions:["What is the difference between a cache hit and a cache miss? How do they affect system performance?","Why is cache invalidation considered one of the hardest problems in computer science?","How would you handle a cold start problem when deploying a new cache cluster?","What factors determine the optimal TTL for a cached resource?","Explain the thundering herd problem and how you would mitigate it."],resources:[{label:"AWS Caching Overview",url:"https://aws.amazon.com/caching/"},{label:"Caching Patterns (Microsoft)",url:"https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside"}]},{id:"caching-strategies",title:"Caching Strategies",category:"fundamentals",order:2,explanation:`There are four primary caching strategies, each suited to different access patterns. Cache-Aside (Lazy Loading) is the most common: the application checks the cache first, and on a miss, fetches from the database, stores the result in cache, then returns it. The cache only contains data that has been requested, so memory is used efficiently. The downside is that the first request for any item is always slow (a miss), and if the database is updated outside the application, the cache becomes stale until the TTL expires.

Write-Through writes data to both the cache and the database simultaneously on every write. This ensures the cache is always consistent with the database, eliminating stale reads. The trade-off is higher write latency (two writes per operation) and the fact that the cache may contain data that is never read. Write-Behind (Write-Back) writes to the cache immediately and asynchronously flushes to the database in batches. This gives extremely fast write performance but risks data loss if the cache crashes before the flush.

Read-Through is similar to cache-aside but the cache itself is responsible for loading data from the database on a miss, rather than the application. This simplifies application code because it only interacts with the cache, never the database directly. This pattern is common with cache libraries like Caffeine (Java) or cache providers like AWS DAX (DynamoDB Accelerator).`,useCases:[{title:"Cache-Aside for User Profiles",scenario:"A social media app reads user profiles 100x more than it writes them. Profiles change when users edit settings, which happens rarely.",implementation:`// Go: Cache-aside with Redis
func GetUserProfile(ctx context.Context, userID int64) (*Profile, error) {
    key := fmt.Sprintf("user:%d:profile", userID)

    // 1. Check cache
    cached, err := redisClient.Get(ctx, key).Result()
    if err == nil {
        var p Profile
        json.Unmarshal([]byte(cached), &p)
        return &p, nil
    }

    // 2. Cache miss -> query DB
    p, err := db.GetProfile(userID)
    if err != nil { return nil, err }

    // 3. Populate cache
    data, _ := json.Marshal(p)
    redisClient.Set(ctx, key, data, 15*time.Minute)
    return p, nil
}`},{title:"Write-Through for Inventory Counts",scenario:"An e-commerce platform needs real-time accurate inventory. Every purchase must update both cache and DB to prevent overselling.",implementation:`// Write-through: update DB and cache atomically
func DecrementStock(ctx context.Context, productID int64, qty int) error {
    // 1. Update database (source of truth)
    err := db.Exec("UPDATE inventory SET stock = stock - ? WHERE product_id = ?", qty, productID)
    if err != nil { return err }

    // 2. Update cache to match
    key := fmt.Sprintf("inventory:%d", productID)
    newStock, _ := db.GetStock(productID)
    redisClient.Set(ctx, key, newStock, 1*time.Hour)
    return nil
}`},{title:"Write-Behind for Analytics Events",scenario:"A high-traffic analytics service ingests 50K events/second. Writing each event to the database individually would overwhelm it.",implementation:`# Write-behind: buffer in Redis, flush to DB in batches
# On each event:
LPUSH analytics:buffer '{"event":"page_view","user":42,"ts":1700000000}'

# Background worker (every 5 seconds):
events = LRANGE analytics:buffer 0 999
# Batch INSERT into database
LTRIM analytics:buffer 1000 -1

# Result: 50K writes/sec to Redis (fast)
#         10 batch inserts/sec to DB (manageable)`}],keyCommands:[{command:"SET key value EX ttl",description:"Write-through / cache-aside: store value with expiry"},{command:"GET key",description:"Cache-aside: check cache before hitting DB"},{command:"LPUSH / LRANGE / LTRIM",description:"Write-behind: buffer writes in a Redis list, flush in batches"},{command:"SETEX key seconds value",description:"Atomic set-with-expiry, common in read-through implementations"}],bestPractices:["Use cache-aside for read-heavy workloads where occasional staleness is acceptable","Use write-through when cache consistency is critical (e.g., inventory, account balances)","Use write-behind only when you can tolerate potential data loss on cache failure","Combine strategies: cache-aside for reads + write-through for writes gives best consistency","For read-through, ensure the cache library handles dog-piling (concurrent misses for the same key)","Always have a fallback path: if cache is down, the system should degrade to hitting the database directly"],interviewQuestions:["Compare cache-aside and read-through. When would you choose one over the other?","What are the risks of write-behind caching? How would you mitigate data loss?","Design a caching strategy for a product catalog that is read 1000x more than updated.","How does write-through caching affect write latency? When is that trade-off acceptable?"],resources:[{label:"Caching Strategies and How to Choose the Right One",url:"https://codeahoy.com/2017/08/11/caching-strategies-and-how-to-choose-the-right-one/"},{label:"AWS ElastiCache Caching Strategies",url:"https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html"}]},{id:"eviction-policies",title:"Eviction Policies",category:"fundamentals",order:3,explanation:`When a cache reaches its memory limit, it must decide which entries to remove to make space for new ones. This decision is governed by eviction policies. LRU (Least Recently Used) removes the entry that has not been accessed for the longest time. It works well for most workloads because recently accessed data is likely to be accessed again. Redis uses an approximated LRU by default: it samples a configurable number of keys and evicts the least recently used among the sample, which is nearly as effective as true LRU but much more memory-efficient.

LFU (Least Frequently Used) removes the entry that has been accessed the fewest times. It is better than LRU for workloads with a stable set of hot keys because it keeps frequently accessed items even if they have not been touched in the last few seconds. Redis introduced LFU in version 4.0. FIFO (First In, First Out) removes the oldest entry regardless of access pattern. It is simple but rarely optimal. Random eviction picks a random key to remove, which is surprisingly effective in some workloads because it avoids the overhead of tracking access patterns.

TTL-based eviction removes keys based on their expiration time. In Redis, you can configure maxmemory-policy to volatile-ttl, which evicts keys with the shortest remaining TTL first among keys that have an expiry set. Choosing the right policy depends on your workload: LRU for general-purpose, LFU for stable hot-key sets, volatile-ttl when you want to keep persistent keys and only evict expiring ones.`,useCases:[{title:"LRU for Session Store",scenario:"A web app stores user sessions in Redis. Active users access their sessions frequently; inactive sessions should be evicted first when memory is tight.",implementation:`# Configure Redis for LRU eviction
# redis.conf:
maxmemory 2gb
maxmemory-policy allkeys-lru

# Or at runtime:
CONFIG SET maxmemory 2gb
CONFIG SET maxmemory-policy allkeys-lru

# Sessions are SET with TTL for safety,
# but LRU ensures least-recently-active sessions
# are evicted first under memory pressure.
SET session:abc123 '{"user_id":42}' EX 3600`},{title:"LFU for Content Delivery",scenario:"A news site caches article content. Trending articles are read millions of times; the long tail of old articles should be evicted first.",implementation:`# LFU keeps frequently accessed (trending) articles
CONFIG SET maxmemory-policy allkeys-lfu

# Trending article: accessed 10,000 times
GET article:breaking-news-123  # frequency counter: 10000

# Old article: accessed 3 times last month
GET article:archive-2023-456   # frequency counter: 3

# Under memory pressure, archive-2023-456 is evicted first
# even if it was accessed more recently than the trending one.

# Check object frequency:
OBJECT FREQ article:breaking-news-123
# => (integer) 255  (log-scaled counter, max 255)`}],keyCommands:[{command:"CONFIG SET maxmemory 2gb",description:"Set the maximum memory limit for the Redis instance"},{command:"CONFIG SET maxmemory-policy allkeys-lru",description:"Set eviction policy (allkeys-lru, volatile-lru, allkeys-lfu, volatile-ttl, noeviction, etc.)"},{command:"OBJECT IDLETIME key",description:"Check how long since a key was last accessed (useful for LRU debugging)"},{command:"OBJECT FREQ key",description:"Check the access frequency counter for a key (LFU mode only)"},{command:"INFO memory",description:"View current memory usage, peak memory, and eviction stats"}],bestPractices:["Use allkeys-lru as the default policy for most workloads; it is safe and effective","Use allkeys-lfu if your workload has a stable set of hot keys that should never be evicted","Use volatile-ttl when mixing persistent keys (no TTL) with expiring cache entries","Set maxmemory-samples to 10+ for better approximation of true LRU/LFU (default is 5)","Never use noeviction in production unless you have a plan to handle OOM errors","Monitor evicted_keys in INFO stats to know when memory pressure is causing evictions"],interviewQuestions:["Explain the difference between LRU and LFU. Give a scenario where LFU outperforms LRU.","How does Redis implement approximate LRU? Why not use true LRU?","What happens when Redis reaches maxmemory and the eviction policy is noeviction?","How would you choose an eviction policy for a mixed workload of session data and cached API responses?","What is the volatile- prefix in Redis eviction policies? When would you use volatile-lru vs allkeys-lru?"],resources:[{label:"Redis Eviction Policies",url:"https://redis.io/docs/reference/eviction/"},{label:"Understanding LRU vs LFU",url:"https://redis.io/blog/lfu-cache-eviction-algorithm/"}]},{id:"redis-architecture",title:"Redis Architecture",category:"redis",order:4,explanation:`Redis is an in-memory data structure store that achieves exceptional performance through a single-threaded event loop architecture. The main thread handles all client commands sequentially, which eliminates the need for locks and context switching. Redis uses I/O multiplexing (epoll on Linux, kqueue on macOS) to handle thousands of concurrent connections on a single thread. A single Redis instance can handle 100,000+ operations per second because in-memory operations complete in microseconds and the event loop eliminates concurrency overhead.

For durability, Redis offers two persistence mechanisms. RDB (Redis Database) creates point-in-time snapshots by forking a child process that writes the dataset to disk. The fork uses copy-on-write, so the parent continues serving requests with minimal impact. RDB is compact and fast to load but can lose data written between snapshots. AOF (Append Only File) logs every write operation. It can be configured to fsync every second (good balance of performance and durability), on every write (safest but slowest), or never (OS decides). AOF files are larger but offer point-in-time recovery.

Redis replication uses an asynchronous leader-follower model. Replicas connect to the primary, receive a full dataset sync (RDB transfer), then receive a continuous stream of write commands. Replicas can serve read traffic to scale read throughput horizontally. Replication is asynchronous by default, meaning a primary acknowledges writes before replicas confirm, so failover can lose the most recent writes. WAIT command can enforce synchronous replication for critical writes.`,useCases:[{title:"Read Replicas for Global App",scenario:"An app serves users in US, EU, and Asia. The primary Redis is in US-East. Read replicas in EU and Asia reduce read latency from 200ms to 5ms.",implementation:`# Primary (US-East) redis.conf:
bind 0.0.0.0
protected-mode no

# Replica (EU-West) redis.conf:
replicaof primary-us-east.example.com 6379
replica-read-only yes

# Application routing:
# Writes -> primary (US-East)
redis_primary.SET("user:42:profile", data)

# Reads -> nearest replica
redis_replica.GET("user:42:profile")

# Monitor replication lag:
INFO replication
# master_repl_offset:1234567
# slave0:ip=10.0.1.5,port=6379,state=online,offset=1234560,lag=1`},{title:"Hybrid Persistence (RDB + AOF)",scenario:"A payment system needs fast restart (RDB) plus no data loss (AOF). Use both together.",implementation:`# redis.conf: enable both persistence modes
save 900 1        # RDB snapshot: every 15 min if >= 1 key changed
save 300 10       # RDB snapshot: every 5 min if >= 10 keys changed
save 60 10000     # RDB snapshot: every 1 min if >= 10000 keys changed

appendonly yes
appendfsync everysec  # AOF: fsync every second (1 sec max data loss)

aof-use-rdb-preamble yes  # Hybrid: AOF file starts with RDB snapshot
                          # for fast loading, then appends AOF tail

# On restart:
# 1. Redis loads the RDB preamble (fast bulk load)
# 2. Replays the AOF tail (recent ops since last RDB)
# 3. Full dataset recovered with <= 1 second data loss`}],keyCommands:[{command:"INFO server",description:"View Redis version, mode (standalone/cluster), and uptime"},{command:"INFO memory",description:"View memory usage, fragmentation ratio, and allocator stats"},{command:"INFO replication",description:"View replication status, connected replicas, and replication lag"},{command:"BGSAVE",description:"Trigger an RDB snapshot in the background"},{command:"BGREWRITEAOF",description:"Rewrite the AOF file to compact it (removes redundant operations)"}],bestPractices:["Use AOF with appendfsync everysec for most production workloads (1 second max data loss)","Enable RDB + AOF together for fast restarts (RDB) with minimal data loss (AOF)","Set maxmemory to 75% of available RAM to leave room for fork(), replication buffers, and OS","Use replica-read-only yes on all replicas to prevent accidental writes","Monitor replication lag: if lag exceeds your SLA, consider WAIT for critical writes"],interviewQuestions:["Why is Redis single-threaded yet so fast? What would you lose with a multi-threaded model?","Compare RDB and AOF persistence. When would you use one vs both?","What happens during a Redis fork for RDB persistence? What is copy-on-write?","Explain the trade-offs of appendfsync always vs everysec vs no.","How does Redis handle replication lag? What is the WAIT command?"],resources:[{label:"Redis Persistence Demystified",url:"https://redis.io/docs/management/persistence/"},{label:"Redis Architecture Overview",url:"https://architecturenotes.co/redis/"}]},{id:"redis-data-structures",title:"Redis Data Structures",category:"redis",order:5,explanation:`Redis is not just a key-value store; it is a data structure server. Each value can be a rich type: Strings are the simplest, storing text, numbers, or serialized objects up to 512MB. Lists are ordered sequences implemented as linked lists, ideal for queues, activity feeds, and recent-items lists. Sets are unordered collections of unique strings, perfect for tags, unique visitors, and set operations (union, intersection, difference). Hashes map string fields to string values, like a mini key-value store within a key, ideal for representing objects.

Sorted Sets (ZSETs) are the most powerful structure: each member has a score, and the set is always sorted by score. This enables leaderboards, priority queues, time-series indexes, and rate limiting with O(log N) insert and O(log N) range queries. Streams are an append-only log with consumer groups, designed for event sourcing and message brokering. They are like Kafka topics within Redis.

HyperLogLog is a probabilistic structure that estimates the cardinality (count of unique elements) of a set using only 12KB of memory regardless of the number of elements, with a standard error of 0.81%. Use it for counting unique visitors, unique search queries, or unique IPs. Bitmaps let you perform bit-level operations on strings, enabling efficient storage for boolean flags across millions of users (e.g., daily active users, feature flags).`,useCases:[{title:"Leaderboard with Sorted Sets",scenario:"A gaming platform needs a real-time leaderboard for 1M players, with instant rank lookups and top-N queries.",implementation:`# Add/update player scores
ZADD leaderboard 1500 "player:alice"
ZADD leaderboard 2300 "player:bob"
ZADD leaderboard 1800 "player:charlie"

# Get top 10 players with scores
ZREVRANGE leaderboard 0 9 WITHSCORES
# 1) "player:bob"      2) "2300"
# 3) "player:charlie"  4) "1800"
# 5) "player:alice"    6) "1500"

# Get a specific player's rank (0-indexed)
ZREVRANK leaderboard "player:charlie"
# => 1  (2nd place)

# Increment score atomically
ZINCRBY leaderboard 500 "player:alice"
# alice now at 2000, re-sorted automatically`},{title:"Unique Visitor Counting with HyperLogLog",scenario:"Track unique visitors per page per day across a site with 100M daily pageviews. Exact counting would need gigabytes; HyperLogLog uses 12KB per counter.",implementation:`# Add visitor IDs to the daily HyperLogLog counter
PFADD pageviews:homepage:2025-01-15 "user:42"
PFADD pageviews:homepage:2025-01-15 "user:99"
PFADD pageviews:homepage:2025-01-15 "user:42"  # duplicate, ignored

# Count unique visitors
PFCOUNT pageviews:homepage:2025-01-15
# => 2

# Merge multiple days for weekly unique count
PFMERGE pageviews:homepage:week3 \\
  pageviews:homepage:2025-01-15 \\
  pageviews:homepage:2025-01-16 \\
  pageviews:homepage:2025-01-17

# Memory: 12KB per counter regardless of cardinality
# 1000 pages * 365 days = ~4.3MB total`},{title:"User Object with Hashes",scenario:"Store user profile data as a Hash instead of serialized JSON. Update individual fields without reading/writing the entire object.",implementation:`# Store user as a Hash
HSET user:42 name "Alice" email "alice@example.com" \\
  plan "pro" login_count 157 last_login "2025-01-15"

# Get a single field (fast, no deserialization)
HGET user:42 plan
# => "pro"

# Increment a counter field atomically
HINCRBY user:42 login_count 1
# => 158

# Get all fields
HGETALL user:42
# name => Alice, email => alice@example.com, ...

# vs. String approach (slower for partial updates):
# GET user:42 -> deserialize JSON -> modify -> serialize -> SET`}],keyCommands:[{command:"ZADD / ZREVRANGE / ZRANK",description:"Sorted Set: add scored members, get top-N, get rank"},{command:"HSET / HGET / HGETALL / HINCRBY",description:"Hash: set/get fields, increment numeric fields"},{command:"LPUSH / RPUSH / LPOP / LRANGE",description:"List: push/pop from either end, range query"},{command:"SADD / SMEMBERS / SINTER / SUNION",description:"Set: add members, list all, intersection, union"},{command:"PFADD / PFCOUNT / PFMERGE",description:"HyperLogLog: add elements, count uniques, merge counters"}],bestPractices:["Use Hashes for objects instead of serialized JSON strings when you need partial field updates","Use Sorted Sets over Lists when you need ordering by a custom score, not just insertion order","Use HyperLogLog for approximate counting to save memory (12KB vs gigabytes for exact sets)","Use Sets for tag systems and social graph features (friends-in-common = SINTER)","Choose the right structure: wrong choice leads to O(N) where O(log N) or O(1) is possible"],interviewQuestions:["What data structure would you use for a real-time leaderboard? Why Sorted Sets over a relational DB?","When would you use a Hash vs a serialized JSON String in Redis?","How does HyperLogLog count unique elements with only 12KB of memory? What is the accuracy trade-off?","Explain the time complexity of ZADD, ZRANK, and ZREVRANGE.","How would you implement a social media feed using Redis Lists vs Sorted Sets?"],resources:[{label:"Redis Data Types Tutorial",url:"https://redis.io/docs/data-types/tutorial/"},{label:"Redis Commands Reference",url:"https://redis.io/commands/"}]},{id:"redis-commands-hands-on",title:"Redis Hands-On",category:"redis",order:6,explanation:`Getting hands-on with Redis is essential for interview readiness. You can run Redis locally using Docker with a single command: docker run -d --name redis -p 6379:6379 redis:latest. Then connect with redis-cli to explore commands interactively. Understanding pipelining is critical for performance: instead of sending commands one at a time (round-trip per command), pipelining sends multiple commands in a batch and reads all responses at once, reducing network overhead by 10-100x.

Redis transactions use MULTI/EXEC to group commands that execute atomically (all or nothing). Between MULTI and EXEC, commands are queued but not executed. EXEC runs them all sequentially with no interleaving from other clients. However, Redis transactions are not like SQL transactions: there is no rollback on error. If one command in the batch fails, the others still execute. For conditional transactions, use WATCH to implement optimistic locking: WATCH a key, read its value, MULTI, modify, EXEC. If the watched key was changed by another client between WATCH and EXEC, the transaction is aborted.

Lua scripting with EVAL is more powerful than transactions for complex atomic operations. A Lua script runs atomically on the Redis server, can include conditionals and loops, and sees a consistent snapshot of the data. This is the preferred approach for operations like "increment if below limit" (rate limiting) or "transfer balance between accounts" (debit one, credit another).`,useCases:[{title:"Pipelining for Bulk Operations",scenario:"Import 10,000 user records into Redis. Without pipelining, 10K round-trips at 0.5ms each = 5 seconds. With pipelining, 1 round-trip = 50ms.",implementation:`# Without pipelining (slow: 10,000 round-trips)
for i in range(10000):
    redis.set(f"user:{i}", f"data_{i}")
# Total: ~5 seconds

# With pipelining (fast: 1 round-trip)
pipe = redis.pipeline()
for i in range(10000):
    pipe.set(f"user:{i}", f"data_{i}")
pipe.execute()
# Total: ~50ms (100x faster)

# redis-cli pipelining:
cat commands.txt | redis-cli --pipe
# commands.txt:
# SET user:1 data_1
# SET user:2 data_2
# ...`},{title:"Optimistic Locking with WATCH",scenario:"Two users try to buy the last concert ticket simultaneously. Use WATCH to prevent double-selling.",implementation:`# Optimistic lock: WATCH + MULTI/EXEC
WATCH inventory:concert:42
stock = GET inventory:concert:42
# => "1" (one ticket left)

if int(stock) > 0:
    MULTI
    DECR inventory:concert:42
    SADD purchased:concert:42 "user:alice"
    EXEC
    # If another client modified inventory:concert:42
    # between WATCH and EXEC, EXEC returns nil (aborted).
    # Retry the whole operation.
else:
    UNWATCH
    # Sold out

# In Go:
// txf := func(tx *redis.Tx) error {
//     stock, _ := tx.Get(ctx, key).Int()
//     if stock <= 0 { return ErrSoldOut }
//     _, err := tx.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
//         pipe.Decr(ctx, key)
//         return nil
//     })
//     return err
// }
// redisClient.Watch(ctx, txf, key)`},{title:"Lua Script for Rate Limiting",scenario:"Implement a sliding window rate limiter: allow 100 requests per 60 seconds per user. Must be atomic.",implementation:`-- rate_limit.lua: atomic rate limiter
local key = KEYS[1]
local limit = tonumber(ARGV[1])   -- 100
local window = tonumber(ARGV[2])  -- 60
local now = tonumber(ARGV[3])     -- current timestamp

-- Remove old entries outside the window
redis.call("ZREMRANGEBYSCORE", key, 0, now - window)

-- Count current requests
local count = redis.call("ZCARD", key)

if count < limit then
    -- Add current request
    redis.call("ZADD", key, now, now .. ":" .. math.random())
    redis.call("EXPIRE", key, window)
    return 1  -- allowed
else
    return 0  -- rate limited
end

-- Usage:
-- EVAL "..." 1 ratelimit:user:42 100 60 1700000000`}],keyCommands:[{command:"MULTI / EXEC / DISCARD",description:"Transaction: queue commands, execute atomically, or abort"},{command:"WATCH key [key...]",description:"Optimistic lock: abort EXEC if watched keys changed"},{command:"EVAL script numkeys key [key...] arg [arg...]",description:"Execute a Lua script atomically on the server"},{command:"SUBSCRIBE / PUBLISH channel message",description:"Pub/Sub: subscribe to channels and publish messages"},{command:"SCAN cursor [MATCH pattern] [COUNT n]",description:"Incrementally iterate keys without blocking (unlike KEYS *)"}],bestPractices:["Always use SCAN instead of KEYS * in production: KEYS blocks the server for the entire iteration","Use pipelining for any batch operation; the performance difference is dramatic","Prefer Lua scripts over MULTI/EXEC for complex atomic operations (Lua supports conditionals)","Keep Lua scripts short: a long-running Lua script blocks the entire Redis server","Use WATCH for optimistic locking only when contention is low; high contention causes many retries"],interviewQuestions:["What is the difference between Redis transactions (MULTI/EXEC) and SQL transactions?","How does pipelining improve Redis performance? What is the trade-off?","Explain optimistic locking with WATCH. When would this fail and need a retry?","Why would you use a Lua script instead of MULTI/EXEC?","Why is KEYS * dangerous in production? What should you use instead?"],resources:[{label:"Redis Transactions",url:"https://redis.io/docs/interact/transactions/"},{label:"Redis Pipelining",url:"https://redis.io/docs/latest/develop/use/pipelining/"}]},{id:"redis-pub-sub",title:"Redis Pub/Sub & Streams",category:"redis",order:7,explanation:`Redis Pub/Sub is a fire-and-forget messaging pattern where publishers send messages to channels and all connected subscribers receive them in real time. It is simple and low-latency, but messages are not persisted: if a subscriber is offline when a message is published, that message is lost. This makes Pub/Sub ideal for real-time notifications, chat, and live dashboards, but unsuitable for reliable message queuing.

Redis Streams (introduced in v5.0) solve the durability problem. A Stream is an append-only log where each entry has an auto-generated ID (timestamp-sequence) and a set of field-value pairs. Unlike Pub/Sub, messages in a Stream persist and can be read by multiple consumers at any time. Consumer Groups allow multiple workers to divide the work: each message is delivered to exactly one consumer in the group, similar to Kafka consumer groups. If a consumer crashes, pending messages can be reclaimed by another consumer using XCLAIM.

Streams vs Kafka: both are append-only logs with consumer groups, but Kafka is designed for massive throughput (millions of messages/sec) across a distributed cluster with configurable retention. Redis Streams are better for moderate throughput (tens of thousands/sec) where you already have Redis and want to avoid the operational complexity of running a separate Kafka cluster. For most applications that process fewer than 100K messages/sec, Redis Streams are simpler and sufficient.`,useCases:[{title:"Real-Time Notifications with Pub/Sub",scenario:"A chat application needs to broadcast messages to all connected users in a room instantly.",implementation:`# Publisher (when user sends a message):
PUBLISH chat:room:42 '{"user":"alice","msg":"Hello everyone!"}'

# Subscriber (each connected client):
SUBSCRIBE chat:room:42
# Blocking wait for messages:
# 1) "message"
# 2) "chat:room:42"
# 3) "{user:alice, msg:Hello everyone!}"`},{title:"Order Processing with Streams + Consumer Groups",scenario:"An e-commerce platform processes orders asynchronously. Multiple workers handle orders, and each order must be processed exactly once. If a worker crashes, its pending orders are reclaimed.",implementation:`# Create consumer group (starting from new messages)
XGROUP CREATE orders $ MKSTREAM

# Producer: add order to stream
XADD orders * order_id 12345 customer_id 42 total 99.99
# => "1700000000000-0"

# Consumer worker-1: read next unprocessed message
XREADGROUP GROUP order-processors worker-1 COUNT 1 BLOCK 5000 STREAMS orders >
# Process the order...

# Acknowledge completion
XACK orders order-processors 1700000000000-0

# If worker-1 crashes, reclaim pending messages:
XPENDING orders order-processors - + 10
XCLAIM orders order-processors worker-2 30000 1700000000000-0

# worker-2 picks up and processes the failed message`}],keyCommands:[{command:"PUBLISH channel message",description:"Pub/Sub: send a message to all subscribers of a channel"},{command:"SUBSCRIBE channel [channel...]",description:"Pub/Sub: subscribe to one or more channels (blocking)"},{command:"XADD stream * field value [field value...]",description:"Stream: append an entry with auto-generated ID"},{command:"XREADGROUP GROUP group consumer COUNT n BLOCK ms STREAMS stream >",description:"Stream: read new messages as part of a consumer group"},{command:"XACK stream group id [id...]",description:"Stream: acknowledge that a message has been processed"}],bestPractices:["Use Pub/Sub only for ephemeral real-time messaging where message loss is acceptable","Use Streams when you need message persistence, replay, and exactly-once delivery semantics","Always XACK processed messages in consumer groups to prevent them from being reclaimed","Set a reasonable BLOCK timeout in XREADGROUP to avoid busy-waiting","Monitor XPENDING regularly to detect stuck consumers and reclaim their messages","Trim Streams with MAXLEN or MINID to prevent unbounded memory growth"],interviewQuestions:["What is the key difference between Redis Pub/Sub and Redis Streams?","How do Redis Streams consumer groups compare to Kafka consumer groups?","What happens if a subscriber disconnects during a Pub/Sub broadcast? How do Streams solve this?","Explain the XPENDING and XCLAIM commands. When would you use them?","When would you choose Redis Streams over Kafka? What are the trade-offs?"],resources:[{label:"Redis Streams Introduction",url:"https://redis.io/docs/data-types/streams-tutorial/"},{label:"Redis Pub/Sub Documentation",url:"https://redis.io/docs/interact/pubsub/"}]},{id:"cache-patterns",title:"Cache Patterns",category:"patterns",order:8,explanation:`Beyond basic caching strategies, there are several powerful patterns that use Redis as more than a cache. Distributed Locking ensures only one process executes a critical section across multiple servers. Redis implements this with SETNX (SET if Not eXists) with an expiry: if the key does not exist, the lock is acquired; if it exists, another process holds the lock. The expiry prevents deadlocks if the lock holder crashes. Redlock is a more robust algorithm that acquires locks across multiple independent Redis instances.

Rate Limiting is one of Redis's strongest use cases. A sliding window rate limiter uses Sorted Sets: add each request as a member with the current timestamp as the score, remove entries outside the window with ZREMRANGEBYSCORE, then check ZCARD against the limit. This gives a precise sliding window without the burstiness of fixed-window counters. Session Storage uses Redis to store HTTP sessions, enabling stateless application servers that can scale horizontally. Any server can read any user's session from Redis, eliminating sticky sessions.

Leaderboards are a natural fit for Sorted Sets (ZADD for score updates, ZREVRANGE for top-N, ZRANK for individual ranking) and are used in gaming, sales dashboards, and social platforms. Real-Time Analytics uses Redis to aggregate metrics in real time: increment counters with INCR, maintain rolling averages with Sorted Sets, and expire old data with TTLs.`,useCases:[{title:"Distributed Lock for Payment Processing",scenario:"Multiple servers process payments. A duplicate payment must never happen. Use a distributed lock so only one server processes a given payment at a time.",implementation:`// Go: distributed lock with Redis
func ProcessPayment(ctx context.Context, paymentID string) error {
    lockKey := fmt.Sprintf("lock:payment:%s", paymentID)
    lockValue := uuid.New().String() // unique lock owner ID

    // Acquire lock: SET NX EX (atomic set-if-not-exists with expiry)
    ok, err := redisClient.SetNX(ctx, lockKey, lockValue, 30*time.Second).Result()
    if !ok {
        return fmt.Errorf("payment %s is already being processed", paymentID)
    }

    defer func() {
        // Release lock: only if we still own it (Lua for atomicity)
        script := \`if redis.call("GET", KEYS[1]) == ARGV[1] then
            return redis.call("DEL", KEYS[1])
        else return 0 end\`
        redisClient.Eval(ctx, script, []string{lockKey}, lockValue)
    }()

    // Process payment safely
    return executePayment(paymentID)
}`},{title:"API Rate Limiter with Sorted Sets",scenario:"API gateway allows 100 requests per minute per API key. Use a sliding window for accurate rate limiting.",implementation:`// Go: sliding window rate limiter
func CheckRateLimit(ctx context.Context, apiKey string) (bool, error) {
    key := fmt.Sprintf("ratelimit:%s", apiKey)
    now := time.Now().UnixMilli()
    windowMs := int64(60000) // 1 minute
    limit := int64(100)

    pipe := redisClient.Pipeline()
    // Remove entries outside the window
    pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%d", now-windowMs))
    // Count entries in the window
    countCmd := pipe.ZCard(ctx, key)
    pipe.Exec(ctx)

    if countCmd.Val() >= limit {
        return false, nil // rate limited
    }

    // Add current request
    member := fmt.Sprintf("%d:%s", now, uuid.New().String())
    redisClient.ZAdd(ctx, key, redis.Z{Score: float64(now), Member: member})
    redisClient.Expire(ctx, key, 2*time.Minute) // cleanup safety net
    return true, nil
}`},{title:"Session Store for Stateless Servers",scenario:"A web app runs on 10 servers behind a load balancer. Any server must be able to handle any user's request by reading the session from Redis.",implementation:`# Store session on login
SET session:abc123def456 '{"user_id":42,"role":"admin","cart":[1,2,3]}' EX 3600

# Any server reads session from the cookie token
GET session:abc123def456
# => {"user_id":42,"role":"admin","cart":[1,2,3]}

# Extend session on activity (sliding expiry)
EXPIRE session:abc123def456 3600

# Logout: delete session
DEL session:abc123def456

# Benefits:
# - No sticky sessions needed
# - Any server can be terminated without losing sessions
# - Sessions survive server restarts
# - Easy to invalidate all sessions for a user (use a pattern)`}],keyCommands:[{command:"SET key value NX EX seconds",description:"Distributed lock: acquire lock atomically with expiry"},{command:"EVAL script numkeys ...",description:"Lua script for atomic lock release (check-and-delete)"},{command:"ZREMRANGEBYSCORE key min max",description:"Rate limiting: remove entries outside the sliding window"},{command:"INCR / INCRBY key",description:"Atomic counter increment for analytics and rate limiting"},{command:"EXPIRE key seconds",description:"Set or refresh TTL for session sliding expiry"}],bestPractices:["Always set an expiry on distributed locks to prevent deadlocks from crashed lock holders","Use a unique lock value (UUID) and release with Lua to prevent releasing another process's lock","For rate limiting, prefer sliding window (Sorted Set) over fixed window (INCR) to avoid burst at window boundaries","Store sessions as Hashes (HSET) instead of JSON strings if you need to update individual fields","Implement circuit breakers: if Redis is down, degrade gracefully (e.g., allow all requests) rather than failing hard"],interviewQuestions:["How would you implement a distributed lock using Redis? What are the failure modes?","Design a rate limiter for an API gateway using Redis. How do you handle the sliding window?","Why is a Lua script needed to release a distributed lock safely?","Compare fixed-window vs sliding-window rate limiting. What is the burst problem with fixed windows?","How would you invalidate all sessions for a specific user across all servers?"],resources:[{label:"Redlock Algorithm",url:"https://redis.io/docs/manual/patterns/distributed-locks/"},{label:"Redis Rate Limiting Pattern",url:"https://redis.com/glossary/rate-limiting/"}]},{id:"cache-invalidation",title:"Cache Invalidation Strategies",category:"patterns",order:9,explanation:`Cache invalidation is the process of removing or updating stale data from the cache when the source of truth changes. The simplest approach is TTL-based expiration: set a TTL and accept that data may be stale for up to that duration. This works when eventual consistency is acceptable (product listings, user profiles, news feeds). The trade-off is between freshness (short TTL, more DB hits) and efficiency (long TTL, more staleness).

Event-driven invalidation is more precise: when data changes in the database, publish an event that triggers cache deletion. In a microservices architecture, this uses a message broker (Kafka, Redis Pub/Sub) to broadcast invalidation events. The application writes to the DB, publishes an "invalidate:product:42" event, and all cache nodes delete that key. This gives near-instant consistency but requires the invalidation pipeline to be reliable. Versioned keys append a version number to the cache key (product:42:v3). When data changes, increment the version. Old keys expire naturally via TTL while new requests use the new version, avoiding explicit invalidation.

Stampede prevention is critical for high-traffic keys. When a popular cache entry expires, hundreds of concurrent requests all miss the cache and hit the database simultaneously (thundering herd). Solutions include: lock-based recomputation (only one request recomputes, others wait), probabilistic early expiration (randomly refresh before TTL expires), and stale-while-revalidate (serve the stale value while one request refreshes in the background).`,useCases:[{title:"Event-Driven Invalidation with Pub/Sub",scenario:"A product catalog is cached in 5 Redis nodes across regions. When an admin updates a product, all caches must be invalidated within seconds.",implementation:`// Go: publish invalidation event on update
func UpdateProduct(ctx context.Context, productID int64, data Product) error {
    // 1. Update database (source of truth)
    err := db.UpdateProduct(productID, data)
    if err != nil { return err }

    // 2. Delete local cache
    key := fmt.Sprintf("product:%d", productID)
    redisClient.Del(ctx, key)

    // 3. Broadcast invalidation to all nodes
    event := fmt.Sprintf(\`{"action":"invalidate","key":"%s"}\`, key)
    redisClient.Publish(ctx, "cache:invalidation", event)
    return nil
}

// Subscriber on each node:
// sub := redisClient.Subscribe(ctx, "cache:invalidation")
// for msg := range sub.Channel() {
//     var event InvalidationEvent
//     json.Unmarshal([]byte(msg.Payload), &event)
//     localCache.Delete(event.Key)
// }`},{title:"Stampede Prevention with Locking",scenario:"A homepage banner is cached with a 5-minute TTL. The site gets 50K requests/second. When the TTL expires, 50K requests simultaneously hit the DB.",implementation:`// Go: lock-based stampede prevention
func GetBanner(ctx context.Context) (string, error) {
    key := "homepage:banner"
    lockKey := key + ":lock"

    // 1. Try cache
    val, err := redisClient.Get(ctx, key).Result()
    if err == nil {
        return val, nil // cache hit
    }

    // 2. Cache miss: try to acquire recompute lock
    acquired, _ := redisClient.SetNX(ctx, lockKey, "1", 10*time.Second).Result()
    if acquired {
        // 3. This request recomputes the value
        banner := db.GetBanner()
        redisClient.Set(ctx, key, banner, 5*time.Minute)
        redisClient.Del(ctx, lockKey)
        return banner, nil
    }

    // 4. Another request is recomputing; wait and retry
    time.Sleep(100 * time.Millisecond)
    return redisClient.Get(ctx, key).Result()
}`},{title:"Versioned Cache Keys",scenario:"A user's dashboard config changes rarely but must be instantly fresh when it does. Use versioned keys to avoid explicit invalidation across distributed caches.",implementation:`# Store current version in a fast-lookup key
SET user:42:dashboard:version 3

# Cache data under versioned key
SET user:42:dashboard:v3 '{"layout":"grid","widgets":["sales","orders"]}' EX 3600

# Read flow:
version = GET user:42:dashboard:version  # => "3"
data = GET user:42:dashboard:v3
# Hit! Return data.

# On update:
INCR user:42:dashboard:version  # => 4
SET user:42:dashboard:v4 '{"layout":"list","widgets":["sales","revenue"]}' EX 3600
# Old key user:42:dashboard:v3 expires naturally via TTL
# No explicit DELETE needed across distributed nodes`}],keyCommands:[{command:"DEL key",description:"Explicit invalidation: delete a cached entry immediately"},{command:"UNLINK key",description:"Async delete: removes key from keyspace instantly, frees memory in background"},{command:"PUBLISH channel message",description:"Broadcast invalidation events to all subscriber nodes"},{command:"INCR key",description:"Increment version counter for versioned cache keys"},{command:"SET key value NX EX seconds",description:"Acquire recompute lock for stampede prevention"}],bestPractices:["Delete-then-read is safer than update-then-read: delete the cache key, let the next read repopulate from DB","Use UNLINK instead of DEL for large values: UNLINK is non-blocking","For event-driven invalidation, ensure the event bus is reliable or combine with TTL as a safety net","Add jitter to TTLs (e.g., 300 +/- 30 seconds) to prevent synchronized expiration of related keys","Use stale-while-revalidate for non-critical data: serve stale and refresh in the background","Log cache invalidation events for debugging consistency issues"],interviewQuestions:["What is the thundering herd problem? Describe three ways to prevent cache stampedes.","Compare TTL-based vs event-driven cache invalidation. When would you use each?","How does the versioned cache key pattern work? What are its advantages over explicit deletion?","Explain stale-while-revalidate. When is it appropriate and when is it dangerous?","In a microservices system, how would you ensure all services invalidate their caches when shared data changes?"],resources:[{label:"Cache Invalidation Strategies",url:"https://blog.the-pans.com/different-ways-of-caching-in-distributed-system/"},{label:"Thundering Herd Problem",url:"https://en.wikipedia.org/wiki/Thundering_herd_problem"}]},{id:"redis-cluster",title:"Redis Cluster & Sentinel",category:"production",order:10,explanation:`Redis Sentinel provides high availability for standalone Redis. It monitors the primary, detects failures via consensus among multiple Sentinel processes, and automatically promotes a replica to primary. Clients connect to Sentinel to discover the current primary address. Sentinel handles the common "what happens when the master goes down" scenario without data sharding. It is the right choice when your dataset fits in a single node's memory and you just need automatic failover.

Redis Cluster provides both high availability AND horizontal data sharding. The key space is divided into 16,384 hash slots, and each master node owns a subset of slots. The hash slot for a key is computed as CRC16(key) mod 16384. Data is automatically distributed across nodes. Each master has one or more replicas for failover. If a master fails, its replica is promoted automatically. Cluster supports up to 1000 nodes and can handle millions of operations per second.

The key trade-off is that Redis Cluster does not support multi-key operations across different hash slots. Commands like MGET, MSET, or Lua scripts that touch keys on different nodes will fail. You can force keys to the same slot using hash tags: {user:42}:profile and {user:42}:settings both hash to the same slot because only the content inside {} is hashed. This enables multi-key operations on related data while still distributing unrelated users across nodes.`,useCases:[{title:"Sentinel for Session Store HA",scenario:"A single Redis instance stores 2M sessions. If it crashes, all users are logged out. Sentinel provides automatic failover in under 30 seconds.",implementation:`# sentinel.conf (run 3 Sentinels for quorum)
sentinel monitor mymaster 10.0.1.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 30000
sentinel parallel-syncs mymaster 1

# Start 3 Sentinels:
redis-sentinel /etc/sentinel1.conf
redis-sentinel /etc/sentinel2.conf
redis-sentinel /etc/sentinel3.conf

# Application connects via Sentinel (Go):
// rdb := redis.NewFailoverClient(&redis.FailoverOptions{
//     MasterName:    "mymaster",
//     SentinelAddrs: []string{"sentinel1:26379", "sentinel2:26379", "sentinel3:26379"},
// })

# On master failure:
# 1. Sentinels detect master is down (5s timeout)
# 2. Sentinels vote on failover (quorum = 2)
# 3. Replica promoted to master (~30s total)
# 4. Clients auto-discover new master via Sentinel`},{title:"Redis Cluster for Sharded Cache",scenario:"A caching layer needs 100GB of data across 5 masters. Hash tags keep related keys on the same shard.",implementation:`# Create a 6-node cluster (3 masters + 3 replicas)
redis-cli --cluster create \\
  10.0.1.1:6379 10.0.1.2:6379 10.0.1.3:6379 \\
  10.0.1.4:6379 10.0.1.5:6379 10.0.1.6:6379 \\
  --cluster-replicas 1

# Hash tags: force related keys to same slot
SET {user:42}:profile '{"name":"Alice"}'
SET {user:42}:settings '{"theme":"dark"}'
SET {user:42}:cart '[1,2,3]'

# Multi-key operation works because same hash tag:
MGET {user:42}:profile {user:42}:settings {user:42}:cart

# Check which slot a key maps to:
CLUSTER KEYSLOT {user:42}:profile
# => (integer) 8528
CLUSTER KEYSLOT {user:42}:cart
# => (integer) 8528  (same slot!)

# Check cluster health:
CLUSTER INFO
CLUSTER NODES`}],keyCommands:[{command:"CLUSTER INFO",description:"View cluster state, slots assigned, known nodes, and health"},{command:"CLUSTER NODES",description:"List all nodes with their roles, slots, and connection status"},{command:"CLUSTER KEYSLOT key",description:"Show which hash slot a key maps to (for debugging sharding)"},{command:"SENTINEL get-master-addr-by-name master",description:"Ask Sentinel for the current master IP and port"},{command:"CLUSTER FAILOVER",description:"Manually trigger failover (for maintenance or testing)"}],bestPractices:["Use Sentinel when your dataset fits on one node and you only need HA (simpler to operate)","Use Cluster when you need to shard data across multiple nodes (dataset exceeds single-node RAM)","Always run an odd number of Sentinels (3 or 5) for proper quorum voting","Use hash tags {prefix} to colocate related keys on the same slot for multi-key operations","Monitor cluster slot coverage: if any slot has no master and no replica, the cluster goes down"],interviewQuestions:["When would you choose Redis Sentinel over Redis Cluster?","How does Redis Cluster distribute data across nodes? Explain hash slots.","What are hash tags and why are they needed in Redis Cluster?","What happens during a failover in Redis Sentinel? How long does it take?","Can Redis Cluster guarantee strong consistency? Why or why not?"],resources:[{label:"Redis Cluster Specification",url:"https://redis.io/docs/reference/cluster-spec/"},{label:"Redis Sentinel Documentation",url:"https://redis.io/docs/management/sentinel/"}]},{id:"redis-performance",title:"Redis Performance & Optimization",category:"production",order:11,explanation:`Redis performance optimization starts with memory management. Redis stores everything in RAM, so memory efficiency directly impacts cost and capacity. Use appropriate data structures: a Hash with a few fields uses less memory than separate String keys because Redis optimizes small Hashes using ziplist encoding. The hash-max-ziplist-entries and hash-max-ziplist-value thresholds control when Redis switches from compact ziplist to full hashtable encoding. Similarly, small Lists, Sets, and Sorted Sets use compact encodings.

Connection pooling is essential for production applications. Creating a new TCP connection for each command adds 1-3ms of overhead. A connection pool reuses connections, eliminating this overhead. Most Redis client libraries (go-redis, Jedis, redis-py) support connection pooling out of the box. Set the pool size to match your concurrency level: too few connections cause queuing, too many waste resources. A good starting point is 10-20 connections per application instance.

Pipelining batches multiple commands into a single network round-trip, reducing latency from N round-trips to 1. For bulk operations, pipelining is 5-10x faster. Lua scripting goes further by executing complex logic server-side, avoiding multiple round-trips entirely. However, Lua scripts block the Redis server for their entire duration, so keep them short (under 5ms). For long-running computations, break them into smaller chunks or move the logic to the application layer.`,useCases:[{title:"Memory Optimization with Hashes",scenario:"Store 10M user objects. Using separate String keys for each field wastes memory on per-key overhead. Packing into Hashes reduces memory by 5-10x.",implementation:`# Bad: separate String keys (high overhead per key)
SET user:42:name "Alice"
SET user:42:email "alice@example.com"
SET user:42:plan "pro"
# Memory: ~200 bytes per field (key overhead)
# Total: 10M users * 3 fields * 200 bytes = 6GB

# Good: Hash per user (compact ziplist encoding)
HSET user:42 name "Alice" email "alice@example.com" plan "pro"
# Memory: ~100 bytes per user (ziplist)
# Total: 10M users * 100 bytes = 1GB

# Even better: Hash bucketing for tiny values
# Pack 100 users per Hash bucket:
HSET users:0 42 '{"name":"Alice","plan":"pro"}'
HSET users:0 43 '{"name":"Bob","plan":"free"}'
# bucket = user_id / 100
# Memory: ~50 bytes per user = 500MB

# Verify encoding:
OBJECT ENCODING user:42
# => "ziplist" (compact) or "hashtable" (large)`},{title:"Connection Pooling in Go",scenario:"A Go service handling 5000 concurrent requests to Redis. Without pooling, each request creates a TCP connection (1-3ms overhead + file descriptor exhaustion).",implementation:`// Go: configure connection pool with go-redis
import "github.com/redis/go-redis/v9"

rdb := redis.NewClient(&redis.Options{
    Addr:         "redis:6379",
    Password:     "",
    DB:           0,
    PoolSize:     20,                  // max connections
    MinIdleConns: 5,                   // keep 5 warm connections
    DialTimeout:  5 * time.Second,
    ReadTimeout:  3 * time.Second,
    WriteTimeout: 3 * time.Second,
    PoolTimeout:  4 * time.Second,     // wait for pool connection
    MaxRetries:   3,
    MinRetryBackoff: 8 * time.Millisecond,
    MaxRetryBackoff: 512 * time.Millisecond,
})

// Monitor pool stats:
stats := rdb.PoolStats()
fmt.Printf("Hits: %d, Misses: %d, Timeouts: %d\\n",
    stats.Hits, stats.Misses, stats.Timeouts)`},{title:"Key Expiry Strategies",scenario:"Redis has 50M keys but only 20M are actively used. The rest are stale, wasting 60% of memory. Implement a systematic expiry strategy.",implementation:`# 1. Always set TTL when creating keys
SET cache:product:42 data EX 3600    # 1 hour TTL
HSET user:42 name "Alice"
EXPIRE user:42 86400                 # 24 hour TTL

# 2. Scan for keys without TTL (fix legacy data)
# In a migration script:
SCAN 0 COUNT 1000
# For each key:
TTL <key>
# If -1 (no expiry), set a default:
EXPIRE <key> 604800  # 7 day default

# 3. Monitor key expiry stats:
INFO keyspace
# db0:keys=50000000,expires=48000000,avg_ttl=3600000
# 48M/50M keys have TTL = good

# 4. Configure lazy expiry + active expiry:
# redis.conf:
lazyfree-lazy-expire yes     # free memory in background thread
hz 10                        # active expiry checks per second (default)`}],keyCommands:[{command:"OBJECT ENCODING key",description:"Check the internal encoding of a key (ziplist, hashtable, skiplist, etc.)"},{command:"MEMORY USAGE key",description:"Get the exact memory used by a key and its value in bytes"},{command:"DEBUG SLEEP seconds",description:"Simulate slow command (testing only, never in production)"},{command:"SLOWLOG GET 10",description:"View the 10 most recent commands that exceeded the slowlog threshold"},{command:"INFO all",description:"Comprehensive server stats: memory, CPU, clients, keyspace, replication"}],bestPractices:["Use OBJECT ENCODING to verify keys use compact encodings (ziplist, intset) for memory efficiency","Set connection pool size to 2x your expected concurrency; monitor pool stats for timeouts","Use pipelining for any operation that sends more than 3 commands in sequence","Monitor SLOWLOG to catch commands taking longer than expected (default threshold: 10ms)","Set hz to 10-100 for more aggressive active key expiry (default is 10, higher = more CPU)","Use UNLINK instead of DEL for large keys to avoid blocking the main thread"],interviewQuestions:["How would you reduce Redis memory usage by 50% without losing functionality?","What is the difference between ziplist and hashtable encoding in Redis Hashes?","How does connection pooling improve Redis performance? How do you size the pool?","What is the Redis SLOWLOG? How would you use it to diagnose performance issues?","Explain the difference between passive (lazy) and active key expiry in Redis."],resources:[{label:"Redis Memory Optimization",url:"https://redis.io/docs/management/optimization/memory-optimization/"},{label:"Redis Latency Monitoring",url:"https://redis.io/docs/management/optimization/latency/"}]},{id:"cache-comparison",title:"Cache Comparison & Decision Framework",category:"alternatives",order:12,explanation:`Choosing the right caching solution depends on your workload, data structures, and operational requirements. Redis is the most versatile: it supports rich data structures (Sorted Sets, Hashes, Streams), persistence, replication, Lua scripting, and Pub/Sub. It is the best choice when you need more than simple key-value caching. Memcached is simpler and slightly faster for pure key-value workloads because it uses multi-threaded architecture and has lower per-key memory overhead. However, it has no persistence, no data structures beyond strings, and no replication.

AWS ElastiCache is a managed service that runs either Redis or Memcached. It handles patching, failover, backups, and scaling. Choose ElastiCache when you want Redis/Memcached without the operational burden. The trade-off is cost (2-3x more than self-hosted) and some feature restrictions (no custom modules, limited CONFIG access). CDN caching (CloudFront, Cloudflare) is ideal for static assets and API responses that are the same for all users. It caches at the edge, reducing latency to single-digit milliseconds. However, CDN cache invalidation is slow (seconds to minutes) and you pay per invalidation request.

Application-level caching (in-process caching) uses local memory within the application process. Libraries like Caffeine (Java), groupcache (Go), or lru-cache (Node.js) provide LRU caches with zero network latency. The downside is that each process has its own cache, so cache coherence across multiple instances is a challenge, and memory is shared with the application. Use in-process caching for hot configuration data, small lookup tables, or as an L1 cache in front of Redis (L2).`,useCases:[{title:"Decision Framework: When to Use What",scenario:"A team is deciding on a caching solution for a new microservice. Use this framework to choose.",implementation:`# Decision Tree:
#
# Need rich data structures (sorted sets, hashes, lists)?
#   YES -> Redis
#   NO  -> Continue
#
# Need persistence / durability?
#   YES -> Redis
#   NO  -> Continue
#
# Need pub/sub or message streaming?
#   YES -> Redis (Streams) or Kafka (if >100K msg/sec)
#   NO  -> Continue
#
# Pure key-value with multi-threaded performance?
#   YES -> Memcached
#   NO  -> Continue
#
# Caching static assets or public API responses?
#   YES -> CDN (CloudFront, Cloudflare)
#   NO  -> Continue
#
# Need zero-latency cache for hot config/lookup data?
#   YES -> In-process cache (Caffeine, groupcache)
#   NO  -> Redis (safe default)`},{title:"L1/L2 Caching Architecture",scenario:"A high-traffic API serves 100K requests/sec. Redis alone adds 0.5ms per request. Add an in-process L1 cache to reduce Redis calls by 80%.",implementation:`// Go: L1 (in-process) + L2 (Redis) caching
import "github.com/hashicorp/golang-lru/v2"

var l1Cache, _ = lru.New[string, string](10000) // 10K entries in-process

func GetProduct(ctx context.Context, id string) (string, error) {
    key := "product:" + id

    // L1: check in-process cache (0ms latency)
    if val, ok := l1Cache.Get(key); ok {
        return val, nil  // L1 hit
    }

    // L2: check Redis (0.5ms latency)
    val, err := redisClient.Get(ctx, key).Result()
    if err == nil {
        l1Cache.Add(key, val)  // promote to L1
        return val, nil        // L2 hit
    }

    // Miss: fetch from DB (5-50ms latency)
    val = db.GetProduct(id)
    redisClient.Set(ctx, key, val, 5*time.Minute)  // populate L2
    l1Cache.Add(key, val)                           // populate L1
    return val, nil
}

// L1 TTL: use LRU eviction (10K entries max)
// L2 TTL: 5 minutes in Redis
// Result: 80% L1 hits, 15% L2 hits, 5% DB hits`},{title:"Redis vs Memcached Benchmark Comparison",scenario:"Compare Redis and Memcached for a simple string cache workload to understand the performance characteristics.",implementation:`# Redis benchmark (built-in tool)
redis-benchmark -h localhost -p 6379 -c 50 -n 100000 -q
# SET: 120,000 requests/sec
# GET: 130,000 requests/sec

# Memcached benchmark (memtier_benchmark)
memtier_benchmark -s localhost -p 11211 --protocol=memcache_text \\
  -c 50 -n 100000 --ratio=1:1
# SET: 140,000 requests/sec
# GET: 150,000 requests/sec

# Comparison:
# +-----------+--------+-----------+
# | Feature   | Redis  | Memcached |
# +-----------+--------+-----------+
# | GET/SET   | 130K/s | 150K/s    | Memcached ~15% faster
# | Threading | Single | Multi     | Memcached scales on cores
# | Data types| 10+    | String    | Redis far more flexible
# | Persist   | Yes    | No        | Redis only
# | Pub/Sub   | Yes    | No        | Redis only
# | Memory    | Higher | Lower     | Memcached more efficient
# +-----------+--------+-----------+
# Verdict: Memcached wins for simple caching;
#          Redis wins for everything else.`}],keyCommands:[{command:"redis-benchmark -c 50 -n 100000 -q",description:"Run Redis built-in benchmark with 50 concurrent clients"},{command:"INFO commandstats",description:"View per-command call counts and average latency"},{command:"MONITOR",description:"Real-time stream of all commands hitting the server (debugging only, impacts performance)"},{command:"CLIENT LIST",description:"View all connected clients with their state, idle time, and flags"}],bestPractices:["Default to Redis unless you have a specific reason to choose Memcached (simplicity, multi-threading)","Use CDN caching for any static or public content before reaching your application","Implement L1 (in-process) + L2 (Redis) for ultra-high-throughput services (>50K req/sec)","When using ElastiCache, enable automatic failover and multi-AZ for production workloads","Never use MONITOR in production for more than a few seconds: it impacts throughput significantly","Benchmark with your actual workload, not just synthetic tests: data size and access patterns matter"],interviewQuestions:["When would you choose Memcached over Redis? Give specific scenarios.","What is L1/L2 caching? How does an in-process cache complement Redis?","Compare self-hosted Redis vs AWS ElastiCache. What are the trade-offs?","How does CDN caching differ from application-level caching? Can they be used together?","Design a caching architecture for an e-commerce site with 100K concurrent users."],resources:[{label:"Redis vs Memcached (AWS)",url:"https://aws.amazon.com/elasticache/redis-vs-memcached/"},{label:"Caching Best Practices (Google Cloud)",url:"https://cloud.google.com/architecture/best-practices-for-caching"}]}];export{e as a};
