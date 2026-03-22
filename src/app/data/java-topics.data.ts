import { JavaTopic } from '../models/java.model';

export const JAVA_TOPICS: JavaTopic[] = [
  // ── Core Java ─────────────────────────────────────────────────────────
  {
    id: 'java-oop',
    title: 'OOP Principles in Java',
    category: 'core-java',
    order: 1,
    explanation:
      `What is Object-Oriented Programming?

OOP is a programming paradigm that organizes code around "objects" -- bundles of data (fields) and behavior (methods) that model real-world entities. Java is fundamentally an OOP language: almost everything lives inside a class.

Why does it exist?

Before OOP, procedural code became a tangled mess as programs grew. OOP lets you break complex systems into small, self-contained pieces that are easier to understand, test, reuse, and maintain.

The 4 Pillars -- with Real-World Analogies

1. ENCAPSULATION (Hiding internals)
   Analogy: A medicine capsule hides the chemicals inside. You swallow it; you don't mix the chemicals yourself.
   In Java: Make fields private, expose controlled access via getters/setters.

   ┌────────────────────────┐
   │  BankAccount (capsule)  │
   │  ─────────────────────  │
   │  - balance: double      │  ← private (hidden)
   │  + deposit(amount)      │  ← public (controlled)
   │  + getBalance()         │  ← public (read-only)
   └────────────────────────┘

2. INHERITANCE (Reusing behavior from a parent)
   Analogy: A child inherits eye color and height from their parents but can also develop their own traits.
   In Java: A subclass extends a parent class and inherits its fields/methods.

        Animal
       ┌───┴───┐
      Dog      Cat
      bark()   meow()
   Both inherit eat() and sleep() from Animal.

3. POLYMORPHISM (Same action, different behavior)
   Analogy: A TV remote's "power" button turns on a TV, but the same button on an AC remote turns on an AC. Same interface, different behavior.
   In Java: A parent reference can point to a child object, and the correct method runs at runtime (dynamic dispatch).

   Animal a = new Dog();
   a.speak();  → "Woof!"

   Animal a = new Cat();
   a.speak();  → "Meow!"

4. ABSTRACTION (Hiding complexity behind a simple interface)
   Analogy: Driving a car -- you turn the steering wheel and press the accelerator. You don't need to know how the engine, transmission, or fuel injection works.
   In Java: Abstract classes and interfaces define WHAT to do; concrete classes define HOW.

Abstract Class vs Interface (Java 8+)

  ┌─────────────────────┬─────────────────────────────┬──────────────────────────────┐
  │                     │ Abstract Class               │ Interface                    │
  ├─────────────────────┼─────────────────────────────┼──────────────────────────────┤
  │ Fields              │ Instance fields allowed      │ Only static final constants  │
  │ Constructors        │ Yes                         │ No                           │
  │ Methods             │ Abstract + concrete          │ Abstract + default + static  │
  │ Inheritance         │ Single (extends one)         │ Multiple (implements many)   │
  │ Use when            │ Shared state + partial impl  │ Contract / capability        │
  └─────────────────────┴─────────────────────────────┴──────────────────────────────┘

  Rule of thumb:
  - Use interface when defining a CAPABILITY (Flyable, Serializable, Comparable)
  - Use abstract class when sharing STATE and partial behavior among related classes

  Java 8 default methods blurred the line -- interfaces can now have method bodies.
  But interfaces still cannot hold instance state.

Composition vs Inheritance -- "Prefer composition over inheritance"

  Inheritance = "is-a" (Dog IS an Animal)
  Composition = "has-a" (Car HAS an Engine)

  Problem with inheritance: Tight coupling. Changing the parent breaks all children.
  Composition: Swap parts at runtime. An ElectricCar can swap its Engine without changing the Car class.

  ┌──────────┐  has-a  ┌──────────┐
  │   Car    │────────→│  Engine  │ ← can be GasEngine or ElectricEngine
  └──────────┘         └──────────┘`,
    codeExamples: [
      {
        title: 'Interface + Implementation',
        code: `// Capability contract
public interface Notifiable {
    void send(String message, String recipient);
}

// Concrete implementations
public class EmailNotifier implements Notifiable {
    @Override
    public void send(String message, String recipient) {
        System.out.println("Email to " + recipient + ": " + message);
    }
}

public class SmsNotifier implements Notifiable {
    @Override
    public void send(String message, String recipient) {
        System.out.println("SMS to " + recipient + ": " + message);
    }
}

// Polymorphism in action
public class AlertService {
    private final List<Notifiable> notifiers;

    public AlertService(List<Notifiable> notifiers) {
        this.notifiers = notifiers;
    }

    public void alertAll(String msg, String recipient) {
        for (Notifiable n : notifiers) {
            n.send(msg, recipient);  // correct implementation called at runtime
        }
    }
}`,
        explanation: `This demonstrates polymorphism and the "program to an interface" principle. AlertService doesn't know or care whether it's sending emails or SMS -- it just calls send() on each Notifiable. You can add a PushNotifier tomorrow without changing AlertService at all. This is the Open/Closed Principle in action.`
      },
      {
        title: 'Abstract Class with Shared State',
        code: `public abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // Concrete method -- shared by all shapes
    public String getColor() { return color; }

    // Abstract -- each shape calculates differently
    public abstract double area();
    public abstract double perimeter();

    @Override
    public String toString() {
        return getClass().getSimpleName() + "(color=" + color
             + ", area=" + String.format("%.2f", area()) + ")";
    }
}

public class Circle extends Shape {
    private final double radius;

    public Circle(String color, double radius) {
        super(color);   // must call parent constructor
        this.radius = radius;
    }

    @Override
    public double area() { return Math.PI * radius * radius; }

    @Override
    public double perimeter() { return 2 * Math.PI * radius; }
}

public class Rectangle extends Shape {
    private final double width, height;

    public Rectangle(String color, double w, double h) {
        super(color);
        this.width = w;
        this.height = h;
    }

    @Override
    public double area() { return width * height; }

    @Override
    public double perimeter() { return 2 * (width + height); }
}`,
        explanation: `Abstract class is used here because all shapes share common state (color) and a toString() implementation, but each shape calculates area/perimeter differently. You can't instantiate Shape directly -- only concrete subclasses. The constructor chain (super(color)) ensures every shape has a color.`
      },
      {
        title: 'Composition over Inheritance',
        code: `// Instead of: class ElectricCar extends Car extends Vehicle (fragile hierarchy)
// Use composition:

public interface Engine {
    void start();
    String type();
}

public class GasEngine implements Engine {
    @Override public void start() { System.out.println("Vroom!"); }
    @Override public String type() { return "Gasoline"; }
}

public class ElectricMotor implements Engine {
    @Override public void start() { System.out.println("Whirr..."); }
    @Override public String type() { return "Electric"; }
}

public class Car {
    private final String model;
    private final Engine engine;  // HAS-A engine (composition)

    public Car(String model, Engine engine) {
        this.model = model;
        this.engine = engine;
    }

    public void drive() {
        engine.start();
        System.out.println(model + " with " + engine.type() + " engine is driving");
    }
}

// Usage -- swap engines without changing Car class
Car tesla = new Car("Model 3", new ElectricMotor());
Car mustang = new Car("Mustang", new GasEngine());
tesla.drive();    // Whirr... Model 3 with Electric engine is driving
mustang.drive();  // Vroom! Mustang with Gasoline engine is driving`,
        explanation: `With composition, the Car delegates engine behavior to an Engine object. You can swap implementations at construction time (or even at runtime with a setter). With inheritance, you'd need a rigid class hierarchy: GasCar extends Car, ElectricCar extends Car -- and adding a HybridCar that uses BOTH engines becomes awkward. Composition gives you flexibility; inheritance gives you rigidity.`
      }
    ],
    bestPractices: [
      'Program to interfaces, not implementations -- declare variables as List<T>, not ArrayList<T>',
      'Prefer composition over inheritance -- use "has-a" unless "is-a" is genuinely true',
      'Keep class hierarchies shallow -- 2-3 levels max; deep hierarchies are hard to reason about',
      'Follow the Liskov Substitution Principle -- a subclass should be usable wherever its parent is expected',
      'Make classes final if they are not designed for extension',
      'Use interfaces for cross-cutting capabilities (Comparable, Serializable) and abstract classes for shared state'
    ],
    commonMistakes: [
      'Using inheritance for code reuse when there is no "is-a" relationship -- leads to fragile base class problem',
      'Exposing mutable internal state through getters (return new ArrayList<>(list) instead of the list itself)',
      'Forgetting that default methods in interfaces cannot access instance state -- they can only call other interface methods',
      'Creating God classes that violate Single Responsibility -- split into focused classes',
      'Using instanceof checks everywhere instead of polymorphism -- a sign your hierarchy needs redesign'
    ],
    interviewQuestions: [
      'What are the 4 pillars of OOP? Explain each with an example.',
      'When would you use an abstract class vs an interface?',
      'What changed with interfaces in Java 8? Can you have method bodies in interfaces now?',
      'Explain "prefer composition over inheritance" with an example.',
      'What is the Liskov Substitution Principle?',
      'Can a class implement multiple interfaces? Can it extend multiple classes? Why?',
      'What is the diamond problem and how does Java solve it?',
      'Explain method overloading vs method overriding.'
    ],
    resources: [
      { label: 'Oracle OOP Concepts', url: 'https://docs.oracle.com/javase/tutorial/java/concepts/' },
      { label: 'Effective Java - Item 18: Composition over Inheritance', url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/' },
      { label: 'Baeldung - Abstract Class vs Interface', url: 'https://www.baeldung.com/java-interface-vs-abstract-class' }
    ]
  },

  {
    id: 'java-collections',
    title: 'Collections Framework',
    category: 'core-java',
    order: 2,
    explanation:
      `What is the Collections Framework?

It is Java's built-in library of data structures and algorithms. Instead of writing your own linked list or hash table, you use battle-tested, optimized implementations from java.util.

Why does it exist?

Every program needs to store and manipulate groups of objects. Before Collections (Java 1.2), developers used raw arrays, Vector, and Hashtable -- which were inconsistent and limited. The framework provides a unified architecture with common interfaces.

Collections Hierarchy (ASCII diagram)

  Iterable
  └── Collection
      ├── List (ordered, duplicates allowed)
      │   ├── ArrayList   — backed by array, fast random access O(1), slow insert/remove middle O(n)
      │   ├── LinkedList  — doubly-linked nodes, fast insert/remove O(1) at ends, slow random access O(n)
      │   └── Vector      — synchronized ArrayList (legacy, avoid -- use Collections.synchronizedList)
      ├── Set (no duplicates)
      │   ├── HashSet        — O(1) lookup, no ordering guarantee
      │   ├── LinkedHashSet  — O(1) lookup, preserves insertion order
      │   └── TreeSet        — sorted order (red-black tree), O(log n) operations
      └── Queue / Deque
          ├── PriorityQueue  — min-heap by default, O(log n) insert/remove
          ├── ArrayDeque     — resizable double-ended queue, faster than Stack/LinkedList
          └── LinkedList     — also implements Deque

  Map (NOT part of Collection interface, but part of the framework)
  ├── HashMap         — O(1) get/put, no ordering, allows one null key
  ├── LinkedHashMap   — O(1) get/put, preserves insertion order
  ├── TreeMap         — sorted by keys (red-black tree), O(log n)
  ├── Hashtable       — synchronized (legacy, avoid -- use ConcurrentHashMap)
  └── ConcurrentHashMap — thread-safe, lock striping, no null keys/values

When to Use What? (Decision Flowchart)

  Need key-value pairs?
  ├── YES → Need thread safety? → ConcurrentHashMap
  │         Need sorted keys?   → TreeMap
  │         Need insertion order? → LinkedHashMap
  │         Otherwise           → HashMap
  └── NO → Need ordering?
           ├── YES → Allow duplicates?
           │         ├── YES → ArrayList (random access) or LinkedList (frequent insert/remove)
           │         └── NO  → LinkedHashSet (insertion order) or TreeSet (sorted)
           └── NO  → HashSet

HashMap Internals (Important for Interviews)

  HashMap uses an array of "buckets." Each bucket holds a linked list (or tree after Java 8).

  1. PUT operation:
     key → hashCode() → compress to index → bucket[index]
     If bucket empty → store (key, value) node
     If bucket occupied → check equals():
       - Same key? → overwrite value
       - Different key? → collision → append to linked list

  2. Java 8 optimization: When a bucket's linked list grows beyond 8 nodes,
     it converts to a red-black tree (O(log n) instead of O(n) lookup).

  3. Load factor (default 0.75): When 75% of buckets are occupied, the array
     doubles in size and ALL entries are rehashed. This is expensive.

  Bucket Array (size 16 default):
  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
  │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │13 │14 │15 │
  └─┬─┴───┴─┬─┴───┴───┴───┴─┬─┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
    │       │               │
   [A→B]   [C]            [D→E→F] ← collision chain (list or tree)

ArrayList vs LinkedList Performance

  ┌───────────────────┬───────────────┬────────────────┐
  │ Operation         │ ArrayList     │ LinkedList     │
  ├───────────────────┼───────────────┼────────────────┤
  │ get(index)        │ O(1)          │ O(n)           │
  │ add(end)          │ O(1) amortized│ O(1)           │
  │ add(middle)       │ O(n) shift    │ O(1) + O(n) find│
  │ remove(middle)    │ O(n) shift    │ O(1) + O(n) find│
  │ Memory            │ Compact array │ Node overhead  │
  │ Cache performance │ Excellent     │ Poor (scattered)│
  └───────────────────┴───────────────┴────────────────┘

  In practice, ArrayList wins almost always because CPU cache locality matters
  more than Big-O for most real-world sizes. Use LinkedList only for pure
  queue/deque patterns.`,
    codeExamples: [
      {
        title: 'HashMap -- Usage Patterns',
        code: `import java.util.*;

public class CollectionExamples {
    public static void main(String[] args) {
        // --- HashMap basics ---
        Map<String, Integer> wordCount = new HashMap<>();
        String[] words = {"apple", "banana", "apple", "cherry", "banana", "apple"};

        for (String word : words) {
            wordCount.merge(word, 1, Integer::sum);  // elegant way to count
        }
        System.out.println(wordCount);  // {banana=2, cherry=1, apple=3}

        // getOrDefault -- avoid null checks
        int grapeCount = wordCount.getOrDefault("grape", 0);

        // computeIfAbsent -- lazy initialization of complex values
        Map<String, List<String>> groupedWords = new HashMap<>();
        for (String word : words) {
            groupedWords.computeIfAbsent(word.substring(0, 1), k -> new ArrayList<>())
                        .add(word);
        }

        // --- Unmodifiable collections (Java 9+) ---
        List<String> immutable = List.of("a", "b", "c");      // throws on add/remove
        Map<String, Integer> immutableMap = Map.of("x", 1, "y", 2);
        Set<String> immutableSet = Set.of("a", "b", "c");
    }
}`,
        explanation: `merge() is the cleanest way to count occurrences -- it puts 1 if the key is absent, or applies the function (Integer::sum) if present. computeIfAbsent() lazily creates the value only when the key is missing, which is perfect for "group by first letter" patterns. Java 9's List.of(), Map.of(), Set.of() create truly immutable collections -- any modification attempt throws UnsupportedOperationException.`
      },
      {
        title: 'Iterating Collections + Utility Methods',
        code: `import java.util.*;
import java.util.stream.*;

public class IterationPatterns {
    public static void main(String[] args) {
        List<Integer> numbers = new ArrayList<>(List.of(5, 3, 8, 1, 9, 2, 7));

        // 1. Enhanced for loop (most readable for simple iteration)
        for (int n : numbers) { System.out.print(n + " "); }

        // 2. Iterator (needed when removing during iteration)
        Iterator<Integer> it = numbers.iterator();
        while (it.hasNext()) {
            if (it.next() < 3) it.remove();  // safe removal
        }

        // 3. forEach with lambda
        numbers.forEach(n -> System.out.print(n + " "));

        // --- Collections utility class ---
        Collections.sort(numbers);                    // [3, 5, 7, 8, 9]
        Collections.reverse(numbers);                 // [9, 8, 7, 5, 3]
        int max = Collections.max(numbers);           // 9
        int freq = Collections.frequency(numbers, 5); // 1
        Collections.shuffle(numbers);                 // random order

        // Binary search (list MUST be sorted first)
        Collections.sort(numbers);
        int idx = Collections.binarySearch(numbers, 7);

        // Unmodifiable wrapper (view, not a copy)
        List<Integer> readOnly = Collections.unmodifiableList(numbers);

        // Thread-safe wrapper
        List<Integer> syncList = Collections.synchronizedList(new ArrayList<>());
    }
}`,
        explanation: `Key takeaway: use Iterator.remove() when you need to remove elements during iteration -- a plain for-each loop will throw ConcurrentModificationException. Collections utility class provides sorting, searching, and wrapping. Note: Collections.unmodifiableList() wraps the original list -- if the original changes, the "unmodifiable" view reflects those changes. For a true immutable copy, use List.copyOf() (Java 10+).`
      },
      {
        title: 'Choosing the Right Collection',
        code: `import java.util.*;

public class CollectionChoice {

    // Scenario 1: Remove duplicates while preserving order
    public static <T> List<T> removeDuplicates(List<T> input) {
        return new ArrayList<>(new LinkedHashSet<>(input));
    }

    // Scenario 2: Find top-K elements efficiently
    public static List<Integer> topK(List<Integer> nums, int k) {
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();  // min-heap
        for (int n : nums) {
            minHeap.offer(n);
            if (minHeap.size() > k) minHeap.poll();  // remove smallest
        }
        return new ArrayList<>(minHeap);  // contains k largest elements
    }

    // Scenario 3: LRU Cache using LinkedHashMap
    public static <K, V> Map<K, V> createLRUCache(int maxSize) {
        return new LinkedHashMap<>(maxSize, 0.75f, true) {  // accessOrder = true
            @Override
            protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
                return size() > maxSize;
            }
        };
    }

    public static void main(String[] args) {
        // Dedup
        List<String> names = List.of("Alice", "Bob", "Alice", "Carol", "Bob");
        System.out.println(removeDuplicates(names));  // [Alice, Bob, Carol]

        // Top 3
        System.out.println(topK(List.of(3, 1, 4, 1, 5, 9, 2, 6), 3));  // [5, 6, 9]

        // LRU Cache
        Map<String, String> cache = createLRUCache(3);
        cache.put("a", "1"); cache.put("b", "2"); cache.put("c", "3");
        cache.get("a");       // access "a" → moves to end
        cache.put("d", "4");  // evicts "b" (least recently used)
        System.out.println(cache);  // {c=3, a=1, d=4}
    }
}`,
        explanation: `Three powerful patterns: (1) LinkedHashSet preserves insertion order while removing duplicates -- wrapping it back in an ArrayList gives you a deduped list. (2) A min-heap of size K naturally keeps the K largest elements -- when it exceeds K, the smallest is removed. (3) LinkedHashMap with accessOrder=true reorders entries on every get(), making it a built-in LRU cache when you override removeEldestEntry().`
      }
    ],
    bestPractices: [
      'Declare variables using the interface type: List<T>, Map<K,V>, Set<T> -- not the implementation',
      'Pre-size ArrayList if you know the count: new ArrayList<>(expectedSize) avoids resizing',
      'Use Map.merge(), computeIfAbsent(), getOrDefault() instead of manual null checks',
      'For thread-safe collections, prefer ConcurrentHashMap over Collections.synchronizedMap()',
      'Use EnumSet and EnumMap when keys are enums -- they are faster than HashSet/HashMap',
      'Never use raw types (Map map) -- always parameterize (Map<String, Integer>)'
    ],
    commonMistakes: [
      'Using ArrayList.remove(int) when you mean remove(Object) -- remove(1) removes index 1, not the value 1',
      'Modifying a collection during for-each iteration → ConcurrentModificationException',
      'Forgetting to override both hashCode() AND equals() when using objects as HashMap keys',
      'Using mutable objects as HashMap keys -- if the key changes after insertion, the entry is lost',
      'Assuming HashMap preserves insertion order -- use LinkedHashMap if order matters',
      'Using LinkedList for everything -- ArrayList is faster in practice due to cache locality'
    ],
    interviewQuestions: [
      'How does HashMap work internally? What happens during a hash collision?',
      'What is the time complexity of get() and put() for HashMap? When does it degrade?',
      'What happens when the load factor threshold is exceeded?',
      'Difference between HashMap and ConcurrentHashMap?',
      'Why must you override hashCode() when you override equals()?',
      'ArrayList vs LinkedList -- when would you choose each?',
      'How would you implement an LRU cache in Java?',
      'What is the difference between fail-fast and fail-safe iterators?',
      'Explain the difference between Comparable and Comparator.'
    ],
    resources: [
      { label: 'Oracle Collections Tutorial', url: 'https://docs.oracle.com/javase/tutorial/collections/' },
      { label: 'Baeldung - Java Collections', url: 'https://www.baeldung.com/java-collections' },
      { label: 'HashMap Internals Deep Dive', url: 'https://www.baeldung.com/java-hashmap-advanced' }
    ]
  },

  {
    id: 'java-streams-lambdas',
    title: 'Streams API & Lambdas',
    category: 'core-java',
    order: 3,
    explanation:
      `What are Lambdas and Streams?

Lambda expressions (Java 8) are anonymous functions -- a concise way to pass behavior as a parameter. The Streams API is a declarative pipeline for processing collections, replacing verbose for-loops with readable, chainable operations.

Why do they exist?

Before Java 8, processing a list meant writing imperative loops with mutable state:
  for (Order o : orders) { if (o.isPaid()) { total += o.getAmount(); } }

Streams let you express the WHAT (filter paid, sum amounts) without specifying the HOW (loop mechanics):
  orders.stream().filter(Order::isPaid).mapToDouble(Order::getAmount).sum();

Functional Interfaces (the foundation of lambdas)

A functional interface has exactly ONE abstract method. The lambda provides the implementation.

  ┌───────────────────┬───────────────────────┬──────────────────────────────┐
  │ Interface         │ Method                │ Use Case                     │
  ├───────────────────┼───────────────────────┼──────────────────────────────┤
  │ Predicate<T>      │ boolean test(T)       │ Filtering (is this valid?)   │
  │ Function<T, R>    │ R apply(T)            │ Transforming (T → R)         │
  │ Consumer<T>       │ void accept(T)        │ Side effects (print, save)   │
  │ Supplier<T>       │ T get()               │ Factory (create something)   │
  │ UnaryOperator<T>  │ T apply(T)            │ Transform same type          │
  │ BiFunction<T,U,R> │ R apply(T, U)         │ Combine two inputs           │
  └───────────────────┴───────────────────────┴──────────────────────────────┘

Stream Pipeline (How It Works)

  Source → Intermediate Operations → Terminal Operation
  (lazy)        (lazy)                 (triggers execution)

  List.stream()  →  filter()  →  map()  →  sorted()  →  collect()
  ──────────────    ────────     ──────     ────────     ─────────
  creates stream    lazy         lazy       lazy         TERMINAL
                                                         (pulls data through)

  Key insight: NOTHING happens until a terminal operation is called.
  Intermediate operations just build up the pipeline description.

  Common Intermediate: filter(), map(), flatMap(), distinct(), sorted(), peek(), limit(), skip()
  Common Terminal:     collect(), forEach(), reduce(), count(), findFirst(), anyMatch(), toList()

How Laziness Works (Diagram)

  Given: [1, 2, 3, 4, 5].stream().filter(x > 2).map(x * 10).findFirst()

  Step 1: Take 1 → filter(1 > 2)? NO → skip
  Step 2: Take 2 → filter(2 > 2)? NO → skip
  Step 3: Take 3 → filter(3 > 2)? YES → map(3 * 10) = 30 → findFirst returns 30. DONE.

  Elements 4 and 5 are NEVER processed. This is called short-circuiting.

Parallel Streams -- When to Use

  .parallelStream() splits work across multiple threads using ForkJoinPool.

  USE when:
  - Large dataset (10,000+ elements)
  - CPU-intensive operations per element
  - No shared mutable state
  - Order doesn't matter

  AVOID when:
  - Small collections (thread overhead > benefit)
  - I/O-bound operations (use async instead)
  - Operations depend on encounter order
  - Using a shared mutable accumulator`,
    codeExamples: [
      {
        title: 'Stream Pipeline -- Processing Orders',
        code: `import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    record Order(String customer, String product, double amount, boolean paid) {}

    public static void main(String[] args) {
        List<Order> orders = List.of(
            new Order("Alice", "Laptop", 999.99, true),
            new Order("Bob", "Phone", 499.50, false),
            new Order("Alice", "Tablet", 329.00, true),
            new Order("Carol", "Laptop", 999.99, true),
            new Order("Bob", "Charger", 29.99, true)
        );

        // 1. Total revenue from paid orders
        double revenue = orders.stream()
            .filter(Order::paid)
            .mapToDouble(Order::amount)
            .sum();
        System.out.println("Revenue: $" + revenue);  // $2358.97

        // 2. Group paid orders by customer → sum amounts
        Map<String, Double> revenueByCustomer = orders.stream()
            .filter(Order::paid)
            .collect(Collectors.groupingBy(
                Order::customer,
                Collectors.summingDouble(Order::amount)
            ));
        // {Alice=1328.99, Carol=999.99, Bob=29.99}

        // 3. Partition into paid vs unpaid
        Map<Boolean, List<Order>> partitioned = orders.stream()
            .collect(Collectors.partitioningBy(Order::paid));
        // true → [Alice-Laptop, Alice-Tablet, Carol-Laptop, Bob-Charger]
        // false → [Bob-Phone]

        // 4. Most expensive paid order
        Optional<Order> topOrder = orders.stream()
            .filter(Order::paid)
            .max(Comparator.comparingDouble(Order::amount));
        topOrder.ifPresent(o -> System.out.println("Top: " + o));
    }
}`,
        explanation: `This shows the core stream patterns you'll use daily. filter() removes elements that don't match the predicate. mapToDouble() extracts a numeric value for aggregation. Collectors.groupingBy() is like SQL's GROUP BY -- it buckets elements by a key and applies a downstream collector (summingDouble). partitioningBy() is a special groupBy with exactly two groups (true/false). Note how each pipeline reads like English: "from orders, keep paid ones, group by customer, sum amounts."`
      },
      {
        title: 'Method References and flatMap',
        code: `import java.util.*;
import java.util.stream.*;

public class AdvancedStreams {

    record Department(String name, List<String> employees) {}

    public static void main(String[] args) {
        // --- Method References (4 kinds) ---
        // 1. Static method:    ClassName::staticMethod
        List<String> nums = List.of("1", "2", "3");
        List<Integer> parsed = nums.stream().map(Integer::parseInt).toList();

        // 2. Instance method of a particular object:  object::method
        String prefix = "Hello, ";
        List<String> greeted = List.of("Alice", "Bob").stream()
            .map(prefix::concat).toList();  // ["Hello, Alice", "Hello, Bob"]

        // 3. Instance method of an arbitrary object:  ClassName::method
        List<String> words = List.of("Banana", "Apple", "Cherry");
        words.stream().sorted(String::compareToIgnoreCase);

        // 4. Constructor reference:  ClassName::new
        List<String> names = List.of("Alice", "Bob");
        List<StringBuilder> builders = names.stream()
            .map(StringBuilder::new).toList();

        // --- flatMap: flatten nested collections ---
        List<Department> departments = List.of(
            new Department("Engineering", List.of("Alice", "Bob")),
            new Department("Marketing", List.of("Carol")),
            new Department("Engineering", List.of("Dave"))
        );

        // Get all unique employee names across all departments
        List<String> allEmployees = departments.stream()
            .flatMap(dept -> dept.employees().stream())  // Stream<List<String>> → Stream<String>
            .distinct()
            .sorted()
            .toList();
        // [Alice, Bob, Carol, Dave]
    }
}`,
        explanation: `Method references are shorthand for lambdas where you're just calling an existing method. Integer::parseInt is shorter than s -> Integer.parseInt(s). flatMap() is essential when you have nested collections (List of Lists) and want a single flat stream. Think of it as: map() wraps each element in a stream; flatMap() unwraps nested streams into one. This is the same concept as flatMap in functional programming (monadic bind).`
      },
      {
        title: 'Custom Collectors and reduce()',
        code: `import java.util.*;
import java.util.stream.*;

public class CollectorExamples {
    record Employee(String name, String department, double salary) {}

    public static void main(String[] args) {
        List<Employee> employees = List.of(
            new Employee("Alice", "Engineering", 120_000),
            new Employee("Bob", "Engineering", 110_000),
            new Employee("Carol", "Marketing", 95_000),
            new Employee("Dave", "Marketing", 90_000),
            new Employee("Eve", "Engineering", 130_000)
        );

        // Collectors.toMap -- build a lookup map
        Map<String, Double> salaryLookup = employees.stream()
            .collect(Collectors.toMap(Employee::name, Employee::salary));

        // Joining strings
        String nameList = employees.stream()
            .map(Employee::name)
            .collect(Collectors.joining(", ", "[", "]"));
        // [Alice, Bob, Carol, Dave, Eve]

        // Multi-level grouping: department → average salary
        Map<String, Double> avgByDept = employees.stream()
            .collect(Collectors.groupingBy(
                Employee::department,
                Collectors.averagingDouble(Employee::salary)
            ));
        // {Engineering=120000.0, Marketing=92500.0}

        // reduce() -- manual aggregation
        double totalSalary = employees.stream()
            .map(Employee::salary)
            .reduce(0.0, Double::sum);

        // reduce with combiner (useful for parallel streams)
        String allNames = employees.stream()
            .map(Employee::name)
            .reduce("", (a, b) -> a.isEmpty() ? b : a + ", " + b);
    }
}`,
        explanation: `Collectors.toMap() builds a Map from a stream -- be careful with duplicate keys (it throws by default; pass a merge function as 3rd arg). Collectors.joining() concatenates strings with a delimiter, prefix, and suffix. reduce() is the most general terminal operation: it takes an identity value and an accumulator function, folding all elements into a single result. For simple sums, mapToDouble().sum() is cleaner, but reduce() handles arbitrary aggregations.`
      }
    ],
    bestPractices: [
      'Keep stream pipelines short (3-5 operations) -- extract complex lambdas into named methods',
      'Prefer method references (Order::isPaid) over lambdas (o -> o.isPaid()) for readability',
      'Use toList() (Java 16+) instead of collect(Collectors.toList()) for brevity',
      'Avoid side effects in stream operations -- do not modify external variables inside map/filter',
      'Use mapToInt/mapToDouble for numeric operations to avoid boxing overhead',
      'Prefer Optional methods (ifPresent, orElse, map) over isPresent()+get()'
    ],
    commonMistakes: [
      'Reusing a stream -- streams can only be consumed once; calling a terminal operation twice throws IllegalStateException',
      'Using parallel streams on small collections -- thread management overhead makes it slower',
      'Mutating shared state inside parallel stream operations -- causes race conditions',
      'Forgetting that stream operations are lazy -- peek() won\'t execute without a terminal operation',
      'Using forEach() to collect results into a list instead of collect(Collectors.toList())',
      'Catching exceptions inside lambdas with ugly try-catch blocks -- extract to a helper method'
    ],
    interviewQuestions: [
      'What is the difference between intermediate and terminal operations in streams?',
      'Explain lazy evaluation in streams with an example.',
      'What is the difference between map() and flatMap()?',
      'When would you use reduce() vs collect()?',
      'What are the four main functional interfaces in java.util.function?',
      'When should you use parallel streams? What are the dangers?',
      'What is a method reference? Name the four types.',
      'How does Optional help prevent NullPointerException?'
    ],
    resources: [
      { label: 'Oracle Streams Tutorial', url: 'https://docs.oracle.com/javase/tutorial/collections/streams/' },
      { label: 'Baeldung - Java 8 Streams', url: 'https://www.baeldung.com/java-8-streams' },
      { label: 'Java Stream API Cheat Sheet', url: 'https://www.baeldung.com/java-streams-cheat-sheet' }
    ]
  },

  {
    id: 'java-exceptions',
    title: 'Exception Handling',
    category: 'core-java',
    order: 4,
    explanation:
      `What is Exception Handling?

An exception is an event that disrupts the normal flow of a program. Java's exception mechanism lets you separate error-handling code from business logic, making programs more robust and readable.

Why does it exist?

Without exceptions, every function would need to return error codes, and callers would need to check them manually. Exceptions let errors propagate up the call stack automatically until something handles them.

Exception Hierarchy

  Throwable
  ├── Error (JVM-level problems -- do NOT catch these)
  │   ├── OutOfMemoryError
  │   ├── StackOverflowError
  │   └── VirtualMachineError
  └── Exception (application-level problems)
      ├── Checked Exceptions (MUST handle -- compiler enforces)
      │   ├── IOException
      │   ├── SQLException
      │   ├── FileNotFoundException
      │   └── ClassNotFoundException
      └── RuntimeException (Unchecked -- compiler does NOT enforce)
          ├── NullPointerException
          ├── IllegalArgumentException
          ├── IndexOutOfBoundsException
          ├── ClassCastException
          └── ArithmeticException

Checked vs Unchecked -- When to Use

  Checked exceptions:
  - Represent recoverable conditions (file not found → ask user for another path)
  - The compiler forces the caller to handle them (try-catch or throws)
  - Use for problems OUTSIDE the programmer's control

  Unchecked (RuntimeException):
  - Represent programming bugs (null pointer, bad argument, array out of bounds)
  - Not forced by compiler -- would be too noisy to declare everywhere
  - Use for problems that indicate a BUG in the code

  Analogy:
  Checked = weather forecast says rain → you MUST bring an umbrella (compiler enforces)
  Unchecked = you trip on your own shoelace → a bug, not a foreseeable condition

try-with-resources (Java 7+)

  Any object implementing AutoCloseable is automatically closed when the try block exits.

  Old way (fragile):
    FileReader reader = null;
    try {
        reader = new FileReader("file.txt");
        // use reader
    } finally {
        if (reader != null) reader.close();  // what if close() throws?
    }

  Modern way:
    try (var reader = new FileReader("file.txt")) {
        // use reader -- automatically closed, even on exception
    }

  Multiple resources:
    try (var conn = dataSource.getConnection();
         var stmt = conn.prepareStatement(sql);
         var rs = stmt.executeQuery()) {
        // all three closed in reverse order
    }

Exception Propagation

  main() → methodA() → methodB() → throws Exception
                                         ↓
  If methodB doesn't catch it → propagates to methodA
  If methodA doesn't catch it → propagates to main
  If main doesn't catch it → JVM prints stack trace and terminates

  This is why you should catch exceptions at the appropriate level --
  not too early (loses context) and not too late (crashes the app).`,
    codeExamples: [
      {
        title: 'Custom Exception Hierarchy',
        code: `// Base exception for the domain
public class OrderException extends RuntimeException {
    private final String errorCode;

    public OrderException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public OrderException(String errorCode, String message, Throwable cause) {
        super(message, cause);  // exception chaining -- preserves root cause
        this.errorCode = errorCode;
    }

    public String getErrorCode() { return errorCode; }
}

// Specific exceptions
public class OrderNotFoundException extends OrderException {
    public OrderNotFoundException(Long orderId) {
        super("ORDER_NOT_FOUND", "Order not found: " + orderId);
    }
}

public class InsufficientStockException extends OrderException {
    private final String productId;
    private final int requested;
    private final int available;

    public InsufficientStockException(String productId, int requested, int available) {
        super("INSUFFICIENT_STOCK",
            String.format("Product %s: requested %d, available %d", productId, requested, available));
        this.productId = productId;
        this.requested = requested;
        this.available = available;
    }

    // Getters for structured error response
    public String getProductId() { return productId; }
    public int getRequested() { return requested; }
    public int getAvailable() { return available; }
}`,
        explanation: `A domain exception hierarchy gives you structured error handling. The base OrderException is a RuntimeException (unchecked) because order errors are typically programming or business logic failures, not recoverable I/O issues. Exception chaining (passing the cause) preserves the full stack trace -- never throw a new exception without the original cause, or you lose debugging information. Specific subclasses carry contextual data (orderId, productId, quantities) that error handlers can use to build user-friendly responses.`
      },
      {
        title: 'try-with-resources and Exception Chaining',
        code: `import java.io.*;
import java.nio.file.*;

public class ExceptionPatterns {

    // Good: try-with-resources ensures cleanup
    public static String readFile(String path) {
        try (BufferedReader reader = Files.newBufferedReader(Path.of(path))) {
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\\n");
            }
            return content.toString();
        } catch (FileNotFoundException e) {
            // Specific exception first -- more specific handling
            throw new OrderException("FILE_NOT_FOUND", "Config file missing: " + path, e);
        } catch (IOException e) {
            // Broader exception second -- wraps and rethrows
            throw new OrderException("FILE_READ_ERROR", "Failed to read: " + path, e);
        }
    }

    // Pattern: Convert checked to unchecked at service boundary
    public static void processOrder(Long orderId) {
        try {
            String config = readFile("orders/" + orderId + ".json");
            // ... process
        } catch (OrderException e) {
            // Log and handle at appropriate level
            System.err.println("[" + e.getErrorCode() + "] " + e.getMessage());
            throw e;  // rethrow if caller should handle
        }
    }

    // Anti-patterns to AVOID:
    // 1. catch (Exception e) {} -- swallowing exceptions (silent failure)
    // 2. catch (Throwable t) -- catches Errors too
    // 3. e.printStackTrace() in production -- use a logger
    // 4. throw new RuntimeException(e.getMessage()) -- loses stack trace!
    //    Correct: throw new RuntimeException("context", e)
}`,
        explanation: `This demonstrates three key patterns: (1) try-with-resources for automatic cleanup of the BufferedReader, (2) catching specific exceptions before broad ones (FileNotFoundException before IOException), and (3) wrapping checked exceptions as unchecked at service boundaries. The important detail is always passing the original exception as the "cause" parameter -- this preserves the full chain: OrderException → IOException → FileNotFoundException, which is invaluable for debugging.`
      }
    ],
    bestPractices: [
      'Catch specific exceptions, not Exception or Throwable -- you might accidentally catch OutOfMemoryError',
      'Always include the original exception as the cause when wrapping: new MyException("msg", originalException)',
      'Use try-with-resources for ALL closeable resources (streams, connections, readers)',
      'Log exceptions at the point of handling, not at every level they pass through',
      'Throw early (validate inputs at the top of the method), catch late (handle at the appropriate layer)',
      'Use unchecked exceptions for programming errors, checked for recoverable external conditions',
      'Never use exceptions for flow control (don\'t catch an exception to check if something exists)'
    ],
    commonMistakes: [
      'Catching Exception/Throwable as a blanket handler -- masks real bugs',
      'Swallowing exceptions: catch (Exception e) { /* empty */ } -- silent failures are the worst bugs',
      'Losing the stack trace: throw new RuntimeException(e.getMessage()) instead of new RuntimeException(e)',
      'Using e.printStackTrace() in production instead of a proper logger',
      'Catching and rethrowing without adding context -- useless catch block',
      'Declaring throws Exception on methods instead of specific exception types',
      'Using exceptions for control flow (e.g., catching NumberFormatException to validate if a string is numeric)'
    ],
    interviewQuestions: [
      'What is the difference between checked and unchecked exceptions? Give examples of each.',
      'When should you create a custom checked exception vs unchecked?',
      'What is exception chaining and why is it important?',
      'Explain try-with-resources. What interface must the resource implement?',
      'What happens if both the try block and the finally block throw exceptions?',
      'Why should you never catch Throwable?',
      'What is the difference between throw and throws?',
      'How does multi-catch work? (catch (IOException | SQLException e))'
    ],
    resources: [
      { label: 'Oracle Exception Handling Tutorial', url: 'https://docs.oracle.com/javase/tutorial/essential/exceptions/' },
      { label: 'Baeldung - Exception Handling Best Practices', url: 'https://www.baeldung.com/java-exceptions' },
      { label: 'Effective Java - Item 69-77: Exceptions', url: 'https://www.oreilly.com/library/view/effective-java/9780134686097/' }
    ]
  },

  {
    id: 'java-concurrency',
    title: 'Concurrency & Multithreading',
    category: 'core-java',
    order: 5,
    explanation:
      `What is Concurrency?

Concurrency is the ability of a program to make progress on multiple tasks during overlapping time periods. Multithreading is Java's mechanism for achieving this -- multiple threads of execution run within a single process, sharing the same heap memory but having their own stack.

Why does it exist?

Modern CPUs have multiple cores. A single-threaded program wastes those cores. Concurrency lets you:
- Handle many users simultaneously (web servers)
- Perform background tasks (sending emails while serving requests)
- Speed up CPU-intensive computations by splitting work across cores

Thread Lifecycle

  NEW ──→ RUNNABLE ──→ RUNNING ──→ TERMINATED
                ↕              ↕
           BLOCKED ←──→ WAITING/TIMED_WAITING

  NEW:        Thread object created, not yet started
  RUNNABLE:   start() called, waiting for CPU time
  RUNNING:    Executing on a CPU core
  BLOCKED:    Waiting to acquire a monitor lock (synchronized)
  WAITING:    Waiting indefinitely (wait(), join(), park())
  TIMED_WAITING: Waiting with timeout (sleep(), wait(ms))
  TERMINATED: Run method completed (or exception thrown)

Thread vs Runnable vs Callable

  ┌──────────────┬─────────────────┬───────────────────┬──────────────────────┐
  │              │ Thread           │ Runnable           │ Callable<V>          │
  ├──────────────┼─────────────────┼───────────────────┼──────────────────────┤
  │ Return value │ None (void run) │ None (void run)    │ V call() -- returns! │
  │ Exceptions   │ Cannot throw    │ Cannot throw       │ Can throw checked    │
  │ Usage        │ Extend class    │ Implement interface│ Submit to Executor   │
  │ Flexibility  │ No multiple     │ Can implement      │ Can implement        │
  │              │ inheritance     │ multiple interfaces│ multiple interfaces  │
  └──────────────┴─────────────────┴───────────────────┴──────────────────────┘

Thread Pool Analogy

  Imagine a restaurant with 5 waiters (threads). Customers (tasks) arrive:
  - If a waiter is free → serves immediately
  - If all 5 are busy → customer waits in queue
  - You don't hire a new waiter for every customer (too expensive = too many threads)
  - You don't fire a waiter after each customer (thread creation overhead)

  This is exactly what ExecutorService does.

ExecutorService Types

  ┌─────────────────────────┬──────────────────────────────────────────────┐
  │ Type                    │ When to Use                                  │
  ├─────────────────────────┼──────────────────────────────────────────────┤
  │ newFixedThreadPool(n)   │ Known, bounded workload. n = CPU cores.      │
  │ newCachedThreadPool()   │ Many short-lived tasks. Creates threads       │
  │                         │ on demand, reuses idle ones.                  │
  │ newSingleThreadExecutor │ Tasks must run sequentially on a background   │
  │                         │ thread (event logging, file writing).         │
  │ newScheduledThreadPool  │ Periodic/delayed tasks (cron-like).           │
  │ newVirtualThreadPerTask │ Java 21+ -- millions of lightweight threads.  │
  └─────────────────────────┴──────────────────────────────────────────────┘

CompletableFuture -- "Promises in Java"

  CompletableFuture is Java's answer to JavaScript Promises. It lets you chain
  async operations without blocking:

  fetchUser(id)                            // returns CompletableFuture<User>
    .thenApply(user -> fetchOrders(user))  // transform result
    .thenAccept(orders -> display(orders)) // consume result
    .exceptionally(ex -> handleError(ex)); // handle any error in the chain

Synchronization Comparison

  ┌────────────────┬──────────────────────────────────────────────────┐
  │ Mechanism      │ When to Use                                      │
  ├────────────────┼──────────────────────────────────────────────────┤
  │ synchronized   │ Simple mutual exclusion. Built-in, no imports.   │
  │ ReentrantLock  │ Need tryLock(), timed lock, or fairness.         │
  │ AtomicInteger  │ Single variable updates (counters). Lock-free.   │
  │ volatile       │ Flag variables (boolean stop). Visibility only.  │
  │ ConcurrentMap  │ Thread-safe Map operations (putIfAbsent, etc.)   │
  └────────────────┴──────────────────────────────────────────────────┘`,
    codeExamples: [
      {
        title: 'CompletableFuture -- Async Pipelines',
        code: `import java.util.concurrent.*;

public class AsyncPipeline {
    private static final ExecutorService executor = Executors.newFixedThreadPool(4);

    // Simulated async service calls
    static CompletableFuture<String> fetchUser(int userId) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(200);  // simulate DB call
            return "User-" + userId;
        }, executor);
    }

    static CompletableFuture<Double> fetchAccountBalance(String user) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(150);
            return 1500.75;
        }, executor);
    }

    static CompletableFuture<String> fetchCreditScore(String user) {
        return CompletableFuture.supplyAsync(() -> {
            sleep(300);
            return "EXCELLENT";
        }, executor);
    }

    public static void main(String[] args) throws Exception {
        // Sequential chaining: fetch user → then fetch balance
        CompletableFuture<Double> balanceFuture = fetchUser(42)
            .thenCompose(user -> fetchAccountBalance(user));  // flatMap

        // Parallel: fetch balance AND credit score simultaneously
        CompletableFuture<String> userFuture = fetchUser(42);

        CompletableFuture<String> combined = userFuture.thenCompose(user -> {
            CompletableFuture<Double> balance = fetchAccountBalance(user);
            CompletableFuture<String> credit = fetchCreditScore(user);

            return balance.thenCombine(credit, (bal, score) ->
                String.format("%s: balance=$%.2f, credit=%s", user, bal, score));
        });

        // Error handling
        CompletableFuture<String> safe = combined
            .exceptionally(ex -> "Fallback: " + ex.getMessage())
            .orTimeout(5, TimeUnit.SECONDS);  // timeout after 5s

        System.out.println(safe.get());
        executor.shutdown();
    }

    static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
}`,
        explanation: `thenCompose() is the async equivalent of flatMap -- it chains async operations sequentially (user → balance). thenCombine() runs two futures in parallel and merges results when both complete. This is like Promise.all() in JavaScript. exceptionally() catches errors anywhere in the chain. orTimeout() (Java 9+) prevents hanging indefinitely. Always provide a custom executor (don't rely on ForkJoinPool.commonPool()) and shut it down when done.`
      },
      {
        title: 'ExecutorService and Producer-Consumer',
        code: `import java.util.concurrent.*;

public class ProducerConsumer {
    // BlockingQueue handles thread synchronization automatically
    private static final BlockingQueue<String> queue = new LinkedBlockingQueue<>(10);
    private static volatile boolean running = true;

    public static void main(String[] args) throws InterruptedException {
        ExecutorService executor = Executors.newFixedThreadPool(3);

        // 1 producer, 2 consumers
        executor.submit(() -> {
            try {
                for (int i = 1; i <= 20; i++) {
                    String task = "Task-" + i;
                    queue.put(task);  // blocks if queue is full (backpressure)
                    System.out.println("Produced: " + task);
                    Thread.sleep(50);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                running = false;
            }
        });

        Runnable consumer = () -> {
            String name = Thread.currentThread().getName();
            try {
                while (running || !queue.isEmpty()) {
                    String task = queue.poll(100, TimeUnit.MILLISECONDS);
                    if (task != null) {
                        System.out.println(name + " processing: " + task);
                        Thread.sleep(100);  // simulate work
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        executor.submit(consumer);
        executor.submit(consumer);

        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);
        System.out.println("All tasks processed.");
    }
}`,
        explanation: `The producer-consumer pattern decouples task generation from task processing. BlockingQueue handles ALL the synchronization for you -- put() blocks when the queue is full (backpressure), and poll(timeout) blocks when empty. The volatile keyword on the running flag ensures both consumer threads see the update when the producer sets it to false. This pattern is the foundation of most concurrent systems: message queues, web servers, and thread pools all use it internally.`
      }
    ],
    bestPractices: [
      'Use ExecutorService instead of creating raw threads -- it manages lifecycle and reuse',
      'Always shutdown executors: executor.shutdown() + awaitTermination()',
      'Prefer CompletableFuture over raw Thread/Runnable for async workflows',
      'Use BlockingQueue for producer-consumer patterns instead of manual wait/notify',
      'Set thread pool size = CPU cores for CPU-bound work, higher for I/O-bound work',
      'Use volatile for simple flags, AtomicXxx for counters, synchronized/Lock for complex state',
      'Always restore the interrupt flag: catch (InterruptedException) { Thread.currentThread().interrupt(); }'
    ],
    commonMistakes: [
      'Creating a new thread per request in a web server -- leads to thousands of threads and OOM',
      'Forgetting to shutdown ExecutorService -- the JVM won\'t exit because non-daemon threads are alive',
      'Using synchronized everywhere "just to be safe" -- over-synchronization kills performance',
      'Catching InterruptedException and ignoring it -- always restore the interrupt flag',
      'Sharing mutable state between threads without synchronization -- leads to subtle, hard-to-reproduce bugs',
      'Using Thread.sleep() for coordination -- use CountDownLatch, CyclicBarrier, or Phaser instead',
      'Calling future.get() without a timeout -- can hang the application forever'
    ],
    interviewQuestions: [
      'What is the difference between a process and a thread?',
      'Explain the thread lifecycle in Java.',
      'What is the difference between Runnable and Callable?',
      'How does ExecutorService work? What are the different thread pool types?',
      'What is CompletableFuture and how does it differ from Future?',
      'Explain the difference between synchronized, ReentrantLock, and AtomicInteger.',
      'What is the volatile keyword? When would you use it?',
      'What is a deadlock? How do you prevent it?',
      'Explain the producer-consumer pattern.',
      'What are virtual threads (Java 21)? How do they differ from platform threads?'
    ],
    resources: [
      { label: 'Oracle Concurrency Tutorial', url: 'https://docs.oracle.com/javase/tutorial/essential/concurrency/' },
      { label: 'Baeldung - Java Concurrency', url: 'https://www.baeldung.com/java-concurrency' },
      { label: 'Java Concurrency in Practice (JCIP)', url: 'https://jcip.net/' }
    ]
  },

  {
    id: 'java-memory-gc',
    title: 'JVM Memory & Garbage Collection',
    category: 'core-java',
    order: 6,
    explanation:
      `What is JVM Memory Management?

The Java Virtual Machine (JVM) automatically manages memory for you. Unlike C/C++ where you manually allocate and free memory, Java's Garbage Collector (GC) automatically reclaims memory from objects that are no longer reachable.

Why does it matter?

Understanding JVM memory helps you:
- Diagnose OutOfMemoryError and memory leaks
- Tune GC for your application's latency/throughput requirements
- Write memory-efficient code
- Answer the most common Java interview questions

JVM Memory Layout

  JVM Memory
  ├── Heap (shared across ALL threads)
  │   ├── Young Generation (short-lived objects)
  │   │   ├── Eden Space         — ALL new objects are born here
  │   │   ├── Survivor S0 (From) — survived 1st GC cycle
  │   │   └── Survivor S1 (To)   — survived 2nd+ GC cycle
  │   └── Old Generation (Tenured) — long-lived objects promoted here
  │
  ├── Stack (one per thread, private)
  │   └── Stack Frames
  │       ├── Local variables
  │       ├── Method parameters
  │       └── Return address
  │
  ├── Metaspace (replaced PermGen in Java 8)
  │   ├── Class metadata (bytecode, method info)
  │   ├── Static variables
  │   └── Constant pool
  │
  └── Native Memory
      ├── Direct ByteBuffers (NIO)
      ├── Thread stacks (OS-level)
      └── JNI allocations

Object Lifecycle

  1. Object created → lands in Eden
  2. Eden fills up → Minor GC (Young GC)
     - Live objects move to Survivor S0
     - Dead objects are swept (freed)
  3. Next Minor GC:
     - Eden live objects + S0 live objects → move to S1
     - S0 is cleared
     - S0 and S1 swap roles each cycle
  4. Object survives N cycles (default 15) → promoted to Old Gen
  5. Old Gen fills up → Major GC (Full GC) — expensive, pauses application

  ┌─────────── Young Generation ──────────┐  ┌── Old Generation ──┐
  │ Eden    │ Survivor S0 │ Survivor S1   │  │                    │
  │ [new!]  │ [age: 1]    │ [age: 2+]     │──→│ [age: 15+]         │
  │ [new!]  │             │               │  │ [long-lived]       │
  │ [dead]  │             │               │  │                    │
  └─────────┴─────────────┴───────────────┘  └────────────────────┘
      ↑ Minor GC (fast, frequent)                  ↑ Major GC (slow, rare)

GC Process: Mark → Sweep → Compact

  Mark:    Start from GC roots (stack variables, static fields, thread refs).
           Trace all reachable objects. Mark them as "alive."

  Sweep:   Everything NOT marked is garbage → reclaim the memory.

  Compact: Move surviving objects together to eliminate fragmentation.
           (Not all GC algorithms compact)

  GC Roots (starting points for reachability):
  - Local variables on thread stacks
  - Static fields of loaded classes
  - Active thread references
  - JNI references

Garbage Collector Comparison

  ┌──────────────┬──────────────┬────────────┬──────────────────────────────────┐
  │ GC           │ Throughput   │ Latency    │ Best For                         │
  ├──────────────┼──────────────┼────────────┼──────────────────────────────────┤
  │ Serial       │ Low          │ High pause │ Small apps, single-core          │
  │ Parallel     │ High         │ High pause │ Batch processing, max throughput │
  │ G1 (default) │ Good         │ Low pause  │ General purpose (Java 9+)        │
  │ ZGC          │ Good         │ Ultra-low  │ Large heaps (TB), < 1ms pauses   │
  │ Shenandoah   │ Good         │ Ultra-low  │ Similar to ZGC (Red Hat)         │
  └──────────────┴──────────────┴────────────┴──────────────────────────────────┘

  G1 (Garbage First): Divides heap into ~2000 regions. Collects regions with
  the most garbage first (hence the name). Target pause time: -XX:MaxGCPauseMillis=200

  ZGC (Java 15+ production): Sub-millisecond pauses even with terabyte heaps.
  Uses colored pointers and load barriers. Enable with: -XX:+UseZGC

Common Memory Leak Patterns

  1. Static collections that grow forever (static Map<> cache without eviction)
  2. Listeners/callbacks never unregistered
  3. Inner classes holding references to outer class (anonymous classes in Android)
  4. Unclosed resources (streams, connections) -- use try-with-resources
  5. ThreadLocal variables not removed after use in thread pools`,
    codeExamples: [
      {
        title: 'Memory Leak Demo and Fix',
        code: `import java.util.*;

public class MemoryLeakDemo {

    // ❌ LEAK: Static map grows forever -- objects never garbage collected
    private static final Map<String, byte[]> leakyCache = new HashMap<>();

    public static void leakyMethod() {
        for (int i = 0; i < 100_000; i++) {
            leakyCache.put("key-" + i, new byte[1024]);  // 100MB consumed, never freed
        }
    }

    // ✅ FIX 1: Use WeakHashMap -- entries are GC'd when key has no other references
    private static final Map<String, byte[]> weakCache = new WeakHashMap<>();

    // ✅ FIX 2: Bounded cache with LRU eviction (LinkedHashMap)
    private static final Map<String, byte[]> lruCache = new LinkedHashMap<>(100, 0.75f, true) {
        @Override
        protected boolean removeEldestEntry(Map.Entry<String, byte[]> eldest) {
            return size() > 1000;  // cap at 1000 entries
        }
    };

    // ❌ LEAK: ThreadLocal not cleaned up in thread pool
    private static final ThreadLocal<List<byte[]>> threadData = new ThreadLocal<>();

    public static void leakyThreadPoolTask() {
        threadData.set(new ArrayList<>());
        threadData.get().add(new byte[1024 * 1024]);  // 1MB
        // Thread returns to pool -- but threadData is never removed!
    }

    // ✅ FIX: Always remove ThreadLocal in finally block
    public static void safeThreadPoolTask() {
        try {
            threadData.set(new ArrayList<>());
            threadData.get().add(new byte[1024 * 1024]);
            // ... do work
        } finally {
            threadData.remove();  // CRITICAL in thread pools
        }
    }
}`,
        explanation: `Static HashMap is the #1 cause of memory leaks in Java. Objects stored in static collections live as long as the class is loaded (forever). WeakHashMap entries are garbage-collected when the key is no longer referenced elsewhere. For a bounded cache, LinkedHashMap with removeEldestEntry() or Caffeine/Guava Cache is better. ThreadLocal is another classic leak source in web servers -- the thread is reused by the pool, so the ThreadLocal data from request A is still there for request B. Always call remove() in a finally block.`
      },
      {
        title: 'JVM Tuning Flags',
        code: `# --- Heap sizing ---
-Xms512m              # Initial heap size (set equal to Xmx to avoid resizing)
-Xmx2g               # Maximum heap size
-XX:NewRatio=2        # Old:Young = 2:1 (Young gets 1/3 of heap)

# --- GC selection ---
-XX:+UseG1GC          # G1 (default Java 9+)
-XX:MaxGCPauseMillis=200  # Target pause time for G1

-XX:+UseZGC           # ZGC (Java 15+) -- sub-ms pauses
-XX:+UseShenandoahGC  # Shenandoah -- low latency alternative

# --- GC logging (essential for diagnosis) ---
-Xlog:gc*:file=gc.log:time,uptime,level,tags  # Java 9+ unified logging
-XX:+HeapDumpOnOutOfMemoryError    # Auto heap dump on OOM
-XX:HeapDumpPath=/tmp/heapdump.hprof

# --- Metaspace ---
-XX:MetaspaceSize=256m     # Initial metaspace (triggers GC when exceeded)
-XX:MaxMetaspaceSize=512m  # Cap to prevent runaway class loading

# --- Monitoring commands ---
jps                    # List running Java processes
jstat -gc <pid> 1000   # GC stats every 1 second
jmap -heap <pid>       # Heap summary
jmap -histo <pid>      # Object histogram (top memory consumers)
jcmd <pid> GC.heap_info     # Heap details
jcmd <pid> VM.native_memory # Native memory tracking`,
        explanation: `Key tuning rule: set -Xms equal to -Xmx to avoid heap resizing at runtime. For web applications, G1 is the default and works well. Switch to ZGC if you need ultra-low latency (< 1ms pauses). Always enable -XX:+HeapDumpOnOutOfMemoryError in production -- when an OOM happens, you'll have the heap dump to analyze with tools like Eclipse MAT or VisualVM. The jstat, jmap, and jcmd commands are essential for diagnosing memory issues in production.`
      }
    ],
    bestPractices: [
      'Set -Xms equal to -Xmx to avoid heap resizing at runtime',
      'Always enable -XX:+HeapDumpOnOutOfMemoryError in production',
      'Use try-with-resources for all closeable resources to prevent memory leaks',
      'Avoid storing large objects in static fields -- prefer bounded caches (Caffeine, Guava)',
      'Always call ThreadLocal.remove() in a finally block when using thread pools',
      'Profile with VisualVM or JFlight Recorder before tuning GC -- measure, don\'t guess',
      'Use ZGC for latency-sensitive applications (Java 15+)'
    ],
    commonMistakes: [
      'Calling System.gc() explicitly -- it is a "suggestion," not a command, and harms performance',
      'Setting -Xmx too high -- leads to long GC pauses; large heaps take longer to scan',
      'Storing session data in static Maps without eviction -- classic memory leak',
      'Not removing ThreadLocal values in thread pool environments',
      'Confusing memory leak (growing used memory over time) with high memory usage (large but stable)',
      'Ignoring GC logs until production crashes -- always monitor GC in staging',
      'Using finalizers (deprecated in Java 9) -- they delay GC and are unreliable'
    ],
    interviewQuestions: [
      'Explain the JVM memory structure. What goes on the heap vs the stack?',
      'What is the difference between Young Generation and Old Generation?',
      'How does garbage collection work? Explain mark-and-sweep.',
      'What are GC roots?',
      'What is the difference between Minor GC and Major (Full) GC?',
      'Compare G1, ZGC, and Parallel GC. When would you use each?',
      'How do you diagnose a memory leak in Java?',
      'What is Metaspace? How does it differ from PermGen?',
      'What flags would you use to tune GC for a web application?',
      'What is a soft reference vs a weak reference vs a phantom reference?'
    ],
    resources: [
      { label: 'Oracle GC Tuning Guide', url: 'https://docs.oracle.com/en/java/javase/17/gctuning/' },
      { label: 'Baeldung - JVM Memory Structure', url: 'https://www.baeldung.com/java-stack-heap' },
      { label: 'Understanding ZGC', url: 'https://www.baeldung.com/jvm-zgc-garbage-collector' }
    ]
  },

  // ── Spring Boot ───────────────────────────────────────────────────────
  {
    id: 'spring-boot-basics',
    title: 'Spring Boot Fundamentals',
    category: 'spring-boot',
    order: 7,
    explanation:
      `What is Spring Boot?

Spring Boot is an opinionated framework built on top of the Spring Framework that eliminates boilerplate configuration. It lets you build production-ready applications with minimal setup.

Why does it exist?

The original Spring Framework was powerful but required mountains of XML configuration. Setting up a simple web app meant configuring a DispatcherServlet, view resolvers, data source, transaction manager, etc. Spring Boot said: "If 90% of projects use the same config, just make it the default."

Analogy: Spring is like building a house brick by brick. Spring Boot is buying a pre-built house where the plumbing and electrical are already done -- you just decorate.

@SpringBootApplication -- What's Inside?

  @SpringBootApplication
  ├── @Configuration          — "This class defines beans"
  ├── @EnableAutoConfiguration — "Scan the classpath and configure things automatically"
  │   └── Sees spring-boot-starter-web? → configures embedded Tomcat, Jackson, etc.
  │   └── Sees spring-boot-starter-data-jpa? → configures DataSource, EntityManager
  └── @ComponentScan          — "Find all @Component, @Service, @Repository, @Controller in this package"

  Auto-configuration is the magic: Spring Boot checks what JARs are on the classpath
  and configures beans accordingly. You can override any auto-configured bean by
  defining your own @Bean method.

Dependency Injection (DI) -- The Core Concept

  Analogy: Instead of you making your own coffee every morning (creating dependencies),
  a barista (Spring container) makes it and hands it to you. You just say what you want.

  Without DI:
    class OrderService {
        private PaymentService paymentService = new PaymentService();  // tight coupling
    }

  With DI:
    class OrderService {
        private final PaymentService paymentService;

        OrderService(PaymentService paymentService) {  // Spring injects this
            this.paymentService = paymentService;
        }
    }

  Why? Testability (mock PaymentService in tests), flexibility (swap implementations),
  loose coupling (OrderService doesn't know or care how PaymentService is created).

Constructor Injection vs Field Injection

  ┌───────────────────┬─────────────────────────────┬─────────────────────────────┐
  │                   │ Constructor Injection         │ Field Injection (@Autowired)│
  ├───────────────────┼─────────────────────────────┼─────────────────────────────┤
  │ Immutability      │ Fields can be final          │ Cannot be final             │
  │ Required deps     │ Enforced at construction     │ Can be null at runtime      │
  │ Testability       │ Easy: new Service(mockDep)   │ Requires reflection/Spring  │
  │ Circular deps     │ Fails fast (compile time)    │ May hide circular deps      │
  │ Recommendation    │ PREFERRED                    │ Avoid                       │
  └───────────────────┴─────────────────────────────┴─────────────────────────────┘

Request Flow in Spring Boot

  HTTP Request
      ↓
  Embedded Tomcat (listens on port 8080)
      ↓
  DispatcherServlet (front controller -- routes to correct handler)
      ↓
  Filter Chain (security, CORS, logging)
      ↓
  @RestController method (matched by @RequestMapping / @GetMapping)
      ↓
  @Service (business logic, transactions)
      ↓
  @Repository (JPA / database access)
      ↓
  Database
      ↓ (response flows back up)
  Controller returns ResponseEntity → Jackson serializes to JSON → HTTP Response`,
    codeExamples: [
      {
        title: 'REST Controller + Service + Repository',
        code: `// --- Entity ---
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer stock;
    // getters, setters
}

// --- Repository ---
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPriceLessThan(BigDecimal maxPrice);
    Optional<Product> findByNameIgnoreCase(String name);
}

// --- Service ---
@Service
@RequiredArgsConstructor  // Lombok generates constructor injection
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    @Transactional
    public Product create(ProductRequest request) {
        Product product = new Product();
        product.setName(request.name());
        product.setPrice(request.price());
        product.setStock(request.stock());
        return productRepository.save(product);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> listAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        Product created = productService.create(request);
        URI location = URI.create("/api/products/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }
}

// --- DTO ---
public record ProductRequest(
    @NotBlank String name,
    @NotNull @Positive BigDecimal price,
    @Min(0) Integer stock
) {}`,
        explanation: `This follows the standard three-layer architecture. The Controller handles HTTP concerns (path mapping, status codes, validation trigger). The Service contains business logic and transaction management. The Repository handles database access -- JpaRepository provides findAll(), findById(), save(), delete() for free. Notice the DTO (ProductRequest record) is separate from the Entity -- never expose your database model directly to the API. @RequiredArgsConstructor (Lombok) generates the constructor, enabling constructor injection without writing it manually.`
      },
      {
        title: 'application.yml Configuration',
        code: `# application.yml
server:
  port: 8080
  error:
    include-message: always
    include-binding-errors: always

spring:
  application:
    name: product-service

  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&serverTimezone=UTC
    username: \${DB_USERNAME:root}       # env variable with default
    password: \${DB_PASSWORD:password}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
      connection-timeout: 30000

  jpa:
    hibernate:
      ddl-auto: validate           # never use update/create in production
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        default_batch_fetch_size: 16

  jackson:
    serialization:
      write-dates-as-timestamps: false
    default-property-inclusion: non_null

logging:
  level:
    root: INFO
    com.myapp: DEBUG
    org.hibernate.SQL: DEBUG       # see actual SQL queries`,
        explanation: `Key points: \${DB_USERNAME:root} uses environment variables with a default fallback. ddl-auto should be "validate" in production (only checks schema matches entities) -- never "update" or "create" which modify the database. Hikari connection pool settings control how many database connections are maintained. default_batch_fetch_size helps prevent N+1 queries by loading associations in batches. Jackson settings control JSON serialization -- non_null skips null fields in responses.`
      }
    ],
    bestPractices: [
      'Use constructor injection (not @Autowired on fields) for mandatory dependencies',
      'Keep controllers thin -- delegate all business logic to the service layer',
      'Use DTOs for API input/output -- never expose JPA entities directly',
      'Set spring.jpa.hibernate.ddl-auto=validate in production; use Flyway/Liquibase for migrations',
      'Externalize configuration using environment variables and @ConfigurationProperties',
      'Return proper HTTP status codes: 201 Created, 204 No Content, 404 Not Found, etc.',
      'Use @Valid on @RequestBody parameters to trigger Bean Validation'
    ],
    commonMistakes: [
      'Using spring.jpa.hibernate.ddl-auto=update in production -- can drop columns or corrupt data',
      'Putting business logic in the controller layer -- violates separation of concerns',
      'Using field injection (@Autowired) instead of constructor injection -- harder to test',
      'Returning JPA entities directly from controllers -- exposes internal structure, causes serialization issues with lazy loading',
      'Not handling exceptions properly -- letting stack traces reach the client',
      'Hardcoding configuration values instead of using environment variables or profiles',
      'Forgetting @Transactional on service methods that perform multiple DB operations'
    ],
    interviewQuestions: [
      'What is Spring Boot and how does it differ from the Spring Framework?',
      'What does @SpringBootApplication do? What annotations does it combine?',
      'Explain auto-configuration. How does Spring Boot know what to configure?',
      'What is Dependency Injection? Why is constructor injection preferred?',
      'Describe the request lifecycle in a Spring Boot application.',
      'What is the difference between @Component, @Service, @Repository, and @Controller?',
      'How do you handle different environments (dev, staging, prod) in Spring Boot?',
      'What is an embedded server? How does it differ from deploying a WAR?'
    ],
    resources: [
      { label: 'Spring Boot Reference Guide', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/' },
      { label: 'Baeldung - Spring Boot Tutorial', url: 'https://www.baeldung.com/spring-boot' },
      { label: 'Spring Initializr', url: 'https://start.spring.io/' }
    ]
  },

  {
    id: 'spring-boot-layered-arch',
    title: 'Layered Architecture',
    category: 'spring-boot',
    order: 8,
    explanation:
      `What is Layered Architecture?

It is a pattern where code is organized into horizontal layers, each with a distinct responsibility. Each layer only communicates with the layer directly below it. This is the most common architecture for Spring Boot applications.

Why does it exist?

Without layers, you end up with "spaghetti code" where HTTP handling, business rules, and database queries are all mixed together. Changes to the database schema ripple through the entire codebase. Layered architecture provides separation of concerns -- each layer can change independently.

Architecture Diagram

  Client (Browser / Mobile App)
      ↓ HTTP Request (JSON)
  ┌──────────────────────────────────────────────────┐
  │  Controller Layer  (@RestController)              │
  │  - Receives HTTP request                          │
  │  - Validates input (@Valid)                       │
  │  - Converts DTO to domain object                  │
  │  - Calls service method                           │
  │  - Returns ResponseEntity with status code         │
  └────────────────────┬─────────────────────────────┘
                       ↓ Domain Object / DTO
  ┌──────────────────────────────────────────────────┐
  │  Service Layer  (@Service)                        │
  │  - Business logic and validation rules            │
  │  - Transaction management (@Transactional)        │
  │  - Orchestrates multiple repositories             │
  │  - Maps Entity ↔ DTO                              │
  └────────────────────┬─────────────────────────────┘
                       ↓ Entity
  ┌──────────────────────────────────────────────────┐
  │  Repository Layer  (@Repository)                  │
  │  - JPA queries (derived, @Query, native)          │
  │  - Database CRUD operations                       │
  │  - NO business logic                              │
  └────────────────────┬─────────────────────────────┘
                       ↓ SQL
  ┌──────────────────────────────────────────────────┐
  │  Database  (MySQL / PostgreSQL)                    │
  └──────────────────────────────────────────────────┘

Why DTOs Matter

  DTO (Data Transfer Object) is a simple object that carries data between layers.

  Entity (JPA):
  - Has database annotations (@Entity, @Table, @Column)
  - May have relationships (@OneToMany, @ManyToOne)
  - Has fields the client should never see (password hash, audit fields, internal IDs)

  DTO:
  - Represents exactly what the API sends/receives
  - Can combine fields from multiple entities
  - Can evolve independently from the database schema
  - Prevents security issues (mass assignment, data leakage)

  Analogy: An Entity is your medical record (full detail, internal).
  A DTO is the summary your doctor gives you (only relevant info, client-safe).

Global Exception Handling with @ControllerAdvice

  Instead of try-catch in every controller, define ONE class that catches
  exceptions across ALL controllers:

  @ControllerAdvice
  └── @ExceptionHandler(ResourceNotFoundException.class) → 404
  └── @ExceptionHandler(MethodArgumentNotValidException.class) → 400
  └── @ExceptionHandler(Exception.class) → 500 (fallback)

  This centralizes error formatting and ensures consistent error responses.`,
    codeExamples: [
      {
        title: 'Full CRUD Flow with DTO Mapping',
        code: `// --- DTOs ---
public record CreateUserRequest(
    @NotBlank String name,
    @Email String email,
    @Size(min = 8) String password
) {}

public record UserResponse(Long id, String name, String email, LocalDateTime createdAt) {
    public static UserResponse from(User entity) {
        return new UserResponse(entity.getId(), entity.getName(),
            entity.getEmail(), entity.getCreatedAt());
    }
}

// --- Service ---
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse create(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("User with email already exists");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        User saved = userRepository.save(user);
        return UserResponse.from(saved);  // Entity → DTO conversion
    }

    public Page<UserResponse> list(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(UserResponse::from);  // map entities to DTOs
    }

    @Transactional
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));

        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) user.setEmail(request.email());

        return UserResponse.from(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", id);
        }
        userRepository.deleteById(id);
    }
}

// --- Controller ---
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> list(Pageable pageable) {
        return ResponseEntity.ok(userService.list(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}`,
        explanation: `Notice the clean separation: the Controller handles HTTP mechanics (status codes, validation trigger, path variables). The Service handles business rules (duplicate email check, password encoding). The Repository handles persistence. DTOs (CreateUserRequest, UserResponse) ensure the password hash never reaches the client, and the internal User entity is never exposed. The static factory method UserResponse.from(entity) keeps mapping logic close to the DTO. Page<UserResponse> provides built-in pagination.`
      },
      {
        title: 'Global Exception Handler (@ControllerAdvice)',
        code: `@RestControllerAdvice
public class GlobalExceptionHandler {

    // Standard error response body
    record ErrorResponse(int status, String error, String message, LocalDateTime timestamp) {}

    // 404 -- resource not found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // 409 -- duplicate resource
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(DuplicateResourceException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    // 400 -- validation errors (@Valid failed)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
            fieldErrors.put(err.getField(), err.getDefaultMessage()));

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", 400);
        body.put("error", "Validation Failed");
        body.put("fieldErrors", fieldErrors);
        body.put("timestamp", LocalDateTime.now());
        return ResponseEntity.badRequest().body(body);
    }

    // 500 -- catch-all for unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleAll(Exception ex) {
        // Log the full stack trace but don't expose it to the client
        log.error("Unexpected error", ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    private ResponseEntity<ErrorResponse> buildResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(
            new ErrorResponse(status.value(), status.getReasonPhrase(), message, LocalDateTime.now()));
    }
}`,
        explanation: `@RestControllerAdvice intercepts exceptions thrown by ANY controller in the application. Each @ExceptionHandler method handles a specific exception type and returns a consistent error response. For validation errors, we extract individual field errors into a map so the UI can display per-field messages. The catch-all handler (Exception.class) logs the full stack trace for debugging but returns a generic message to the client -- never expose internal details. This replaces scattered try-catch blocks with a single, centralized error handling strategy.`
      }
    ],
    bestPractices: [
      'Never expose JPA entities in API responses -- always use DTOs',
      'Keep controllers thin: validate input, delegate to service, return response',
      'Put @Transactional on service methods, not on controllers or repositories',
      'Use @ControllerAdvice for centralized, consistent error handling',
      'Use Java records for DTOs -- they are immutable, concise, and perfect for data carriers',
      'Return proper HTTP status codes (201, 204, 400, 404, 409, 500)',
      'Use Pageable for list endpoints to prevent returning millions of records'
    ],
    commonMistakes: [
      'Putting business logic in controllers -- makes it impossible to reuse across different interfaces',
      'Returning entities directly -- exposes database structure, lazy loading issues, security risks',
      'Catching exceptions in every controller method instead of using @ControllerAdvice',
      'Using @Transactional(readOnly=true) on write operations -- silently drops writes',
      'Not validating input -- trusting client data leads to data corruption and security issues',
      'Mixing layers: repository calling a service, controller calling repository directly'
    ],
    interviewQuestions: [
      'What are the layers in a typical Spring Boot application? What is each layer responsible for?',
      'Why should you use DTOs instead of returning entities?',
      'What is @ControllerAdvice and how does it work?',
      'Where should @Transactional be placed and why?',
      'What is the difference between @RestController and @Controller?',
      'How do you handle validation errors in Spring Boot?',
      'Explain the difference between ResponseEntity and returning an object directly.'
    ],
    resources: [
      { label: 'Baeldung - Spring Boot Architecture', url: 'https://www.baeldung.com/spring-boot-architecture' },
      { label: 'Spring MVC Docs', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc.html' },
      { label: 'DTO Pattern', url: 'https://www.baeldung.com/java-dto-pattern' }
    ]
  },

  {
    id: 'spring-boot-config',
    title: 'Configuration & Profiles',
    category: 'spring-boot',
    order: 9,
    explanation:
      `What is Externalized Configuration?

Spring Boot lets you configure your application without changing code. Database URLs, API keys, feature flags -- all can be changed through properties files, environment variables, or command-line arguments.

Why does it exist?

You need different settings for different environments: dev uses localhost database, staging uses a test DB, production uses the real DB with SSL. Without externalized config, you'd rebuild the application for each environment.

Configuration Priority (Highest Wins)

  Priority (highest → lowest):
  ┌────┬──────────────────────────────────────────────────────────┐
  │ 1  │ Command-line arguments (--server.port=9090)             │
  │ 2  │ SPRING_APPLICATION_JSON (inline JSON)                    │
  │ 3  │ System properties (-Dserver.port=9090)                   │
  │ 4  │ OS environment variables (SERVER_PORT=9090)              │
  │ 5  │ application-{profile}.yml (profile-specific)             │
  │ 6  │ application.yml (default)                                │
  │ 7  │ @ConfigurationProperties defaults                        │
  │ 8  │ SpringApplication.setDefaultProperties()                 │
  └────┴──────────────────────────────────────────────────────────┘

  Key: Environment variables override YAML, command-line overrides everything.
  This lets ops teams change settings without touching the code or config files.

Profiles

  A profile activates a specific set of configuration. Common pattern:

  application.yml             → shared settings (logging format, Jackson config)
  application-dev.yml         → local DB, debug logging, show-sql=true
  application-staging.yml     → staging DB, info logging
  application-prod.yml        → production DB, warn logging, SSL enabled

  Activate a profile:
  - application.yml:   spring.profiles.active=dev
  - Environment var:   SPRING_PROFILES_ACTIVE=prod
  - Command line:      --spring.profiles.active=prod

@ConfigurationProperties vs @Value

  ┌──────────────────────────────┬───────────────────────────────────────┐
  │ @Value("$\\{app.name}")      │ @ConfigurationProperties(prefix="app")│
  ├──────────────────────────────┼───────────────────────────────────────┤
  │ Single value injection       │ Binds entire group of properties      │
  │ No type safety               │ Type-safe, validated with @Validated  │
  │ No IDE autocomplete          │ IDE autocomplete with metadata        │
  │ Scattered across classes     │ Centralized in one POJO              │
  │ Good for simple, one-off     │ Good for structured configuration     │
  └──────────────────────────────┴───────────────────────────────────────┘

  Rule: Use @Value for 1-2 simple values. Use @ConfigurationProperties for anything more.`,
    codeExamples: [
      {
        title: 'Profile-based Configuration',
        code: `# application.yml (shared)
spring:
  application:
    name: order-service
  jackson:
    default-property-inclusion: non_null

server:
  error:
    include-message: always

app:
  pagination:
    default-page-size: 20
    max-page-size: 100

---
# application-dev.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/orders_dev
    username: root
    password: root
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

logging:
  level:
    com.myapp: DEBUG
    org.hibernate.SQL: DEBUG

app:
  cors:
    allowed-origins: http://localhost:3000

---
# application-prod.yml
spring:
  datasource:
    url: jdbc:mysql://\${DB_HOST}:\${DB_PORT}/\${DB_NAME}
    username: \${DB_USERNAME}
    password: \${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate

logging:
  level:
    root: WARN
    com.myapp: INFO

app:
  cors:
    allowed-origins: https://myapp.com`,
        explanation: `The shared application.yml contains settings common to all environments. Profile-specific files override only what differs. In production, sensitive values come from environment variables (\${DB_HOST}), never hardcoded. ddl-auto is "update" in dev (convenient for development) but "validate" in prod (only checks that the schema matches, never modifies it). Logging is verbose in dev and minimal in prod. This pattern means you deploy the SAME JAR to every environment -- only the active profile changes.`
      },
      {
        title: '@ConfigurationProperties -- Type-safe Config',
        code: `// application.yml
// app:
//   mail:
//     host: smtp.gmail.com
//     port: 587
//     from: noreply@myapp.com
//     templates:
//       welcome: /templates/welcome.html
//       reset-password: /templates/reset.html
//   retry:
//     max-attempts: 3
//     backoff-ms: 1000

@Configuration
@ConfigurationProperties(prefix = "app.mail")
@Validated  // enables Bean Validation on config
public class MailProperties {
    @NotBlank
    private String host;

    @Min(1) @Max(65535)
    private int port;

    @Email
    private String from;

    private Map<String, String> templates = new HashMap<>();

    // getters and setters required for binding
    public String getHost() { return host; }
    public void setHost(String host) { this.host = host; }
    public int getPort() { return port; }
    public void setPort(int port) { this.port = port; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public Map<String, String> getTemplates() { return templates; }
    public void setTemplates(Map<String, String> templates) { this.templates = templates; }
}

// Usage in service -- clean, type-safe, validated at startup
@Service
@RequiredArgsConstructor
public class MailService {
    private final MailProperties mailProperties;

    public void sendWelcomeEmail(String to) {
        String template = mailProperties.getTemplates().get("welcome");
        System.out.printf("Sending from %s via %s:%d using template %s%n",
            mailProperties.getFrom(), mailProperties.getHost(),
            mailProperties.getPort(), template);
    }
}`,
        explanation: `@ConfigurationProperties binds a group of YAML properties to a Java POJO. With @Validated, invalid configuration fails at startup (not at runtime when you first use it). The templates field demonstrates binding a YAML map to a Java Map -- Spring handles the conversion automatically. This approach is far superior to scattered @Value annotations because: (1) all mail config is in one place, (2) IDE autocomplete works, (3) validation happens at startup, (4) easy to inject the whole group into services.`
      }
    ],
    bestPractices: [
      'Use @ConfigurationProperties for structured config groups, @Value only for simple one-off values',
      'Never hardcode secrets -- use environment variables or a vault (HashiCorp Vault, AWS Secrets Manager)',
      'Add @Validated to @ConfigurationProperties to fail fast on bad configuration',
      'Keep application.yml for shared config, profile-specific files for overrides only',
      'Document all configuration properties with defaults and descriptions',
      'Use spring-boot-configuration-processor for IDE autocomplete metadata'
    ],
    commonMistakes: [
      'Hardcoding database passwords or API keys in YAML files committed to version control',
      'Using spring.profiles.active=prod in application.yml -- the profile should be set externally',
      'Not providing sensible defaults -- the app fails if an optional property is missing',
      'Mixing @Value and @ConfigurationProperties for the same config group',
      'Forgetting that environment variable names are uppercase with underscores: spring.datasource.url → SPRING_DATASOURCE_URL'
    ],
    interviewQuestions: [
      'What is the order of configuration priority in Spring Boot?',
      'How do profiles work? How do you activate a profile?',
      'What is the difference between @Value and @ConfigurationProperties?',
      'How do you handle sensitive configuration (passwords, API keys)?',
      'How does Spring Boot resolve environment variables in YAML?',
      'What happens when properties conflict between application.yml and application-dev.yml?'
    ],
    resources: [
      { label: 'Spring Boot Externalized Configuration', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config' },
      { label: 'Baeldung - Properties with Spring Boot', url: 'https://www.baeldung.com/properties-with-spring' },
      { label: 'Baeldung - @ConfigurationProperties', url: 'https://www.baeldung.com/configuration-properties-in-spring-boot' }
    ]
  },

  // ── Spring Security ───────────────────────────────────────────────────
  {
    id: 'spring-security-basics',
    title: 'Spring Security Fundamentals',
    category: 'spring-security',
    order: 10,
    explanation:
      `What is Spring Security?

Spring Security is a framework that handles authentication (who are you?) and authorization (what are you allowed to do?) for Spring applications. It protects your endpoints with a chain of servlet filters.

Why does it exist?

Security is hard to get right. SQL injection, XSS, CSRF, session fixation, brute force -- every web app faces these threats. Spring Security provides battle-tested defenses out of the box, so you don't reinvent the wheel (and introduce vulnerabilities).

Authentication vs Authorization

  Authentication: Verifying IDENTITY
  - "Prove you are who you claim to be"
  - Username/password, JWT token, OAuth2, biometrics
  - Results in a Principal (the authenticated user)

  Authorization: Verifying PERMISSIONS
  - "Are you allowed to do this?"
  - Role-based (ADMIN, USER), permission-based (READ_ORDERS, DELETE_USERS)
  - Happens AFTER successful authentication

  Analogy:
  Authentication = showing your ID at the airport security checkpoint
  Authorization = the boarding pass that says which gate (resource) you can access

Security Filter Chain

  Every HTTP request passes through a chain of filters before reaching your controller:

  HTTP Request
      ↓
  ┌─────────────────────────────────────────┐
  │  SecurityFilterChain                     │
  │                                          │
  │  1. CorsFilter                           │ ← Cross-Origin Resource Sharing
  │  2. CsrfFilter                           │ ← Cross-Site Request Forgery protection
  │  3. UsernamePasswordAuthenticationFilter  │ ← Form login / basic auth
  │     OR JwtAuthenticationFilter (custom)   │ ← JWT token validation
  │  4. ExceptionTranslationFilter            │ ← Converts security exceptions → HTTP responses
  │  5. AuthorizationFilter                   │ ← Checks roles/permissions
  └────────────────────┬────────────────────┘
                       ↓ (if all filters pass)
                  @RestController

  If any filter rejects the request:
  - Not authenticated → 401 Unauthorized
  - Not authorized    → 403 Forbidden

How Authentication Works Internally

  1. Request arrives with credentials (e.g., username + password)
  2. AuthenticationFilter extracts credentials → creates Authentication token
  3. AuthenticationManager delegates to AuthenticationProvider(s)
  4. AuthenticationProvider loads user via UserDetailsService
  5. PasswordEncoder.matches() checks password
  6. On success → Authentication object stored in SecurityContextHolder
  7. Subsequent requests use the SecurityContext to check authorization

  AuthenticationFilter → AuthenticationManager → AuthenticationProvider
                                                       ↓
                                                 UserDetailsService.loadUserByUsername()
                                                       ↓
                                                 PasswordEncoder.matches()
                                                       ↓ (success)
                                                 SecurityContextHolder.setAuthentication()`,
    codeExamples: [
      {
        title: 'Security Configuration (Spring Security 6+)',
        code: `@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())  // disable for stateless APIs (JWT)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()        // public endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // admin only
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers("/api/products/**").hasAnyRole("ADMIN", "MANAGER")
                .anyRequest().authenticated()                       // everything else: login required
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}`,
        explanation: `This configures a stateless JWT-based security setup. CSRF is disabled because stateless APIs use tokens (not cookies) for authentication -- CSRF only applies to cookie-based auth. SessionCreationPolicy.STATELESS tells Spring not to create HTTP sessions. The request matchers define authorization rules: auth endpoints are public, admin endpoints need ADMIN role, GET on products is public but write operations need elevated roles. The JwtAuthFilter is added BEFORE the default username/password filter to intercept JWT tokens first.`
      },
      {
        title: 'JWT Authentication Filter',
        code: `@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extract token from Authorization header
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);  // no token → skip, let other filters handle
            return;
        }

        String jwt = authHeader.substring(7);  // remove "Bearer "

        // 2. Extract username from token
        String username = jwtService.extractUsername(jwt);

        // 3. If not already authenticated, validate and set authentication
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}`,
        explanation: `This filter runs once per request (OncePerRequestFilter). It extracts the JWT from the "Bearer" Authorization header, validates it, loads the user details, and sets the authentication in the SecurityContext. If there's no token, the filter simply passes the request along -- other filters or the authorization rules will handle the 401. The SecurityContextHolder is thread-local, so each request has its own authentication context. After this filter, @PreAuthorize and role checks work because the user's authorities are loaded.`
      }
    ],
    bestPractices: [
      'Use BCryptPasswordEncoder (or Argon2) for hashing passwords -- never store plaintext',
      'Disable CSRF only for stateless APIs (JWT); keep it enabled for cookie-based apps',
      'Use the most restrictive rule first in authorizeHttpRequests -- order matters',
      'Store JWT secrets in environment variables, not in code',
      'Set short JWT expiry (15-30 minutes) and use refresh tokens for long sessions',
      'Always validate and sanitize user input to prevent injection attacks',
      'Use @PreAuthorize for method-level security when URL-based rules aren\'t granular enough'
    ],
    commonMistakes: [
      'Disabling CSRF for cookie-based sessions -- leaves the app vulnerable to CSRF attacks',
      'Storing passwords in plaintext or with weak hashing (MD5, SHA-1)',
      'Not configuring CORS properly -- either too restrictive (blocks legitimate requests) or too permissive (*)',
      'Putting security logic in controllers instead of the filter chain',
      'Returning detailed error messages for authentication failures ("user not found" vs "invalid credentials")',
      'Not setting JWT expiry -- tokens valid forever are a massive security risk'
    ],
    interviewQuestions: [
      'What is the difference between authentication and authorization?',
      'How does the Spring Security filter chain work?',
      'What is CSRF and when should you disable it?',
      'How does JWT authentication work in Spring Security?',
      'What is the SecurityContextHolder and how is it used?',
      'What is the difference between @Secured, @PreAuthorize, and @RolesAllowed?',
      'How do you implement role-based access control in Spring?',
      'What password encoder should you use and why?'
    ],
    resources: [
      { label: 'Spring Security Reference', url: 'https://docs.spring.io/spring-security/reference/' },
      { label: 'Baeldung - Spring Security Tutorial', url: 'https://www.baeldung.com/security-spring' },
      { label: 'OWASP Cheat Sheets', url: 'https://cheatsheetseries.owasp.org/' }
    ]
  },

  {
    id: 'spring-security-oauth2',
    title: 'OAuth2 & JWT',
    category: 'spring-security',
    order: 11,
    explanation:
      `What is OAuth2?

OAuth2 is an authorization framework that lets a third-party application access a user's resources on another service WITHOUT the user sharing their password. It defines HOW to delegate access safely.

Why does it exist?

Imagine you want "Login with Google" in your app. Without OAuth2, the user would have to give your app their Google password. That's dangerous -- your app could read their emails, change settings, etc. OAuth2 solves this by giving your app a LIMITED, REVOCABLE token instead of the password.

Analogy: A hotel key card. The front desk (authorization server) gives you a card (token) that opens your room (resource) for a specific time. You don't get the master key (password). The hotel can deactivate your card at any time.

OAuth2 Authorization Code Flow (Most Common)

  ┌──────┐    ┌─────────┐    ┌────────────────┐    ┌──────────────┐
  │ User │    │ Your App│    │ Auth Server     │    │ Resource     │
  │      │    │(Client) │    │ (Google/Okta)   │    │ Server (API) │
  └──┬───┘    └────┬────┘    └───────┬────────┘    └──────┬───────┘
     │             │                  │                     │
     │  1. Click "Login with Google"  │                     │
     │────────────→│                  │                     │
     │             │  2. Redirect to auth server            │
     │             │─────────────────→│                     │
     │  3. User logs in + consents    │                     │
     │────────────────────────────────→│                     │
     │             │  4. Auth server redirects back with    │
     │             │     authorization_code                  │
     │             │←─────────────────│                     │
     │             │  5. Exchange code + client_secret       │
     │             │     for access_token + refresh_token    │
     │             │─────────────────→│                     │
     │             │←─────────────────│                     │
     │             │  6. Call API with access_token          │
     │             │─────────────────────────────────────────→
     │             │  7. API validates token, returns data   │
     │             │←─────────────────────────────────────────
     │  8. Show data to user          │                     │
     │←────────────│                  │                     │

  Why the extra "code exchange" step?
  The authorization_code is passed through the browser (URL redirect) -- visible.
  The client_secret is sent server-to-server (step 5) -- invisible.
  This prevents the token from being intercepted in the browser.

JWT (JSON Web Token) Structure

  A JWT is a self-contained token that carries user claims. No need to query the
  database on every request to check who the user is.

  ┌──────────────────────────────────────────────────────────────┐
  │               Header.Payload.Signature                       │
  ├──────────────┬───────────────────────┬───────────────────────┤
  │   HEADER     │   PAYLOAD             │   SIGNATURE           │
  │ {            │ {                     │ HMACSHA256(           │
  │  "alg":"HS256"│  "sub": "user123",  │   base64(header) +    │
  │  "typ":"JWT" │  "name": "Alice",    │   "." +               │
  │ }            │  "roles": ["ADMIN"], │   base64(payload),    │
  │              │  "iat": 1234567890,  │   secret              │
  │              │  "exp": 1234571490   │ )                     │
  │              │ }                     │                       │
  └──────────────┴───────────────────────┴───────────────────────┘
  Base64Url      Base64Url               Verifies integrity
  encoded        encoded                 (not tampered with)

  The server signs the token with a secret key. When a request comes in:
  1. Decode header + payload (Base64 -- not encrypted, anyone can read it!)
  2. Recompute signature using the secret key
  3. Compare signatures -- if they match, the token is valid and unmodified

  IMPORTANT: JWT is signed, NOT encrypted. Don't put sensitive data (passwords,
  SSN) in the payload. Use HTTPS to protect the token in transit.

Access Token vs Refresh Token

  ┌─────────────────┬───────────────────────┬───────────────────────┐
  │                 │ Access Token           │ Refresh Token          │
  ├─────────────────┼───────────────────────┼───────────────────────┤
  │ Purpose         │ Access protected APIs  │ Get new access tokens  │
  │ Lifetime        │ Short (15-30 min)      │ Long (7-30 days)       │
  │ Stored in       │ Memory / header        │ HttpOnly cookie        │
  │ Sent with       │ Every API request      │ Only to /refresh       │
  │ If compromised  │ Limited damage (short) │ Revoke on server side  │
  └─────────────────┴───────────────────────┴───────────────────────┘`,
    codeExamples: [
      {
        title: 'JWT Service -- Generate & Validate Tokens',
        code: `@Service
public class JwtService {
    @Value("\${jwt.secret}")
    private String secretKey;

    @Value("\${jwt.access-token-expiry-ms:900000}")  // 15 minutes default
    private long accessTokenExpiry;

    @Value("\${jwt.refresh-token-expiry-ms:604800000}")  // 7 days default
    private long refreshTokenExpiry;

    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).toList());
        return buildToken(claims, userDetails.getUsername(), accessTokenExpiry);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(Map.of(), userDetails.getUsername(), refreshTokenExpiry);
    }

    private String buildToken(Map<String, Object> claims, String subject, long expiry) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiry))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
        return resolver.apply(claims);
    }

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}`,
        explanation: `The JwtService generates and validates tokens using the jjwt library. Access tokens contain the user's roles in the claims so the server can authorize requests without a database lookup. Refresh tokens are minimal (no roles) -- they're only used to obtain new access tokens. The signing key is loaded from configuration, never hardcoded. extractClaim() uses a Function parameter for flexibility -- you can extract any claim (subject, expiration, custom fields) with the same method.`
      },
      {
        title: 'Auth Controller -- Login & Refresh',
        code: `@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        // Spring Security authenticates (checks password via BCrypt)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        UserDetails user = userDetailsService.loadUserByUsername(request.email());
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshRequest request) {
        String username = jwtService.extractUsername(request.refreshToken());
        UserDetails user = userDetailsService.loadUserByUsername(username);

        if (!jwtService.isTokenValid(request.refreshToken(), user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccessToken = jwtService.generateAccessToken(user);
        return ResponseEntity.ok(new AuthResponse(newAccessToken, request.refreshToken()));
    }
}

record LoginRequest(@Email String email, @NotBlank String password) {}
record RefreshRequest(@NotBlank String refreshToken) {}
record AuthResponse(String accessToken, String refreshToken) {}`,
        explanation: `The login endpoint delegates authentication to Spring Security's AuthenticationManager, which uses the configured AuthenticationProvider and PasswordEncoder. If the password is wrong, it throws AuthenticationException (caught by @ControllerAdvice and returned as 401). On success, both access and refresh tokens are generated and returned. The refresh endpoint validates the refresh token and issues a new access token without requiring the user to log in again. In production, store refresh tokens in the database and support revocation.`
      }
    ],
    bestPractices: [
      'Use short-lived access tokens (15-30 min) with refresh token rotation',
      'Store the JWT secret in environment variables or a vault, never in code',
      'Use HTTPS everywhere -- JWT is signed but NOT encrypted',
      'Never put sensitive data in JWT claims (passwords, SSN, credit cards)',
      'Implement token revocation for logout (blacklist or database check)',
      'Use HttpOnly cookies for refresh tokens to prevent XSS theft',
      'Validate the token audience (aud) and issuer (iss) claims in multi-service architectures'
    ],
    commonMistakes: [
      'Using a weak or short secret key for signing -- must be at least 256 bits for HS256',
      'Not setting token expiry -- tokens valid forever are a security risk',
      'Storing tokens in localStorage -- vulnerable to XSS attacks',
      'Putting sensitive data in the JWT payload (it is Base64-encoded, not encrypted)',
      'Not handling token expiry on the client -- leads to 401 errors without automatic refresh',
      'Using symmetric signing (HS256) in distributed systems -- use RS256 with public/private keys'
    ],
    interviewQuestions: [
      'Explain the OAuth2 Authorization Code flow step by step.',
      'What is a JWT? What are its three parts?',
      'How does JWT differ from session-based authentication?',
      'What is the difference between access tokens and refresh tokens?',
      'Why is JWT signed but not encrypted? How does the signature prevent tampering?',
      'What is the difference between HS256 and RS256?',
      'How do you handle token revocation/logout with JWT?',
      'What is PKCE and why is it needed for public clients (SPAs, mobile)?'
    ],
    resources: [
      { label: 'OAuth 2.0 Simplified', url: 'https://www.oauth.com/' },
      { label: 'JWT.io -- Debugger & Docs', url: 'https://jwt.io/' },
      { label: 'Spring Security OAuth2 Guide', url: 'https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html' }
    ]
  },

  // ── Spring Data JPA ───────────────────────────────────────────────────
  {
    id: 'spring-data-jpa',
    title: 'Spring Data JPA Fundamentals',
    category: 'spring-data',
    order: 12,
    explanation:
      `What is Spring Data JPA?

Spring Data JPA is an abstraction layer on top of JPA (Java Persistence API) that eliminates boilerplate database code. You define an interface, and Spring generates the implementation at runtime.

Why does it exist?

Without Spring Data JPA, you'd write repetitive DAO (Data Access Object) code for every entity: findById, findAll, save, delete, custom queries. Spring Data JPA generates all of this from method names alone.

How It Works

  Your Code:
  ┌───────────────────────────────────────────────┐
  │ interface ProductRepository                    │
  │   extends JpaRepository<Product, Long>         │
  │                                                │
  │   List<Product> findByPriceLessThan(BigDecimal)│
  └──────────────────────┬────────────────────────┘
                         ↓ Spring generates at runtime
  ┌───────────────────────────────────────────────┐
  │ SimpleJpaRepository (Spring Data impl)         │
  │   + findAll(), findById(), save(), delete()    │
  │   + Derived query: SELECT * FROM products      │
  │     WHERE price < ?                            │
  └──────────────────────┬────────────────────────┘
                         ↓ JPA (Hibernate)
  ┌───────────────────────────────────────────────┐
  │ EntityManager → JDBC → SQL → Database          │
  └───────────────────────────────────────────────┘

  You write the interface. Spring writes the implementation. Hibernate translates to SQL.

Query Derivation -- Method Name to SQL

  Spring parses method names and generates queries automatically:

  findByName(String name)
    → SELECT * FROM products WHERE name = ?

  findByPriceBetween(BigDecimal min, BigDecimal max)
    → SELECT * FROM products WHERE price BETWEEN ? AND ?

  findByNameContainingIgnoreCaseOrderByPriceDesc(String name)
    → SELECT * FROM products WHERE LOWER(name) LIKE LOWER('%?%') ORDER BY price DESC

  countByStatus(String status)
    → SELECT COUNT(*) FROM products WHERE status = ?

  existsByEmail(String email)
    → SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM users WHERE email = ?

  Keywords: findBy, countBy, existsBy, deleteBy
  Conditions: And, Or, Between, LessThan, GreaterThan, Like, Containing, In, IsNull
  Modifiers: OrderBy, First, Top, Distinct

Pagination and Sorting

  Spring Data provides built-in pagination through the Pageable interface:

  Page<Product> findAll(Pageable pageable);

  Usage:
  Pageable pageable = PageRequest.of(0, 20, Sort.by("price").descending());
  Page<Product> page = repository.findAll(pageable);
  page.getContent()       → List<Product> (this page's data)
  page.getTotalElements() → total rows in DB
  page.getTotalPages()    → total pages
  page.hasNext()          → boolean`,
    codeExamples: [
      {
        title: 'Repository with Derived and Custom Queries',
        code: `@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // --- Derived queries (Spring generates SQL from method name) ---
    List<Order> findByCustomerName(String name);
    List<Order> findByStatusAndCreatedAtAfter(String status, LocalDateTime after);
    Optional<Order> findFirstByCustomerNameOrderByCreatedAtDesc(String name);
    long countByStatus(String status);
    boolean existsByCustomerEmail(String email);

    // --- JPQL (entity-based query language) ---
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id = :id")
    Optional<Order> findByIdWithItems(@Param("id") Long id);

    @Query("SELECT o.status, COUNT(o), SUM(o.total) FROM Order o " +
           "WHERE o.createdAt >= :since GROUP BY o.status")
    List<Object[]> getOrderStatsSince(@Param("since") LocalDateTime since);

    // --- Native SQL (when JPQL isn't enough) ---
    @Query(value = "SELECT * FROM orders WHERE MATCH(notes) AGAINST(:keyword IN BOOLEAN MODE)",
           nativeQuery = true)
    List<Order> fullTextSearch(@Param("keyword") String keyword);

    // --- @Modifying for UPDATE/DELETE queries ---
    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :status WHERE o.id IN :ids")
    int bulkUpdateStatus(@Param("ids") List<Long> ids, @Param("status") String status);
}`,
        explanation: `Derived queries work for simple lookups -- Spring parses the method name into SQL. For anything complex (JOINs, aggregations, full-text search), use @Query with JPQL or native SQL. JOIN FETCH in the findByIdWithItems query eagerly loads items in a single query, avoiding the N+1 problem. @Modifying marks queries that change data (UPDATE/DELETE) and must be paired with @Transactional. The bulkUpdateStatus method returns the count of affected rows.`
      },
      {
        title: 'Entity Mapping and Auditing',
        code: `@Entity
@Table(name = "orders", indexes = {
    @Index(name = "idx_order_customer", columnList = "customer_id"),
    @Index(name = "idx_order_status_date", columnList = "status, created_at")
})
@EntityListeners(AuditingEntityListener.class)
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // --- Auditing (auto-populated by Spring Data) ---
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    // --- Helper method to maintain bidirectional relationship ---
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}

// Enable auditing in a config class
@Configuration
@EnableJpaAuditing
public class JpaConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication())
            .map(Authentication::getName);
    }
}`,
        explanation: `The entity defines the database mapping. @Index annotations improve query performance for common search patterns. FetchType.LAZY on @ManyToOne prevents loading the Customer on every Order query -- it's loaded only when accessed. CascadeType.ALL + orphanRemoval on items means saving/deleting an Order automatically saves/deletes its items. The addItem/removeItem helper methods maintain both sides of the bidirectional relationship. Spring Data auditing (@CreatedDate, @CreatedBy) automatically sets timestamps and the current user on save, eliminating manual boilerplate.`
      }
    ],
    bestPractices: [
      'Use derived queries for simple lookups, @Query(JPQL) for complex ones, native SQL as last resort',
      'Always use FetchType.LAZY for @ManyToOne and @OneToMany -- fetch eagerly only when needed with JOIN FETCH',
      'Define @Index annotations for columns used in WHERE and JOIN clauses',
      'Use Pageable for all list endpoints -- never return unbounded result sets',
      'Enable Spring Data Auditing for automatic created/updated timestamps',
      'Use bidirectional helper methods (addItem/removeItem) to keep relationships consistent',
      'Prefer JPQL over native SQL for portability across databases'
    ],
    commonMistakes: [
      'Using FetchType.EAGER on relationships -- loads the entire object graph every time',
      'Not using @Transactional on service methods -- leads to LazyInitializationException when accessing lazy fields',
      'Returning entities with lazy collections directly in API responses -- Jackson triggers lazy loading or throws',
      'Forgetting @Modifying on UPDATE/DELETE @Query methods -- they silently do nothing',
      'Using findAll() without pagination on large tables -- loads millions of rows into memory',
      'Updating entities by loading, modifying, and saving when a bulk @Query UPDATE is more efficient'
    ],
    interviewQuestions: [
      'What is Spring Data JPA? How does it differ from plain JPA/Hibernate?',
      'How do derived query methods work? Give examples.',
      'What is the difference between JPQL and native SQL in @Query?',
      'Explain FetchType.LAZY vs EAGER. Which is the default for @ManyToOne?',
      'How does pagination work in Spring Data JPA?',
      'What is the difference between save() and saveAndFlush()?',
      'How do you enable auditing in Spring Data JPA?',
      'What is the N+1 problem? (Covered in detail in the next topic)'
    ],
    resources: [
      { label: 'Spring Data JPA Reference', url: 'https://docs.spring.io/spring-data/jpa/docs/current/reference/html/' },
      { label: 'Baeldung - Spring Data JPA', url: 'https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa' },
      { label: 'Derived Query Methods', url: 'https://www.baeldung.com/spring-data-derived-queries' }
    ]
  },

  {
    id: 'jpa-relationships',
    title: 'JPA Relationships & N+1 Problem',
    category: 'spring-data',
    order: 13,
    explanation:
      `What are JPA Relationships?

JPA relationships map how entities relate to each other in the database -- foreign keys in SQL become object references in Java. The four relationship types mirror database cardinalities.

Relationship Types

  @ManyToOne (most common -- FK on this table)
  ┌──────────┐     ┌──────────────┐
  │ OrderItem │────→│    Order     │   Many items belong to one order
  │ order_id  │     │ id           │   OrderItem has the FK (owning side)
  └──────────┘     └──────────────┘

  @OneToMany (inverse of ManyToOne)
  ┌──────────────┐     ┌──────────┐
  │    Order     │←────│ OrderItem │   One order has many items
  │ items (List) │     │ order_id  │   Order is the inverse side (mappedBy)
  └──────────────┘     └──────────┘

  @OneToOne
  ┌──────────┐     ┌──────────────┐
  │   User   │────→│  UserProfile │   One user has one profile
  │ profile  │     │  user_id     │
  └──────────┘     └──────────────┘

  @ManyToMany (junction table)
  ┌──────────┐     ┌─────────────────┐     ┌──────────┐
  │ Student  │←───→│ student_courses │←───→│  Course  │
  │          │     │ student_id      │     │          │
  │          │     │ course_id       │     │          │
  └──────────┘     └─────────────────┘     └──────────┘

The N+1 Problem (Critical for Interviews)

  What is it?
  When you load N entities and each one triggers a SEPARATE query to load its
  related entities, resulting in 1 + N queries instead of 1 or 2.

  Example: Load 100 orders, each with a customer:

  N+1 Problem:
  Query 1:  SELECT * FROM orders                    (1 query → 100 orders)
  Query 2:  SELECT * FROM customers WHERE id = 1    (for order 1)
  Query 3:  SELECT * FROM customers WHERE id = 2    (for order 2)
  ...
  Query 101: SELECT * FROM customers WHERE id = 100  (for order 100)
  Total: 101 queries!

  Fixed with JOIN FETCH:
  Query 1:  SELECT o.*, c.* FROM orders o
            JOIN customers c ON o.customer_id = c.id   (1 query → 100 orders with customers)
  Total: 1 query!

  ┌─────────────────────────────────────────────────┐
  │  N+1: 101 queries (SLOW)                        │
  │  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ... ┌───┐            │
  │  │Q1│ │Q2│ │Q3│ │Q4│ │Q5│     │101│            │
  │  └──┘ └──┘ └──┘ └──┘ └──┘     └───┘            │
  │                                                  │
  │  JOIN FETCH: 1 query (FAST)                      │
  │  ┌────────────────────────────────────────────┐  │
  │  │              Single Query                   │  │
  │  └────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────┘

Solutions to N+1

  1. JOIN FETCH (JPQL): Explicit eager loading in the query
     @Query("SELECT o FROM Order o JOIN FETCH o.customer")

  2. @EntityGraph: Declarative eager loading on repository method
     @EntityGraph(attributePaths = {"customer", "items"})
     List<Order> findAll();

  3. @BatchSize (Hibernate): Load related entities in batches
     @BatchSize(size = 16)  → loads 16 customers per query instead of 1
     Turns 101 queries into 1 + ceil(100/16) = 8 queries

  4. DTO Projection: Select only needed columns, skip relationships entirely
     @Query("SELECT new OrderSummary(o.id, o.total, c.name) FROM Order o JOIN o.customer c")`,
    codeExamples: [
      {
        title: 'Relationships and N+1 Fix',
        code: `// --- Entities with relationships ---
@Entity
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)  // LAZY = don't load customer until accessed
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 16)  // Solution 3: batch loading
    private List<OrderItem> items = new ArrayList<>();

    private BigDecimal total;
}

@Entity
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;          // owning side (has the FK)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
    private BigDecimal unitPrice;
}

// --- Repository with N+1 solutions ---
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Solution 1: JOIN FETCH in JPQL
    @Query("SELECT DISTINCT o FROM Order o " +
           "JOIN FETCH o.customer " +
           "JOIN FETCH o.items " +
           "WHERE o.customer.id = :customerId")
    List<Order> findByCustomerWithDetails(@Param("customerId") Long customerId);

    // Solution 2: @EntityGraph (declarative)
    @EntityGraph(attributePaths = {"customer", "items", "items.product"})
    List<Order> findByStatus(OrderStatus status);

    // Solution 4: DTO Projection (most efficient -- only selected columns)
    @Query("SELECT new com.myapp.dto.OrderSummary(o.id, o.total, o.status, c.name) " +
           "FROM Order o JOIN o.customer c WHERE o.status = :status")
    List<OrderSummary> findOrderSummariesByStatus(@Param("status") OrderStatus status);
}`,
        explanation: `FetchType.LAZY is set on all @ManyToOne and @OneToMany relationships to avoid loading everything upfront. When you actually need related data, use JOIN FETCH (explicit in query), @EntityGraph (declarative on method), or @BatchSize (automatic batching). The DISTINCT keyword in JOIN FETCH is important -- without it, a join with a collection (items) produces duplicate parent rows. DTO projections are the most efficient because they only select the columns you need -- no entity management overhead, no lazy loading traps.`
      },
      {
        title: 'Detecting N+1 with Logging',
        code: `# application-dev.yml -- Enable SQL logging to detect N+1

spring:
  jpa:
    show-sql: false  # Use Hibernate logger instead (formatted)
    properties:
      hibernate:
        format_sql: true
        # Generates query statistics (query count, time, etc.)
        generate_statistics: true

logging:
  level:
    # Shows the actual SQL queries
    org.hibernate.SQL: DEBUG
    # Shows parameter values bound to queries
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE

# Alternatively, add Hibernate query counter in test:
# ──────────────────────────────────────────────────

// In test class:
@Test
void shouldNotHaveNPlusOne() {
    // Reset Hibernate statistics
    Statistics stats = entityManager.getEntityManagerFactory()
        .unwrap(SessionFactory.class).getStatistics();
    stats.setStatisticsEnabled(true);
    stats.clear();

    // Execute the operation
    List<Order> orders = orderService.findRecentOrders();
    orders.forEach(o -> o.getCustomer().getName());  // trigger lazy load

    // Assert query count
    long queryCount = stats.getQueryExecutionCount();
    assertThat(queryCount)
        .as("Should use JOIN FETCH, not N+1")
        .isLessThanOrEqualTo(2);  // 1-2 queries expected
}`,
        explanation: `The most reliable way to catch N+1 problems is to log SQL queries during development. hibernate.generate_statistics gives you query counts, cache hit rates, and execution times. In tests, you can use Hibernate Statistics to programmatically assert the number of queries. If you see the same SELECT repeated 50+ times in your logs, you have an N+1 problem. Tools like spring-boot-starter-data-jpa-extra or p6spy can also help detect this automatically.`
      }
    ],
    bestPractices: [
      'Default all relationships to FetchType.LAZY -- fetch eagerly only in specific queries',
      'Use JOIN FETCH or @EntityGraph when you know you need related entities',
      'Use @BatchSize(size = 16) as a safety net for collections that might be lazily loaded',
      'Use DTO projections for read-only queries where you don\'t need full entities',
      'Always use DISTINCT with JOIN FETCH on collections to avoid duplicate rows',
      'Enable SQL logging in dev/test to detect N+1 problems early',
      'Prefer bidirectional @OneToMany with orphanRemoval=true over manual delete queries'
    ],
    commonMistakes: [
      'Using FetchType.EAGER on @ManyToOne -- loads the related entity every time, even when not needed',
      'Returning entities with LAZY relationships from a service → LazyInitializationException (session closed)',
      'Multiple JOIN FETCH on collections in one query → Hibernate MultipleBagFetchException (use Set or separate queries)',
      'Forgetting DISTINCT with JOIN FETCH on collections → duplicate parent entities in results',
      'Using CascadeType.ALL on @ManyToOne → deleting a child deletes the parent!',
      'Not detecting N+1 until production → massive performance degradation under load'
    ],
    interviewQuestions: [
      'What is the N+1 problem? Give a concrete example.',
      'What are the different ways to solve the N+1 problem?',
      'What is the difference between FetchType.LAZY and EAGER?',
      'Explain the difference between unidirectional and bidirectional relationships.',
      'What is the "owning side" of a relationship? Why does it matter?',
      'What is CascadeType.ALL? When should you use it?',
      'What is orphanRemoval and how does it differ from CascadeType.REMOVE?',
      'How do you handle MultipleBagFetchException?'
    ],
    resources: [
      { label: 'Baeldung - JPA Relationships', url: 'https://www.baeldung.com/jpa-hibernate-associations' },
      { label: 'Vlad Mihalcea - N+1 Problem', url: 'https://vladmihalcea.com/n-plus-1-query-problem/' },
      { label: 'Baeldung - Entity Graph', url: 'https://www.baeldung.com/jpa-entity-graph' }
    ]
  },

  {
    id: 'jpa-transactions',
    title: 'Transactions & Locking',
    category: 'spring-data',
    order: 14,
    explanation:
      `What is a Transaction?

A transaction is a sequence of operations that either ALL succeed or ALL fail. There is no partial state -- it's all or nothing.

Why does it exist?

Imagine transferring $100 from Account A to Account B:
  Step 1: Deduct $100 from A
  Step 2: Add $100 to B

If the system crashes after Step 1 but before Step 2, the $100 vanishes. Transactions prevent this: if Step 2 fails, Step 1 is rolled back.

ACID Properties

  A - Atomicity:    All or nothing. If any operation fails, everything is rolled back.
  C - Consistency:  The database moves from one valid state to another.
  I - Isolation:    Concurrent transactions don't interfere with each other.
  D - Durability:   Once committed, data survives crashes (written to disk).

@Transactional in Spring

  When you annotate a method with @Transactional:
  1. Spring creates a proxy around the method
  2. Before the method: opens a transaction (BEGIN)
  3. Method executes normally: changes are buffered
  4. Method returns: COMMIT (all changes saved)
  5. Method throws RuntimeException: ROLLBACK (all changes undone)

  ┌──────────────────────────────────────────┐
  │  @Transactional                           │
  │  ┌──────────────────────────────────────┐ │
  │  │ BEGIN TRANSACTION                    │ │
  │  │   deductFromAccount(A, 100)          │ │
  │  │   addToAccount(B, 100)               │ │
  │  │   COMMIT ← if no exception           │ │
  │  │   ROLLBACK ← if RuntimeException     │ │
  │  └──────────────────────────────────────┘ │
  └──────────────────────────────────────────┘

Transaction Propagation

  What happens when a @Transactional method calls another @Transactional method?

  ┌───────────────────┬────────────────────────────────────────────────────────┐
  │ Propagation       │ Behavior                                              │
  ├───────────────────┼────────────────────────────────────────────────────────┤
  │ REQUIRED (default)│ Join existing TX, or create new one if none exists     │
  │ REQUIRES_NEW      │ Always create a NEW TX, suspend the outer one          │
  │ MANDATORY         │ Must have an existing TX, throws exception if none     │
  │ SUPPORTS          │ Join TX if exists, run without TX if none              │
  │ NOT_SUPPORTED     │ Suspend existing TX, run without TX                    │
  │ NEVER             │ Throws exception if a TX exists                        │
  │ NESTED            │ Create a savepoint within the outer TX                 │
  └───────────────────┴────────────────────────────────────────────────────────┘

  Most common: REQUIRED (default) and REQUIRES_NEW

  Example: OrderService.placeOrder() calls AuditService.log()
  - REQUIRED: Both run in the SAME transaction. If audit fails, order rolls back too.
  - REQUIRES_NEW: Audit runs in its OWN transaction. If audit fails, order still commits.

Isolation Levels

  ┌───────────────────┬────────────────────────────────────────────────────────┐
  │ Problem           │ Description                                           │
  ├───────────────────┼────────────────────────────────────────────────────────┤
  │ Dirty Read        │ Read uncommitted data from another TX                 │
  │ Non-Repeatable    │ Same query returns different data within one TX       │
  │ Phantom Read      │ New rows appear between two identical queries         │
  └───────────────────┴────────────────────────────────────────────────────────┘

  ┌─────────────────────┬────────────┬───────────────────┬──────────────┐
  │ Isolation Level     │ Dirty Read │ Non-Repeatable Read│ Phantom Read │
  ├─────────────────────┼────────────┼───────────────────┼──────────────┤
  │ READ_UNCOMMITTED    │ Possible   │ Possible           │ Possible     │
  │ READ_COMMITTED      │ Prevented  │ Possible           │ Possible     │
  │ REPEATABLE_READ     │ Prevented  │ Prevented          │ Possible     │
  │ SERIALIZABLE        │ Prevented  │ Prevented          │ Prevented    │
  └─────────────────────┴────────────┴───────────────────┴──────────────┘

  MySQL default: REPEATABLE_READ
  PostgreSQL default: READ_COMMITTED

Optimistic vs Pessimistic Locking

  Optimistic Locking (version-based):
  "I assume no one else is modifying this row. If someone did, I'll retry."
  - Uses @Version column (incremented on each update)
  - If two users edit the same row, the second save throws OptimisticLockException
  - Best for: low contention, read-heavy workloads

  Pessimistic Locking (database lock):
  "I'm locking this row NOW. No one else can modify it until I'm done."
  - Uses SELECT ... FOR UPDATE (database-level lock)
  - Other transactions block until the lock is released
  - Best for: high contention, critical financial operations`,
    codeExamples: [
      {
        title: 'Transaction Management and Propagation',
        code: `@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    private final AuditService auditService;

    @Transactional  // Default: REQUIRED
    public Order placeOrder(CreateOrderRequest request) {
        // All of these run in ONE transaction
        Order order = createOrder(request);
        inventoryService.reserveStock(order.getItems());  // joins this TX
        paymentService.charge(order.getTotal());           // joins this TX

        // If payment fails → inventory reservation is rolled back too
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)  // Optimizes: no dirty checking, may use read replica
    public Page<Order> findOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    @Transactional(
        rollbackFor = Exception.class,        // Roll back on ALL exceptions (not just Runtime)
        timeout = 30                          // Timeout after 30 seconds
    )
    public void processRefund(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
        order.setStatus(OrderStatus.REFUNDED);
        paymentService.refund(order.getTotal());
        orderRepository.save(order);
    }
}

@Service
public class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String action, String details) {
        // Runs in its OWN transaction
        // Even if the calling transaction rolls back, this audit log is saved
        auditRepository.save(new AuditLog(action, details));
    }
}`,
        explanation: `The placeOrder() method wraps order creation, inventory reservation, and payment in a single transaction. If payment fails, everything rolls back -- the order is not saved and inventory is not reserved. readOnly=true on query methods allows Hibernate to skip dirty checking (performance optimization) and potentially route to a read replica. AuditService.log() uses REQUIRES_NEW to create an independent transaction -- audit logs should be preserved even if the main operation fails. rollbackFor=Exception.class overrides the default (which only rolls back on RuntimeException).`
      },
      {
        title: 'Optimistic and Pessimistic Locking',
        code: `// --- Optimistic Locking with @Version ---
@Entity
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int stock;

    @Version  // Hibernate checks this on every UPDATE
    private Integer version;
}

// UPDATE products SET stock=?, version=version+1
// WHERE id=? AND version=?
// If version doesn't match → OptimisticLockException

@Service
public class ProductService {
    @Transactional
    @Retryable(value = OptimisticLockException.class, maxAttempts = 3)
    public void updateStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow();
        product.setStock(product.getStock() - quantity);
        productRepository.save(product);
        // If another thread updated stock between findById and save:
        // version mismatch → OptimisticLockException → retry
    }
}

// --- Pessimistic Locking ---
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)  // SELECT ... FOR UPDATE
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(@Param("id") Long id);
}

@Service
public class TransferService {
    @Transactional
    public void transfer(Long fromId, Long toId, BigDecimal amount) {
        // Lock both accounts -- always lock in consistent order to prevent deadlock!
        Long firstId = Math.min(fromId, toId);
        Long secondId = Math.max(fromId, toId);

        Account first = accountRepository.findByIdForUpdate(firstId).orElseThrow();
        Account second = accountRepository.findByIdForUpdate(secondId).orElseThrow();

        Account from = fromId.equals(firstId) ? first : second;
        Account to = fromId.equals(firstId) ? second : first;

        if (from.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(fromId, amount);
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));
    }
}`,
        explanation: `Optimistic locking uses a @Version column. Hibernate adds "AND version=?" to every UPDATE. If two threads read version 1 and both try to update, only one succeeds -- the other gets OptimisticLockException and can retry. This is best for scenarios with low contention. Pessimistic locking uses SELECT ... FOR UPDATE which blocks other transactions from modifying the row. The transfer example shows a critical pattern: always lock rows in a consistent order (by ID) to prevent deadlocks. If Thread A locks account 1 then 2, and Thread B locks account 2 then 1, both wait forever (deadlock).`
      }
    ],
    bestPractices: [
      'Place @Transactional on service methods, not controllers or repositories',
      'Use @Transactional(readOnly = true) for read-only operations -- enables optimizations',
      'Use REQUIRES_NEW for independent operations that should survive parent rollback (audit, notifications)',
      'Always lock rows in a consistent order (e.g., by ID) to prevent deadlocks',
      'Use optimistic locking (@Version) for low-contention entities, pessimistic for financial operations',
      'Set transaction timeouts to prevent long-running transactions from holding locks',
      'Avoid doing HTTP calls or heavy computation inside a transaction -- keep transactions short'
    ],
    commonMistakes: [
      'Calling @Transactional methods within the same class -- Spring proxy doesn\'t intercept self-invocation',
      'Using @Transactional on private methods -- Spring AOP only works on public methods',
      'Catching exceptions inside @Transactional without re-throwing -- prevents rollback',
      'Not setting rollbackFor -- by default, checked exceptions do NOT trigger rollback',
      'Performing I/O (HTTP calls, file operations) inside a transaction -- holds DB connection unnecessarily',
      'Forgetting that @Transactional creates a proxy -- the first call must come from outside the class'
    ],
    interviewQuestions: [
      'What are the ACID properties? Explain each.',
      'How does @Transactional work in Spring? What happens behind the scenes?',
      'What is transaction propagation? Explain REQUIRED vs REQUIRES_NEW.',
      'What are the different isolation levels? What problems does each prevent?',
      'Explain optimistic vs pessimistic locking. When would you use each?',
      'Why doesn\'t @Transactional work when calling a method within the same class?',
      'What happens if a checked exception is thrown inside a @Transactional method?',
      'How do you prevent deadlocks when locking multiple rows?'
    ],
    resources: [
      { label: 'Spring Transaction Management', url: 'https://docs.spring.io/spring-framework/reference/data-access/transaction.html' },
      { label: 'Baeldung - Spring Transactions', url: 'https://www.baeldung.com/transaction-configuration-with-jpa-and-spring' },
      { label: 'Vlad Mihalcea - Locking', url: 'https://vladmihalcea.com/optimistic-vs-pessimistic-locking/' }
    ]
  },

  // ── Spring Cloud ──────────────────────────────────────────────────────
  {
    id: 'spring-cloud-config',
    title: 'Spring Cloud Config',
    category: 'spring-cloud',
    order: 15,
    explanation:
      `What is Spring Cloud Config?

Spring Cloud Config provides centralized, externalized configuration for distributed systems. Instead of each microservice having its own application.yml, all configuration lives in one place (Git repo, filesystem, or Vault) and services fetch it at startup.

Why does it exist?

In a microservices architecture with 20+ services, managing configuration becomes a nightmare:
- Where is the database URL for the order-service in production?
- We need to change the Redis host -- which services use Redis?
- How do we rotate a secret without redeploying 15 services?

Spring Cloud Config solves this by providing a single source of truth.

Architecture

  ┌──────────────────────────────────────────────────────────────────────┐
  │                      Spring Cloud Config Architecture                │
  │                                                                      │
  │   ┌──────────────────┐      ┌────────────────────┐                  │
  │   │  Git Repository   │      │ Config Server       │                  │
  │   │  (Single source   │─────→│ (Spring Boot app)   │                  │
  │   │   of truth)       │      │ Port: 8888          │                  │
  │   │                   │      └────────┬───────────┘                  │
  │   │ application.yml   │               │                              │
  │   │ order-service.yml │          Serves config                       │
  │   │ order-service-    │          via REST API                        │
  │   │   prod.yml        │               │                              │
  │   └──────────────────┘      ┌─────────┼──────────┐                  │
  │                             ↓         ↓          ↓                  │
  │                       ┌──────┐  ┌──────┐  ┌───────────┐            │
  │                       │Order │  │User  │  │Inventory  │            │
  │                       │Svc   │  │Svc   │  │Svc        │            │
  │                       └──────┘  └──────┘  └───────────┘            │
  │                       (Config Clients -- fetch on startup)          │
  └──────────────────────────────────────────────────────────────────────┘

  Config resolution order (per service):
  1. {application}-{profile}.yml  (e.g., order-service-prod.yml)
  2. {application}.yml            (e.g., order-service.yml)
  3. application-{profile}.yml    (shared, e.g., application-prod.yml)
  4. application.yml              (shared defaults)

  API: GET http://config-server:8888/order-service/prod
  Returns the merged configuration for order-service in the prod profile.

Dynamic Refresh

  With Spring Cloud Bus + RabbitMQ/Kafka, you can refresh configuration
  without restarting services:

  1. Push config change to Git
  2. Webhook triggers /actuator/busrefresh
  3. Message broadcast to all services via RabbitMQ
  4. Each service reloads @RefreshScope beans

  Git push → Webhook → Config Server → Bus → All Services refresh`,
    codeExamples: [
      {
        title: 'Config Server Setup',
        code: `// --- Config Server (separate Spring Boot app) ---

// pom.xml dependency
// <dependency>
//   <groupId>org.springframework.cloud</groupId>
//   <artifactId>spring-cloud-config-server</artifactId>
// </dependency>

@SpringBootApplication
@EnableConfigServer
public class ConfigServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
    }
}

// application.yml for config server
// server:
//   port: 8888
// spring:
//   cloud:
//     config:
//       server:
//         git:
//           uri: https://github.com/myorg/config-repo
//           default-label: main
//           search-paths: '{application}'
//           clone-on-start: true
//         encrypt:
//           enabled: true

// --- Config Client (every microservice) ---

// pom.xml dependency
// <dependency>
//   <groupId>org.springframework.cloud</groupId>
//   <artifactId>spring-cloud-starter-config</artifactId>
// </dependency>

// application.yml for config client
// spring:
//   application:
//     name: order-service
//   config:
//     import: configserver:http://config-server:8888
//   cloud:
//     config:
//       fail-fast: true
//       retry:
//         max-attempts: 5
//         initial-interval: 1000`,
        explanation: `The Config Server is a standalone Spring Boot app that serves configuration from a Git repository. @EnableConfigServer activates the REST API. Each client service sets spring.config.import to point to the config server and spring.application.name to identify which config files to fetch. fail-fast=true makes the service refuse to start if it can't reach the config server (better than running with wrong config). search-paths='{application}' lets you organize config files in per-service directories.`
      },
      {
        title: 'Dynamic Refresh with @RefreshScope',
        code: `// Beans with @RefreshScope are recreated when /actuator/refresh is called

@Service
@RefreshScope
public class PricingService {

    @Value("\${pricing.discount-percentage:0}")
    private double discountPercentage;

    @Value("\${pricing.tax-rate:0.18}")
    private double taxRate;

    public BigDecimal calculateFinalPrice(BigDecimal basePrice) {
        BigDecimal discounted = basePrice.multiply(
            BigDecimal.valueOf(1 - discountPercentage / 100));
        return discounted.multiply(BigDecimal.valueOf(1 + taxRate));
    }
}

// Or with @ConfigurationProperties (recommended)
@Configuration
@ConfigurationProperties(prefix = "pricing")
@RefreshScope
public class PricingProperties {
    private double discountPercentage;
    private double taxRate;
    private Map<String, Double> categoryMultipliers = new HashMap<>();
    // getters and setters
}

// To trigger refresh:
// POST http://order-service:8080/actuator/refresh
//   → Refreshes only this instance
//
// POST http://config-server:8888/actuator/busrefresh
//   → Refreshes ALL instances via message bus (needs Spring Cloud Bus)`,
        explanation: `@RefreshScope tells Spring to destroy and recreate the bean when a refresh event occurs. Without it, @Value fields are injected once at startup and never updated. When you POST to /actuator/refresh, Spring reloads the config from the config server and recreates all @RefreshScope beans. For multiple instances, use Spring Cloud Bus (RabbitMQ/Kafka) to broadcast the refresh to all instances at once. This lets you change feature flags, rate limits, or pricing without redeployment.`
      }
    ],
    bestPractices: [
      'Use Git as the config backend for versioning, audit trail, and pull request reviews on config changes',
      'Encrypt sensitive values using Spring Cloud Config encryption (or use HashiCorp Vault backend)',
      'Set fail-fast=true on clients so they don\'t start with wrong/missing configuration',
      'Use @ConfigurationProperties + @RefreshScope instead of scattered @Value annotations',
      'Organize config files by service name in the Git repo for clarity',
      'Test configuration changes in staging before applying to production'
    ],
    commonMistakes: [
      'Not encrypting secrets in the config repo -- Git history preserves plaintext forever',
      'Single config server without redundancy -- becomes a single point of failure',
      'Forgetting @RefreshScope on beans that need dynamic configuration updates',
      'Not setting spring.application.name -- the client won\'t know which config to fetch',
      'Storing environment-specific config in application.yml instead of application-{profile}.yml'
    ],
    interviewQuestions: [
      'What is Spring Cloud Config and what problem does it solve?',
      'How does the config resolution order work for a specific service and profile?',
      'How do you refresh configuration at runtime without restarting services?',
      'What is @RefreshScope and when do you need it?',
      'How do you handle secrets in Spring Cloud Config?',
      'What happens if the config server is down when a service starts?'
    ],
    resources: [
      { label: 'Spring Cloud Config Reference', url: 'https://docs.spring.io/spring-cloud-config/docs/current/reference/html/' },
      { label: 'Baeldung - Spring Cloud Config', url: 'https://www.baeldung.com/spring-cloud-configuration' },
      { label: 'Spring Cloud Bus', url: 'https://spring.io/projects/spring-cloud-bus' }
    ]
  },

  // ── API Docs ──────────────────────────────────────────────────────────
  {
    id: 'springdoc-openapi',
    title: 'Springdoc OpenAPI & Swagger',
    category: 'api-docs',
    order: 16,
    explanation:
      `What is OpenAPI / Swagger?

OpenAPI is a specification for describing REST APIs in a machine-readable format (JSON/YAML). Swagger UI is a tool that reads this spec and generates an interactive, browsable API documentation page. Springdoc is the library that auto-generates the OpenAPI spec from your Spring Boot code.

Why does it exist?

Without API documentation, frontend developers, QA, and external consumers have to read your source code or ask you to understand the API. OpenAPI provides a single source of truth that stays in sync with your code (because it's generated from annotations on your controllers).

How It Works

  Spring Boot App
  ├── @RestController with annotations
  │   (@Operation, @Parameter, @Schema, etc.)
  ↓
  Springdoc Library
  ├── Scans controllers, models, validation annotations
  ├── Generates OpenAPI 3.0 spec at /v3/api-docs
  └── Serves Swagger UI at /swagger-ui.html
  ↓
  Browser → Interactive API Documentation
  ├── Try out endpoints directly from the browser
  ├── See request/response schemas
  └── Authentication support (JWT, OAuth2)

  Add one dependency → get full API docs for free:
  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.x</version>
  </dependency>`,
    codeExamples: [
      {
        title: 'Annotated Controller with OpenAPI',
        code: `@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product management endpoints")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @Operation(
        summary = "List all products",
        description = "Returns a paginated list of products with optional filtering"
    )
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Products retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid pagination parameters")
    })
    @GetMapping
    public ResponseEntity<Page<ProductResponse>> list(
            @Parameter(description = "Page number (0-based)", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (max 100)", example = "20")
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(productService.list(PageRequest.of(page, Math.min(size, 100))));
    }

    @Operation(summary = "Create a new product")
    @ApiResponse(responseCode = "201", description = "Product created successfully")
    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }
}

// DTO with schema annotations
@Schema(description = "Request body for creating a product")
public record ProductRequest(
    @Schema(description = "Product name", example = "MacBook Pro", requiredMode = REQUIRED)
    @NotBlank String name,

    @Schema(description = "Price in USD", example = "1999.99", minimum = "0.01")
    @NotNull @Positive BigDecimal price,

    @Schema(description = "Available stock quantity", example = "50", minimum = "0")
    @Min(0) Integer stock
) {}`,
        explanation: `@Tag groups endpoints in the Swagger UI. @Operation adds summary and description to each endpoint. @ApiResponse documents the possible HTTP status codes. @Schema on DTO fields provides descriptions, examples, and constraints that appear in the Swagger UI model section. Bean Validation annotations (@NotBlank, @Positive, @Min) are automatically picked up by Springdoc and shown as constraints in the spec. The examples help frontend developers understand expected values without reading code.`
      },
      {
        title: 'OpenAPI Configuration with JWT Security',
        code: `@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Product Service API")
                .version("1.0.0")
                .description("REST API for managing products and inventory")
                .contact(new Contact()
                    .name("Engineering Team")
                    .email("engineering@myapp.com")))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
            .components(new Components()
                .addSecuritySchemes("Bearer Auth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Enter your JWT token")));
    }
}

// application.yml
// springdoc:
//   api-docs:
//     path: /v3/api-docs
//   swagger-ui:
//     path: /swagger-ui.html
//     operations-sorter: method
//     tags-sorter: alpha
//   default-produces-media-type: application/json`,
        explanation: `The OpenAPI configuration bean defines global API metadata (title, version, description) and security schemes. The JWT bearer scheme adds an "Authorize" button in Swagger UI where you can paste your token -- all subsequent "Try it out" requests include the token in the Authorization header. This makes Swagger UI fully functional for testing authenticated endpoints.`
      }
    ],
    bestPractices: [
      'Add @Schema annotations with descriptions and examples on all DTO fields',
      'Use @Tag to group related endpoints logically in the Swagger UI',
      'Document all possible response codes with @ApiResponse',
      'Disable Swagger UI in production: springdoc.swagger-ui.enabled=false',
      'Use the springdoc-openapi-starter-webmvc-ui dependency (not the old springfox library)',
      'Export the OpenAPI spec (/v3/api-docs) for API clients to generate SDKs'
    ],
    commonMistakes: [
      'Leaving Swagger UI enabled in production -- exposes your entire API surface to attackers',
      'Not providing examples in @Schema -- frontend devs have to guess the expected format',
      'Using springfox (deprecated) instead of springdoc for new Spring Boot 3.x projects',
      'Not documenting error responses -- consumers don\'t know what errors to handle',
      'Forgetting to add the security scheme -- can\'t test authenticated endpoints from Swagger UI'
    ],
    interviewQuestions: [
      'What is OpenAPI? How does it differ from Swagger?',
      'How does Springdoc generate API documentation from your code?',
      'How do you secure Swagger UI in production?',
      'How do you add JWT authentication support to Swagger UI?',
      'What is the difference between springfox and springdoc?'
    ],
    resources: [
      { label: 'Springdoc OpenAPI', url: 'https://springdoc.org/' },
      { label: 'OpenAPI 3.0 Specification', url: 'https://swagger.io/specification/' },
      { label: 'Baeldung - Springdoc', url: 'https://www.baeldung.com/spring-rest-openapi-documentation' }
    ]
  },

  // ── Rate Limiting ─────────────────────────────────────────────────────
  {
    id: 'bucket4j-rate-limiting',
    title: 'Rate Limiting with Bucket4j + Hazelcast',
    category: 'rate-limiting',
    order: 17,
    explanation:
      `What is Rate Limiting?

Rate limiting controls how many requests a client can make to your API within a time window. It protects your backend from abuse, DDoS attacks, and accidental overload.

Why does it exist?

Without rate limiting:
- A single misbehaving client can overload your server
- Brute-force attacks can try millions of passwords
- Web scraping bots can consume all your resources
- Accidental infinite loops in client code can bring down your API

Token Bucket Algorithm (How Bucket4j Works)

  Imagine a bucket that holds a fixed number of tokens (e.g., 10).

  Bucket (capacity: 10 tokens)
  ┌──────────────────────────┐
  │ ■ ■ ■ ■ ■ ■ ■ □ □ □      │  ← 7 tokens available
  └──────────────────────────┘

  Each request consumes 1 token:
  ┌──────────────────────────┐
  │ ■ ■ ■ ■ ■ ■ □ □ □ □      │  ← 6 tokens left
  └──────────────────────────┘

  Tokens are refilled at a steady rate (e.g., 1 token every 100ms):
  ┌──────────────────────────┐
  │ ■ ■ ■ ■ ■ ■ ■ □ □ □      │  ← refilled to 7
  └──────────────────────────┘

  If the bucket is empty:
  ┌──────────────────────────┐
  │ □ □ □ □ □ □ □ □ □ □      │  ← 0 tokens
  └──────────────────────────┘
  → Request REJECTED → HTTP 429 Too Many Requests

  The bucket NEVER exceeds capacity, even if the client is idle.
  This allows bursts (use all 10 tokens quickly) while enforcing an average rate.

Distributed Rate Limiting with Hazelcast

  In a multi-instance deployment, rate limits must be shared across instances.
  Otherwise, a client hitting 3 instances gets 3x the allowed rate.

  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │ Instance1│    │ Instance2│    │ Instance3│
  └────┬─────┘    └────┬─────┘    └────┬─────┘
       └──────────────┼──────────────┘
                      ↓
              ┌───────────────┐
              │   Hazelcast   │ ← shared distributed map
              │  (embedded or │   stores token buckets
              │   standalone) │   per client API key
              └───────────────┘

  All instances read/write the SAME bucket for a given client.

  Alternative backends: Redis (Redisson), in-memory (single instance only).`,
    codeExamples: [
      {
        title: 'Bucket4j Rate Limiting Filter',
        code: `@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String clientKey = resolveClientKey(request);
        ConsumptionProbe probe = rateLimitService.tryConsume(clientKey);

        // Add rate limit headers (standard convention)
        response.setHeader("X-Rate-Limit-Remaining",
            String.valueOf(probe.getRemainingTokens()));

        if (!probe.isConsumed()) {
            long waitSeconds = probe.getNanosToWaitForRefill() / 1_000_000_000;
            response.setHeader("X-Rate-Limit-Retry-After-Seconds",
                String.valueOf(waitSeconds));
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write(
                "{\\"error\\":\\"Rate limit exceeded\\",\\"retryAfter\\":" + waitSeconds + "}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String resolveClientKey(HttpServletRequest request) {
        // Priority: API key → authenticated user → IP address
        String apiKey = request.getHeader("X-API-Key");
        if (apiKey != null) return "api:" + apiKey;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) return "user:" + auth.getName();

        return "ip:" + request.getRemoteAddr();
    }
}

@Service
public class RateLimitService {
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    // Default: 20 requests per minute
    private final Bandwidth defaultLimit = Bandwidth.classic(
        20, Refill.greedy(20, Duration.ofMinutes(1)));

    public ConsumptionProbe tryConsume(String clientKey) {
        Bucket bucket = buckets.computeIfAbsent(clientKey,
            k -> Bucket.builder().addLimit(defaultLimit).build());
        return bucket.tryConsumeAndReturnRemaining(1);
    }
}`,
        explanation: `The filter intercepts every request, identifies the client (by API key, user, or IP), and checks if they have remaining tokens. ConsumptionProbe tells us if the token was consumed and how many remain. Standard X-Rate-Limit headers inform the client of their quota status. If the bucket is empty, we return 429 with a Retry-After hint. computeIfAbsent ensures each client gets their own bucket, created lazily on first request.`
      },
      {
        title: 'Distributed Bucket4j with Hazelcast',
        code: `// build.gradle / pom.xml
// implementation 'com.bucket4j:bucket4j-hazelcast'
// implementation 'com.hazelcast:hazelcast-spring'

@Configuration
public class HazelcastConfig {
    @Bean
    public HazelcastInstance hazelcastInstance() {
        Config config = new Config();
        config.setClusterName("rate-limit-cluster");

        // Map configuration for bucket storage
        MapConfig mapConfig = new MapConfig("rate-limit-buckets");
        mapConfig.setTimeToLiveSeconds(3600);  // evict idle buckets after 1h
        config.addMapConfig(mapConfig);

        return Hazelcast.newHazelcastInstance(config);
    }
}

@Service
@RequiredArgsConstructor
public class DistributedRateLimitService {
    private final HazelcastInstance hazelcast;

    private final BucketConfiguration defaultConfig = BucketConfiguration.builder()
        .addLimit(Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1))))
        .addLimit(Bandwidth.classic(10, Refill.greedy(10, Duration.ofSeconds(1))))
        .build();

    public ConsumptionProbe tryConsume(String clientKey) {
        IMap<String, byte[]> map = hazelcast.getMap("rate-limit-buckets");
        HazelcastProxyManager<String> proxyManager =
            new HazelcastProxyManager<>(map);

        BucketProxy bucket = proxyManager.builder()
            .build(clientKey, () -> defaultConfig);

        return bucket.tryConsumeAndReturnRemaining(1);
    }
}`,
        explanation: `This setup uses Hazelcast as a distributed backend for Bucket4j. All application instances share the same Hazelcast cluster, so a client's token bucket is consistent regardless of which instance handles the request. Two bandwidth limits are defined: a sustained limit (100/min) and a burst limit (10/sec). The burst limit prevents a client from dumping all 100 requests in 1 second. HazelcastProxyManager handles serialization and distributed synchronization of bucket state. TTL of 1 hour evicts buckets for inactive clients to prevent memory leaks.`
      }
    ],
    bestPractices: [
      'Use multiple bandwidth limits: a sustained rate (per minute) AND a burst rate (per second)',
      'Include X-Rate-Limit-Remaining and Retry-After headers in responses',
      'Use distributed storage (Hazelcast/Redis) in multi-instance deployments',
      'Implement different rate limits per tier (free: 100/hr, pro: 10000/hr)',
      'Rate limit by API key or authenticated user, not just IP (NAT can share IPs)',
      'Set TTL on bucket entries to prevent memory leaks from inactive clients'
    ],
    commonMistakes: [
      'Using in-memory rate limiting with multiple instances -- clients get N times the limit',
      'Rate limiting only by IP address -- all users behind the same corporate NAT share a limit',
      'Not returning rate limit headers -- clients can\'t implement backoff',
      'Setting the limit too low and blocking legitimate traffic',
      'Not whitelisting health check endpoints from rate limiting'
    ],
    interviewQuestions: [
      'What is the token bucket algorithm? How does it differ from fixed window?',
      'How do you implement rate limiting in a distributed system?',
      'What HTTP status code should you return when rate limit is exceeded?',
      'How do you handle rate limiting when your application has multiple instances?',
      'What headers should you include in rate-limited responses?'
    ],
    resources: [
      { label: 'Bucket4j GitHub', url: 'https://github.com/bucket4j/bucket4j' },
      { label: 'Baeldung - Rate Limiting Spring Boot', url: 'https://www.baeldung.com/spring-bucket4j' },
      { label: 'Token Bucket Algorithm', url: 'https://en.wikipedia.org/wiki/Token_bucket' }
    ]
  },

  // ── Validation ────────────────────────────────────────────────────────
  {
    id: 'bean-validation',
    title: 'Bean Validation & Custom Validators',
    category: 'validation',
    order: 18,
    explanation:
      `What is Bean Validation?

Bean Validation (JSR 380) is a Java standard for declarative validation using annotations. Instead of writing if-else checks in your service layer, you annotate fields with constraints like @NotBlank, @Email, @Size, and the framework validates automatically.

Why does it exist?

Validation logic is repetitive and error-prone. Without a framework:
  if (name == null || name.trim().isEmpty()) throw ...
  if (email == null || !email.matches("...")) throw ...
  if (age < 0 || age > 150) throw ...

With Bean Validation:
  @NotBlank String name;
  @Email String email;
  @Min(0) @Max(150) int age;

The framework handles the checking, error message formatting, and integration with Spring MVC.

How It Works in Spring Boot

  HTTP Request (JSON body)
      ↓
  @Valid @RequestBody CreateUserRequest request
      ↓
  Hibernate Validator (Bean Validation implementation)
  ├── Checks each annotated field
  ├── Collects ALL violations (not just the first)
  └── If violations found → throws MethodArgumentNotValidException
      ↓
  @ControllerAdvice catches it → returns 400 with field-level errors

Built-in Constraints

  ┌─────────────────────┬──────────────────────────────────────────┐
  │ Annotation          │ Validates                                │
  ├─────────────────────┼──────────────────────────────────────────┤
  │ @NotNull            │ Not null (empty string is OK)             │
  │ @NotEmpty           │ Not null AND not empty (size > 0)         │
  │ @NotBlank           │ Not null, not empty, not just whitespace  │
  │ @Size(min, max)     │ String length or collection size          │
  │ @Min / @Max         │ Numeric minimum/maximum                   │
  │ @Positive           │ Greater than 0                            │
  │ @Email              │ Valid email format                        │
  │ @Pattern(regexp)    │ Matches regex                             │
  │ @Past / @Future     │ Date in the past/future                   │
  │ @Valid              │ Cascade validation to nested objects       │
  └─────────────────────┴──────────────────────────────────────────┘

  @NotNull vs @NotEmpty vs @NotBlank:
  - @NotNull:  "abc" ✓  "" ✓  "   " ✓  null ✗
  - @NotEmpty: "abc" ✓  "" ✗  "   " ✓  null ✗
  - @NotBlank: "abc" ✓  "" ✗  "   " ✗  null ✗  (use this for strings)`,
    codeExamples: [
      {
        title: 'Request Validation with Nested Objects',
        code: `public record CreateOrderRequest(
    @NotBlank(message = "Customer name is required")
    String customerName,

    @NotBlank @Email(message = "Valid email is required")
    String customerEmail,

    @NotNull(message = "Shipping address is required")
    @Valid  // cascade validation to nested object
    AddressRequest shippingAddress,

    @NotEmpty(message = "At least one item is required")
    @Size(max = 50, message = "Maximum 50 items per order")
    List<@Valid OrderItemRequest> items  // validate each item in the list
) {}

public record AddressRequest(
    @NotBlank String street,
    @NotBlank String city,
    @NotBlank @Size(min = 5, max = 10) String zipCode,
    @NotBlank @Pattern(regexp = "^[A-Z]{2}$", message = "State must be 2 uppercase letters")
    String state
) {}

public record OrderItemRequest(
    @NotNull Long productId,
    @NotNull @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 1000, message = "Quantity cannot exceed 1000")
    Integer quantity
) {}

// Controller -- @Valid triggers validation
@PostMapping("/orders")
public ResponseEntity<OrderResponse> create(
        @Valid @RequestBody CreateOrderRequest request) {
    // If validation fails, MethodArgumentNotValidException is thrown
    // before this method even executes
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(orderService.create(request));
}`,
        explanation: `@Valid on the shippingAddress field triggers nested validation -- without it, only the top-level fields are checked. List<@Valid OrderItemRequest> validates each item in the list individually. The message parameter provides custom error messages that are returned to the client. Notice how validation is purely declarative -- no if-else logic in the controller. If any constraint fails, Spring throws MethodArgumentNotValidException before the method body executes, which your @ControllerAdvice catches and formats into a 400 response.`
      },
      {
        title: 'Custom Validator Annotation',
        code: `// Step 1: Define the annotation
@Documented
@Constraint(validatedBy = UniqueEmailValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueEmail {
    String message() default "Email already registered";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Step 2: Implement the validator
@Component
@RequiredArgsConstructor
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    private final UserRepository userRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true;  // let @NotNull handle null check
        return !userRepository.existsByEmail(email);
    }
}

// Step 3: Use it on a DTO field
public record RegisterRequest(
    @NotBlank String name,
    @NotBlank @Email @UniqueEmail String email,  // custom + built-in combined
    @NotBlank @Size(min = 8) String password
) {}

// --- Cross-field validation (class-level) ---
@Documented
@Constraint(validatedBy = PasswordMatchValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PasswordMatch {
    String message() default "Passwords do not match";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

@Component
public class PasswordMatchValidator implements ConstraintValidator<PasswordMatch, RegisterRequest> {
    @Override
    public boolean isValid(RegisterRequest req, ConstraintValidatorContext ctx) {
        if (req.password() == null || req.confirmPassword() == null) return true;
        return req.password().equals(req.confirmPassword());
    }
}`,
        explanation: `Custom validators let you encapsulate complex validation logic (database lookups, cross-field checks) behind a simple annotation. The three-step pattern is always the same: (1) define the annotation with @Constraint, (2) implement ConstraintValidator<AnnotationType, FieldType>, (3) use the annotation on fields or classes. The validator is a Spring @Component, so you can inject repositories or services. Returning true for null values follows the convention -- let @NotNull handle nullability separately. Class-level annotations (@PasswordMatch on the record) enable cross-field validation.`
      }
    ],
    bestPractices: [
      'Use @NotBlank for strings (not @NotNull or @NotEmpty) -- it handles null, empty, and whitespace',
      'Always use @Valid on nested objects and collections to cascade validation',
      'Provide custom error messages: @NotBlank(message = "Name is required")',
      'Handle MethodArgumentNotValidException in @ControllerAdvice for consistent error responses',
      'Create custom validator annotations for business rules (unique email, valid date range)',
      'Validate at the API layer (DTOs) -- don\'t rely on database constraints as the only validation'
    ],
    commonMistakes: [
      'Forgetting @Valid on @RequestBody -- validation annotations are present but never triggered',
      'Using @NotNull on a String instead of @NotBlank -- allows empty strings',
      'Not cascading validation with @Valid on nested objects -- nested fields are not checked',
      'Putting validation logic in the service layer when declarative annotations would suffice',
      'Not handling MethodArgumentNotValidException -- clients get a 500 instead of a useful 400'
    ],
    interviewQuestions: [
      'What is Bean Validation (JSR 380)? How does it integrate with Spring?',
      'What is the difference between @NotNull, @NotEmpty, and @NotBlank?',
      'How do you create a custom validation annotation?',
      'How do you validate nested objects in a request body?',
      'How do you handle validation errors in a Spring REST controller?',
      'Can you do cross-field validation (e.g., confirm password matches password)?'
    ],
    resources: [
      { label: 'Jakarta Bean Validation', url: 'https://beanvalidation.org/' },
      { label: 'Baeldung - Validation in Spring Boot', url: 'https://www.baeldung.com/spring-boot-bean-validation' },
      { label: 'Baeldung - Custom Validators', url: 'https://www.baeldung.com/spring-mvc-custom-validator' }
    ]
  },

  // ── Tooling ───────────────────────────────────────────────────────────
  {
    id: 'lombok',
    title: 'Lombok',
    category: 'tooling',
    order: 19,
    explanation:
      `What is Lombok?

Project Lombok is a Java library that generates boilerplate code at compile time using annotations. It eliminates getters, setters, constructors, toString(), equals(), hashCode(), loggers, and builder patterns from your source code.

Why does it exist?

A typical Java POJO with 10 fields requires ~100 lines of getters, setters, equals, hashCode, toString, and constructors. Lombok reduces this to ~15 lines. Less boilerplate = fewer bugs, easier code review, and clearer intent.

How It Works

  Source code (with Lombok annotations)
      ↓ javac annotation processing (compile time)
  Lombok processor modifies the AST (Abstract Syntax Tree)
      ↓
  Bytecode (.class files) contains generated methods
      ↓
  IDE plugin shows generated methods in autocomplete

  Lombok does NOT run at runtime. It only generates code at compile time.
  The compiled .class file is identical to hand-written code.

Most Used Annotations

  ┌─────────────────────────┬──────────────────────────────────────────────┐
  │ Annotation              │ Generates                                    │
  ├─────────────────────────┼──────────────────────────────────────────────┤
  │ @Getter / @Setter       │ Getter/setter for each field                 │
  │ @ToString               │ toString() with all fields                   │
  │ @EqualsAndHashCode      │ equals() and hashCode()                      │
  │ @NoArgsConstructor      │ No-argument constructor                      │
  │ @AllArgsConstructor     │ Constructor with all fields                   │
  │ @RequiredArgsConstructor│ Constructor with final + @NonNull fields      │
  │ @Data                   │ @Getter + @Setter + @ToString +              │
  │                         │ @EqualsAndHashCode + @RequiredArgsConstructor │
  │ @Value                  │ Immutable @Data (final fields, no setters)    │
  │ @Builder                │ Builder pattern                               │
  │ @Slf4j / @Log           │ Logger field: private static final Logger log│
  │ @With                   │ withField() methods for immutable objects     │
  └─────────────────────────┴──────────────────────────────────────────────┘`,
    codeExamples: [
      {
        title: 'Common Lombok Usage Patterns',
        code: `// --- JPA Entity with Lombok ---
@Entity
@Table(name = "employees")
@Getter @Setter
@NoArgsConstructor            // JPA requires no-arg constructor
@AllArgsConstructor
@ToString(exclude = "password")  // exclude sensitive fields from toString
@EqualsAndHashCode(of = "id")   // use only id for equals/hashCode
public class Employee {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private BigDecimal salary;
}

// --- Immutable DTO with Builder ---
@Value   // makes all fields private final, generates getters, equals, hashCode, toString
@Builder // generates Employee.builder().name("Alice").email("...").build()
public class EmployeeResponse {
    Long id;
    String name;
    String email;
    BigDecimal salary;
    LocalDateTime createdAt;
}

// Usage:
EmployeeResponse response = EmployeeResponse.builder()
    .id(1L)
    .name("Alice")
    .email("alice@example.com")
    .salary(new BigDecimal("85000"))
    .createdAt(LocalDateTime.now())
    .build();

// --- Service with constructor injection ---
@Service
@RequiredArgsConstructor  // generates constructor for final fields
@Slf4j                    // generates: private static final Logger log = ...
public class EmployeeService {
    private final EmployeeRepository employeeRepository;  // injected via constructor
    private final PasswordEncoder passwordEncoder;         // injected via constructor

    public EmployeeResponse create(CreateEmployeeRequest request) {
        log.info("Creating employee: {}", request.name());
        // ... business logic
    }
}`,
        explanation: `@Getter/@Setter on an entity is preferred over @Data because @Data generates equals/hashCode using ALL fields -- dangerous for JPA entities (lazy-loaded collections cause issues). Instead, use @EqualsAndHashCode(of = "id") to compare only by primary key. @ToString(exclude) prevents sensitive data from appearing in logs. @Value creates an immutable class (all fields final, no setters) -- perfect for DTOs. @RequiredArgsConstructor + final fields is the idiomatic way to do constructor injection in Spring. @Slf4j saves you from writing the Logger boilerplate in every class.`
      }
    ],
    bestPractices: [
      'Prefer @Getter/@Setter over @Data on JPA entities -- @Data generates unsafe equals/hashCode',
      'Use @EqualsAndHashCode(of = "id") on entities -- compare by business key, not all fields',
      'Use @ToString(exclude = {"password", "secretKey"}) to keep sensitive data out of logs',
      'Use @Value + @Builder for immutable DTOs',
      'Use @RequiredArgsConstructor for Spring dependency injection (final fields)',
      'Always install the Lombok IDE plugin -- without it, your IDE shows compilation errors'
    ],
    commonMistakes: [
      'Using @Data on JPA entities -- generates equals/hashCode with ALL fields including lazy collections',
      'Forgetting @NoArgsConstructor on JPA entities -- Hibernate requires it',
      'Using @Builder without @NoArgsConstructor on entities -- Jackson deserialization fails',
      'Not excluding sensitive fields from @ToString -- passwords end up in log files',
      'Over-using Lombok -- @Setter on every field defeats encapsulation; prefer immutable objects',
      'Forgetting to install the Lombok IDE plugin -- IDE shows errors even though compilation works'
    ],
    interviewQuestions: [
      'What is Lombok and how does it work under the hood?',
      'What is the difference between @Data and @Value?',
      'Why shouldn\'t you use @Data on JPA entities?',
      'How does @RequiredArgsConstructor enable constructor injection?',
      'What does @Builder generate? How would you use it?',
      'What are the risks of using Lombok?'
    ],
    resources: [
      { label: 'Project Lombok', url: 'https://projectlombok.org/' },
      { label: 'Baeldung - Lombok', url: 'https://www.baeldung.com/intro-to-project-lombok' },
      { label: 'Lombok Features', url: 'https://projectlombok.org/features/' }
    ]
  },

  {
    id: 'java-testing',
    title: 'Testing in Spring Boot',
    category: 'tooling',
    order: 20,
    explanation:
      `What is Testing in Spring Boot?

Testing ensures your code works correctly and continues to work as you make changes. Spring Boot provides a rich testing framework built on JUnit 5, Mockito, and Spring Test.

Why does it matter?

Without tests:
- Every code change is a gamble (did I break something?)
- Bugs reach production and cost 10x more to fix
- Refactoring is terrifying (no safety net)
- "It works on my machine" becomes a daily problem

The Test Pyramid

  A healthy test suite follows the pyramid shape:

         /\\
        /  \\
       / E2E\\          Few: Slow, expensive, brittle
      /──────\\         Full application + browser/API tests
     /  Integ. \\       Moderate: Test layers working together
    /────────────\\     @SpringBootTest, @DataJpaTest, Testcontainers
   /  Unit Tests  \\    Many: Fast, isolated, cheap
  /────────────────\\   Plain JUnit + Mockito, no Spring context
  ──────────────────

  Invest most in unit tests (fast feedback), use integration tests
  for critical paths, and keep E2E tests minimal.

Types of Tests in Spring Boot

  ┌───────────────────┬──────────────────────────────────────────────────────┐
  │ Type              │ What It Tests                                        │
  ├───────────────────┼──────────────────────────────────────────────────────┤
  │ Unit Test         │ Single class in isolation (mock dependencies)         │
  │ Slice Test        │ One layer: @WebMvcTest (controller),                  │
  │                   │ @DataJpaTest (repository), @JsonTest (serialization)  │
  │ Integration Test  │ Multiple layers together with real Spring context     │
  │ @SpringBootTest   │ Full application context (closest to production)      │
  └───────────────────┴──────────────────────────────────────────────────────┘

  Speed: Unit > Slice > Integration > @SpringBootTest

Mockito Essentials

  Mockito creates fake ("mock") objects so you can test a class without its real dependencies.

  when(mockRepo.findById(1L)).thenReturn(Optional.of(product));
  → "When someone calls findById(1L) on this mock, return this product"

  verify(mockRepo, times(1)).save(any(Product.class));
  → "Assert that save() was called exactly once with any Product"

  given() / when() / then() pattern:
    GIVEN: Set up mocks and test data
    WHEN:  Call the method under test
    THEN:  Assert the result and verify interactions`,
    codeExamples: [
      {
        title: 'Unit Test with Mockito',
        code: `@ExtendWith(MockitoExtension.class)  // no Spring context -- fast!
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryClient inventoryClient;

    @InjectMocks  // creates ProductService and injects mocks
    private ProductService productService;

    @Test
    @DisplayName("Should return product when found by ID")
    void getById_whenProductExists_returnsProduct() {
        // GIVEN
        Product product = new Product(1L, "Laptop", new BigDecimal("999.99"), 50);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // WHEN
        ProductResponse result = productService.getById(1L);

        // THEN
        assertThat(result.name()).isEqualTo("Laptop");
        assertThat(result.price()).isEqualByComparingTo("999.99");
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Should throw when product not found")
    void getById_whenProductNotFound_throwsException() {
        // GIVEN
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        // WHEN + THEN
        assertThatThrownBy(() -> productService.getById(99L))
            .isInstanceOf(ResourceNotFoundException.class)
            .hasMessageContaining("99");
    }

    @Test
    @DisplayName("Should create product and check inventory")
    void create_withValidRequest_savesAndReturnsProduct() {
        // GIVEN
        CreateProductRequest request = new CreateProductRequest("Phone", new BigDecimal("499"), 100);
        when(productRepository.save(any(Product.class)))
            .thenAnswer(invocation -> {
                Product saved = invocation.getArgument(0);
                saved.setId(1L);  // simulate DB generating ID
                return saved;
            });

        // WHEN
        ProductResponse result = productService.create(request);

        // THEN
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("Phone");
        verify(productRepository).save(any(Product.class));
        verify(inventoryClient).initializeStock(eq(1L), eq(100));
    }
}`,
        explanation: `@ExtendWith(MockitoExtension.class) runs with Mockito (no Spring context = fast). @Mock creates a mock object, @InjectMocks creates the real service and injects the mocks. Each test follows the GIVEN-WHEN-THEN pattern for clarity. assertThat() (AssertJ) provides fluent, readable assertions. verify() checks that the mock was called with expected arguments. The thenAnswer() variant lets you modify the argument (simulating database ID generation). These tests run in milliseconds because there's no Spring context, no database, no network.`
      },
      {
        title: 'Slice Tests -- @WebMvcTest and @DataJpaTest',
        code: `// --- Controller Slice Test (loads only web layer) ---
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean  // Spring-managed mock (replaces real bean in context)
    private ProductService productService;

    @Test
    void listProducts_returnsOk() throws Exception {
        when(productService.list(any())).thenReturn(Page.empty());

        mockMvc.perform(get("/api/products")
                .param("page", "0")
                .param("size", "20"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void createProduct_withInvalidBody_returns400() throws Exception {
        String invalidJson = "{\\"name\\":\\"\\",\\"price\\":-1}";

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldErrors.name").exists())
            .andExpect(jsonPath("$.fieldErrors.price").exists());
    }
}

// --- Repository Slice Test (loads only JPA layer + embedded DB) ---
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProductRepositoryTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
        .withDatabaseName("testdb");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
    }

    @Autowired
    private ProductRepository productRepository;

    @Test
    void findByPriceLessThan_returnsMatchingProducts() {
        productRepository.save(new Product(null, "Cheap", new BigDecimal("10"), 5));
        productRepository.save(new Product(null, "Expensive", new BigDecimal("1000"), 2));

        List<Product> results = productRepository.findByPriceLessThan(new BigDecimal("100"));

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getName()).isEqualTo("Cheap");
    }
}`,
        explanation: `@WebMvcTest loads ONLY the web layer (controller + filters + exception handlers) -- the service is mocked. This is perfect for testing HTTP concerns: status codes, validation, JSON serialization. MockMvc simulates HTTP requests without starting a real server. @DataJpaTest loads ONLY the JPA layer with an embedded or containerized database. Testcontainers spins up a real MySQL in Docker, so your tests run against the same database engine as production. @DynamicPropertySource wires the container's random port into Spring's datasource config.`
      }
    ],
    bestPractices: [
      'Follow the test pyramid: many unit tests, some slice tests, few integration tests',
      'Use @ExtendWith(MockitoExtension.class) for unit tests (no Spring context = fast)',
      'Use @WebMvcTest for controller tests, @DataJpaTest for repository tests',
      'Use Testcontainers for integration tests with real databases',
      'Name tests descriptively: methodName_whenCondition_expectedBehavior',
      'Test edge cases: null inputs, empty collections, boundary values, error scenarios',
      'Use AssertJ (assertThat) instead of JUnit\'s assertEquals -- much more readable'
    ],
    commonMistakes: [
      'Using @SpringBootTest for everything -- loads the entire context, making tests slow',
      'Not mocking external dependencies in unit tests -- tests become flaky and slow',
      'Testing implementation details instead of behavior -- tests break on refactoring',
      'Writing tests that depend on execution order -- each test should be independent',
      'Skipping error case tests -- only testing the happy path',
      'Using @MockBean in unit tests (it\'s for Spring context) instead of @Mock (Mockito)'
    ],
    interviewQuestions: [
      'What is the test pyramid? Why is it shaped that way?',
      'What is the difference between @Mock and @MockBean?',
      'How does @WebMvcTest differ from @SpringBootTest?',
      'What is Testcontainers and why would you use it?',
      'How do you test a REST controller in Spring Boot?',
      'What is the difference between unit tests and integration tests?',
      'How do you mock a repository in a service test?',
      'What is the GIVEN-WHEN-THEN pattern?'
    ],
    resources: [
      { label: 'Spring Boot Testing Guide', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing' },
      { label: 'Baeldung - Testing in Spring Boot', url: 'https://www.baeldung.com/spring-boot-testing' },
      { label: 'Testcontainers', url: 'https://testcontainers.com/' }
    ]
  },

  {
    id: 'spring-boot-production',
    title: 'Production Readiness',
    category: 'tooling',
    order: 21,
    explanation:
      `What is Production Readiness?

Production readiness means your application is prepared to handle real traffic reliably. It includes health checks, monitoring, structured logging, graceful shutdown, and observability -- the things that keep your app running at 3 AM without paging you.

Why does it matter?

A local demo app and a production-grade app are fundamentally different. In production:
- Your app runs 24/7 across multiple instances
- Load balancers need to know if an instance is healthy
- You need to diagnose issues WITHOUT accessing the server
- Deployments must not drop in-flight requests
- You need metrics to answer: "Is it slow? Where? Why?"

Spring Boot Actuator

  Actuator provides production-ready endpoints out of the box:

  ┌──────────────────────────┬────────────────────────────────────────────┐
  │ Endpoint                 │ Purpose                                    │
  ├──────────────────────────┼────────────────────────────────────────────┤
  │ /actuator/health         │ Application health (UP/DOWN)               │
  │ /actuator/health/liveness│ Is the app running? (Kubernetes probe)     │
  │ /actuator/health/readiness│ Can it serve traffic? (Kubernetes probe)  │
  │ /actuator/info           │ Build info, git commit, custom details     │
  │ /actuator/metrics        │ JVM memory, CPU, HTTP request stats        │
  │ /actuator/prometheus     │ Metrics in Prometheus scrape format        │
  │ /actuator/env            │ Environment properties (REDACT in prod!)   │
  │ /actuator/loggers        │ View/change log levels at runtime          │
  └──────────────────────────┴────────────────────────────────────────────┘

Monitoring Stack

  Your App (Micrometer metrics)
      ↓ /actuator/prometheus
  Prometheus (scrapes metrics every 15s)
      ↓
  Grafana (dashboards and alerting)

  Structured Logging (JSON):
  Your App (logback-spring.xml → JSON format)
      ↓
  Filebeat / Fluentd (ships logs)
      ↓
  Elasticsearch → Kibana (search and visualize logs)

Graceful Shutdown

  Without graceful shutdown:
  ┌──────────────────┐
  │  SIGTERM received │
  │  → App killed     │  In-flight requests get 502!
  └──────────────────┘

  With graceful shutdown:
  ┌──────────────────────────┐
  │  SIGTERM received         │
  │  → Stop accepting new req │
  │  → Wait for in-flight     │
  │    requests to complete   │
  │  → Shutdown (max 30s)     │
  └──────────────────────────┘

  server.shutdown=graceful
  spring.lifecycle.timeout-per-shutdown-phase=30s`,
    codeExamples: [
      {
        title: 'Actuator Configuration and Custom Health Indicator',
        code: `# application-prod.yml
management:
  endpoints:
    web:
      exposure:
        include: health, info, prometheus, loggers
      base-path: /actuator
  endpoint:
    health:
      show-details: when-authorized  # don't expose details publicly
      probes:
        enabled: true  # /health/liveness and /health/readiness
    loggers:
      enabled: true    # change log levels at runtime without restart
  metrics:
    tags:
      application: order-service  # tag all metrics with app name
  prometheus:
    metrics:
      export:
        enabled: true

server:
  shutdown: graceful

spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s

---
// Custom Health Indicator
@Component
public class DatabaseHealthIndicator implements HealthIndicator {

    private final DataSource dataSource;

    public DatabaseHealthIndicator(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public Health health() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                return Health.up()
                    .withDetail("database", "MySQL")
                    .withDetail("connectionPool", "active")
                    .build();
            }
        } catch (SQLException e) {
            return Health.down()
                .withDetail("error", e.getMessage())
                .build();
        }
        return Health.down().build();
    }
}`,
        explanation: `The actuator config exposes only safe endpoints in production. show-details=when-authorized prevents leaking internal details to anonymous users. Kubernetes probes (liveness/readiness) let the orchestrator automatically restart unhealthy pods or stop routing traffic to them. The custom health indicator checks actual database connectivity -- the default one only checks if the DataSource bean exists. Graceful shutdown gives in-flight requests up to 30 seconds to complete before the JVM exits.`
      },
      {
        title: 'Structured Logging and Custom Metrics',
        code: `// --- Structured logging with logback-spring.xml ---
// <configuration>
//   <springProfile name="prod">
//     <appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">
//       <encoder class="net.logstash.logback.encoder.LogstashEncoder">
//         <includeMdcKeyName>traceId</includeMdcKeyName>
//         <includeMdcKeyName>userId</includeMdcKeyName>
//       </encoder>
//     </appender>
//     <root level="INFO">
//       <appender-ref ref="JSON" />
//     </root>
//   </springProfile>
// </configuration>
//
// Output:
// {"timestamp":"2025-01-15T10:30:00","level":"INFO","logger":"OrderService",
//  "message":"Order placed","orderId":123,"traceId":"abc-def","userId":"user42"}

// --- Custom Metrics with Micrometer ---
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final MeterRegistry meterRegistry;  // inject Micrometer registry

    // Counter: How many orders were placed?
    public Order placeOrder(CreateOrderRequest request) {
        Order order = createAndSave(request);
        meterRegistry.counter("orders.placed",
            "status", order.getStatus().name(),
            "region", request.region()
        ).increment();
        return order;
    }

    // Timer: How long does order processing take?
    public void processOrder(Long orderId) {
        Timer.Sample sample = Timer.start(meterRegistry);
        try {
            // ... processing logic
        } finally {
            sample.stop(meterRegistry.timer("orders.processing.duration",
                "orderId", String.valueOf(orderId)));
        }
    }

    // Gauge: How many orders are pending?
    @PostConstruct
    public void registerGauges() {
        Gauge.builder("orders.pending.count", orderRepository,
            repo -> repo.countByStatus(OrderStatus.PENDING))
            .register(meterRegistry);
    }
}`,
        explanation: `Structured logging (JSON) enables searching and filtering in log aggregation tools (ELK, Splunk). MDC keys (traceId, userId) add context to every log entry without passing them explicitly. Custom metrics with Micrometer feed into Prometheus/Grafana: counters track totals (orders placed), timers track duration (processing time), and gauges track current values (pending orders). Tags like "status" and "region" enable slicing metrics in dashboards: "Show me orders.placed where status=FAILED and region=US".`
      }
    ],
    bestPractices: [
      'Enable graceful shutdown in production to avoid dropping in-flight requests',
      'Expose only necessary actuator endpoints (health, prometheus, loggers)',
      'Use structured JSON logging in production for log aggregation tools',
      'Add custom health indicators for critical dependencies (database, message queue, external APIs)',
      'Use Micrometer counters, timers, and gauges for business metrics',
      'Set up alerts on key metrics: error rate > 1%, p99 latency > 500ms, health DOWN',
      'Use MDC (Mapped Diagnostic Context) to add traceId/userId to all log entries'
    ],
    commonMistakes: [
      'Exposing all actuator endpoints publicly -- /env, /configprops, /beans leak sensitive information',
      'Not enabling graceful shutdown -- deployments cause 502 errors for in-flight requests',
      'Using System.out.println instead of a logging framework in production',
      'Not monitoring GC pauses, connection pool exhaustion, or thread pool saturation',
      'Logging sensitive data (passwords, tokens, PII) -- redact before logging',
      'Not setting up health checks for Kubernetes -- failed pods aren\'t restarted'
    ],
    interviewQuestions: [
      'What is Spring Boot Actuator? What endpoints does it provide?',
      'What is the difference between liveness and readiness probes?',
      'How do you implement custom health indicators?',
      'How does graceful shutdown work in Spring Boot?',
      'What is Micrometer and how does it integrate with Prometheus?',
      'How do you implement structured logging in Spring Boot?',
      'What metrics would you monitor for a production Spring Boot application?'
    ],
    resources: [
      { label: 'Spring Boot Actuator', url: 'https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html' },
      { label: 'Micrometer Documentation', url: 'https://micrometer.io/docs' },
      { label: 'Baeldung - Spring Boot Actuator', url: 'https://www.baeldung.com/spring-boot-actuators' }
    ]
  },

  {
    id: 'java-design-patterns',
    title: 'Design Patterns for Interviews',
    category: 'tooling',
    order: 22,
    explanation:
      `What are Design Patterns?

Design patterns are proven, reusable solutions to common software design problems. They are not code you copy-paste -- they are templates for structuring your code to make it flexible, maintainable, and testable.

Why do they matter for interviews?

Interviewers use design patterns to assess:
1. Can you recognize common problems?
2. Do you know established solutions?
3. Can you apply patterns in real-world contexts (especially Spring Boot)?

Key Patterns for Backend Java Interviews

  Creational (How objects are created)
  ├── Singleton   — One instance for the entire application
  ├── Factory     — Delegate object creation to a factory
  └── Builder     — Construct complex objects step by step

  Behavioral (How objects communicate)
  ├── Strategy    — Swap algorithms at runtime
  ├── Observer    — Notify many objects when something changes
  └── Template    — Define algorithm skeleton, let subclasses fill steps

  Structural (How objects are composed)
  ├── Adapter     — Make incompatible interfaces work together
  └── Decorator   — Add behavior to objects dynamically

Patterns in Spring Boot (You're Already Using Them!)

  ┌───────────────────┬──────────────────────────────────────────────────┐
  │ Pattern           │ Where in Spring Boot                              │
  ├───────────────────┼──────────────────────────────────────────────────┤
  │ Singleton         │ Every @Bean is singleton by default               │
  │ Factory           │ BeanFactory, FactoryBean                          │
  │ Proxy             │ @Transactional, @Cacheable (AOP proxies)          │
  │ Template Method   │ JdbcTemplate, RestTemplate, JpaRepository         │
  │ Strategy          │ AuthenticationProvider, HandlerMapping             │
  │ Observer          │ ApplicationEventPublisher, @EventListener          │
  │ Decorator         │ Filter chain, HandlerInterceptor                   │
  │ Adapter           │ HandlerAdapter, WebMvcConfigurer                   │
  └───────────────────┴──────────────────────────────────────────────────┘

When to Use Each

  Need exactly one instance?                    → Singleton
  Need to create objects without specifying class → Factory
  Need to build objects with many optional params → Builder
  Need to swap algorithms at runtime?            → Strategy
  Need to notify multiple listeners of events?   → Observer
  Need to make two incompatible systems talk?    → Adapter
  Need to add behavior without modifying class?  → Decorator`,
    codeExamples: [
      {
        title: 'Strategy Pattern with Spring DI',
        code: `// The Strategy interface
public interface PaymentStrategy {
    String type();  // "CREDIT_CARD", "PAYPAL", "BANK_TRANSFER"
    PaymentResult process(PaymentRequest request);
}

// Concrete strategies (each is a Spring bean)
@Component
public class CreditCardPayment implements PaymentStrategy {
    @Override public String type() { return "CREDIT_CARD"; }
    @Override public PaymentResult process(PaymentRequest request) {
        // charge credit card via Stripe API
        return new PaymentResult(true, "Charged $" + request.amount());
    }
}

@Component
public class PayPalPayment implements PaymentStrategy {
    @Override public String type() { return "PAYPAL"; }
    @Override public PaymentResult process(PaymentRequest request) {
        // redirect to PayPal
        return new PaymentResult(true, "PayPal payment initiated");
    }
}

@Component
public class BankTransferPayment implements PaymentStrategy {
    @Override public String type() { return "BANK_TRANSFER"; }
    @Override public PaymentResult process(PaymentRequest request) {
        // initiate ACH transfer
        return new PaymentResult(true, "Bank transfer pending");
    }
}

// Context: uses the correct strategy based on payment type
@Service
public class PaymentService {
    private final Map<String, PaymentStrategy> strategies;

    // Spring injects ALL PaymentStrategy beans → build a lookup map
    public PaymentService(List<PaymentStrategy> strategyList) {
        this.strategies = strategyList.stream()
            .collect(Collectors.toMap(PaymentStrategy::type, Function.identity()));
    }

    public PaymentResult pay(String paymentType, PaymentRequest request) {
        PaymentStrategy strategy = strategies.get(paymentType);
        if (strategy == null) {
            throw new IllegalArgumentException("Unknown payment type: " + paymentType);
        }
        return strategy.process(request);
    }
}

// Adding a new payment method = just create a new @Component. No other code changes!`,
        explanation: `The Strategy pattern combined with Spring DI is extremely powerful. Spring auto-discovers all PaymentStrategy beans and injects them as a List. The constructor builds a Map for O(1) lookup by type. To add a new payment method (e.g., Apple Pay), you just create a new @Component implementing PaymentStrategy -- the PaymentService automatically picks it up without any code changes. This is the Open/Closed Principle in action: open for extension (new strategies), closed for modification (PaymentService doesn't change).`
      },
      {
        title: 'Builder Pattern',
        code: `// Manual builder (understand the pattern before using Lombok @Builder)
public class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;
    private final int timeoutMs;
    private final boolean followRedirects;

    private HttpRequest(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.headers = Map.copyOf(builder.headers);
        this.body = builder.body;
        this.timeoutMs = builder.timeoutMs;
        this.followRedirects = builder.followRedirects;
    }

    // Static inner builder class
    public static class Builder {
        // Required
        private final String url;
        private final String method;
        // Optional with defaults
        private Map<String, String> headers = new HashMap<>();
        private String body;
        private int timeoutMs = 5000;
        private boolean followRedirects = true;

        public Builder(String url, String method) {  // required params in constructor
            this.url = url;
            this.method = method;
        }

        public Builder header(String key, String value) {
            this.headers.put(key, value);
            return this;  // return this for chaining
        }

        public Builder body(String body) { this.body = body; return this; }
        public Builder timeoutMs(int ms) { this.timeoutMs = ms; return this; }
        public Builder followRedirects(boolean follow) { this.followRedirects = follow; return this; }

        public HttpRequest build() {
            // Validate before building
            if (url == null || url.isBlank()) throw new IllegalStateException("URL is required");
            return new HttpRequest(this);
        }
    }

    // Getters only -- immutable object
    public String getUrl() { return url; }
    public String getMethod() { return method; }
    // ...
}

// Usage: clear, readable, impossible to mix up parameter order
HttpRequest request = new HttpRequest.Builder("https://api.example.com/users", "POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .body("{\\"name\\":\\"Alice\\"}")
    .timeoutMs(3000)
    .build();`,
        explanation: `The Builder pattern solves the "telescoping constructor" problem -- when an object has many parameters, constructors with 5+ arguments are unreadable and error-prone (was the 3rd argument timeout or retries?). The builder makes construction self-documenting: .header("Content-Type", "application/json") is clearer than passing it as the 4th constructor argument. The built object is immutable (all fields final, no setters). Required parameters go in the Builder constructor; optional ones have defaults. In practice, use Lombok @Builder to avoid writing this boilerplate. But know the manual pattern for interviews.`
      },
      {
        title: 'Observer Pattern with Spring Events',
        code: `// Event (immutable data carrier)
public record OrderPlacedEvent(
    Long orderId,
    String customerEmail,
    BigDecimal total,
    LocalDateTime placedAt
) {}

// Publisher (fires the event)
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public Order placeOrder(CreateOrderRequest request) {
        Order order = new Order(request);
        order = orderRepository.save(order);

        // Publish event -- all listeners are notified
        eventPublisher.publishEvent(new OrderPlacedEvent(
            order.getId(), request.email(), order.getTotal(), LocalDateTime.now()));

        return order;
    }
}

// Listeners (react to the event independently)
@Component
@Slf4j
public class EmailNotificationListener {
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        log.info("Sending confirmation email to {}", event.customerEmail());
        // send email...
    }
}

@Component
@Slf4j
public class InventoryListener {
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        log.info("Reserving inventory for order {}", event.orderId());
        // reserve stock...
    }
}

@Component
@Slf4j
public class AnalyticsListener {
    @Async  // runs on a separate thread
    @EventListener
    public void onOrderPlaced(OrderPlacedEvent event) {
        log.info("Tracking analytics for order {}", event.orderId());
        // send to analytics service...
    }
}

// Adding a new reaction to order placement = just add a new @EventListener
// OrderService doesn't know or care who's listening`,
        explanation: `The Observer pattern (implemented via Spring Events) decouples the publisher from the listeners. OrderService doesn't know that emails are sent, inventory is reserved, or analytics are tracked -- it just publishes an event. Each listener reacts independently. @Async makes the analytics listener non-blocking. @TransactionalEventListener can delay event processing until the transaction commits (preventing side effects on rollback). This pattern is essential for maintainable microservices -- as requirements grow, you add listeners without modifying the core business logic.`
      }
    ],
    bestPractices: [
      'Learn patterns through real-world use cases, not abstract UML diagrams',
      'Use Strategy + Spring DI for anything that needs runtime behavior swapping',
      'Use Builder for objects with 4+ parameters, especially with optional fields',
      'Use Spring Events (Observer pattern) to decouple side effects from core logic',
      'Don\'t over-engineer -- apply a pattern only when the problem warrants it',
      'Know which patterns Spring Boot already implements (Singleton, Proxy, Template, Strategy)'
    ],
    commonMistakes: [
      'Using Singleton pattern manually in Spring -- all @Bean/@Component are singletons by default',
      'Applying patterns where a simple if-else would suffice -- over-engineering is a real problem',
      'Confusing the Factory pattern with the Builder pattern -- Factory creates different types, Builder constructs one type step by step',
      'Implementing Observer manually when Spring Events exist',
      'Creating a Strategy interface with only one implementation -- wait until you have two',
      'Not recognizing that Spring Boot is built on design patterns -- interviewers love this connection'
    ],
    interviewQuestions: [
      'What is the Singleton pattern? How does Spring implement it?',
      'Explain the Strategy pattern with a real-world example.',
      'When would you use the Builder pattern? How does Lombok @Builder work?',
      'What is the Observer pattern? How does Spring Events implement it?',
      'What is the difference between the Factory and Abstract Factory patterns?',
      'Name 3 design patterns used internally by the Spring Framework.',
      'What is the Decorator pattern? How does the servlet filter chain use it?',
      'When should you NOT use a design pattern?'
    ],
    resources: [
      { label: 'Refactoring Guru - Design Patterns', url: 'https://refactoring.guru/design-patterns' },
      { label: 'Baeldung - Design Patterns in Java', url: 'https://www.baeldung.com/java-design-patterns' },
      { label: 'Head First Design Patterns', url: 'https://www.oreilly.com/library/view/head-first-design/9781492077992/' }
    ]
  }
];
