import { GolangTopic } from '../models/golang.model';

export const GOLANG_TOPICS: GolangTopic[] = [
  // ── Fundamentals ────────────────────────────────────────────────────
  {
    id: 'go-basics',
    title: 'Go Fundamentals',
    category: 'fundamentals',
    order: 1,
    explanation:
      'Go is a statically typed, compiled language designed for simplicity, performance, and concurrency. Unlike traditional OOP languages, Go has no classes or inheritance. Instead, it uses structs to define data types and interfaces for polymorphism. Embedding allows struct composition (has-a relationship) rather than inheritance (is-a relationship).\n\nType assertions let you extract the concrete type from an interface value. They come in two forms: the single-return form (panics on failure) and the comma-ok form (safe). Type switches are a cleaner way to handle multiple possible types from an interface.\n\nGo uses a unique error handling philosophy: errors are values, not exceptions. Functions return errors as the last return value, and callers must explicitly check them. This makes the error path visible and forces developers to think about failure modes at every step. The init() function runs before main() and is used for package-level initialization. Multiple init() functions can exist in a single package and run in source file order.',
    codeExamples: [
      {
        title: 'Structs, Embedding & Methods',
        code: `// Base struct
type Address struct {
    Street string
    City   string
    State  string
}

func (a Address) FullAddress() string {
    return a.Street + ", " + a.City + ", " + a.State
}

// Embedding: Employee "has-a" Address
type Employee struct {
    Address          // embedded (promoted fields/methods)
    Name    string
    Salary  float64
}

func main() {
    emp := Employee{
        Name:   "Alice",
        Salary: 90000,
        Address: Address{
            Street: "123 Main St",
            City:   "Portland",
            State:  "OR",
        },
    }

    // Promoted method - called directly on Employee
    fmt.Println(emp.FullAddress()) // "123 Main St, Portland, OR"
    fmt.Println(emp.City)          // "Portland" - promoted field
}`,
        explanation: 'Embedding promotes the inner struct\'s fields and methods to the outer struct. This is Go\'s composition mechanism -- there is no inheritance. The Employee struct can directly access Address methods and fields without delegation boilerplate.'
      },
      {
        title: 'Type Assertions & Type Switches',
        code: `func describe(i interface{}) string {
    // Type switch: clean way to handle multiple types
    switch v := i.(type) {
    case string:
        return "String of length " + strconv.Itoa(len(v))
    case int:
        return "Integer: " + strconv.Itoa(v)
    case bool:
        return "Boolean: " + strconv.FormatBool(v)
    case nil:
        return "Nil value"
    default:
        return fmt.Sprintf("Unknown type: %T", v)
    }
}

func safeCast(i interface{}) {
    // Comma-ok form: safe type assertion
    s, ok := i.(string)
    if ok {
        fmt.Println("Got string:", s)
    } else {
        fmt.Println("Not a string, actual type:", reflect.TypeOf(i))
    }

    // Single-return form: PANICS if wrong type
    // s := i.(string)  // panic if i is not a string
}`,
        explanation: 'Type assertions extract the concrete value from an interface. Always use the comma-ok form (value, ok := i.(Type)) in production code to avoid panics. Type switches are preferred when you need to handle multiple possible types -- they are cleaner than chained if-else type assertions.'
      },
      {
        title: 'Zero Values & Declaration Patterns',
        code: `func main() {
    // Zero values: Go initializes all variables
    var i int        // 0
    var f float64    // 0.0
    var b bool       // false
    var s string     // "" (empty string)
    var p *int       // nil
    var sl []int     // nil (but len=0, cap=0, usable with append)
    var m map[string]int // nil (NOT safe for writes!)

    // Short declaration (most common)
    name := "Alice"
    age := 30

    // Multiple return values
    result, err := divide(10, 0)
    if err != nil {
        log.Fatal(err) // handle error immediately
    }

    // Blank identifier discards unwanted values
    _, err = divide(10, 3)

    // Constants: untyped until used
    const pi = 3.14159
    const (
        StatusPending = iota  // 0
        StatusActive          // 1
        StatusClosed          // 2
    )
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}`,
        explanation: 'Go assigns zero values to all declared variables -- there are no uninitialized variables. This eliminates an entire class of bugs. Note: nil maps panic on write (use make(map[...]) instead), but nil slices are safe for append. The iota keyword auto-increments within const blocks and is used for enumerations.'
      }
    ],
    bestPractices: [
      'Prefer short variable declarations (:=) inside functions; use var for package-level or when you need the zero value explicitly',
      'Always handle errors immediately after the function call, not later',
      'Use embedding for composition, never simulate inheritance with embedded interfaces that you then override',
      'Name return values only for documentation purposes in short functions, not as a general practice',
      'Use iota for related constants, but consider string-based enums (type Status string) when readability matters more'
    ],
    commonMistakes: [
      'Writing to a nil map causes a panic -- always initialize with make(map[K]V{}) or a literal',
      'Confusing pointer receivers (*T) and value receivers (T): value receivers get a copy, mutations are lost',
      'Shadowing variables with := in inner scopes (especially err), which silently creates a new variable',
      'Using named return values and forgetting that naked return statements return the current values, leading to subtle bugs',
      'Embedding a mutex in a struct and accidentally copying the struct (copies the mutex too, which is a data race)'
    ],
    interviewQuestions: [
      'What are zero values in Go and why are they important?',
      'Explain the difference between value receivers and pointer receivers. When would you use each?',
      'How does Go achieve polymorphism without class inheritance?',
      'What is the difference between make() and new() in Go?',
      'Explain what happens when you embed a struct vs. having it as a named field.'
    ],
    resources: [
      { label: 'A Tour of Go', url: 'https://go.dev/tour/' },
      { label: 'Effective Go', url: 'https://go.dev/doc/effective_go' },
      { label: 'Go by Example', url: 'https://gobyexample.com/' }
    ]
  },
  {
    id: 'pointers-memory',
    title: 'Pointers & Memory Management',
    category: 'fundamentals',
    order: 2,
    explanation:
      'Go uses pointers but has no pointer arithmetic (unlike C). A pointer holds the memory address of a value. You get a pointer with & (address-of) and dereference it with * (value-at). Pointers are essential for mutating values inside functions and for avoiding expensive copies of large structs.\n\nGo manages memory automatically with a garbage collector (GC). The runtime decides whether a variable lives on the stack (fast, auto-freed) or the heap (slower, GC-managed) through escape analysis at compile time. If a variable\'s reference escapes the function (returned, stored in a global, sent to a goroutine), it gets allocated on the heap.\n\nYou can inspect escape analysis with go build -gcflags="-m". Understanding this helps you write allocation-efficient code. The GC is a concurrent, tri-color mark-and-sweep collector that runs alongside your program. It pauses are typically under 1ms in modern Go. You can tune it with GOGC (default 100, meaning GC triggers when heap doubles).',
    codeExamples: [
      {
        title: 'Pointers Basics & Mutation',
        code: `type Config struct {
    Host    string
    Port    int
    Debug   bool
    MaxConn int
}

// Pointer receiver: mutates the original
func (c *Config) EnableDebug() {
    c.Debug = true
}

// Value receiver: works on a copy, original unchanged
func (c Config) Summary() string {
    return fmt.Sprintf("%s:%d (debug=%t)", c.Host, c.Port, c.Debug)
}

func updatePort(c *Config, port int) {
    c.Port = port // modifies original through pointer
}

func main() {
    cfg := &Config{Host: "localhost", Port: 8080, MaxConn: 100}

    cfg.EnableDebug()       // mutates cfg
    updatePort(cfg, 9090)   // mutates cfg

    fmt.Println(cfg.Summary()) // "localhost:9090 (debug=true)"

    // Nil pointer check
    var p *Config
    if p == nil {
        fmt.Println("pointer is nil, must initialize before use")
    }
}`,
        explanation: 'Use pointer receivers when the method needs to modify the struct, the struct is large (avoid copying), or for consistency (if one method uses a pointer receiver, all should). Value receivers are fine for small, immutable types like time.Time or simple read-only methods.'
      },
      {
        title: 'Stack vs Heap & Escape Analysis',
        code: `// STACK allocation: x does NOT escape
func stackAlloc() int {
    x := 42           // allocated on stack
    return x           // value is copied to caller
}

// HEAP allocation: p DOES escape
func heapAlloc() *int {
    x := 42            // x escapes to heap because its address is returned
    return &x          // pointer to x is returned
}

// Escape to heap via interface
func escapeViaInterface() {
    x := 42
    fmt.Println(x)    // x escapes: Println takes interface{}
}

// Escape via closure
func escapViaClosure() func() int {
    x := 42
    return func() int {
        return x       // x escapes: captured by closure
    }
}

// Check escape analysis:
// go build -gcflags="-m" ./...
// Output:
//   ./main.go:10: x escapes to heap
//   ./main.go:5: x does not escape`,
        explanation: 'The Go compiler performs escape analysis at compile time to decide stack vs. heap allocation. Stack allocation is faster (no GC involved). Variables escape to the heap when: their address is returned, they are stored in an interface, captured by a closure, or assigned to a package-level variable. Use go build -gcflags="-m" to see exactly what escapes.'
      },
      {
        title: 'Garbage Collector Tuning',
        code: `import "runtime"

func main() {
    // Read current GC stats
    var stats runtime.MemStats
    runtime.ReadMemStats(&stats)
    fmt.Printf("HeapAlloc: %d MB\\n", stats.HeapAlloc/1024/1024)
    fmt.Printf("NumGC: %d\\n", stats.NumGC)
    fmt.Printf("PauseTotalNs: %d ms\\n", stats.PauseTotalNs/1_000_000)

    // Force a GC cycle (rarely needed in production)
    runtime.GC()

    // GOGC controls GC frequency (env var or runtime)
    // GOGC=100 (default): GC when heap doubles
    // GOGC=200: GC when heap triples (less frequent, more memory)
    // GOGC=50:  GC when heap grows 50% (more frequent, less memory)
    debug.SetGCPercent(200)

    // GOMEMLIMIT (Go 1.19+): soft memory limit
    // Prevents OOM by triggering GC more aggressively near limit
    debug.SetMemoryLimit(512 * 1024 * 1024) // 512 MB
}`,
        explanation: 'Go\'s garbage collector is concurrent (runs alongside your code) and has sub-millisecond pauses. GOGC=100 means GC triggers when live heap doubles since last collection. GOMEMLIMIT is the modern way to control memory usage -- it acts as a soft cap that makes GC more aggressive as you approach the limit, preventing OOM kills in containers.'
      }
    ],
    bestPractices: [
      'Prefer stack allocation: return values instead of pointers when the struct is small (< ~256 bytes)',
      'Use pointer receivers consistently on a type -- mixing value and pointer receivers is confusing',
      'Set GOMEMLIMIT in containerized environments to match your pod memory limit minus some headroom',
      'Profile allocations with go test -benchmem and pprof before optimizing -- premature optimization is the root of all evil',
      'Use sync.Pool for frequently allocated short-lived objects (like buffers) to reduce GC pressure'
    ],
    commonMistakes: [
      'Dereferencing a nil pointer causes a panic -- always check for nil before using pointers received from external sources',
      'Assuming pointers are always faster: for small structs (< 64 bytes), value copies can be faster due to cache locality',
      'Returning pointers to loop variables (all iterations share the same variable in Go < 1.22)',
      'Ignoring escape analysis output and over-allocating on the heap unnecessarily',
      'Setting GOGC too low in production, causing excessive GC CPU overhead (> 5% is a red flag)'
    ],
    interviewQuestions: [
      'Explain stack vs. heap allocation in Go. How does the compiler decide where to allocate?',
      'What is escape analysis? How can you check if a variable escapes?',
      'How does Go\'s garbage collector work? What is the tri-color mark-and-sweep algorithm?',
      'When would you use a pointer receiver vs. a value receiver?',
      'What is GOGC and GOMEMLIMIT? How would you tune GC for a memory-sensitive service?'
    ],
    resources: [
      { label: 'Go GC Guide', url: 'https://tip.golang.org/doc/gc-guide' },
      { label: 'Allocation Efficiency in Go', url: 'https://segment.com/blog/allocation-efficiency-in-high-performance-go-services/' }
    ]
  },
  {
    id: 'slices-maps',
    title: 'Slices, Maps & Internal Mechanics',
    category: 'fundamentals',
    order: 3,
    explanation:
      'Slices and maps are Go\'s primary collection types. Understanding their internal mechanics is crucial for writing efficient code and avoiding subtle bugs.\n\nA slice is a three-field struct (called a slice header): a pointer to an underlying array, a length (number of elements), and a capacity (size of the underlying array). When you append beyond capacity, Go allocates a new array (roughly 2x for small slices, ~1.25x for large ones) and copies elements over. This is why append() returns a new slice -- the pointer may have changed.\n\nMaps in Go are implemented as hash tables with buckets. Each bucket holds 8 key-value pairs. When the load factor exceeds 6.5 (avg 6.5 items per bucket), the map grows by doubling the number of buckets. Maps are NOT safe for concurrent access -- use sync.RWMutex or sync.Map. Map iteration order is intentionally randomized to prevent code from depending on it.\n\nImportant: maps cannot be shrunk. Even after deleting all keys, the allocated buckets remain. If you need to reclaim memory, create a new map.',
    codeExamples: [
      {
        title: 'Slice Internals & Gotchas',
        code: `func main() {
    // Slice header: {ptr, len, cap}
    s := make([]int, 3, 5) // len=3, cap=5
    fmt.Println(len(s), cap(s)) // 3, 5

    // Append within capacity: no new allocation
    s = append(s, 4) // len=4, cap=5, same underlying array

    // Append beyond capacity: NEW array allocated
    s = append(s, 5, 6) // len=6, cap=10 (doubled)

    // GOTCHA: sub-slices share the underlying array
    original := []int{1, 2, 3, 4, 5}
    sub := original[1:3] // sub = [2, 3], shares same array

    sub[0] = 99           // modifies original! original = [1, 99, 3, 4, 5]

    // Fix: use full slice expression to limit capacity
    safe := original[1:3:3] // len=2, cap=2 (cap limited)
    safe = append(safe, 10) // allocates new array, original unaffected

    // Pre-allocate when size is known
    result := make([]string, 0, 1000) // avoids repeated growth
    for i := 0; i < 1000; i++ {
        result = append(result, strconv.Itoa(i))
    }

    // Delete element from middle (order-preserving)
    s = append(s[:2], s[3:]...) // remove index 2
}`,
        explanation: 'The critical gotcha is that sub-slices share the underlying array. Modifying a sub-slice modifies the original. Use the full slice expression s[low:high:max] to cap the capacity, forcing append to allocate a new array. Always pre-allocate with make([]T, 0, expectedSize) when you know the approximate size.'
      },
      {
        title: 'Map Patterns & Concurrent Safety',
        code: `func main() {
    // Initialize map
    users := map[string]int{
        "alice": 30,
        "bob":   25,
    }

    // Check existence (comma-ok idiom)
    age, exists := users["charlie"]
    if !exists {
        fmt.Println("charlie not found")
    }

    // Delete key
    delete(users, "bob")

    // Iterate (random order!)
    for name, age := range users {
        fmt.Printf("%s: %d\\n", name, age)
    }

    // Use map as a set
    seen := make(map[string]struct{}) // struct{} uses zero bytes
    seen["apple"] = struct{}{}
    if _, ok := seen["apple"]; ok {
        fmt.Println("already seen")
    }
}

// Concurrent-safe map with RWMutex
type SafeCache struct {
    mu    sync.RWMutex
    items map[string]string
}

func (c *SafeCache) Get(key string) (string, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.items[key]
    return val, ok
}

func (c *SafeCache) Set(key, value string) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = value
}`,
        explanation: 'Maps are NOT goroutine-safe. Concurrent reads are fine, but concurrent read+write or write+write causes a fatal runtime crash (not a data race -- Go detects it and panics). Use sync.RWMutex for read-heavy workloads (multiple concurrent readers, exclusive writer) or sync.Map for cases with many goroutines accessing disjoint keys.'
      },
      {
        title: 'Slice Memory Leaks & Cleanup',
        code: `// MEMORY LEAK: sub-slice holds reference to entire original array
func leakySubSlice() []byte {
    data := make([]byte, 1_000_000) // 1 MB
    // ... fill data ...
    return data[:10] // keeps the entire 1 MB array alive!
}

// FIX: copy to a new slice
func safeSubSlice() []byte {
    data := make([]byte, 1_000_000)
    // ... fill data ...
    result := make([]byte, 10)
    copy(result, data[:10])
    return result // only 10 bytes kept alive
}

// Clearing a slice without allocating
func clearSlice() {
    s := []int{1, 2, 3, 4, 5}

    // Reuse underlying array (zero alloc):
    s = s[:0] // len=0, cap=5, ready for append

    // vs. creating new slice (allocates):
    s = nil        // releases to GC
    s = []int{}    // empty but non-nil
}

// Growing a slice efficiently
func buildLargeSlice(n int) []int {
    // BAD: O(n) allocations as slice grows
    var bad []int
    for i := 0; i < n; i++ {
        bad = append(bad, i)
    }

    // GOOD: O(1) allocation
    good := make([]int, 0, n)
    for i := 0; i < n; i++ {
        good = append(good, i)
    }
    return good
}`,
        explanation: 'A common memory leak in Go occurs when a small sub-slice holds a reference to a very large underlying array, preventing GC from collecting the large array. Always copy the data you need when the original is much larger. Use s[:0] to reuse a slice\'s memory without allocation.'
      }
    ],
    bestPractices: [
      'Pre-allocate slices with make([]T, 0, n) when you know the expected size to avoid repeated allocations',
      'Use the full slice expression s[low:high:max] when creating sub-slices that will be appended to',
      'Use map[K]struct{} for sets instead of map[K]bool -- struct{} takes zero bytes',
      'Always use the comma-ok idiom when reading from maps to distinguish "key not found" from "zero value"',
      'Copy sub-slices when the original array is large and the sub-slice is long-lived'
    ],
    commonMistakes: [
      'Concurrent map access without synchronization causes a fatal crash, not a silent data race',
      'Assuming map iteration order is stable -- it is intentionally randomized',
      'Not realizing that append() may return a new slice header (always reassign: s = append(s, ...))',
      'Creating memory leaks by holding small sub-slices of very large arrays',
      'Using len() on a nil map returns 0 (safe), but writing to a nil map panics'
    ],
    interviewQuestions: [
      'Explain the internal structure of a Go slice. What is the slice header?',
      'What happens internally when you append to a slice beyond its capacity?',
      'Why is concurrent map access a fatal error in Go, and how do you handle it?',
      'How can a sub-slice cause a memory leak? How do you prevent it?',
      'What is the difference between a nil slice and an empty slice? When does it matter?'
    ],
    resources: [
      { label: 'Go Slices: usage and internals', url: 'https://go.dev/blog/slices-intro' },
      { label: 'Go Maps in Action', url: 'https://go.dev/blog/maps' }
    ]
  },
  {
    id: 'interfaces-composition',
    title: 'Interfaces & Composition',
    category: 'fundamentals',
    order: 4,
    explanation:
      'Go interfaces are implemented implicitly -- a type satisfies an interface by implementing its methods, with no "implements" keyword. This is called structural typing and enables powerful decoupling. You can define an interface in the consumer package without modifying the provider, which is the opposite of Java/C#.\n\nThe empty interface (interface{} or "any" in Go 1.18+) accepts any value. It is used extensively in the standard library (fmt.Println, json.Marshal) but should be avoided in your own APIs because it throws away type safety.\n\nInterface composition lets you build larger interfaces from smaller ones. The io.ReadWriter interface is composed of io.Reader and io.Writer. This follows the Interface Segregation Principle: keep interfaces small (1-3 methods) and compose them as needed.\n\nA key design principle in Go: "Accept interfaces, return structs." Functions should take interface parameters (for flexibility) but return concrete types (for clarity). Define interfaces where they are used (consumer side), not where they are implemented (producer side).',
    codeExamples: [
      {
        title: 'Implicit Interfaces & Composition',
        code: `// Small, focused interfaces (Go style)
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Interface composition
type ReadWriter interface {
    Reader
    Writer
}

// Concrete type implicitly satisfies Reader
type FileReader struct {
    path string
}

func (f *FileReader) Read(p []byte) (int, error) {
    data, err := os.ReadFile(f.path)
    if err != nil {
        return 0, err
    }
    n := copy(p, data)
    return n, nil
}

// Consumer defines what it needs (not the producer)
type DataProcessor struct{}

func (dp *DataProcessor) Process(r Reader) error {
    buf := make([]byte, 1024)
    n, err := r.Read(buf)
    if err != nil {
        return err
    }
    fmt.Printf("Processed %d bytes\\n", n)
    return nil
}

// Any type with Read() works -- even from other packages
func main() {
    dp := &DataProcessor{}
    dp.Process(&FileReader{path: "data.txt"})
    dp.Process(strings.NewReader("hello"))  // stdlib type works too!
}`,
        explanation: 'FileReader never declares "implements Reader". It just has a Read method with the right signature. This means you can satisfy interfaces from other packages without importing them. The DataProcessor accepts any Reader -- this is "accept interfaces, return structs" in action.'
      },
      {
        title: 'Interface Values, nil, and Type Assertions',
        code: `// An interface value holds two things: (type, value)
// It is nil ONLY when both type and value are nil

type Logger interface {
    Log(msg string)
}

type ConsoleLogger struct{}
func (c *ConsoleLogger) Log(msg string) {
    fmt.Println("[CONSOLE]", msg)
}

func main() {
    // Nil interface: both type and value are nil
    var l Logger
    fmt.Println(l == nil) // true

    // Non-nil interface with nil concrete value!
    var c *ConsoleLogger  // nil pointer
    l = c                 // interface holds (*ConsoleLogger, nil)
    fmt.Println(l == nil) // FALSE! type is set, only value is nil

    // This is a classic Go gotcha with error returns:
    // return (*MyError)(nil) makes err != nil check TRUE
}

// SAFE pattern: always return the interface type directly
func doWork() error {
    var err *MyError // nil
    // ... work ...

    // BAD: return err  -- returns (*MyError, nil), not nil!
    // GOOD:
    if err != nil {
        return err
    }
    return nil // returns (nil, nil) -- truly nil interface
}

type MyError struct{ msg string }
func (e *MyError) Error() string { return e.msg }`,
        explanation: 'An interface value is a two-word pair: (concrete type, concrete value). It is nil only when BOTH are nil. Assigning a nil pointer to an interface makes it non-nil because the type information is set. This is one of Go\'s most subtle gotchas, especially with error returns.'
      },
      {
        title: 'Dependency Injection with Interfaces',
        code: `// Define interfaces at the consumer (service layer)
type UserRepository interface {
    FindByID(id int64) (*User, error)
    Save(user *User) error
}

type EmailSender interface {
    Send(to, subject, body string) error
}

// Service depends on interfaces, not concrete types
type UserService struct {
    repo   UserRepository
    mailer EmailSender
}

func NewUserService(repo UserRepository, mailer EmailSender) *UserService {
    return &UserService{repo: repo, mailer: mailer}
}

func (s *UserService) Register(name, email string) error {
    user := &User{Name: name, Email: email}
    if err := s.repo.Save(user); err != nil {
        return fmt.Errorf("saving user: %w", err)
    }
    if err := s.mailer.Send(email, "Welcome!", "Hello "+name); err != nil {
        return fmt.Errorf("sending welcome email: %w", err)
    }
    return nil
}

// In production: real implementations
// In tests: mock implementations
type MockRepo struct {
    users map[int64]*User
}
func (m *MockRepo) FindByID(id int64) (*User, error) {
    return m.users[id], nil
}
func (m *MockRepo) Save(user *User) error {
    m.users[user.ID] = user
    return nil
}`,
        explanation: 'This is the standard Go pattern for dependency injection. Define small interfaces at the point of use (UserService defines what it needs). Inject implementations through constructors. In tests, swap in mocks that satisfy the same interface. No DI framework needed -- Go\'s implicit interfaces make this natural.'
      }
    ],
    bestPractices: [
      'Keep interfaces small: 1-3 methods is ideal. The bigger the interface, the weaker the abstraction',
      'Define interfaces in the package that uses them, not the package that implements them',
      'Accept interfaces, return structs: this gives callers flexibility while keeping your return types concrete',
      'Use the empty interface (any) sparingly -- it discards type safety. Prefer generics (Go 1.18+) for type-flexible code',
      'Compose interfaces from smaller ones rather than defining large monolithic interfaces'
    ],
    commonMistakes: [
      'Returning a nil concrete pointer wrapped in an interface -- the interface value is NOT nil',
      'Defining interfaces in the implementation package (Java-style) instead of the consumer package',
      'Creating "God interfaces" with 10+ methods -- violates Interface Segregation Principle',
      'Using interface{}/any as function parameters when a specific interface or generic would work',
      'Forgetting that method sets differ: a value of type T can only call value receivers, *T can call both'
    ],
    interviewQuestions: [
      'How are Go interfaces different from interfaces in Java or C#?',
      'Explain the nil interface gotcha. When is an interface value nil vs. non-nil?',
      'What does "accept interfaces, return structs" mean and why is it a best practice?',
      'How would you design a Go application using dependency injection without a framework?',
      'What is the difference between embedding an interface in a struct vs. having an interface field?'
    ],
    resources: [
      { label: 'Go Interfaces (Jordan Orelli)', url: 'https://jordanorelli.com/post/32665860244/how-to-use-interfaces-in-go' },
      { label: 'Effective Go: Interfaces', url: 'https://go.dev/doc/effective_go#interfaces' }
    ]
  },
  {
    id: 'error-handling',
    title: 'Error Handling Patterns',
    category: 'fundamentals',
    order: 5,
    explanation:
      'Go treats errors as values, not exceptions. Every function that can fail returns an error as its last return value. There are no try/catch blocks. This explicit error handling makes failure paths visible but requires discipline to avoid swallowing errors.\n\nGo 1.13 introduced error wrapping with %w in fmt.Errorf and errors.Is/As for inspection. Wrapping creates an error chain: each layer adds context while preserving the original error. errors.Is checks if any error in the chain matches a sentinel value. errors.As checks if any error in the chain matches a type.\n\nSentinel errors (like io.EOF, sql.ErrNoRows) are predefined error values used for comparison. Custom error types implement the error interface and carry additional data (status codes, field names). The choice between sentinel errors and custom types depends on whether callers need to inspect error details or just check for a specific condition.\n\nPanic/recover exists for truly exceptional situations (nil pointer dereference, out-of-bounds access) but should almost never be used for control flow. Libraries should never panic -- convert panics to errors at API boundaries.',
    codeExamples: [
      {
        title: 'Error Wrapping & Unwrapping Chain',
        code: `import (
    "errors"
    "fmt"
)

// Sentinel errors: predefined, comparable values
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
    ErrConflict     = errors.New("conflict")
)

// Custom error type with extra context
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}

// Repository layer
func findUser(id int64) (*User, error) {
    user, err := db.Query("SELECT ...")
    if err != nil {
        if errors.Is(err, sql.ErrNoRows) {
            return nil, fmt.Errorf("user %d: %w", id, ErrNotFound)
        }
        return nil, fmt.Errorf("querying user %d: %w", id, err)
    }
    return user, nil
}

// Service layer: wraps repository errors with more context
func getProfile(id int64) (*Profile, error) {
    user, err := findUser(id)
    if err != nil {
        return nil, fmt.Errorf("get profile: %w", err)
    }
    return buildProfile(user), nil
}

// Controller layer: inspects the error chain
func handleRequest(id int64) {
    profile, err := getProfile(id)
    if err != nil {
        // errors.Is: walks the entire chain
        if errors.Is(err, ErrNotFound) {
            respondJSON(404, "User not found")
            return
        }
        respondJSON(500, "Internal error")
        return
    }
    respondJSON(200, profile)
}`,
        explanation: 'Each layer wraps the error with context using fmt.Errorf("context: %w", err). This creates a chain: "get profile: user 42: not found". The controller uses errors.Is to walk the entire chain and find the sentinel error, regardless of how many layers of wrapping exist.'
      },
      {
        title: 'errors.Is vs errors.As',
        code: `// errors.Is: checks for a SPECIFIC error VALUE in the chain
func handleSentinel(err error) {
    if errors.Is(err, ErrNotFound) {
        // matched the sentinel value anywhere in chain
    }
    if errors.Is(err, context.DeadlineExceeded) {
        // request timed out
    }
}

// errors.As: extracts a SPECIFIC error TYPE from the chain
func handleTyped(err error) {
    var ve *ValidationError
    if errors.As(err, &ve) {
        // ve is now populated with the ValidationError from the chain
        fmt.Printf("Bad field: %s, reason: %s\\n", ve.Field, ve.Message)
    }

    var ne *net.OpError
    if errors.As(err, &ne) {
        fmt.Printf("Network op %s failed on %s\\n", ne.Op, ne.Addr)
    }
}

// Multi-error pattern (Go 1.20+ with errors.Join)
func validateUser(u *User) error {
    var errs []error

    if u.Name == "" {
        errs = append(errs, &ValidationError{Field: "name", Message: "required"})
    }
    if u.Email == "" {
        errs = append(errs, &ValidationError{Field: "email", Message: "required"})
    }
    if len(u.Password) < 8 {
        errs = append(errs, &ValidationError{Field: "password", Message: "min 8 chars"})
    }

    return errors.Join(errs...) // nil if no errors
}`,
        explanation: 'errors.Is compares values (for sentinel errors like ErrNotFound). errors.As extracts types (for custom error types like *ValidationError). errors.Join (Go 1.20+) combines multiple errors into one, and both Is/As can find errors inside a joined error. This is the idiomatic way to handle multi-field validation.'
      },
      {
        title: 'Panic, Recover & API Boundaries',
        code: `// Recover from panics at API boundaries
func safeHandler(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if rec := recover(); rec != nil {
                // Log the stack trace for debugging
                stack := debug.Stack()
                log.Printf("PANIC: %v\\n%s", rec, stack)

                // Return 500 to client instead of crashing
                http.Error(w, "Internal Server Error", 500)
            }
        }()
        next(w, r)
    }
}

// When panic is acceptable: programmer errors, impossible states
func MustCompileRegex(pattern string) *regexp.Regexp {
    re, err := regexp.Compile(pattern)
    if err != nil {
        panic(fmt.Sprintf("invalid regex %q: %v", pattern, err))
    }
    return re
}

// Must-style initializers are OK for package-level setup
var emailPattern = MustCompileRegex(\`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\`)

// NEVER use panic for normal error handling
// NEVER let panics propagate from library code`,
        explanation: 'Recover catches panics and converts them to errors. Use it at API boundaries (HTTP middleware, goroutine entry points) to prevent one bad request from crashing the entire server. Must-style functions (MustCompileRegex) are acceptable for package initialization where failure means a programming error. Never use panic for expected error conditions.'
      }
    ],
    bestPractices: [
      'Always wrap errors with context: fmt.Errorf("operation detail: %w", err)',
      'Use sentinel errors for conditions callers check with errors.Is (ErrNotFound, ErrConflict)',
      'Use custom error types when callers need to extract structured data with errors.As',
      'Never ignore errors: use _ = fn() only when you have explicitly decided it is safe',
      'Add a recover() middleware at every API/goroutine entry point to prevent crashes',
      'Use errors.Join for multi-error scenarios like validation instead of returning the first error only'
    ],
    commonMistakes: [
      'Using == to compare wrapped errors instead of errors.Is (wrapping breaks == comparison)',
      'Wrapping with %v instead of %w -- %v formats as string, %w preserves the chain for Is/As',
      'Returning fmt.Errorf("...") without wrapping -- callers lose ability to inspect the original error',
      'Using panic for expected errors (file not found, invalid input) instead of returning error',
      'Logging an error AND returning it -- causes duplicate log entries as each layer logs and passes up'
    ],
    interviewQuestions: [
      'Explain the difference between errors.Is and errors.As. When would you use each?',
      'What is error wrapping in Go? Why use %w instead of %v?',
      'How would you design an error handling strategy for a multi-layer application (controller/service/repository)?',
      'When is it appropriate to use panic in Go? How does recover work?',
      'What are sentinel errors and when should you use them vs. custom error types?'
    ],
    resources: [
      { label: 'Working with Errors in Go 1.13', url: 'https://go.dev/blog/go1.13-errors' },
      { label: 'Don\'t just check errors, handle them gracefully', url: 'https://dave.cheney.net/2016/04/27/dont-just-check-errors-handle-them-gracefully' }
    ]
  },

  // ── Concurrency ─────────────────────────────────────────────────────
  {
    id: 'goroutines',
    title: 'Goroutines Simplified',
    category: 'concurrency',
    order: 6,
    explanation:
      'Think of goroutines like lightweight workers in a restaurant kitchen. The restaurant (your program) has a few actual chefs (OS threads, typically matching your CPU cores). But it has MANY tasks: chopping vegetables, boiling water, plating food. Instead of hiring one chef per task (expensive!), the kitchen manager (Go scheduler) assigns tasks to available chefs and switches between them efficiently.\n\nA goroutine is one of these tasks. It costs about 2 KB of stack memory (vs. 1-8 MB for an OS thread), so you can run millions of them. When a goroutine blocks (waiting for I/O, a channel, or a lock), the scheduler immediately assigns another goroutine to that chef (OS thread). This is called M:N scheduling: M goroutines are multiplexed onto N OS threads.\n\nThe Go scheduler has three key components: G (goroutine), M (machine/OS thread), and P (processor, a logical CPU). Each P has a local run queue of goroutines. When a P\'s queue is empty, it steals work from other P\'s queues. This work-stealing algorithm keeps all CPU cores busy.\n\nStarting a goroutine is as simple as: go doSomething(). But the tricky part is coordination -- how do goroutines communicate results, and how do you wait for them to finish? That is where channels and sync primitives come in.',
    codeExamples: [
      {
        title: 'Basic Goroutines & Why You Need Synchronization',
        code: `func main() {
    // Start a goroutine -- it runs concurrently with main
    go sayHello("Alice")
    go sayHello("Bob")
    go sayHello("Charlie")

    // PROBLEM: main() exits immediately, killing all goroutines!
    // This prints nothing because main doesn't wait.

    // Quick fix: time.Sleep (NEVER do this in production)
    time.Sleep(time.Second)

    // Proper fix: use WaitGroup
    var wg sync.WaitGroup

    for _, name := range []string{"Alice", "Bob", "Charlie"} {
        wg.Add(1)
        go func(n string) {
            defer wg.Done()
            sayHello(n)
        }(name) // pass name as parameter to avoid closure bug
    }

    wg.Wait() // blocks until all goroutines call Done()
    fmt.Println("All greetings done!")
}

func sayHello(name string) {
    time.Sleep(100 * time.Millisecond) // simulate work
    fmt.Printf("Hello, %s!\\n", name)
}`,
        explanation: 'Key insight: main() is itself a goroutine. When main() returns, all other goroutines are killed immediately. You MUST synchronize with WaitGroup, channels, or other mechanisms. Notice we pass "name" as a function parameter -- if we used the loop variable directly in the closure, all goroutines might see the same value (a classic Go bug fixed in Go 1.22).'
      },
      {
        title: 'Goroutines vs Threads: The Restaurant Analogy',
        code: `// Imagine a restaurant with 4 chefs (CPU cores)
// OS Threads = hiring one dedicated chef per task (expensive, ~1MB each)
// Goroutines = tasks on a task board (~2KB each, chefs pick them up)

func main() {
    // See how many "chefs" (OS threads) we have
    fmt.Println("GOMAXPROCS:", runtime.GOMAXPROCS(0)) // usually = CPU cores

    // Launch 100,000 goroutines -- this is totally fine!
    // Doing this with OS threads would use ~100 GB of memory
    var wg sync.WaitGroup
    start := time.Now()

    for i := 0; i < 100_000; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            // Simulate some work
            time.Sleep(10 * time.Millisecond)
        }(i)
    }

    wg.Wait()
    fmt.Printf("100,000 goroutines completed in %v\\n", time.Since(start))

    // Memory usage: ~200 MB (100K * 2KB)
    // With OS threads: ~100 GB (100K * 1MB) -- impossible!

    var m runtime.MemStats
    runtime.ReadMemStats(&m)
    fmt.Printf("Memory used: %d MB\\n", m.Alloc/1024/1024)
}`,
        explanation: 'Goroutines are 500x cheaper than OS threads in memory. The Go scheduler multiplexes them onto OS threads using work-stealing. When a goroutine blocks (I/O, channel op, sleep), the scheduler parks it and runs another goroutine on the same thread -- no context switch to the OS. This is why Go handles 100K+ concurrent connections easily.'
      },
      {
        title: 'Common Goroutine Leak & Prevention',
        code: `// LEAK: goroutine blocks forever if nobody reads the channel
func leakySearch(query string) string {
    ch := make(chan string)

    go func() {
        result := searchDB(query)
        ch <- result // BLOCKS FOREVER if caller returns early
    }()

    // If timeout happens, goroutine leaks!
    select {
    case result := <-ch:
        return result
    case <-time.After(2 * time.Second):
        return "timeout" // goroutine is still alive, blocking on ch<-
    }
}

// FIX: use buffered channel so send never blocks
func safeSearch(query string) string {
    ch := make(chan string, 1) // buffered: send won't block

    go func() {
        result := searchDB(query)
        ch <- result // succeeds even if nobody reads
    }()

    select {
    case result := <-ch:
        return result
    case <-time.After(2 * time.Second):
        return "timeout" // goroutine will finish and ch gets GC'd
    }
}

// FIX 2: use context cancellation
func safeSearchCtx(ctx context.Context, query string) (string, error) {
    ch := make(chan string, 1)

    go func() {
        ch <- searchDB(query)
    }()

    select {
    case result := <-ch:
        return result, nil
    case <-ctx.Done():
        return "", ctx.Err()
    }
}`,
        explanation: 'Goroutine leaks are one of the most common bugs in Go. A leaked goroutine holds memory and resources forever. The most common cause: a goroutine tries to send on a channel that nobody reads. Fix it with buffered channels (the send succeeds even if nobody reads) or context cancellation (the goroutine checks ctx.Done and exits).'
      }
    ],
    bestPractices: [
      'Always know how a goroutine will stop -- if you cannot answer this, you have a potential leak',
      'Use sync.WaitGroup when you need to wait for a batch of goroutines to complete',
      'Pass loop variables as function parameters (or use Go 1.22+ which fixes the closure bug)',
      'Use buffered channels or context cancellation to prevent goroutine leaks on timeout paths',
      'Do not launch goroutines from init() or package-level variables -- makes testing difficult',
      'Monitor goroutine count in production with runtime.NumGoroutine() -- a steady increase indicates leaks'
    ],
    commonMistakes: [
      'Forgetting that main() exiting kills all goroutines -- must synchronize completion',
      'Goroutine leaks: starting a goroutine that blocks forever because nobody reads/writes its channel',
      'Capturing loop variables in closures (fixed in Go 1.22, but still common in older code)',
      'Spawning unlimited goroutines under load (use worker pools to bound concurrency)',
      'Using time.Sleep for synchronization instead of proper primitives like WaitGroup or channels'
    ],
    interviewQuestions: [
      'What is a goroutine and how is it different from an OS thread? Explain the cost difference.',
      'Explain Go\'s M:N scheduling model. What are G, M, and P?',
      'What is a goroutine leak? How do you detect and prevent them?',
      'How many goroutines can you run simultaneously? What are the practical limits?',
      'What happens when main() returns while goroutines are still running?'
    ],
    resources: [
      { label: 'Concurrency is not Parallelism (Rob Pike)', url: 'https://go.dev/blog/waza-talk' },
      { label: 'Goroutine Scheduler Design Doc', url: 'https://docs.google.com/document/d/1TTj4T2JO42uD5ID9e89oa0sLKhJYD0Y_kqxDv3I3XMw' }
    ]
  },
  {
    id: 'channels',
    title: 'Channels Deep Dive',
    category: 'concurrency',
    order: 7,
    explanation:
      'Channels are Go\'s primary mechanism for goroutine communication. Think of a channel as a pipe: one goroutine puts data in, another takes data out. Go\'s philosophy is "Don\'t communicate by sharing memory; share memory by communicating." This means instead of goroutines accessing shared variables with locks, they pass data through channels.\n\nUnbuffered channels (make(chan T)) are synchronous: the sender blocks until a receiver is ready, and vice versa. This creates a natural synchronization point -- like a handoff. Buffered channels (make(chan T, N)) allow the sender to proceed if there is room in the buffer, acting like a mailbox with N slots.\n\nDirectional channels restrict a channel to send-only (chan<- T) or receive-only (<-chan T). They are used in function signatures to document intent and prevent misuse at compile time.\n\nThe select statement is like a switch for channel operations. It waits on multiple channels simultaneously and executes whichever case is ready first. If multiple cases are ready, it picks one at random. A default case makes select non-blocking.',
    codeExamples: [
      {
        title: 'Unbuffered vs Buffered Channels',
        code: `func main() {
    // UNBUFFERED: sender and receiver must be ready simultaneously
    sync := make(chan string) // capacity = 0

    go func() {
        fmt.Println("Sending...") // prints first
        sync <- "hello"           // BLOCKS until main receives
        fmt.Println("Sent!")      // prints after main receives
    }()

    time.Sleep(time.Second) // goroutine is blocked during this sleep
    msg := <-sync           // unblocks the sender
    fmt.Println("Received:", msg)

    // BUFFERED: sender can proceed if buffer has space
    mailbox := make(chan string, 3) // capacity = 3

    // These don't block because buffer has room
    mailbox <- "msg1"
    mailbox <- "msg2"
    mailbox <- "msg3"
    // mailbox <- "msg4"  // THIS WOULD BLOCK -- buffer full!

    fmt.Println(<-mailbox) // "msg1" (FIFO)
    fmt.Println(<-mailbox) // "msg2"

    // Channel of channels: request-response pattern
    type Request struct {
        Query    string
        Response chan string
    }

    requests := make(chan Request)
    go func() {
        for req := range requests {
            req.Response <- "Result for: " + req.Query
        }
    }()

    resp := make(chan string, 1)
    requests <- Request{Query: "users", Response: resp}
    fmt.Println(<-resp) // "Result for: users"
}`,
        explanation: 'Unbuffered channels are synchronization tools -- they guarantee the sender and receiver are at the same point in time. Buffered channels are like queues -- they decouple sender and receiver timing. Use unbuffered for synchronization, buffered for rate smoothing. Buffer size of 1 is great for "fire and forget" goroutine communication.'
      },
      {
        title: 'Fan-Out/Fan-In Pattern',
        code: `// Fan-out: distribute work across multiple goroutines
// Fan-in: merge results from multiple goroutines into one channel

func fanOutFanIn() {
    jobs := make(chan int, 100)
    results := make(chan string, 100)

    // Fan-out: start 5 workers
    var wg sync.WaitGroup
    for w := 0; w < 5; w++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for job := range jobs { // receives until channel is closed
                result := processJob(workerID, job)
                results <- result
            }
        }(w)
    }

    // Send 20 jobs
    go func() {
        for i := 0; i < 20; i++ {
            jobs <- i
        }
        close(jobs) // signal no more jobs
    }()

    // Close results when all workers are done
    go func() {
        wg.Wait()
        close(results) // safe to close: all writers are done
    }()

    // Fan-in: collect all results
    for result := range results {
        fmt.Println(result)
    }
}

func processJob(workerID, job int) string {
    time.Sleep(100 * time.Millisecond) // simulate work
    return fmt.Sprintf("Worker %d processed job %d", workerID, job)
}`,
        explanation: 'Fan-out/Fan-in is the most common Go concurrency pattern. Multiple workers read from a shared jobs channel (fan-out). Results flow into a shared results channel (fan-in). Close the jobs channel to signal "no more work." Use a WaitGroup to know when all workers are done, then close the results channel. Only the sender should close a channel, never the receiver.'
      },
      {
        title: 'Select Statement & Timeout Patterns',
        code: `// Select: wait on multiple channel operations
func searchWithTimeout(query string) (string, error) {
    ch1 := make(chan string, 1)
    ch2 := make(chan string, 1)

    // Race two data sources
    go func() { ch1 <- searchDatabase(query) }()
    go func() { ch2 <- searchCache(query) }()

    select {
    case result := <-ch1:
        return result, nil
    case result := <-ch2:
        return result, nil
    case <-time.After(3 * time.Second):
        return "", fmt.Errorf("search timed out")
    }
    // Returns whichever source responds first!
}

// Non-blocking channel operations with default
func tryReceive(ch <-chan string) (string, bool) {
    select {
    case msg := <-ch:
        return msg, true
    default:
        return "", false // don't block, return immediately
    }
}

// Ticker: periodic work
func periodicCleanup(ctx context.Context) {
    ticker := time.NewTicker(30 * time.Second)
    defer ticker.Stop() // IMPORTANT: prevent ticker leak

    for {
        select {
        case <-ticker.C:
            cleanupExpiredSessions()
        case <-ctx.Done():
            fmt.Println("Cleanup stopped")
            return
        }
    }
}

// Done channel pattern: signal goroutine to stop
func worker(done <-chan struct{}, jobs <-chan int) {
    for {
        select {
        case <-done:
            fmt.Println("Worker shutting down")
            return
        case job := <-jobs:
            process(job)
        }
    }
}`,
        explanation: 'Select is the "switch statement for channels." It blocks until one case is ready. Key patterns: timeout with time.After, non-blocking check with default, periodic work with time.Ticker, and graceful shutdown with a done channel or context.Done(). Always stop tickers to prevent goroutine leaks.'
      }
    ],
    bestPractices: [
      'Only the sender should close a channel, never the receiver -- closing a closed channel panics',
      'Use range to receive from a channel until it is closed: for msg := range ch { ... }',
      'Buffer size of 0 = synchronization, buffer size of 1 = async handoff, larger = throughput smoothing',
      'Use directional channel types in function parameters: func consume(ch <-chan int) prevents accidental sends',
      'Always pair time.NewTicker with defer ticker.Stop() to prevent goroutine leaks',
      'Prefer context.WithTimeout over time.After for complex timeout scenarios'
    ],
    commonMistakes: [
      'Closing a channel from the receiver side -- can panic if the sender sends after close',
      'Sending on a closed channel causes a panic -- coordinate closure with WaitGroups',
      'Forgetting to close a channel when using range -- the receiving goroutine blocks forever',
      'Using an unbuffered channel in a goroutine that may outlive the receiver (goroutine leak)',
      'Forgetting to stop a time.Ticker -- it keeps running and leaks the underlying goroutine'
    ],
    interviewQuestions: [
      'What is the difference between a buffered and unbuffered channel? When would you use each?',
      'Explain the fan-out/fan-in pattern. Implement a worker pool using channels.',
      'What happens if you send on a closed channel? What about receiving from a closed channel?',
      'How does the select statement work? What happens when multiple cases are ready?',
      'Design a rate limiter using channels. How would you implement token bucket or leaky bucket?'
    ],
    resources: [
      { label: 'Go Concurrency Patterns (Rob Pike)', url: 'https://go.dev/talks/2012/concurrency.slide' },
      { label: 'Go Pipelines and Cancellation', url: 'https://go.dev/blog/pipelines' }
    ]
  },
  {
    id: 'sync-primitives',
    title: 'Sync Primitives',
    category: 'concurrency',
    order: 8,
    explanation:
      'While channels are Go\'s preferred communication mechanism, sync primitives from the sync package are essential tools when channels are not the right fit. The rule of thumb: use channels for passing ownership of data between goroutines, use mutexes for protecting shared state.\n\nsync.Mutex provides exclusive access to a resource. Only one goroutine can hold the lock at a time. sync.RWMutex is an optimization for read-heavy workloads: multiple goroutines can hold read locks simultaneously, but a write lock is exclusive.\n\nsync.WaitGroup is a counter that lets you wait for a collection of goroutines to finish. Add(N) increments, Done() decrements, Wait() blocks until zero. sync.Once ensures a function is executed exactly once, even if called from multiple goroutines -- perfect for lazy initialization.\n\nsync.Pool is a cache of temporary objects to reduce GC pressure. Objects in a Pool can be reclaimed by the GC at any time, so they must be re-initializable. Common use: reusing byte buffers for HTTP handlers.\n\nsync.Map is a concurrent-safe map optimized for two patterns: (1) keys are written once and read many times, (2) multiple goroutines access disjoint sets of keys. For other patterns, a regular map with RWMutex is faster.',
    codeExamples: [
      {
        title: 'Mutex vs RWMutex',
        code: `// Regular Mutex: exclusive access (read and write)
type Counter struct {
    mu    sync.Mutex
    count int
}

func (c *Counter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.count
}

// RWMutex: multiple concurrent readers, exclusive writer
type UserCache struct {
    mu    sync.RWMutex
    users map[int64]*User
}

func (uc *UserCache) Get(id int64) (*User, bool) {
    uc.mu.RLock()           // multiple goroutines can RLock simultaneously
    defer uc.mu.RUnlock()
    u, ok := uc.users[id]
    return u, ok
}

func (uc *UserCache) Set(id int64, user *User) {
    uc.mu.Lock()            // exclusive -- waits for all RLocks to release
    defer uc.mu.Unlock()
    uc.users[id] = user
}

// When to use which:
// Mutex:   simple, fewer than 100 goroutines, write-heavy
// RWMutex: read-heavy (95%+ reads), many concurrent readers
// Channel: data ownership transfer, pipeline patterns`,
        explanation: 'RWMutex is 10-30% faster than Mutex for read-heavy workloads because multiple RLock calls don\'t block each other. But if writes are frequent, RWMutex can actually be slower due to write starvation (writers wait for all readers). For most cases, a simple Mutex is fine and easier to reason about.'
      },
      {
        title: 'WaitGroup, Once & errgroup',
        code: `// WaitGroup: wait for N goroutines
func fetchAll(urls []string) []string {
    var wg sync.WaitGroup
    results := make([]string, len(urls))

    for i, url := range urls {
        wg.Add(1)
        go func(idx int, u string) {
            defer wg.Done()
            results[idx] = fetch(u) // each index is unique, no race
        }(i, url)
    }

    wg.Wait() // blocks until all Done() calls
    return results
}

// Once: exactly-one initialization
type DBPool struct {
    once sync.Once
    db   *sql.DB
}

func (p *DBPool) GetDB() *sql.DB {
    p.once.Do(func() {
        // Called exactly once, even with 1000 concurrent goroutines
        var err error
        p.db, err = sql.Open("mysql", "dsn...")
        if err != nil {
            log.Fatal(err)
        }
    })
    return p.db
}

// errgroup: WaitGroup + error collection
import "golang.org/x/sync/errgroup"

func fetchAllWithErrors(ctx context.Context, urls []string) error {
    g, ctx := errgroup.WithContext(ctx)

    for _, url := range urls {
        url := url // capture for closure
        g.Go(func() error {
            resp, err := http.Get(url)
            if err != nil {
                return fmt.Errorf("fetching %s: %w", url, err)
            }
            defer resp.Body.Close()
            // process response...
            return nil
        })
    }

    return g.Wait() // returns first error, cancels context
}`,
        explanation: 'WaitGroup is for fire-and-forget goroutines where you just need to wait. errgroup (from x/sync) is the production-grade version: it collects the first error and cancels remaining work via context. sync.Once guarantees lazy initialization is thread-safe -- the common pattern for database connections, config loading, and singletons.'
      },
      {
        title: 'sync.Pool for GC Pressure Reduction',
        code: `// Pool: reuse temporary objects to reduce GC pressure
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
    // Get a buffer from the pool (or create new)
    buf := bufPool.Get().(*bytes.Buffer)
    buf.Reset() // IMPORTANT: clean before use

    defer func() {
        buf.Reset()       // clean before returning
        bufPool.Put(buf)  // return to pool for reuse
    }()

    // Use the buffer
    json.NewEncoder(buf).Encode(map[string]string{
        "status": "ok",
        "time":   time.Now().String(),
    })

    w.Header().Set("Content-Type", "application/json")
    w.Write(buf.Bytes())
}

// Real-world impact:
// Without pool: 10K req/s creates 10K buffers, all GC'd
// With pool:    10K req/s reuses ~100 buffers, minimal GC
// Benchmarks show 50-70% reduction in GC pause time

// WARNING: Objects in Pool can be collected by GC at any time
// Don't store important state. Only use for temporary buffers.`,
        explanation: 'sync.Pool dramatically reduces GC pressure by reusing temporary objects. The pool is drained on every GC cycle, so objects must be self-contained and re-initializable. Always Reset() before Put() and after Get(). Common uses: byte buffers, JSON encoders/decoders, regex match arrays, and protocol buffers.'
      }
    ],
    bestPractices: [
      'Always defer mu.Unlock() immediately after Lock() to prevent deadlocks from early returns or panics',
      'Never copy a sync.Mutex, sync.WaitGroup, or any sync type -- pass by pointer only',
      'Use errgroup.WithContext for production goroutine orchestration instead of bare WaitGroup',
      'Use sync.Once for lazy initialization of expensive resources (DB connections, config, caches)',
      'Use sync.Pool for high-allocation hot paths after proving via benchmarks that GC is a bottleneck',
      'Prefer channels for data flow, mutexes for protecting state -- do not mix paradigms unnecessarily'
    ],
    commonMistakes: [
      'Copying a Mutex (e.g., passing a struct containing a Mutex by value) -- the copy has its own lock state',
      'Calling wg.Add() inside the goroutine instead of before -- creates a race with wg.Wait()',
      'Recursive locking: calling Lock() twice from the same goroutine deadlocks (Go mutexes are not reentrant)',
      'Forgetting to Reset() pooled objects before reuse, leading to data leaking between requests',
      'Using RWMutex where a simple Mutex would do -- adds complexity with negligible performance gain for most cases'
    ],
    interviewQuestions: [
      'When would you use a Mutex vs. a channel? Give examples of each.',
      'What is sync.Once and why is it better than a flag with a Mutex for one-time initialization?',
      'Explain how sync.Pool works. When would you use it and what are its limitations?',
      'What happens if you copy a sync.Mutex? Why is this dangerous?',
      'How does errgroup improve upon sync.WaitGroup? When would you choose one over the other?'
    ],
    resources: [
      { label: 'Go sync Package Docs', url: 'https://pkg.go.dev/sync' },
      { label: 'Mutex vs Channel', url: 'https://go.dev/wiki/MutexOrChannel' }
    ]
  },
  {
    id: 'context-package',
    title: 'Context Package',
    category: 'concurrency',
    order: 9,
    explanation:
      'The context package provides a way to carry deadlines, cancellation signals, and request-scoped values across API boundaries and between goroutines. Think of context as a "kill switch" that propagates through your entire call chain.\n\nEvery incoming HTTP request should create a context, and every outgoing call (database query, HTTP request, goroutine) should accept and respect it. When a context is cancelled (timeout, deadline, or manual cancel), all operations using that context should stop promptly.\n\nContext forms a tree: context.Background() is the root, and WithCancel/WithTimeout/WithDeadline create child contexts. Cancelling a parent automatically cancels all children, but not vice versa. This is perfect for request lifecycles: when a client disconnects, all downstream work stops.\n\ncontext.WithValue carries request-scoped data (request ID, auth token, tenant ID) through the call chain. However, it should only be used for cross-cutting concerns that transit process boundaries, not for passing function parameters.',
    codeExamples: [
      {
        title: 'Cancellation & Timeout Propagation',
        code: `func handleRequest(w http.ResponseWriter, r *http.Request) {
    // r.Context() is cancelled when client disconnects
    ctx := r.Context()

    // Add a 5-second timeout for this specific operation
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel() // ALWAYS call cancel to free resources

    result, err := fetchData(ctx)
    if err != nil {
        if errors.Is(err, context.DeadlineExceeded) {
            http.Error(w, "Request timed out", http.StatusGatewayTimeout)
            return
        }
        if errors.Is(err, context.Canceled) {
            // Client disconnected, no point responding
            return
        }
        http.Error(w, "Internal error", 500)
        return
    }
    json.NewEncoder(w).Encode(result)
}

func fetchData(ctx context.Context) (*Data, error) {
    // Database query respects context cancellation
    row := db.QueryRowContext(ctx, "SELECT * FROM data WHERE id = ?", id)

    // HTTP call respects context cancellation
    req, _ := http.NewRequestWithContext(ctx, "GET", "https://api.example.com/data", nil)
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, err // includes context.Canceled/DeadlineExceeded
    }
    defer resp.Body.Close()

    return parseResponse(resp)
}`,
        explanation: 'Context propagates through the entire call chain. When the HTTP request\'s 5-second timeout fires, the database query and HTTP call are both cancelled automatically. Always check for context.DeadlineExceeded and context.Canceled errors to handle timeouts and client disconnections gracefully.'
      },
      {
        title: 'Context Tree & Cascading Cancellation',
        code: `func processOrder(ctx context.Context, orderID string) error {
    // Create child contexts for each phase
    // Cancelling parent cancels ALL children

    // Phase 1: Validate (2s max)
    validateCtx, validateCancel := context.WithTimeout(ctx, 2*time.Second)
    defer validateCancel()
    if err := validateOrder(validateCtx, orderID); err != nil {
        return fmt.Errorf("validation: %w", err)
    }

    // Phase 2: Process payment (10s max)
    paymentCtx, paymentCancel := context.WithTimeout(ctx, 10*time.Second)
    defer paymentCancel()
    if err := processPayment(paymentCtx, orderID); err != nil {
        return fmt.Errorf("payment: %w", err)
    }

    // Phase 3: Send confirmation (3s max)
    notifyCtx, notifyCancel := context.WithTimeout(ctx, 3*time.Second)
    defer notifyCancel()
    if err := sendConfirmation(notifyCtx, orderID); err != nil {
        // Non-critical: log but don't fail the order
        log.Printf("notification failed: %v", err)
    }

    return nil
}

// Manual cancellation example
func longRunningTask(ctx context.Context) {
    ctx, cancel := context.WithCancel(ctx)
    defer cancel()

    go func() {
        // Worker goroutine
        for {
            select {
            case <-ctx.Done():
                fmt.Println("Worker stopped:", ctx.Err())
                return
            default:
                doWork()
            }
        }
    }()

    // Cancel after condition is met
    time.Sleep(5 * time.Second)
    cancel() // signals all goroutines using this context
}`,
        explanation: 'Each phase gets its own timeout, but they all derive from the parent context. If the parent is cancelled (client disconnects), all phases stop immediately. Child timeouts are independent -- the payment phase getting 10 seconds does not affect the validation phase\'s 2-second timeout. Always defer cancel() to release resources.'
      },
      {
        title: 'Context Values: Best Practices',
        code: `// Define unexported key types to prevent collisions
type contextKey string

const (
    requestIDKey contextKey = "requestID"
    tenantIDKey  contextKey = "tenantID"
    userIDKey    contextKey = "userID"
)

// Helper functions for type-safe access
func WithRequestID(ctx context.Context, id string) context.Context {
    return context.WithValue(ctx, requestIDKey, id)
}

func RequestIDFromContext(ctx context.Context) string {
    id, _ := ctx.Value(requestIDKey).(string)
    return id
}

func WithTenantID(ctx context.Context, id int64) context.Context {
    return context.WithValue(ctx, tenantIDKey, id)
}

func TenantIDFromContext(ctx context.Context) int64 {
    id, _ := ctx.Value(tenantIDKey).(int64)
    return id
}

// Middleware that adds values to context
func RequestIDMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        id := r.Header.Get("X-Request-ID")
        if id == "" {
            id = uuid.NewString()
        }
        ctx := WithRequestID(r.Context(), id)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

// Deep in the call chain: access request ID for logging
func queryDatabase(ctx context.Context, query string) (*Result, error) {
    reqID := RequestIDFromContext(ctx)
    log.Printf("[%s] executing query: %s", reqID, query)
    return db.QueryContext(ctx, query)
}`,
        explanation: 'Use unexported key types (type contextKey string) to prevent collisions between packages. Provide exported helper functions for setting and getting values. Only use context values for request-scoped data that crosses process boundaries: request IDs, auth tokens, tenant IDs. Never use context values to pass function parameters or optional arguments.'
      }
    ],
    bestPractices: [
      'Always pass context as the first parameter: func DoSomething(ctx context.Context, ...)',
      'Always call cancel() with defer immediately after creating a cancellable context',
      'Use context.Background() as the root only in main(), tests, and top-level initialization',
      'Use context.TODO() as a placeholder when you are unsure which context to use (temporary)',
      'Never store contexts in structs -- pass them as function parameters',
      'Use context values only for request-scoped, cross-cutting data (request IDs, auth info) -- not business logic'
    ],
    commonMistakes: [
      'Not calling cancel() on derived contexts -- leaks goroutines inside the context tree',
      'Passing context.Background() to functions deep in the call chain instead of propagating the request context',
      'Using context values as a replacement for function parameters (makes dependencies invisible)',
      'Using string keys for context values instead of unexported types (risk of collision between packages)',
      'Ignoring ctx.Done() in long-running goroutines -- they keep running after the client disconnects'
    ],
    interviewQuestions: [
      'What is the context package in Go and why is it important?',
      'Explain the difference between context.WithTimeout and context.WithDeadline.',
      'How does context cancellation propagate through a call chain?',
      'When should you use context.WithValue and when should you avoid it?',
      'How would you implement graceful shutdown of an HTTP server using context?'
    ],
    resources: [
      { label: 'Go Concurrency Patterns: Context', url: 'https://go.dev/blog/context' },
      { label: 'Context Package Docs', url: 'https://pkg.go.dev/context' }
    ]
  },
  {
    id: 'concurrency-patterns',
    title: 'Concurrency Patterns',
    category: 'concurrency',
    order: 10,
    explanation:
      'Go\'s concurrency primitives (goroutines, channels, sync) combine into powerful patterns for real-world problems. These patterns are reusable building blocks for high-throughput services.\n\nThe Worker Pool pattern bounds concurrency by using a fixed number of goroutines that pull work from a shared channel. This prevents resource exhaustion under load (too many DB connections, file handles, or API calls).\n\nThe Pipeline pattern chains processing stages via channels: each stage reads from an input channel, processes data, and writes to an output channel. This enables streaming data processing without loading everything into memory.\n\nThe Semaphore pattern (using a buffered channel) limits concurrent access to a resource. Rate Limiting controls throughput over time using time.Ticker.\n\nerrgroup.Group from golang.org/x/sync is the production-grade way to run concurrent operations: it handles error propagation, context cancellation, and goroutine lifecycle management.',
    codeExamples: [
      {
        title: 'Worker Pool Pattern',
        code: `type Job struct {
    ID      int
    Payload string
}

type Result struct {
    JobID  int
    Output string
    Err    error
}

func workerPool(ctx context.Context, jobs []Job, numWorkers int) []Result {
    jobsCh := make(chan Job, len(jobs))
    resultsCh := make(chan Result, len(jobs))

    // Start workers
    var wg sync.WaitGroup
    for w := 0; w < numWorkers; w++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for job := range jobsCh {
                select {
                case <-ctx.Done():
                    resultsCh <- Result{JobID: job.ID, Err: ctx.Err()}
                    return
                default:
                    output, err := process(job)
                    resultsCh <- Result{JobID: job.ID, Output: output, Err: err}
                }
            }
        }(w)
    }

    // Send all jobs
    for _, job := range jobs {
        jobsCh <- job
    }
    close(jobsCh)

    // Close results after all workers finish
    go func() {
        wg.Wait()
        close(resultsCh)
    }()

    // Collect results
    var results []Result
    for r := range resultsCh {
        results = append(results, r)
    }
    return results
}

// Usage: process 1000 jobs with max 10 concurrent workers
func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    jobs := make([]Job, 1000)
    for i := range jobs {
        jobs[i] = Job{ID: i, Payload: fmt.Sprintf("item-%d", i)}
    }

    results := workerPool(ctx, jobs, 10)
    fmt.Printf("Processed %d jobs\\n", len(results))
}`,
        explanation: 'The worker pool is the most common production pattern. Instead of spawning one goroutine per task (which can overwhelm resources), you create a fixed number of workers. The buffered jobs channel acts as a work queue. Context cancellation ensures workers stop promptly on timeout. This pattern is used everywhere: API request processing, batch jobs, file processing.'
      },
      {
        title: 'Pipeline & Rate Limiter',
        code: `// Pipeline: chain of stages connected by channels
func pipeline() {
    // Stage 1: Generate numbers
    generate := func(ctx context.Context, nums ...int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for _, n := range nums {
                select {
                case out <- n:
                case <-ctx.Done():
                    return
                }
            }
        }()
        return out
    }

    // Stage 2: Square each number
    square := func(ctx context.Context, in <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for n := range in {
                select {
                case out <- n * n:
                case <-ctx.Done():
                    return
                }
            }
        }()
        return out
    }

    // Stage 3: Filter even numbers
    filterEven := func(ctx context.Context, in <-chan int) <-chan int {
        out := make(chan int)
        go func() {
            defer close(out)
            for n := range in {
                if n%2 == 0 {
                    select {
                    case out <- n:
                    case <-ctx.Done():
                        return
                    }
                }
            }
        }()
        return out
    }

    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()

    // Chain: generate -> square -> filterEven
    nums := generate(ctx, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    squared := square(ctx, nums)
    evens := filterEven(ctx, squared)

    for n := range evens {
        fmt.Println(n) // 4, 16, 36, 64, 100
    }
}

// Rate Limiter: N requests per second
func rateLimiter(rps int) <-chan struct{} {
    limiter := make(chan struct{}, rps)
    go func() {
        ticker := time.NewTicker(time.Second / time.Duration(rps))
        defer ticker.Stop()
        for range ticker.C {
            select {
            case limiter <- struct{}{}:
            default: // don't accumulate tokens beyond burst
            }
        }
    }()
    return limiter
}`,
        explanation: 'Pipelines enable streaming data processing where each stage runs concurrently. Data flows through channels without buffering the entire dataset in memory. Each stage checks ctx.Done() for clean shutdown. The rate limiter uses a ticker to emit tokens at a fixed rate -- goroutines acquire a token before proceeding.'
      },
      {
        title: 'Semaphore & errgroup with Limits',
        code: `import "golang.org/x/sync/errgroup"

// Semaphore: limit concurrent access using buffered channel
func fetchURLs(ctx context.Context, urls []string, maxConcurrent int) error {
    sem := make(chan struct{}, maxConcurrent) // semaphore

    g, ctx := errgroup.WithContext(ctx)

    for _, url := range urls {
        url := url
        g.Go(func() error {
            sem <- struct{}{}        // acquire (blocks if at capacity)
            defer func() { <-sem }() // release

            req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
            if err != nil {
                return err
            }
            resp, err := http.DefaultClient.Do(req)
            if err != nil {
                return fmt.Errorf("fetch %s: %w", url, err)
            }
            defer resp.Body.Close()

            if resp.StatusCode != 200 {
                return fmt.Errorf("fetch %s: status %d", url, resp.StatusCode)
            }
            return nil
        })
    }

    return g.Wait() // returns first error, cancels ctx
}

// errgroup.SetLimit (Go 1.20+): built-in concurrency limiting
func fetchURLsModern(ctx context.Context, urls []string) error {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(10) // max 10 concurrent goroutines

    for _, url := range urls {
        url := url
        g.Go(func() error {
            req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
            resp, err := http.DefaultClient.Do(req)
            if err != nil {
                return err
            }
            resp.Body.Close()
            return nil
        })
    }

    return g.Wait()
}`,
        explanation: 'A semaphore (buffered channel of empty structs) limits concurrent access to any resource. errgroup.SetLimit (Go 1.20+) provides built-in concurrency limiting, making the semaphore pattern unnecessary in many cases. errgroup.WithContext creates a context that is cancelled when any goroutine returns an error, so remaining goroutines can stop early.'
      }
    ],
    bestPractices: [
      'Use worker pools to bound concurrency -- never spawn unlimited goroutines under external load',
      'Check ctx.Done() in every stage of a pipeline for clean shutdown',
      'Prefer errgroup over WaitGroup for production code -- it handles errors and cancellation',
      'Use errgroup.SetLimit (Go 1.20+) instead of manual semaphores when possible',
      'Size worker pools based on the bottleneck resource (DB connections, API rate limits) not CPU cores',
      'Always close output channels in pipelines to signal downstream stages that no more data is coming'
    ],
    commonMistakes: [
      'Not bounding concurrency in user-facing endpoints -- a spike in requests spawns unbounded goroutines',
      'Pipeline goroutine leaks: forgetting to propagate context cancellation to all stages',
      'Using a semaphore channel of booleans instead of struct{} (wastes memory, zero semantic difference)',
      'Deadlock in pipelines: a stage blocks on send because the downstream stage exited without draining',
      'Not handling partial failures: in a batch of 100 jobs, one failure should not silently drop 99 results'
    ],
    interviewQuestions: [
      'Implement a worker pool that processes N tasks with M concurrent workers.',
      'What is the pipeline pattern? How do you handle errors and cancellation in a pipeline?',
      'How would you implement a rate limiter in Go? Compare token bucket and leaky bucket.',
      'Explain the semaphore pattern. How does errgroup.SetLimit compare?',
      'How would you design a concurrent web crawler with bounded concurrency and deduplication?'
    ],
    resources: [
      { label: 'Go Advanced Concurrency Patterns', url: 'https://go.dev/talks/2013/advconc.slide' },
      { label: 'errgroup Package', url: 'https://pkg.go.dev/golang.org/x/sync/errgroup' }
    ]
  },

  // ── ORM ─────────────────────────────────────────────────────────────
  {
    id: 'gorm-basics',
    title: 'GORM Fundamentals',
    category: 'orm',
    order: 11,
    explanation:
      'GORM is Go\'s most popular ORM (Object-Relational Mapping) library. It maps Go structs to database tables and provides a chainable API for building queries. GORM supports MySQL, PostgreSQL, SQLite, and SQL Server.\n\nModel definition uses struct tags to map fields to columns. The gorm.Model embed adds ID, CreatedAt, UpdatedAt, and DeletedAt (soft delete). GORM follows conventions: pluralized snake_case table names (User -> users), and ID as primary key.\n\nGORM hooks (BeforeCreate, AfterCreate, BeforeUpdate, etc.) let you inject logic at specific points in the lifecycle. Common uses: setting snowflake IDs, validating data, and updating computed fields.\n\nTransactions in GORM wrap multiple operations so they succeed or fail atomically. Use db.Transaction(func(tx *gorm.DB) error { ... }) for safe transaction handling -- it auto-commits on nil return and auto-rolls back on error.',
    codeExamples: [
      {
        title: 'Model Definition & CRUD',
        code: `type User struct {
    ID        int64          \`gorm:"primaryKey;type:bigint(20)" json:"id"\`
    Name      string         \`gorm:"type:varchar(100);not null" json:"name"\`
    Email     string         \`gorm:"type:varchar(255);uniqueIndex;not null" json:"email"\`
    Age       int            \`gorm:"type:int;default:0" json:"age"\`
    IsActive  bool           \`gorm:"type:tinyint(1);default:1" json:"is_active"\`
    Role      string         \`gorm:"type:varchar(50);default:'user'" json:"role"\`
    CreatedAt time.Time      \`json:"created_at"\`
    UpdatedAt time.Time      \`json:"updated_at"\`
    DeletedAt gorm.DeletedAt \`gorm:"index" json:"-"\` // soft delete
}

// Hook: set snowflake ID before insert
func (u *User) BeforeCreate(tx *gorm.DB) error {
    if u.ID == 0 {
        u.ID = generateSnowflakeID()
    }
    return nil
}

func main() {
    // CREATE
    user := User{Name: "Alice", Email: "alice@example.com", Age: 30}
    result := db.Create(&user) // user.ID is set by BeforeCreate hook
    fmt.Println(result.RowsAffected) // 1

    // READ
    var found User
    db.First(&found, user.ID)                          // by primary key
    db.Where("email = ?", "alice@example.com").First(&found) // by condition
    db.Where("age > ? AND is_active = ?", 25, true).Find(&users) // multiple

    // UPDATE (Omit immutable fields)
    db.Model(&user).Omit("id", "created_at").Updates(User{
        Name: "Alice Smith",
        Age:  31,
    })

    // DELETE (soft delete: sets deleted_at)
    db.Delete(&user) // UPDATE users SET deleted_at = NOW() WHERE id = ?

    // Hard delete (permanently remove)
    db.Unscoped().Delete(&user) // DELETE FROM users WHERE id = ?
}`,
        explanation: 'GORM conventions: use struct tags for column types, constraints, and indexes. BeforeCreate hooks are perfect for snowflake ID generation. When updating, always use Omit() to exclude immutable fields (id, created_at, created_by) instead of Select("*") -- the latter has issues with boolean false values not being saved.'
      },
      {
        title: 'Transactions & Error Handling',
        code: `// db.Transaction handles commit/rollback automatically
func transferFunds(db *gorm.DB, fromID, toID int64, amount float64) error {
    return db.Transaction(func(tx *gorm.DB) error {
        // Lock source account
        var from Account
        if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
            First(&from, fromID).Error; err != nil {
            return fmt.Errorf("lock source: %w", err)
        }

        if from.Balance < amount {
            return fmt.Errorf("insufficient funds: have %.2f, need %.2f",
                from.Balance, amount)
        }

        // Debit source
        if err := tx.Model(&from).
            Update("balance", gorm.Expr("balance - ?", amount)).Error; err != nil {
            return fmt.Errorf("debit: %w", err)
        }

        // Credit destination
        if err := tx.Model(&Account{}).Where("id = ?", toID).
            Update("balance", gorm.Expr("balance + ?", amount)).Error; err != nil {
            return fmt.Errorf("credit: %w", err)
        }

        // Create audit log
        log := TransferLog{FromID: fromID, ToID: toID, Amount: amount}
        if err := tx.Create(&log).Error; err != nil {
            return fmt.Errorf("audit log: %w", err)
        }

        return nil // commit
        // Any error above -> automatic rollback
    })
}`,
        explanation: 'db.Transaction is the safest way to handle transactions. Return nil to commit, return an error to rollback. Use clause.Locking for SELECT ... FOR UPDATE to prevent race conditions on concurrent updates. Use gorm.Expr for SQL expressions (balance - ?) instead of reading, calculating in Go, and writing back -- the latter has a TOCTOU race.'
      },
      {
        title: 'Batch Operations & Avoiding N+1',
        code: `// BATCH CREATE: single INSERT with multiple rows
func createUsers(db *gorm.DB, users []User) error {
    // Creates all users in a single SQL INSERT
    return db.CreateInBatches(users, 100).Error // 100 per batch
}

// BATCH UPDATE: update items by ID presence
func updateItems(tx *gorm.DB, items []Item, tableName string) error {
    var toCreate []Item
    var errs []error

    for i := range items {
        if items[i].ID > 0 {
            // Existing item: update
            err := tx.Table(tableName).
                Where("id = ?", items[i].ID).
                Omit("id", "entity_id", "created_by", "created_at").
                Updates(items[i]).Error
            if err != nil {
                errs = append(errs, err)
            }
        } else {
            // New item: batch create later
            toCreate = append(toCreate, items[i])
        }
    }

    if len(toCreate) > 0 {
        if err := tx.Table(tableName).Create(&toCreate).Error; err != nil {
            errs = append(errs, err)
        }
    }

    return errors.Join(errs...)
}

// BATCH LOAD: prevent N+1 queries for custom fields
func loadWithCustomFields(db *gorm.DB, entityIDs []int64) ([]Entity, error) {
    var entities []Entity
    if err := db.Where("id IN ?", entityIDs).Find(&entities).Error; err != nil {
        return nil, err
    }

    // ONE query for all custom fields (not one per entity!)
    var customFields []CustomField
    db.Where("entity_id IN ?", entityIDs).Find(&customFields)

    // Build lookup map
    cfMap := make(map[int64][]CustomField)
    for _, cf := range customFields {
        cfMap[cf.EntityID] = append(cfMap[cf.EntityID], cf)
    }

    // Assign without additional queries
    for i := range entities {
        entities[i].CustomFields = cfMap[entities[i].ID]
    }

    return entities, nil
}`,
        explanation: 'NEVER perform database operations inside loops. Use batch creates (CreateInBatches), batch loads (WHERE id IN ?), and lookup maps to avoid N+1 queries. The update pattern checks for ID > 0 to distinguish existing records (update) from new ones (batch create). This is a critical performance pattern for CRUD endpoints that handle lists of items.'
      }
    ],
    bestPractices: [
      'Use Omit("id", "created_at", "created_by") instead of Select("*") for updates -- Select has issues with zero/false values',
      'Never use delete-recreate for updates: check item.ID > 0 to distinguish updates from creates',
      'Use db.Transaction() for atomic operations -- it auto-commits on nil, auto-rollbacks on error',
      'Use CreateInBatches() for bulk inserts to avoid oversized SQL statements',
      'Use gorm.Expr() for arithmetic updates (balance + ?) instead of read-modify-write in Go',
      'Set connection pool parameters: db.SetMaxOpenConns(25), db.SetMaxIdleConns(10), db.SetConnMaxLifetime(5 * time.Minute)'
    ],
    commonMistakes: [
      'Performing database queries inside loops (N+1 problem) -- use batch loads with WHERE IN',
      'Using db.Updates(model) without Omit -- zero-value fields (false, 0) are silently skipped',
      'Forgetting that soft delete (DeletedAt) means Find() auto-filters deleted records -- use Unscoped() to include them',
      'Not setting connection pool limits -- default is unlimited, which can exhaust database connections under load',
      'Using db (main instance) instead of tx (transaction instance) inside a Transaction callback -- bypasses the transaction'
    ],
    interviewQuestions: [
      'How does GORM handle soft deletes? How do you query soft-deleted records?',
      'Explain the N+1 query problem and how to prevent it with GORM.',
      'What is the difference between db.Save() and db.Updates()? When would you use each?',
      'How do you handle concurrent updates safely with GORM (optimistic vs. pessimistic locking)?',
      'What GORM hooks are available and what are common use cases for each?'
    ],
    resources: [
      { label: 'GORM Official Docs', url: 'https://gorm.io/docs/' },
      { label: 'GORM Best Practices', url: 'https://gorm.io/docs/performance.html' }
    ]
  },
  {
    id: 'gorm-advanced',
    title: 'GORM Advanced',
    category: 'orm',
    order: 12,
    explanation:
      'Advanced GORM covers relationships, preloading, scopes, raw SQL, and performance optimization. These are the patterns you need for building real production applications.\n\nRelationships in GORM mirror SQL relationships: HasOne, HasMany, BelongsTo, Many2Many. Preloading (eager loading) fetches related records in separate queries to avoid N+1. Use Preload("Relation") for eager loading, or Joins() for SQL JOIN-based loading when you need to filter on related fields.\n\nScopes are reusable query fragments. They let you compose complex queries from simple, testable pieces. Think of them as middleware for database queries.\n\nFor complex queries that do not map well to GORM\'s API, use Raw SQL with db.Raw() or db.Exec(). GORM can scan raw SQL results into structs. Connection pooling configuration is critical for production: set MaxOpenConns, MaxIdleConns, and ConnMaxLifetime to prevent connection exhaustion.',
    codeExamples: [
      {
        title: 'Relationships & Preloading',
        code: `type Company struct {
    ID        int64     \`gorm:"primaryKey" json:"id"\`
    Name      string    \`json:"name"\`
    Users     []User    \`gorm:"foreignKey:CompanyID" json:"users"\`       // HasMany
    Address   Address   \`gorm:"foreignKey:CompanyID" json:"address"\`     // HasOne
}

type User struct {
    ID        int64     \`gorm:"primaryKey" json:"id"\`
    Name      string    \`json:"name"\`
    CompanyID int64     \`json:"company_id"\`
    Company   Company   \`gorm:"foreignKey:CompanyID" json:"company"\`   // BelongsTo
    Orders    []Order   \`gorm:"foreignKey:UserID" json:"orders"\`       // HasMany
    Roles     []Role    \`gorm:"many2many:user_roles" json:"roles"\`     // Many2Many
}

// Preload: separate SELECT queries (good for lists)
func getCompanyWithUsers(db *gorm.DB, companyID int64) (*Company, error) {
    var company Company
    err := db.
        Preload("Users").           // SELECT * FROM users WHERE company_id = ?
        Preload("Users.Orders").     // nested: SELECT * FROM orders WHERE user_id IN (...)
        Preload("Address").
        First(&company, companyID).Error
    return &company, err
}

// Conditional preloading
func getActiveUsers(db *gorm.DB, companyID int64) (*Company, error) {
    var company Company
    err := db.
        Preload("Users", "is_active = ?", true).   // only active users
        Preload("Users.Orders", func(db *gorm.DB) *gorm.DB {
            return db.Order("created_at DESC").Limit(5) // last 5 orders per user
        }).
        First(&company, companyID).Error
    return &company, err
}

// Joins: SQL JOIN (good for filtering on related fields)
func getUsersByCompanyName(db *gorm.DB, companyName string) ([]User, error) {
    var users []User
    err := db.
        Joins("JOIN companies ON companies.id = users.company_id").
        Where("companies.name = ?", companyName).
        Find(&users).Error
    return users, err
}`,
        explanation: 'Preload creates separate SELECT queries (one per relationship). It is efficient for loading lists because it uses WHERE IN. Joins is better when you need to filter based on related table columns. Use conditional preloading to limit the data loaded per relationship. Nested preloading (Users.Orders) works for deep relationships.'
      },
      {
        title: 'Scopes & Reusable Query Builders',
        code: `// Scope: reusable query fragment
func ActiveScope(db *gorm.DB) *gorm.DB {
    return db.Where("is_active = ? AND deleted_at IS NULL", true)
}

func DateRangeScope(start, end time.Time) func(*gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        return db.Where("created_at BETWEEN ? AND ?", start, end)
    }
}

func PaginationScope(page, pageSize int) func(*gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        if pageSize > 100 {
            pageSize = 100 // enforce max limit
        }
        offset := (page - 1) * pageSize
        return db.Offset(offset).Limit(pageSize)
    }
}

func SearchScope(query string, fields ...string) func(*gorm.DB) *gorm.DB {
    return func(db *gorm.DB) *gorm.DB {
        if query == "" {
            return db
        }
        like := "%" + query + "%"
        conds := make([]string, len(fields))
        args := make([]interface{}, len(fields))
        for i, f := range fields {
            conds[i] = f + " LIKE ?"
            args[i] = like
        }
        return db.Where(strings.Join(conds, " OR "), args...)
    }
}

// Compose scopes in handlers
func listUsers(db *gorm.DB, page int, search string) ([]User, int64, error) {
    var users []User
    var total int64

    base := db.Model(&User{}).
        Scopes(ActiveScope).
        Scopes(SearchScope(search, "name", "email"))

    // Count total (without pagination)
    base.Count(&total)

    // Fetch page
    err := base.
        Scopes(PaginationScope(page, 25)).
        Order("created_at DESC").
        Find(&users).Error

    return users, total, err
}`,
        explanation: 'Scopes are composable query fragments. They let you build complex queries from simple, reusable pieces. The pattern is: a function that takes *gorm.DB and returns *gorm.DB. Parameterized scopes return a closure. Compose them with .Scopes(). This keeps your controllers thin and your query logic testable.'
      },
      {
        title: 'Raw SQL, Connection Pooling & Performance',
        code: `// Raw SQL for complex queries
type RevenueReport struct {
    Month      string  \`json:"month"\`
    Total      float64 \`json:"total"\`
    OrderCount int     \`json:"order_count"\`
}

func getRevenueReport(db *gorm.DB, year int) ([]RevenueReport, error) {
    var reports []RevenueReport
    err := db.Raw(\`
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            SUM(amount) AS total,
            COUNT(*) AS order_count
        FROM orders
        WHERE YEAR(created_at) = ?
          AND status = 'completed'
          AND deleted_at IS NULL
        GROUP BY month
        ORDER BY month
    \`, year).Scan(&reports).Error
    return reports, err
}

// Exec for DDL/DML without result scanning
func archiveOldOrders(db *gorm.DB, before time.Time) (int64, error) {
    result := db.Exec(\`
        INSERT INTO orders_archive SELECT * FROM orders WHERE created_at < ?
    \`, before)
    return result.RowsAffected, result.Error
}

// Connection pool configuration
func setupDB() (*gorm.DB, error) {
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Warn), // only log slow queries
        NamingStrategy: schema.NamingStrategy{
            SingularTable: true, // table name = struct name (no pluralization)
        },
    })
    if err != nil {
        return nil, err
    }

    sqlDB, _ := db.DB()

    // Pool settings: tune for your workload
    sqlDB.SetMaxOpenConns(25)               // max simultaneous connections
    sqlDB.SetMaxIdleConns(10)               // keep 10 warm connections
    sqlDB.SetConnMaxLifetime(5 * time.Minute) // recycle connections
    sqlDB.SetConnMaxIdleTime(3 * time.Minute) // close idle connections

    return db, nil
}

// Schema-prefixed table for multi-tenancy
func getTenantTable(tenantID int64, tableName string) string {
    return fmt.Sprintf("tenant_%d.%s", tenantID, tableName)
}

func getUsersForTenant(db *gorm.DB, tenantID int64) ([]User, error) {
    var users []User
    table := getTenantTable(tenantID, "users")
    return users, db.Table(table).Where("is_active = ?", true).Find(&users).Error
}`,
        explanation: 'Use Raw SQL for complex aggregations, reports, and queries that do not map well to GORM\'s API. Connection pool settings are critical: MaxOpenConns prevents exhausting database connections, MaxIdleConns keeps warm connections for reuse, and ConnMaxLifetime prevents stale connections. For multi-tenancy, use db.Table() with schema-prefixed table names.'
      }
    ],
    bestPractices: [
      'Use Preload for loading related data in lists, Joins for filtering on related fields',
      'Build reusable scopes for common query patterns (pagination, search, soft delete, date range)',
      'Set connection pool limits based on your database max_connections and number of app instances',
      'Use Raw SQL for complex reports and aggregations -- do not fight GORM for queries it was not designed for',
      'Enable GORM\'s slow query logger in production: logger.Default.LogMode(logger.Warn)',
      'Use db.Table("schema.table") for multi-tenant applications instead of modifying the global model'
    ],
    commonMistakes: [
      'Not setting MaxOpenConns -- default is unlimited, which can exhaust the database connection pool',
      'Using Preload when you should use Joins -- Preload loads ALL related records, Joins filters them',
      'Preloading deeply nested relationships without limits -- can load massive amounts of data',
      'Not using SingularTable when your database uses singular table names (users vs user)',
      'Scanning Raw SQL results into a struct with mismatched column names (use AS aliases to match struct fields)'
    ],
    interviewQuestions: [
      'What is the difference between Preload and Joins in GORM? When would you use each?',
      'How do you handle multi-tenancy with GORM?',
      'Explain GORM scopes. How would you build a reusable pagination scope?',
      'What connection pool settings are critical for production GORM applications?',
      'When would you use Raw SQL instead of GORM\'s query builder?'
    ],
    resources: [
      { label: 'GORM Preloading', url: 'https://gorm.io/docs/preload.html' },
      { label: 'GORM Scopes', url: 'https://gorm.io/docs/scopes.html' },
      { label: 'GORM Raw SQL', url: 'https://gorm.io/docs/sql_builder.html' }
    ]
  },

  // ── Patterns & Best Practices ───────────────────────────────────────
  {
    id: 'project-structure',
    title: 'Go Project Structure',
    category: 'patterns',
    order: 13,
    explanation:
      'Go project structure has evolved from the "standard layout" to more practical patterns. The key principle is: organize by domain/feature, not by technical layer. A well-structured Go project makes dependencies clear, keeps packages focused, and makes it easy to navigate.\n\nFor microservices, the common pattern is: cmd/ for entry points, internal/ for private packages, pkg/ for public packages (if any), and domain-specific packages at the root or under internal/. The internal/ directory is enforced by the Go toolchain -- packages under it cannot be imported by external modules.\n\nClean Architecture in Go means separating business logic (domain) from infrastructure (database, HTTP, external APIs). The domain layer defines interfaces, and the infrastructure layer implements them. Dependencies point inward: HTTP handlers depend on services, services depend on repositories (via interfaces), repositories depend on the database.\n\nDependency Injection in Go is done manually through constructors -- no framework needed. Each struct declares its dependencies as interface fields, and constructors accept concrete implementations. This makes testing trivial: swap in mocks.',
    codeExamples: [
      {
        title: 'Microservice Project Layout',
        code: `// Project structure for a Go microservice
//
// myservice/
// ├── cmd/
// │   └── myservice/
// │       └── main.go          # entry point, wire dependencies
// ├── internal/
// │   ├── domain/
// │   │   ├── user.go          # domain models & interfaces
// │   │   └── order.go
// │   ├── service/
// │   │   ├── user_service.go  # business logic
// │   │   └── order_service.go
// │   ├── repository/
// │   │   ├── user_repo.go     # database implementations
// │   │   └── order_repo.go
// │   ├── handler/
// │   │   ├── user_handler.go  # HTTP handlers
// │   │   └── order_handler.go
// │   └── middleware/
// │       ├── auth.go
// │       └── logging.go
// ├── migrations/
// │   └── 001_create_users.sql
// ├── config/
// │   └── config.go
// ├── go.mod
// ├── go.sum
// └── Makefile

// internal/domain/user.go — domain models and interfaces
package domain

type User struct {
    ID    int64
    Name  string
    Email string
}

// Repository interface (defined in domain, implemented in repository/)
type UserRepository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    Create(ctx context.Context, user *User) error
    Update(ctx context.Context, user *User) error
}

// Service interface (defined in domain, implemented in service/)
type UserService interface {
    GetUser(ctx context.Context, id int64) (*User, error)
    RegisterUser(ctx context.Context, name, email string) (*User, error)
}`,
        explanation: 'The domain package contains pure business models and interface definitions. It has ZERO external dependencies. Repository and service interfaces are defined here (consumer-side), implemented elsewhere. The internal/ directory ensures these packages cannot be imported by other modules.'
      },
      {
        title: 'Dependency Injection Without Frameworks',
        code: `// internal/service/user_service.go
package service

type userService struct {
    repo    domain.UserRepository
    mailer  domain.EmailSender
    logger  *slog.Logger
}

func NewUserService(
    repo domain.UserRepository,
    mailer domain.EmailSender,
    logger *slog.Logger,
) domain.UserService {
    return &userService{repo: repo, mailer: mailer, logger: logger}
}

func (s *userService) RegisterUser(ctx context.Context, name, email string) (*User, error) {
    existing, _ := s.repo.FindByEmail(ctx, email)
    if existing != nil {
        return nil, ErrEmailTaken
    }

    user := &domain.User{Name: name, Email: email}
    if err := s.repo.Create(ctx, user); err != nil {
        return nil, fmt.Errorf("create user: %w", err)
    }

    if err := s.mailer.Send(email, "Welcome!", "..."); err != nil {
        s.logger.Warn("welcome email failed", "email", email, "err", err)
    }

    return user, nil
}

// cmd/myservice/main.go — wire everything together
func main() {
    cfg := config.Load()
    db := setupDatabase(cfg)
    logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

    // Wire dependencies (manual DI)
    userRepo := repository.NewUserRepository(db)
    mailer := email.NewSMTPSender(cfg.SMTPHost)
    userSvc := service.NewUserService(userRepo, mailer, logger)
    userHandler := handler.NewUserHandler(userSvc)

    // Setup router
    r := gin.New()
    r.POST("/users", userHandler.Register)
    r.GET("/users/:id", userHandler.GetByID)
    r.Run(":8080")
}`,
        explanation: 'Manual dependency injection in Go is done in main(). Create concrete implementations and pass them to constructors that accept interfaces. This is explicit, easy to understand, and requires no framework. The service layer only knows about interfaces -- it does not import the repository package. This makes unit testing trivial: pass mock implementations.'
      },
      {
        title: 'Monorepo Structure (Go Workspaces)',
        code: `// Monorepo layout using Go workspaces (go.work)
//
// service-nuvertos/
// ├── go.work                     # workspace root
// ├── apps/
// │   ├── auth/                   # auth service (:3000)
// │   │   ├── main.go
// │   │   ├── go.mod
// │   │   └── controllers/
// │   ├── accounting/             # accounting service (:8081)
// │   │   ├── main.go
// │   │   ├── go.mod
// │   │   └── controllers/
// │   └── pdf/                    # PDF service (:8082)
// ├── libs/
// │   ├── config/                 # shared DB & tenant config
// │   │   └── go.mod
// │   └── utils/                  # 55+ shared modules
// │       ├── go.mod
// │       ├── vendors/
// │       │   ├── models/
// │       │   ├── services/
// │       │   └── controllers/
// │       └── accounts/
// ├── cmd/                        # CLI tools
// │   ├── migrate/
// │   └── seed-vendors/
// └── migrations/

// go.work file
// go 1.22
// use (
//     ./apps/auth
//     ./apps/accounting
//     ./libs/config
//     ./libs/utils
// )

// Layered delegation pattern:
// App controller -> Shared controller -> Service -> Model
//
// apps/accounting/controllers/vendor_controller.go
package controllers

func CreateVendor(c *gin.Context) {
    c.Set("app_name", "accounting")
    vendorControllers.CreateVendor(c) // delegates to shared controller
}`,
        explanation: 'Go workspaces (go.work) let multiple modules share a single repository. Each app and library has its own go.mod but they can import each other seamlessly. The layered delegation pattern keeps app-specific code thin: app controllers just set context (app_name, tenant) and delegate to shared controllers that contain the actual business logic.'
      }
    ],
    bestPractices: [
      'Organize by domain/feature, not by technical layer (avoid packages named "models", "utils", "helpers")',
      'Use internal/ to prevent external packages from importing your implementation details',
      'Define interfaces at the consumer (service defines what repository it needs), not the producer',
      'Keep main() focused on dependency wiring and configuration -- zero business logic',
      'Use Go workspaces (go.work) for monorepos with multiple services sharing libraries',
      'Follow the "accept interfaces, return structs" pattern in all constructors'
    ],
    commonMistakes: [
      'Creating a "utils" or "common" package that becomes a dumping ground for unrelated functions',
      'Circular imports: package A imports B imports A -- restructure by extracting shared types to a third package',
      'Putting all models in one package instead of co-locating them with their domain logic',
      'Over-engineering with too many layers for a simple service -- start simple, refactor when complexity demands it',
      'Using a DI framework (like wire, dig) for small projects where manual injection is clearer'
    ],
    interviewQuestions: [
      'How would you structure a Go microservice? Explain the role of each directory.',
      'What is the internal/ directory in Go and why is it special?',
      'How does Go handle dependency injection without a framework?',
      'Compare organizing code by layer (controller/service/repo) vs. by domain (user/order/payment).',
      'How would you share code between multiple Go services in a monorepo?'
    ],
    resources: [
      { label: 'Standard Go Project Layout', url: 'https://github.com/golang-standards/project-layout' },
      { label: 'Go Workspaces', url: 'https://go.dev/blog/get-familiar-with-workspaces' }
    ]
  },
  {
    id: 'testing-go',
    title: 'Testing in Go',
    category: 'testing',
    order: 14,
    explanation:
      'Go has a built-in testing framework in the testing package. Test files end with _test.go and test functions start with Test. Go testing emphasizes simplicity: no assertions library needed (though testify is popular), table-driven tests for coverage, and built-in benchmarking/profiling.\n\nTable-driven tests are the Go idiom for testing multiple cases. You define a slice of test cases with inputs and expected outputs, then loop through them. Each case runs as a subtest with t.Run(), so failures are clearly identified.\n\nBenchmarks (BenchmarkXxx) measure performance. They run the code b.N times, where b.N is automatically adjusted to get reliable timing. Use -benchmem to see allocations. Benchmarks are essential before and after optimization to prove improvement.\n\nhttptest provides an in-memory HTTP server for testing handlers without network calls. Combined with interface-based dependency injection, you can test HTTP handlers in isolation by injecting mock services.',
    codeExamples: [
      {
        title: 'Table-Driven Tests',
        code: `// calculator.go
func Add(a, b int) int { return a + b }

func Divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

// calculator_test.go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 2, 3, 5},
        {"negative numbers", -1, -2, -3},
        {"zero", 0, 0, 0},
        {"mixed", -5, 10, 5},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

func TestDivide(t *testing.T) {
    tests := []struct {
        name      string
        a, b      float64
        expected  float64
        expectErr bool
    }{
        {"normal", 10, 3, 3.333333, false},
        {"divide by zero", 10, 0, 0, true},
        {"negative", -10, 2, -5, false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := Divide(tt.a, tt.b)
            if tt.expectErr {
                if err == nil {
                    t.Fatal("expected error, got nil")
                }
                return
            }
            if err != nil {
                t.Fatalf("unexpected error: %v", err)
            }
            if math.Abs(result-tt.expected) > 0.001 {
                t.Errorf("Divide(%f, %f) = %f; want %f",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}`,
        explanation: 'Table-driven tests are the standard Go pattern. Each test case is a struct with inputs and expected outputs. t.Run creates a named subtest -- on failure, you see exactly which case failed. Use t.Fatal for setup errors (stops the subtest), t.Error for assertion failures (continues the subtest).'
      },
      {
        title: 'Mocking with Interfaces & httptest',
        code: `// Service and its interface
type UserService interface {
    GetUser(ctx context.Context, id int64) (*User, error)
}

// Handler under test
type UserHandler struct {
    svc UserService
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    id, _ := strconv.ParseInt(r.PathValue("id"), 10, 64)
    user, err := h.svc.GetUser(r.Context(), id)
    if err != nil {
        http.Error(w, err.Error(), 500)
        return
    }
    json.NewEncoder(w).Encode(user)
}

// Mock implementation for tests
type mockUserService struct {
    users map[int64]*User
    err   error
}

func (m *mockUserService) GetUser(_ context.Context, id int64) (*User, error) {
    if m.err != nil {
        return nil, m.err
    }
    user, ok := m.users[id]
    if !ok {
        return nil, fmt.Errorf("user %d not found", id)
    }
    return user, nil
}

func TestGetUser(t *testing.T) {
    mock := &mockUserService{
        users: map[int64]*User{
            1: {ID: 1, Name: "Alice", Email: "alice@test.com"},
        },
    }
    handler := &UserHandler{svc: mock}

    // Create test HTTP server
    req := httptest.NewRequest("GET", "/users/1", nil)
    req.SetPathValue("id", "1")
    rec := httptest.NewRecorder()

    handler.GetUser(rec, req)

    if rec.Code != 200 {
        t.Fatalf("expected 200, got %d", rec.Code)
    }

    var user User
    json.NewDecoder(rec.Body).Decode(&user)
    if user.Name != "Alice" {
        t.Errorf("expected Alice, got %s", user.Name)
    }
}

func TestGetUser_NotFound(t *testing.T) {
    mock := &mockUserService{users: map[int64]*User{}}
    handler := &UserHandler{svc: mock}

    req := httptest.NewRequest("GET", "/users/999", nil)
    req.SetPathValue("id", "999")
    rec := httptest.NewRecorder()

    handler.GetUser(rec, req)

    if rec.Code != 500 {
        t.Fatalf("expected 500, got %d", rec.Code)
    }
}`,
        explanation: 'The mock implements the same interface as the real service. httptest.NewRequest and httptest.NewRecorder let you test HTTP handlers without starting a real server. No external mocking framework needed -- Go interfaces make manual mocks trivial. For complex mocks with call verification, use testify/mock or gomock.'
      },
      {
        title: 'Benchmarks & testify',
        code: `// Benchmarks: measure performance
func BenchmarkFibRecursive(b *testing.B) {
    for i := 0; i < b.N; i++ {
        fibRecursive(20)
    }
}

func BenchmarkFibIterative(b *testing.B) {
    for i := 0; i < b.N; i++ {
        fibIterative(20)
    }
}

// Run: go test -bench=. -benchmem
// Output:
// BenchmarkFibRecursive-8    30000   42000 ns/op    0 B/op   0 allocs/op
// BenchmarkFibIterative-8  5000000     280 ns/op    0 B/op   0 allocs/op

// Benchmark with setup
func BenchmarkJSONMarshal(b *testing.B) {
    data := generateLargeStruct()
    b.ResetTimer() // exclude setup time

    for i := 0; i < b.N; i++ {
        json.Marshal(data)
    }
}

// Using testify for cleaner assertions
import (
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/require"
)

func TestUserService(t *testing.T) {
    user, err := svc.GetUser(ctx, 1)

    require.NoError(t, err)             // fails fast if error
    assert.Equal(t, "Alice", user.Name) // continues on failure
    assert.NotNil(t, user.CreatedAt)
    assert.Greater(t, user.ID, int64(0))
    assert.Contains(t, user.Email, "@")
}

// Test suite with setup/teardown
type UserServiceSuite struct {
    suite.Suite
    db  *gorm.DB
    svc UserService
}

func (s *UserServiceSuite) SetupTest() {
    s.db = setupTestDB()
    s.svc = NewUserService(NewUserRepo(s.db))
}

func (s *UserServiceSuite) TearDownTest() {
    cleanupTestDB(s.db)
}

func (s *UserServiceSuite) TestCreateUser() {
    user, err := s.svc.CreateUser(context.Background(), "Alice", "alice@test.com")
    s.Require().NoError(err)
    s.Assert().Equal("Alice", user.Name)
}

func TestUserServiceSuite(t *testing.T) {
    suite.Run(t, new(UserServiceSuite))
}`,
        explanation: 'Benchmarks run the function b.N times (auto-adjusted for accuracy). Use -benchmem to see allocations. testify/assert continues on failure (useful for checking multiple fields), testify/require stops on failure (useful for preconditions like error checks). Test suites provide SetupTest/TearDownTest for shared test infrastructure.'
      }
    ],
    bestPractices: [
      'Use table-driven tests for comprehensive coverage of edge cases',
      'Use httptest for handler tests -- no need for real HTTP servers',
      'Write benchmarks before and after optimization to prove improvement',
      'Use require.NoError for preconditions, assert.Equal for assertions',
      'Name test cases descriptively: "empty_input", "negative_balance", not "test1", "test2"',
      'Run tests with -race flag in CI to detect data races: go test -race ./...'
    ],
    commonMistakes: [
      'Not running go test -race in CI -- data races can hide for months before causing production issues',
      'Testing implementation details instead of behavior -- refactoring should not break tests',
      'Not using t.Parallel() for independent tests -- serial test runs are slower in CI',
      'Benchmarking with compiler-optimizable code: store results to a package-level var to prevent optimization',
      'Using global state in tests that makes them order-dependent -- each test should set up its own state'
    ],
    interviewQuestions: [
      'What are table-driven tests in Go? Why are they preferred?',
      'How do you benchmark Go code? What is b.N and how does the framework use it?',
      'How would you mock a database dependency for unit testing a service?',
      'What is httptest and how does it help test HTTP handlers?',
      'How do you detect data races in Go tests?'
    ],
    resources: [
      { label: 'Go Testing Package', url: 'https://pkg.go.dev/testing' },
      { label: 'testify', url: 'https://github.com/stretchr/testify' },
      { label: 'Learn Go with Tests', url: 'https://quii.gitbook.io/learn-go-with-tests/' }
    ]
  },
  {
    id: 'go-performance',
    title: 'Performance & Profiling',
    category: 'performance',
    order: 15,
    explanation:
      'Go provides built-in tools for profiling CPU, memory, goroutines, and blocking operations. The pprof package generates profiles that can be visualized as flame graphs, top-N reports, or call graphs.\n\nCPU profiling shows where your program spends the most time. Memory (heap) profiling shows where allocations happen and which objects consume the most memory. Goroutine profiling detects leaks by showing all active goroutines and their stack traces.\n\nCommon optimization techniques include: reducing allocations (sync.Pool, pre-allocation, strings.Builder), avoiding unnecessary copies (pointer vs. value), efficient JSON handling (json.RawMessage, code generation), and query optimization for database-heavy services.\n\nThe golden rule: profile first, optimize second. Never guess where the bottleneck is. Use pprof to identify the actual hot path, then optimize that specific area. Micro-optimizations on non-hot paths waste time and reduce readability.',
    codeExamples: [
      {
        title: 'pprof HTTP Endpoint & Analysis',
        code: `import (
    "net/http"
    _ "net/http/pprof" // import for side effect: registers /debug/pprof
)

func main() {
    // Option 1: Add pprof to existing server
    // Just import _ "net/http/pprof" and use http.DefaultServeMux
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()

    // Now you can:
    // 1. CPU Profile (30 seconds):
    //    go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
    //
    // 2. Heap Profile (current allocations):
    //    go tool pprof http://localhost:6060/debug/pprof/heap
    //
    // 3. Goroutine dump (detect leaks):
    //    go tool pprof http://localhost:6060/debug/pprof/goroutine
    //
    // 4. Block profile (contention):
    //    go tool pprof http://localhost:6060/debug/pprof/block
    //
    // Inside pprof interactive mode:
    //    (pprof) top 20          # show top 20 functions by CPU/memory
    //    (pprof) list funcName   # show source code annotated with CPU/memory
    //    (pprof) web             # open flame graph in browser
    //    (pprof) svg > out.svg   # generate call graph SVG

    // Your actual application
    startApplication()
}

// Option 2: Programmatic CPU profiling
func profileCode() {
    f, _ := os.Create("cpu.prof")
    pprof.StartCPUProfile(f)
    defer pprof.StopCPUProfile()

    // ... code to profile ...
}`,
        explanation: 'Import net/http/pprof as a blank import to register profiling endpoints. Run a separate HTTP server on a debug port (6060 is conventional). Use go tool pprof to analyze profiles interactively. The "top" command shows hot functions, "list" shows annotated source code, and "web" opens a flame graph. Always profile in production or with production-like data.'
      },
      {
        title: 'String Building & Allocation Reduction',
        code: `// SLOW: string concatenation creates a new string each iteration
// Each + allocates a new string, copies both sides into it
func slowConcat(items []string) string {
    result := ""
    for _, item := range items {
        result += item + "," // O(n^2) allocations!
    }
    return result
}

// FAST: strings.Builder pre-allocates and grows efficiently
func fastConcat(items []string) string {
    var b strings.Builder
    b.Grow(len(items) * 20) // pre-allocate estimated capacity

    for i, item := range items {
        if i > 0 {
            b.WriteByte(',')
        }
        b.WriteString(item)
    }
    return b.String()
}

// Benchmark comparison:
// BenchmarkSlowConcat-8    1000    1500000 ns/op   5000000 B/op   10000 allocs
// BenchmarkFastConcat-8  100000      15000 ns/op     50000 B/op       2 allocs

// sync.Pool for reusable buffers
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func handleRequestPooled(data []byte) []byte {
    buf := bufferPool.Get().(*bytes.Buffer)
    buf.Reset()
    defer bufferPool.Put(buf)

    // Use buffer...
    buf.Write(data)
    buf.WriteString(" processed")

    // Must copy result before returning buffer to pool
    result := make([]byte, buf.Len())
    copy(result, buf.Bytes())
    return result
}

// Pre-allocate maps and slices
func efficientCollection(n int) {
    // BAD: grows and rehashes multiple times
    m := make(map[string]int)
    s := []int{}

    // GOOD: pre-allocate expected size
    m = make(map[string]int, n)   // no rehashing up to n entries
    s = make([]int, 0, n)         // no reallocation up to n items
}`,
        explanation: 'String concatenation with + is O(n^2) because each concatenation allocates a new string and copies both sides. strings.Builder is O(n) because it uses an internal byte slice that grows geometrically. sync.Pool reuses buffers across requests, dramatically reducing GC pressure for high-throughput servers.'
      },
      {
        title: 'JSON Optimization & Struct Field Alignment',
        code: `// json.RawMessage: skip parsing fields you don't need
type APIResponse struct {
    Status string          \`json:"status"\`
    Data   json.RawMessage \`json:"data"\` // NOT parsed until needed
}

func handleResponse(body []byte) (*User, error) {
    var resp APIResponse
    if err := json.Unmarshal(body, &resp); err != nil {
        return nil, err
    }
    if resp.Status != "ok" {
        return nil, errors.New("bad status") // never parsed Data
    }

    var user User
    return &user, json.Unmarshal(resp.Data, &user)
}

// Struct field alignment: reduce memory padding
// BAD: 32 bytes (due to padding)
type BadLayout struct {
    a bool    // 1 byte + 7 padding
    b int64   // 8 bytes
    c bool    // 1 byte + 7 padding
    d int64   // 8 bytes
}                // Total: 32 bytes

// GOOD: 24 bytes (fields ordered by size, descending)
type GoodLayout struct {
    b int64   // 8 bytes
    d int64   // 8 bytes
    a bool    // 1 byte
    c bool    // 1 byte + 6 padding
}                // Total: 24 bytes (25% smaller)

// Use fieldalignment tool:
// go install golang.org/x/tools/go/analysis/passes/fieldalignment/cmd/fieldalignment@latest
// fieldalignment -fix ./...

// Efficient JSON encoding: use encoder directly to writer
func serveJSON(w http.ResponseWriter, data interface{}) {
    w.Header().Set("Content-Type", "application/json")

    // GOOD: encodes directly to writer (no intermediate buffer)
    json.NewEncoder(w).Encode(data)

    // BAD: allocates intermediate byte slice
    // bytes, _ := json.Marshal(data)
    // w.Write(bytes)
}`,
        explanation: 'json.RawMessage delays parsing -- useful when you only need part of a large JSON response. Struct field alignment reduces memory by minimizing padding (CPU requires fields aligned to their size boundaries). Order fields from largest to smallest. Use json.NewEncoder(w).Encode() to write directly to an io.Writer, avoiding an intermediate allocation.'
      }
    ],
    bestPractices: [
      'Profile first, optimize second. Use pprof to identify the actual bottleneck before changing code',
      'Use strings.Builder for building strings, bytes.Buffer for building byte slices',
      'Pre-allocate maps and slices when you know the expected size',
      'Use sync.Pool for frequently allocated temporary objects (buffers, encoders)',
      'Order struct fields from largest to smallest to minimize padding',
      'Use json.RawMessage to defer parsing of large or conditionally-needed JSON fields',
      'Run benchmarks with -benchmem and -count=5 for reliable allocation and timing data'
    ],
    commonMistakes: [
      'Premature optimization: spending time on micro-optimizations without profiling first',
      'String concatenation with + in loops -- O(n^2) performance, use strings.Builder',
      'Not pre-allocating slices when the size is known -- causes repeated allocations as the slice grows',
      'Forgetting to Reset() pooled objects before use -- data leaks between requests',
      'Using json.Marshal + w.Write instead of json.NewEncoder(w).Encode -- unnecessary intermediate allocation'
    ],
    interviewQuestions: [
      'How would you profile a Go application in production? What tools does Go provide?',
      'Explain the difference between CPU profiling and memory profiling. When would you use each?',
      'What is sync.Pool and when should you use it?',
      'How does struct field alignment affect memory usage? How do you fix it?',
      'What strategies would you use to optimize a Go HTTP service that is responding slowly?'
    ],
    resources: [
      { label: 'Go Profiling (blog)', url: 'https://go.dev/blog/pprof' },
      { label: 'High Performance Go Workshop', url: 'https://dave.cheney.net/high-performance-go-workshop/dotgo-paris.html' },
      { label: 'Go Performance Patterns', url: 'https://github.com/dgryski/go-perfbook' }
    ]
  }
];
