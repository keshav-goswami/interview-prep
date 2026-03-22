import { AwsService } from '../models/aws.model';

export const AWS_SERVICES: AwsService[] = [
  // ── Compute ───────────────────────────────────────────────────────────
  {
    id: 'ec2',
    name: 'EC2 (Elastic Compute Cloud)',
    category: 'compute',
    order: 1,
    oneLiner: 'Virtual servers in the cloud with full OS-level control.',
    whenToUse: [
      'You need full control over the OS, runtime, and networking configuration',
      'Running long-lived stateful workloads like databases or legacy applications',
      'Workloads with consistent baseline compute needs where Reserved Instances reduce cost',
      'GPU-intensive workloads (ML training, video encoding) requiring specialized instance types',
      'Applications that need to run on specific hardware or require bare-metal performance'
    ],
    keyFeatures: [
      'Instance families optimized for compute (C), memory (R), storage (I/D), GPU (P/G), and general purpose (M/T)',
      'Pricing models: On-Demand, Reserved (1-3yr), Spot (up to 90% discount, interruptible), Savings Plans',
      'Auto Scaling Groups automatically adjust instance count based on demand or schedules',
      'EBS volumes for persistent block storage, instance store for ephemeral high-IOPS local storage',
      'Placement groups: cluster (low latency), spread (fault isolation), partition (big data)',
      'Instance metadata service (IMDS v2) provides instance identity, credentials, and user data'
    ],
    vsAlternatives: [
      { against: 'Lambda', criteria: 'EC2 for long-running, stateful, or high-compute workloads; Lambda for short-lived, event-driven functions under 15 minutes' },
      { against: 'ECS/EKS', criteria: 'EC2 for full OS control; ECS/EKS for containerized workloads with orchestration' },
      { against: 'Lightsail', criteria: 'EC2 for production workloads needing fine-grained control; Lightsail for simple apps with predictable pricing' }
    ],
    interviewTips: [
      'Know the instance family naming: e.g., m5.xlarge = general purpose, 5th gen, extra-large (4 vCPU, 16 GB)',
      'Understand Spot Instance interruption handling: use checkpointing, diversify instance types, set max price',
      'Auto Scaling: know the difference between target tracking, step scaling, and scheduled scaling policies',
      'Security: use IMDSv2 (hop limit=1) to prevent SSRF attacks from reaching instance metadata'
    ],
    resources: [
      { label: 'EC2 Instance Types', url: 'https://aws.amazon.com/ec2/instance-types/' },
      { label: 'EC2 Best Practices', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-best-practices.html' }
    ]
  },
  {
    id: 'lambda',
    name: 'Lambda',
    category: 'serverless',
    order: 2,
    oneLiner: 'Run code without provisioning servers; pay only for compute time consumed.',
    whenToUse: [
      'Event-driven workloads: S3 uploads, DynamoDB streams, SQS messages, API Gateway requests',
      'Short-lived tasks (< 15 minutes) like image processing, data transformation, or webhook handling',
      'Glue logic between AWS services: trigger Step Functions, publish to SNS, write to DynamoDB',
      'Low or unpredictable traffic patterns where paying per invocation is cheaper than idle servers',
      'Rapid prototyping and MVPs where infrastructure management overhead should be minimized'
    ],
    keyFeatures: [
      'Supports Node.js, Python, Java, Go, .NET, Ruby, and custom runtimes via container images',
      'Automatic scaling from zero to thousands of concurrent executions',
      'Provisioned Concurrency eliminates cold starts for latency-sensitive workloads',
      'Lambda@Edge and CloudFront Functions run code at CDN edge locations',
      'Lambda Layers share common dependencies across functions without duplication',
      'Up to 10 GB memory, 6 vCPU, 15-minute timeout, 10 GB ephemeral /tmp storage'
    ],
    vsAlternatives: [
      { against: 'EC2', criteria: 'Lambda for event-driven, short-lived tasks; EC2 for persistent workloads needing OS access' },
      { against: 'Fargate', criteria: 'Lambda for sub-15-minute tasks; Fargate for long-running containerized workloads without server management' },
      { against: 'Step Functions', criteria: 'Lambda for single tasks; Step Functions to orchestrate multiple Lambda functions into workflows' }
    ],
    interviewTips: [
      'Cold starts: know the causes (new container, VPC attachment) and mitigations (Provisioned Concurrency, smaller packages, SnapStart for Java)',
      'Concurrency: understand reserved concurrency (guarantees capacity) vs provisioned concurrency (pre-warms)',
      'VPC Lambda: attaching to VPC adds cold start latency; use VPC endpoints to access AWS services without NAT',
      'Pricing: billed per GB-second and per invocation; compare with Fargate/EC2 for high-throughput workloads'
    ],
    resources: [
      { label: 'Lambda Developer Guide', url: 'https://docs.aws.amazon.com/lambda/latest/dg/' },
      { label: 'Lambda Best Practices', url: 'https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html' }
    ]
  },
  {
    id: 'ecs',
    name: 'ECS (Elastic Container Service)',
    category: 'containers',
    order: 3,
    oneLiner: 'AWS-native container orchestration service for running Docker containers at scale.',
    whenToUse: [
      'Running containerized microservices with tight AWS integration (ALB, CloudWatch, IAM)',
      'Teams that want container orchestration without the complexity of Kubernetes',
      'Using Fargate launch type for serverless containers without managing EC2 instances',
      'Workloads already integrated with AWS services: ECR, Secrets Manager, SSM Parameter Store'
    ],
    keyFeatures: [
      'Two launch types: EC2 (you manage instances) and Fargate (serverless, AWS manages infrastructure)',
      'Task Definitions describe containers, CPU/memory, networking, volumes, and IAM roles',
      'Services maintain desired task count, integrate with ALB/NLB for load balancing, and support auto-scaling',
      'Service Connect and Cloud Map for service discovery between ECS services',
      'Deep integration with IAM task roles for fine-grained per-container permissions',
      'ECS Exec for interactive debugging (SSH-like access to running containers)'
    ],
    vsAlternatives: [
      { against: 'EKS', criteria: 'ECS for AWS-native simplicity; EKS for Kubernetes ecosystem, portability, and complex orchestration needs' },
      { against: 'Lambda', criteria: 'ECS for long-running services or workloads needing persistent connections; Lambda for event-driven short tasks' },
      { against: 'App Runner', criteria: 'ECS for full control over networking and scaling; App Runner for simple web apps with zero configuration' }
    ],
    interviewTips: [
      'Know the ECS hierarchy: Cluster > Service > Task > Container. Tasks are the unit of deployment.',
      'Fargate pricing is per vCPU/GB-hour; compare with EC2 launch type for cost-sensitive workloads',
      'Task IAM roles vs execution roles: task role = app permissions, execution role = ECS agent permissions (pull images, push logs)',
      'Understand ECS service deployment types: rolling update, blue/green (via CodeDeploy), and external'
    ],
    resources: [
      { label: 'ECS Developer Guide', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/' },
      { label: 'ECS Workshop', url: 'https://ecsworkshop.com/' }
    ]
  },
  {
    id: 'eks',
    name: 'EKS (Elastic Kubernetes Service)',
    category: 'containers',
    order: 4,
    oneLiner: 'Managed Kubernetes service that runs the K8s control plane for you.',
    whenToUse: [
      'Teams with Kubernetes expertise wanting managed control plane without operational overhead',
      'Multi-cloud or hybrid strategies requiring Kubernetes portability',
      'Complex microservice architectures needing K8s ecosystem tools (Helm, Istio, ArgoCD)',
      'Workloads requiring advanced scheduling, CRDs, or operator patterns'
    ],
    keyFeatures: [
      'Managed control plane: AWS handles API server, etcd, and control plane upgrades',
      'Compute options: managed node groups (EC2), self-managed nodes, Fargate profiles (serverless pods)',
      'Add-ons ecosystem: CoreDNS, kube-proxy, VPC CNI, EBS CSI driver, managed via EKS API',
      'IAM Roles for Service Accounts (IRSA) maps K8s service accounts to IAM roles',
      'EKS Anywhere for running EKS on-premises with the same tooling',
      'Cluster Autoscaler and Karpenter for intelligent node provisioning'
    ],
    vsAlternatives: [
      { against: 'ECS', criteria: 'EKS for Kubernetes ecosystem and portability; ECS for simpler AWS-native orchestration' },
      { against: 'Self-managed K8s', criteria: 'EKS for managed control plane and AWS integration; self-managed for full control and cost savings at scale' },
      { against: 'GKE', criteria: 'EKS for AWS-centric workloads; GKE for best-in-class K8s experience with Autopilot mode' }
    ],
    interviewTips: [
      'EKS charges $0.10/hr per cluster for the control plane, plus compute costs for worker nodes',
      'IRSA: understand how OIDC federation allows pods to assume IAM roles without access keys',
      'Karpenter vs Cluster Autoscaler: Karpenter provisions right-sized nodes in seconds; CA works with ASGs',
      'Know the EKS upgrade strategy: control plane first, then node groups, with PodDisruptionBudgets'
    ],
    resources: [
      { label: 'EKS User Guide', url: 'https://docs.aws.amazon.com/eks/latest/userguide/' },
      { label: 'EKS Best Practices', url: 'https://aws.github.io/aws-eks-best-practices/' }
    ]
  },

  // ── Storage ───────────────────────────────────────────────────────────
  {
    id: 's3',
    name: 'S3 (Simple Storage Service)',
    category: 'storage',
    order: 5,
    oneLiner: 'Virtually unlimited object storage with 99.999999999% (11 nines) durability.',
    whenToUse: [
      'Storing any unstructured data: images, videos, backups, logs, data lake files',
      'Static website hosting with CloudFront for global distribution',
      'Data lake foundation for analytics pipelines (Athena, EMR, Redshift Spectrum)',
      'Archival storage using Glacier tiers for compliance and long-term retention',
      'Backup and disaster recovery with cross-region replication'
    ],
    keyFeatures: [
      'Storage classes: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant/Flexible/Deep Archive',
      'Lifecycle policies automatically transition objects between storage classes or expire them',
      'Versioning protects against accidental deletes; MFA Delete adds extra protection',
      'Server-side encryption (SSE-S3, SSE-KMS, SSE-C) and client-side encryption options',
      'Event notifications trigger Lambda, SQS, or SNS on object create/delete events',
      'S3 Select and Glacier Select query data in-place with SQL without downloading entire objects'
    ],
    vsAlternatives: [
      { against: 'EBS', criteria: 'S3 for object/file storage accessed via API; EBS for block storage attached to a single EC2 instance' },
      { against: 'EFS', criteria: 'S3 for object storage via HTTP API; EFS for POSIX-compliant shared filesystem mounted by multiple instances' },
      { against: 'Azure Blob Storage', criteria: 'Both are object stores; S3 has deeper AWS ecosystem integration, Blob has Azure integration' }
    ],
    interviewTips: [
      'S3 consistency model: strong read-after-write consistency for all operations since December 2020',
      'Know the storage class cost tiers and when to use each (Standard vs IA vs Glacier)',
      'Security: bucket policies (resource-based), ACLs (legacy), IAM policies (identity-based), and Block Public Access',
      'Performance: S3 can handle 5,500 GET and 3,500 PUT requests per second per prefix'
    ],
    resources: [
      { label: 'S3 User Guide', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/' },
      { label: 'S3 Storage Classes', url: 'https://aws.amazon.com/s3/storage-classes/' }
    ]
  },
  {
    id: 'ebs',
    name: 'EBS (Elastic Block Store)',
    category: 'storage',
    order: 6,
    oneLiner: 'Persistent block storage volumes for EC2 instances, like virtual hard drives.',
    whenToUse: [
      'Boot volumes for EC2 instances (root filesystem)',
      'Database storage requiring consistent low-latency I/O (RDS, self-managed databases)',
      'Applications needing filesystem-level access (not object/API-based)',
      'Workloads requiring snapshots for backup and disaster recovery'
    ],
    keyFeatures: [
      'Volume types: gp3/gp2 (general SSD), io2/io1 (provisioned IOPS SSD), st1 (throughput HDD), sc1 (cold HDD)',
      'gp3 baseline: 3,000 IOPS / 125 MB/s, independently scalable up to 16,000 IOPS / 1,000 MB/s',
      'Snapshots stored in S3 for point-in-time backups; incremental (only changed blocks stored)',
      'Multi-Attach (io2 only) allows a single volume to attach to up to 16 Nitro instances',
      'Encryption at rest using KMS keys with no performance impact on Nitro instances',
      'Elastic Volumes: resize, change type, or adjust IOPS without downtime'
    ],
    vsAlternatives: [
      { against: 'S3', criteria: 'EBS for block-level access attached to EC2; S3 for object storage accessed via HTTP API' },
      { against: 'Instance Store', criteria: 'EBS for persistent data that survives instance stop/terminate; instance store for ephemeral high-IOPS scratch space' },
      { against: 'EFS', criteria: 'EBS for single-instance attachment (except Multi-Attach); EFS for shared filesystem across multiple instances' }
    ],
    interviewTips: [
      'gp3 vs gp2: gp3 is newer, cheaper, and lets you provision IOPS independently of volume size',
      'EBS volumes are AZ-scoped; to move across AZs, snapshot and restore',
      'RAID 0 across multiple EBS volumes for higher throughput; RAID is managed at OS level, not by AWS',
      'EBS-optimized instances have dedicated bandwidth for EBS I/O, preventing network contention'
    ],
    resources: [
      { label: 'EBS Volume Types', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html' },
      { label: 'EBS Performance Guide', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-performance.html' }
    ]
  },

  // ── Database ──────────────────────────────────────────────────────────
  {
    id: 'rds',
    name: 'RDS (Relational Database Service)',
    category: 'database',
    order: 7,
    oneLiner: 'Managed relational databases: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server.',
    whenToUse: [
      'Applications requiring ACID transactions and relational data models',
      'Lift-and-shift migrations from on-premises relational databases',
      'Workloads where managed backups, patching, and Multi-AZ failover reduce operational burden',
      'Read-heavy workloads that benefit from up to 15 read replicas'
    ],
    keyFeatures: [
      'Multi-AZ deployments provide synchronous replication and automatic failover (< 60 seconds)',
      'Automated backups with point-in-time recovery within the retention period (up to 35 days)',
      'Read replicas for read scaling (async replication); can be promoted to standalone instances',
      'Performance Insights provides database performance monitoring and query-level analysis',
      'RDS Proxy manages connection pooling, reducing database connection overhead for Lambda/serverless',
      'Supports encryption at rest (KMS) and in transit (SSL/TLS)'
    ],
    vsAlternatives: [
      { against: 'Aurora', criteria: 'RDS for standard engine compatibility and lower cost; Aurora for 5x MySQL/3x PostgreSQL performance and auto-scaling storage' },
      { against: 'DynamoDB', criteria: 'RDS for complex queries, joins, and ACID transactions; DynamoDB for single-digit ms latency at any scale with key-value access patterns' },
      { against: 'Self-managed on EC2', criteria: 'RDS for operational simplicity; EC2 for full engine control, custom configurations, or unsupported engines' }
    ],
    interviewTips: [
      'Multi-AZ is for availability (synchronous), read replicas are for performance (asynchronous)',
      'Know the failover process: Multi-AZ flips the DNS CNAME, applications should use the endpoint not IP',
      'RDS Proxy: essential for Lambda workloads to avoid exhausting database connection limits',
      'Storage auto-scaling scales EBS storage automatically; cannot scale down once increased'
    ],
    resources: [
      { label: 'RDS User Guide', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/' },
      { label: 'RDS Best Practices', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html' }
    ]
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'database',
    order: 8,
    oneLiner: 'Cloud-native relational database with MySQL/PostgreSQL compatibility at 5x/3x performance.',
    whenToUse: [
      'High-performance relational workloads needing better throughput than standard RDS',
      'Applications requiring auto-scaling storage (up to 128 TB) without pre-provisioning',
      'Global applications needing cross-region replication with < 1 second lag (Aurora Global Database)',
      'Variable workloads that benefit from Aurora Serverless v2 (scales to zero)'
    ],
    keyFeatures: [
      'Distributed storage engine: 6 copies of data across 3 AZs, tolerates loss of 2 copies for writes, 3 for reads',
      'Aurora Serverless v2: scales compute in fine-grained increments (0.5 ACU) based on demand',
      'Aurora Global Database: up to 5 secondary regions with < 1 second replication lag',
      'Fast cloning creates full database copies in seconds using copy-on-write (great for testing)',
      'Backtrack: rewind the database to a specific point in time without restoring from backup',
      'Up to 15 read replicas with < 10ms replica lag (vs 100ms+ for standard RDS replicas)'
    ],
    vsAlternatives: [
      { against: 'RDS MySQL/PostgreSQL', criteria: 'Aurora for higher performance, auto-scaling storage, and fast failover; RDS for lower cost and standard engine behavior' },
      { against: 'DynamoDB', criteria: 'Aurora for SQL queries and complex joins; DynamoDB for key-value at massive scale' },
      { against: 'CockroachDB/Spanner', criteria: 'Aurora for MySQL/PostgreSQL compatibility; CockroachDB/Spanner for globally distributed ACID transactions' }
    ],
    interviewTips: [
      'Aurora storage is separate from compute: storage auto-scales, compute can be Serverless v2 or provisioned',
      'Failover: Aurora promotes a read replica in < 30 seconds (vs ~60 seconds for RDS Multi-AZ)',
      'Aurora Serverless v2 scales per-instance; set min/max ACU to control cost and performance',
      'Cost: Aurora is ~20% more expensive than RDS but can reduce total cost through fewer replicas needed'
    ],
    resources: [
      { label: 'Aurora User Guide', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/' },
      { label: 'Aurora Serverless v2', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html' }
    ]
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    category: 'database',
    order: 9,
    oneLiner: 'Fully managed NoSQL key-value and document database with single-digit ms latency at any scale.',
    whenToUse: [
      'High-throughput, low-latency workloads: session stores, gaming leaderboards, IoT telemetry',
      'Applications with well-defined access patterns that fit key-value or key-document models',
      'Serverless architectures where DynamoDB scales seamlessly with Lambda',
      'Workloads needing global tables with multi-region active-active replication'
    ],
    keyFeatures: [
      'Single-digit millisecond latency at any scale; tables can handle millions of requests per second',
      'On-demand and provisioned capacity modes; auto-scaling available for provisioned mode',
      'Global Tables provide multi-region, fully replicated tables with active-active writes',
      'DynamoDB Streams captures item-level changes for event-driven architectures (CDC)',
      'DAX (DynamoDB Accelerator): in-memory cache for microsecond response times',
      'PartiQL: SQL-compatible query language for DynamoDB'
    ],
    vsAlternatives: [
      { against: 'RDS/Aurora', criteria: 'DynamoDB for simple access patterns at massive scale; RDS/Aurora for complex queries, joins, and SQL' },
      { against: 'MongoDB', criteria: 'DynamoDB for serverless, fully managed NoSQL; MongoDB for richer query language and flexible schema' },
      { against: 'ElastiCache Redis', criteria: 'DynamoDB for persistent NoSQL with DAX for caching; Redis for pure in-memory caching and data structures' }
    ],
    interviewTips: [
      'Single-table design: model all entities in one table using composite keys; avoid relational thinking',
      'Partition key selection is critical: high-cardinality keys distribute load evenly; hot partitions cause throttling',
      'GSI vs LSI: GSI creates a separate partition (eventually consistent); LSI shares the base table partition (strongly consistent)',
      'Know the item size limit (400 KB) and the difference between query (single partition) and scan (full table)'
    ],
    resources: [
      { label: 'DynamoDB Developer Guide', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/' },
      { label: 'DynamoDB Single-Table Design', url: 'https://www.alexdebrie.com/posts/dynamodb-single-table/' }
    ]
  },
  {
    id: 'elasticache',
    name: 'ElastiCache',
    category: 'database',
    order: 10,
    oneLiner: 'Managed in-memory caching with Redis or Memcached for microsecond response times.',
    whenToUse: [
      'Caching database query results to reduce load on RDS/Aurora',
      'Session storage for web applications requiring fast, shared state',
      'Real-time leaderboards, rate limiting, and pub/sub messaging (Redis)',
      'Reducing latency for frequently accessed data from microseconds to sub-millisecond'
    ],
    keyFeatures: [
      'Redis: supports data structures (strings, hashes, lists, sets, sorted sets), persistence, replication, pub/sub, Lua scripting',
      'Memcached: simple key-value cache, multi-threaded, ideal for pure caching without persistence',
      'Redis Cluster mode: automatic sharding across up to 500 shards for horizontal scaling',
      'Multi-AZ with automatic failover for Redis replication groups',
      'ElastiCache Serverless: auto-scaling, pay-per-use pricing without capacity planning',
      'Encryption at rest and in transit, IAM authentication, Redis AUTH'
    ],
    vsAlternatives: [
      { against: 'DynamoDB DAX', criteria: 'ElastiCache for general-purpose caching and data structures; DAX specifically for DynamoDB query caching' },
      { against: 'MemoryDB for Redis', criteria: 'ElastiCache for caching (data loss acceptable); MemoryDB for durable Redis-compatible database' },
      { against: 'Self-managed Redis', criteria: 'ElastiCache for managed operations (patching, backups, failover); self-managed for full control and configuration' }
    ],
    interviewTips: [
      'Redis vs Memcached: Redis for persistence, data structures, replication; Memcached for simple caching with multi-threading',
      'Caching patterns: cache-aside (lazy loading), write-through, write-behind, read-through',
      'Cache eviction policies: allkeys-lru, volatile-lru, allkeys-lfu. Choose based on access patterns',
      'Know how to handle cache stampede (thundering herd): use distributed locks or probabilistic early expiration'
    ],
    resources: [
      { label: 'ElastiCache User Guide', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/' },
      { label: 'Caching Strategies (AWS)', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Strategies.html' }
    ]
  },

  // ── Networking ────────────────────────────────────────────────────────
  {
    id: 'vpc',
    name: 'VPC (Virtual Private Cloud)',
    category: 'networking',
    order: 11,
    oneLiner: 'Isolated virtual network where you launch AWS resources with full control over IP addressing, routing, and security.',
    whenToUse: [
      'Every production AWS deployment: VPC is the foundational networking layer',
      'Isolating workloads with private subnets (databases) and public subnets (load balancers)',
      'Connecting to on-premises networks via VPN or Direct Connect',
      'Multi-account architectures using VPC peering or Transit Gateway'
    ],
    keyFeatures: [
      'Subnets: public (route to Internet Gateway) and private (route to NAT Gateway for outbound only)',
      'Security Groups (stateful, instance-level firewall) and NACLs (stateless, subnet-level firewall)',
      'NAT Gateway for private subnet internet access; VPC Endpoints for private AWS service access without internet',
      'VPC Peering for direct cross-VPC communication; Transit Gateway for hub-and-spoke multi-VPC connectivity',
      'Flow Logs capture network traffic metadata for security analysis and troubleshooting',
      'CIDR planning: choose non-overlapping ranges for peering; use /16 for production VPCs'
    ],
    vsAlternatives: [
      { against: 'Default VPC', criteria: 'Custom VPC for production with private subnets and controlled access; default VPC for quick experiments' },
      { against: 'VPC Peering vs Transit Gateway', criteria: 'Peering for small number of VPC connections (1:1); Transit Gateway for hub-and-spoke with many VPCs' },
      { against: 'On-premises network', criteria: 'VPC extends your data center to the cloud; use VPN for encrypted tunnels or Direct Connect for dedicated links' }
    ],
    interviewTips: [
      'Know the difference between Security Groups (stateful, allow-only) and NACLs (stateless, allow/deny)',
      'NAT Gateway vs NAT Instance: NAT Gateway is managed, highly available, and scales automatically',
      'VPC Endpoints: Gateway endpoints (S3, DynamoDB) are free; Interface endpoints (PrivateLink) cost per hour + per GB',
      'CIDR planning: always plan for growth; cannot add overlapping CIDRs, difficult to change later'
    ],
    resources: [
      { label: 'VPC User Guide', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/' },
      { label: 'VPC Networking Best Practices', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-best-practices.html' }
    ]
  },
  {
    id: 'route53',
    name: 'Route 53',
    category: 'networking',
    order: 12,
    oneLiner: 'Scalable DNS service with health checking, traffic routing, and domain registration.',
    whenToUse: [
      'DNS management for your domains with 100% availability SLA',
      'Routing policies: weighted (A/B testing), latency-based (geo-proximity), failover (DR), geolocation',
      'Health checking endpoints and automatically failing over to healthy resources',
      'Domain registration and DNSSEC for security'
    ],
    keyFeatures: [
      'Record types: A, AAAA, CNAME, MX, TXT, NS, SOA, ALIAS (AWS-specific for apex domains)',
      'Routing policies: simple, weighted, latency, failover, geolocation, geoproximity, multivalue answer',
      'Health checks monitor HTTP/HTTPS/TCP endpoints; trigger CloudWatch alarms and DNS failover',
      'ALIAS records: free, work at zone apex, resolve to AWS resources (ALB, CloudFront, S3)',
      'Private hosted zones for DNS within VPCs (internal service discovery)',
      'DNSSEC signing for protection against DNS spoofing'
    ],
    vsAlternatives: [
      { against: 'Cloudflare DNS', criteria: 'Route 53 for deep AWS integration and routing policies; Cloudflare for CDN+DNS combo and DDoS protection' },
      { against: 'Google Cloud DNS', criteria: 'Route 53 for AWS-native; Cloud DNS for GCP-native. Both offer 100% availability SLA' }
    ],
    interviewTips: [
      'ALIAS vs CNAME: ALIAS works at zone apex, is free, and resolves to AWS resources. CNAME cannot be at zone apex',
      'Know all routing policies and when to use each: weighted for gradual rollouts, latency for global apps, failover for DR',
      'Route 53 health checks can trigger automated failover: active-passive (primary/secondary) or active-active (multivalue)',
      'Hosted zone charges: $0.50/month per hosted zone + $0.40 per million queries (standard)'
    ],
    resources: [
      { label: 'Route 53 Developer Guide', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/' },
      { label: 'Route 53 Routing Policies', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html' }
    ]
  },
  {
    id: 'cloudfront',
    name: 'CloudFront',
    category: 'networking',
    order: 13,
    oneLiner: 'Global CDN that caches content at 450+ edge locations for low-latency delivery.',
    whenToUse: [
      'Serving static assets (images, CSS, JS) globally with low latency',
      'Accelerating dynamic API responses with regional edge caches',
      'Streaming video with adaptive bitrate using signed URLs/cookies',
      'DDoS protection with AWS Shield integration and WAF rules at the edge'
    ],
    keyFeatures: [
      'Edge locations in 90+ cities across 47 countries for sub-50ms latency globally',
      'Origin types: S3, ALB, EC2, custom HTTP servers, MediaStore, Lambda@Edge',
      'Cache behaviors: path-based routing with different TTLs, headers, and origin per path pattern',
      'Signed URLs and signed cookies for private content distribution',
      'CloudFront Functions (lightweight JS at edge) and Lambda@Edge (full Lambda at edge)',
      'Origin Shield: centralized caching layer that reduces origin load'
    ],
    vsAlternatives: [
      { against: 'S3 static hosting', criteria: 'CloudFront for global performance, HTTPS, custom domains, and caching; S3 alone for simple regional hosting' },
      { against: 'Cloudflare', criteria: 'CloudFront for AWS-native integration; Cloudflare for broader security features and simpler pricing' },
      { against: 'API Gateway', criteria: 'CloudFront for caching and global distribution; API Gateway for API management, auth, and rate limiting' }
    ],
    interviewTips: [
      'CloudFront Functions vs Lambda@Edge: Functions are cheaper and faster (sub-ms) for simple tasks; Lambda@Edge for complex logic with network access',
      'Cache invalidation costs $0 for the first 1,000 paths/month; use versioned filenames instead when possible',
      'Origin Access Control (OAC) restricts S3 access to only CloudFront; replaces legacy Origin Access Identity (OAI)',
      'Price classes: use PriceClass_100 (US/EU only) to reduce costs if your audience is regional'
    ],
    resources: [
      { label: 'CloudFront Developer Guide', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/' },
      { label: 'CloudFront Best Practices', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/best-practices.html' }
    ]
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    category: 'networking',
    order: 14,
    oneLiner: 'Fully managed service to create, publish, and secure REST, HTTP, and WebSocket APIs.',
    whenToUse: [
      'Building serverless APIs with Lambda backend integration',
      'Adding authentication (Cognito, Lambda authorizers), throttling, and API keys to existing services',
      'Creating WebSocket APIs for real-time applications (chat, notifications)',
      'API versioning and stage management (dev, staging, prod) with canary releases'
    ],
    keyFeatures: [
      'REST API: full-featured with request validation, transformation, caching, and WAF integration',
      'HTTP API: simpler, faster, and 71% cheaper than REST API for proxy-style integrations',
      'WebSocket API: persistent connections for real-time bidirectional communication',
      'Usage plans and API keys for monetization and rate limiting per consumer',
      'Request/response transformation using Velocity Template Language (VTL)',
      'Custom domain names with ACM certificates and base path mapping'
    ],
    vsAlternatives: [
      { against: 'ALB', criteria: 'API Gateway for serverless APIs with auth and throttling; ALB for container/EC2 workloads needing Layer 7 routing' },
      { against: 'AppSync', criteria: 'API Gateway for REST/HTTP APIs; AppSync for GraphQL APIs with real-time subscriptions' },
      { against: 'Kong/Tyk', criteria: 'API Gateway for AWS-native serverless; Kong/Tyk for self-managed, multi-cloud API management' }
    ],
    interviewTips: [
      'REST API vs HTTP API: HTTP API is cheaper and faster but lacks request validation, caching, and WAF. Choose REST API when you need those features',
      'Know the integration types: Lambda proxy (pass-through), Lambda custom (VTL mapping), HTTP proxy, AWS service proxy',
      'Throttling: account-level (10K RPS default), stage-level, and method-level. 429 Too Many Requests when exceeded',
      'Cold starts: API Gateway + Lambda cold starts compound; use Provisioned Concurrency for latency-sensitive APIs'
    ],
    resources: [
      { label: 'API Gateway Developer Guide', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/' },
      { label: 'REST vs HTTP API', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html' }
    ]
  },

  // ── Security ──────────────────────────────────────────────────────────
  {
    id: 'iam',
    name: 'IAM (Identity and Access Management)',
    category: 'security',
    order: 15,
    oneLiner: 'Global service for managing authentication (who) and authorization (what they can do) in AWS.',
    whenToUse: [
      'Every AWS account: IAM is the foundation of all access control',
      'Creating fine-grained permissions for users, groups, roles, and services',
      'Cross-account access using IAM roles with trust policies',
      'Temporary credentials with STS (Security Token Service) for federated users'
    ],
    keyFeatures: [
      'Policies: identity-based (attached to users/roles), resource-based (attached to resources), and SCPs (organization-wide)',
      'Roles: assumable identities for services (EC2, Lambda), cross-account access, and federated users',
      'IAM Identity Center (SSO): centralized access management for multiple AWS accounts',
      'Policy evaluation logic: explicit deny > explicit allow > implicit deny',
      'Condition keys for fine-grained control: IP restrictions, MFA requirements, time-based access',
      'Access Analyzer identifies resources shared externally and validates policies'
    ],
    vsAlternatives: [
      { against: 'Cognito', criteria: 'IAM for AWS resource access control; Cognito for application user authentication (sign-up, sign-in, social identity)' },
      { against: 'Resource-based policies', criteria: 'IAM policies for identity-centric control; resource policies (S3, SQS, Lambda) for resource-centric cross-account access' },
      { against: 'Azure AD/Entra ID', criteria: 'IAM for AWS-native access; Azure AD for Microsoft ecosystem and hybrid identity' }
    ],
    interviewTips: [
      'Least privilege: start with zero permissions and add only what is needed. Use Access Advisor to identify unused permissions',
      'Know the policy evaluation order: organization SCP -> resource policy -> identity policy -> permission boundary -> session policy',
      'Roles vs users: prefer roles for services and cross-account access; roles provide temporary credentials automatically',
      'MFA: enforce MFA for all human users, especially for privileged operations and console access'
    ],
    resources: [
      { label: 'IAM User Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/' },
      { label: 'IAM Policy Evaluation Logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' }
    ]
  },

  // ── Messaging ─────────────────────────────────────────────────────────
  {
    id: 'sqs',
    name: 'SQS (Simple Queue Service)',
    category: 'messaging',
    order: 16,
    oneLiner: 'Fully managed message queue for decoupling microservices and buffering workloads.',
    whenToUse: [
      'Decoupling producers from consumers to handle traffic spikes without data loss',
      'Work queues: distributing tasks to multiple worker processes',
      'Buffering writes to a database or downstream service that cannot handle burst traffic',
      'Dead-letter queues for isolating and debugging failed message processing'
    ],
    keyFeatures: [
      'Standard queues: unlimited throughput, at-least-once delivery, best-effort ordering',
      'FIFO queues: exactly-once processing, strict ordering, 3,000 messages/second (with batching)',
      'Long polling reduces empty responses and API calls by waiting up to 20 seconds for messages',
      'Visibility timeout: message is hidden from other consumers while being processed (default 30s)',
      'Dead-letter queues automatically move messages that fail processing after configurable retries',
      'Message retention from 1 minute to 14 days; max message size 256 KB (use S3 for larger payloads)'
    ],
    vsAlternatives: [
      { against: 'SNS', criteria: 'SQS for point-to-point queuing; SNS for fan-out pub/sub to multiple subscribers' },
      { against: 'EventBridge', criteria: 'SQS for simple queuing; EventBridge for event routing with content-based filtering and schema registry' },
      { against: 'Kafka (MSK)', criteria: 'SQS for simple decoupling; Kafka for high-throughput event streaming with replay and partitioning' }
    ],
    interviewTips: [
      'Standard vs FIFO: Standard for high throughput with potential duplicates; FIFO for ordering guarantees with lower throughput',
      'Visibility timeout must be longer than your processing time; extend it programmatically for long tasks',
      'SQS + Lambda: Lambda polls SQS and auto-scales consumers. Set batch size and concurrency limits appropriately',
      'Dead-letter queue redrive: use the new DLQ redrive feature to replay failed messages back to the source queue'
    ],
    resources: [
      { label: 'SQS Developer Guide', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/' },
      { label: 'SQS Best Practices', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html' }
    ]
  },
  {
    id: 'sns',
    name: 'SNS (Simple Notification Service)',
    category: 'messaging',
    order: 17,
    oneLiner: 'Managed pub/sub messaging service for fan-out notifications to multiple subscribers.',
    whenToUse: [
      'Fan-out: one event needs to trigger multiple downstream systems simultaneously',
      'Sending notifications: email, SMS, push notifications, HTTP webhooks',
      'SNS + SQS pattern: publish once, deliver to multiple SQS queues for independent processing',
      'CloudWatch alarm notifications to PagerDuty, Slack, or email'
    ],
    keyFeatures: [
      'Topics: named channels that subscribers listen to; supports Standard and FIFO topics',
      'Subscriber types: SQS, Lambda, HTTP/S endpoints, email, SMS, mobile push, Kinesis Data Firehose',
      'Message filtering: subscribers can set filter policies to receive only matching messages',
      'Fan-out pattern: one SNS publish can deliver to thousands of SQS queues simultaneously',
      'Message attributes for metadata without affecting the message body',
      'Cross-region delivery and cross-account subscriptions via topic policies'
    ],
    vsAlternatives: [
      { against: 'SQS', criteria: 'SNS for pub/sub fan-out to many subscribers; SQS for point-to-point queue between producer and consumer' },
      { against: 'EventBridge', criteria: 'SNS for simple fan-out; EventBridge for content-based routing with 200+ AWS service integrations' },
      { against: 'Kafka (MSK)', criteria: 'SNS for simple notifications; Kafka for ordered, replayable event streams' }
    ],
    interviewTips: [
      'SNS + SQS fan-out is the most common pattern: decouple publishers from consumers with independent queue processing',
      'FIFO topics preserve ordering and support deduplication; pair with FIFO SQS queues',
      'Message filtering at the subscription level reduces unnecessary processing and cost',
      'Know the delivery retry policies: HTTP/S retries exponentially; SQS/Lambda delivery is highly reliable'
    ],
    resources: [
      { label: 'SNS Developer Guide', url: 'https://docs.aws.amazon.com/sns/latest/dg/' },
      { label: 'SNS Fan-out Pattern', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-common-scenarios.html' }
    ]
  },
  {
    id: 'eventbridge',
    name: 'EventBridge',
    category: 'messaging',
    order: 18,
    oneLiner: 'Serverless event bus for building event-driven architectures with content-based routing.',
    whenToUse: [
      'Routing events from AWS services (EC2 state changes, S3 events) to targets based on content',
      'Building event-driven architectures with loose coupling between microservices',
      'Scheduling tasks with cron or rate expressions (replaces CloudWatch Events)',
      'Integrating with SaaS partners (Zendesk, Auth0, Shopify) via partner event sources'
    ],
    keyFeatures: [
      'Event rules with pattern matching: filter events by source, detail-type, and JSON content',
      'Schema registry: auto-discovers event schemas for code generation and validation',
      'Archive and replay: store events and replay them for debugging or reprocessing',
      'Event buses: default (AWS events), custom (your events), and partner (SaaS events)',
      'Targets: Lambda, SQS, SNS, Step Functions, API Gateway, ECS tasks, and 20+ more',
      'Pipes: point-to-point integrations with filtering, enrichment, and transformation'
    ],
    vsAlternatives: [
      { against: 'SNS', criteria: 'EventBridge for content-based routing and schema management; SNS for simple fan-out without event filtering' },
      { against: 'SQS', criteria: 'EventBridge for event routing to multiple targets; SQS for reliable point-to-point message queuing' },
      { against: 'Step Functions', criteria: 'EventBridge for event routing; Step Functions for orchestrating multi-step workflows' }
    ],
    interviewTips: [
      'EventBridge is the evolution of CloudWatch Events with more features (schema registry, archive/replay, SaaS integrations)',
      'Know the event pattern matching syntax: prefix, suffix, numeric ranges, exists/not-exists, OR logic',
      'Archive and replay is powerful for debugging: replay production events in a test environment',
      'EventBridge Pipes vs rules: Pipes for 1:1 integrations with enrichment; rules for 1:many fan-out'
    ],
    resources: [
      { label: 'EventBridge User Guide', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/' },
      { label: 'EventBridge Patterns', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/aws-events.html' }
    ]
  },

  // ── Monitoring ────────────────────────────────────────────────────────
  {
    id: 'cloudwatch',
    name: 'CloudWatch',
    category: 'monitoring',
    order: 19,
    oneLiner: 'AWS-native monitoring service for metrics, logs, alarms, and dashboards.',
    whenToUse: [
      'Monitoring AWS resource metrics (EC2 CPU, RDS connections, Lambda duration)',
      'Centralized log aggregation and analysis with CloudWatch Logs',
      'Setting alarms that trigger Auto Scaling, SNS notifications, or Lambda functions',
      'Creating operational dashboards for real-time visibility'
    ],
    keyFeatures: [
      'Metrics: built-in AWS metrics + custom metrics with dimensions and statistics (avg, p99, max)',
      'Logs: log groups and streams with Insights query language, metric filters, and subscription filters',
      'Alarms: threshold-based, anomaly detection, composite alarms, and math expressions',
      'Dashboards: shareable real-time dashboards with widgets for metrics, logs, and alarms',
      'Contributor Insights: identify top-N contributors (IP addresses, error codes) in log data',
      'Synthetics: canary scripts that monitor endpoints and APIs on a schedule'
    ],
    vsAlternatives: [
      { against: 'Datadog', criteria: 'CloudWatch for AWS-native monitoring at lower cost; Datadog for multi-cloud, richer APM, and better UX' },
      { against: 'Prometheus + Grafana', criteria: 'CloudWatch for managed AWS monitoring; Prometheus/Grafana for Kubernetes-native and multi-cloud with more flexibility' },
      { against: 'X-Ray', criteria: 'CloudWatch for metrics and logs; X-Ray specifically for distributed tracing' }
    ],
    interviewTips: [
      'Default EC2 metrics are 5-minute intervals; enable detailed monitoring for 1-minute intervals (extra cost)',
      'Custom metrics: use PutMetricData API; high-resolution metrics support 1-second granularity',
      'CloudWatch Logs Insights: know the query syntax for common operations (filter, stats, sort, parse)',
      'Alarms: understand the OK/ALARM/INSUFFICIENT_DATA states and evaluation periods vs datapoints to alarm'
    ],
    resources: [
      { label: 'CloudWatch User Guide', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/' },
      { label: 'CloudWatch Logs Insights Syntax', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html' }
    ]
  },

  // ── Serverless ────────────────────────────────────────────────────────
  {
    id: 'step-functions',
    name: 'Step Functions',
    category: 'serverless',
    order: 20,
    oneLiner: 'Visual workflow orchestration for coordinating distributed applications and microservices.',
    whenToUse: [
      'Orchestrating multi-step business workflows (order processing, user onboarding)',
      'Coordinating parallel tasks with fan-out/fan-in patterns',
      'Building human approval workflows with task tokens and wait states',
      'Error handling with retry logic, catch blocks, and fallback states'
    ],
    keyFeatures: [
      'State types: Task, Choice (branching), Parallel, Map (iteration), Wait, Pass, Succeed, Fail',
      'Standard workflows: durable, up to 1-year execution, exactly-once, priced per state transition',
      'Express workflows: high-volume, up to 5-minute execution, at-least-once, priced per invocation and duration',
      'Direct SDK integrations with 200+ AWS services without writing Lambda glue code',
      'Visual workflow designer and execution history for debugging',
      'Distributed Map: process millions of items from S3 in parallel at scale'
    ],
    vsAlternatives: [
      { against: 'Lambda orchestration', criteria: 'Step Functions for complex workflows with branching and error handling; direct Lambda invocation for simple 1-2 step flows' },
      { against: 'EventBridge', criteria: 'Step Functions for ordered, stateful workflows; EventBridge for event-driven, stateless routing' },
      { against: 'Airflow (MWAA)', criteria: 'Step Functions for serverless workflow orchestration; Airflow for data pipeline DAGs with Python-based definitions' }
    ],
    interviewTips: [
      'Standard vs Express: Standard for long-running workflows needing exactly-once; Express for high-volume, short-duration, idempotent tasks',
      'Know the service integration patterns: request-response (sync), run a job (.sync), wait for callback (.waitForTaskToken)',
      'Error handling: use Retry with exponential backoff and Catch to route errors to fallback states',
      'Use direct SDK integrations instead of wrapping everything in Lambda to reduce cost and latency'
    ],
    resources: [
      { label: 'Step Functions Developer Guide', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/' },
      { label: 'Step Functions Workflow Patterns', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/concepts-standard-vs-express.html' }
    ]
  }
];
