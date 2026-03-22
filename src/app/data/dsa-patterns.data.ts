import { DsaPattern } from '../models/dsa.model';

export const DSA_PATTERNS: DsaPattern[] = [
  // ============================================================
  // TIER 1 — Must Know (90%+ interviews)
  // ============================================================
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    tier: 1,
    order: 1,
    category: 'Array & String Patterns',
    explanation: `The Two Pointers technique uses two references (indices or pointers) that move through a data structure — usually an array or string — in a coordinated way. The most common variants are: (1) pointers starting from both ends and moving inward, (2) a slow/fast pointer pair moving in the same direction, and (3) pointers on two separate sorted arrays.

This pattern eliminates the need for nested loops by exploiting sorted order or structural properties to skip unnecessary comparisons. When the input is sorted, moving one pointer narrows the search space in a way that guarantees you won't miss the answer, reducing O(n^2) brute force down to O(n).

Two Pointers is foundational — many other patterns (Sliding Window, Binary Search, merge step in Merge Sort, partitioning in Quick Sort) are variations of this idea. Master it first.`,
    whenToUse: [
      'The input array or string is sorted (or can be sorted without breaking the problem)',
      'You need to find a pair or triplet that satisfies a condition (sum, difference, etc.)',
      'You need to remove duplicates or elements in-place from a sorted array',
      'You are comparing or merging two sorted sequences',
      'The brute-force would require O(n^2) nested iteration over a single array'
    ],
    trick: `Sort first, then squeeze from both ends. If sum too big, move right pointer left; if too small, move left pointer right.`,
    codeTemplate: `#include <vector>
#include <algorithm>
using namespace std;

vector<int> twoPointer(vector<int>& arr, int target) {
    sort(arr.begin(), arr.end());
    int left = 0, right = arr.size() - 1;

    while (left < right) {
        int currentSum = arr[left] + arr[right];
        if (currentSum == target)
            return {left, right};
        else if (currentSum < target)
            left++;
        else
            right--;
    }

    return {};
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'tp-1',
        title: 'Two Sum II - Input Array Is Sorted',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/two-integer-sum-ii' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array' }
        ],
        tags: ['two-pointers', 'sorted-array']
      },
      {
        id: 'tp-2',
        title: '3Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/3sum/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/three-integer-sum' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/3-sum-find-triplets-that-add-up-to-a-zero' }
        ],
        tags: ['two-pointers', 'sorting']
      },
      {
        id: 'tp-3',
        title: 'Container With Most Water',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/container-with-most-water/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/max-water-container' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/container-with-most-water' }
        ],
        tags: ['two-pointers', 'greedy']
      },
      {
        id: 'tp-4',
        title: 'Trapping Rain Water',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/trapping-rain-water/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/trapping-rain-water' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/trapping-rainwater' }
        ],
        tags: ['two-pointers', 'stack']
      },
      {
        id: 'tp-5',
        title: 'Valid Palindrome',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/valid-palindrome/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/is-palindrome' }
        ],
        tags: ['two-pointers', 'string']
      },
      {
        id: 'tp-6',
        title: 'Move Zeroes',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/move-zeroes/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/move-all-zeros-to-the-end-of-the-array' }
        ],
        tags: ['two-pointers', 'in-place']
      },
      {
        id: 'tp-7',
        title: 'Sort Colors',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/sort-colors/' },
          { label: 'GFG', url: 'https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/sort-an-array-of-0s-1s-and-2s' }
        ],
        tags: ['two-pointers', 'dutch-national-flag']
      }
    ],
    resources: [
      { label: 'NeetCode - Two Pointers', url: 'https://neetcode.io/roadmap' },
      { label: 'Two Pointers Technique - GFG', url: 'https://www.geeksforgeeks.org/two-pointers-technique/' }
    ]
  },

  {
    id: 'sliding-window',
    name: 'Sliding Window',
    tier: 1,
    order: 2,
    category: 'Array & String Patterns',
    explanation: `The Sliding Window pattern maintains a contiguous sub-range (window) of elements and slides it across the input, updating the answer incrementally. There are two main flavours: fixed-size windows (e.g., "max sum of any k consecutive elements") and variable-size windows (e.g., "shortest subarray with sum >= target").

For fixed-size windows, you add the new element entering the window and remove the element leaving, keeping a running aggregate in O(1) per step. For variable-size windows, you expand the right boundary to include more elements until a condition is met, then shrink from the left to find the optimal (smallest) valid window.

The key insight is that if a window [l, r] is invalid, extending it further to the right might make it valid, and once valid, shrinking from the left might still keep it valid while improving the answer. This monotonic relationship between window boundaries is what makes the technique work in O(n) time.`,
    whenToUse: [
      'You need the max/min/count of a contiguous subarray or substring of size k',
      'The problem says "longest/shortest substring with at most/at least K distinct characters"',
      'You see phrases like "contiguous subarray", "substring", or "window"',
      'You need to track a running aggregate (sum, product, frequency count) over a range',
      'Brute-force would check all O(n^2) subarrays but adding/removing one element is O(1)'
    ],
    trick: `Expand right to satisfy the condition, then shrink left to optimize. If window is invalid, never shrink — only expand.`,
    codeTemplate: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int slidingWindow(const string& s, int k) {
    unordered_map<char, int> window;
    int left = 0, result = 0;

    for (int right = 0; right < (int)s.size(); right++) {
        // Add s[right] to the window
        window[s[right]]++;

        // Shrink window from the left if condition violated
        while ((int)window.size() > k) {
            window[s[left]]--;
            if (window[s[left]] == 0)
                window.erase(s[left]);
            left++;
        }

        // Update result
        result = max(result, right - left + 1);
    }

    return result;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'sw-1',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/buy-and-sell-crypto' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/stock-buy-and-sell' }
        ],
        tags: ['sliding-window', 'greedy']
      },
      {
        id: 'sw-2',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-substring-without-duplicates' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/length-of-longest-substring-without-any-repeating-character' }
        ],
        tags: ['sliding-window', 'hash-map']
      },
      {
        id: 'sw-3',
        title: 'Longest Repeating Character Replacement',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-repeating-substring-with-replacement' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/longest-repeating-character-replacement' }
        ],
        tags: ['sliding-window', 'hash-map']
      },
      {
        id: 'sw-4',
        title: 'Minimum Window Substring',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/minimum-window-substring/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/minimum-window-with-characters' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/minimum-window-substring' }
        ],
        tags: ['sliding-window', 'hash-map']
      },
      {
        id: 'sw-5',
        title: 'Permutation in String',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/permutation-in-string/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/permutation-string' }
        ],
        tags: ['sliding-window', 'hash-map']
      },
      {
        id: 'sw-6',
        title: 'Minimum Size Subarray Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/' }
        ],
        tags: ['sliding-window', 'prefix-sum']
      }
    ],
    resources: [
      { label: 'NeetCode - Sliding Window', url: 'https://neetcode.io/roadmap' },
      { label: 'Sliding Window Technique - GFG', url: 'https://www.geeksforgeeks.org/window-sliding-technique/' }
    ]
  },

  {
    id: 'binary-search',
    name: 'Binary Search',
    tier: 1,
    order: 3,
    category: 'Array & String Patterns',
    explanation: `Binary Search repeatedly halves the search space by comparing the middle element to the target. The classic version finds an exact value in a sorted array in O(log n), but the real power lies in its generalisation: binary search on the answer. Whenever you can define a monotonic predicate — a function that flips from False to True (or vice versa) at some boundary — you can binary-search for that boundary.

"Binary Search on the answer" means: instead of searching an array, you search over the space of possible answers (e.g., "can we split the array into k parts each with sum <= X?"). You pick a candidate answer, check feasibility in O(n), and narrow the range. This converts many O(n^2) or harder optimisation problems into O(n log(range)).

Watch out for off-by-one errors: decide whether you want the first True or the last False, and set lo/hi boundaries accordingly. The template below finds the leftmost position where condition(mid) is True.`,
    whenToUse: [
      'The input is sorted, or the answer lies in a sorted/monotonic search space',
      'You need to find an exact match, a boundary, or an insertion point in O(log n)',
      'The problem asks for "minimum value such that ..." or "maximum value such that ..." (binary search on the answer)',
      'A brute-force checks every candidate answer linearly but each check is O(n) or faster',
      'You see phrases like "sorted array", "rotated sorted", or "peak element"'
    ],
    trick: `lo, hi define the remaining search space. Shrink it by half each step. For "minimum X such that f(X) is true", use the bisect-left template.`,
    codeTemplate: `#include <vector>
using namespace std;

int binarySearch(vector<int>& arr, int target) {
    int lo = 0, hi = arr.size() - 1;

    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target)
            return mid;
        else if (arr[mid] < target)
            lo = mid + 1;
        else
            hi = mid - 1;
    }

    return -1;
}

// Binary search on the answer
// condition is a user-defined predicate
int binarySearchOnAnswer(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (condition(mid))
            hi = mid;       // mid could be the answer
        else
            lo = mid + 1;   // mid is too small
    }
    return lo;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'bs-1',
        title: 'Binary Search',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/binary-search/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/binary-search' }
        ],
        tags: ['binary-search']
      },
      {
        id: 'bs-2',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/search-in-rotated-sorted-array' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/search-element-in-a-rotated-sorted-array' }
        ],
        tags: ['binary-search', 'rotated-array']
      },
      {
        id: 'bs-3',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/find-minimum-in-rotated-sorted-array' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/minimum-in-rotated-sorted-array' }
        ],
        tags: ['binary-search', 'rotated-array']
      },
      {
        id: 'bs-4',
        title: 'Koko Eating Bananas',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/eating-bananas' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/binary-search/koko-eating-bananas' }
        ],
        tags: ['binary-search', 'binary-search-on-answer']
      },
      {
        id: 'bs-5',
        title: 'Find Peak Element',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-peak-element/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/peak-element-in-array' }
        ],
        tags: ['binary-search']
      },
      {
        id: 'bs-6',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/median-of-two-sorted-arrays' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/median-of-two-sorted-arrays-of-different-sizes' }
        ],
        tags: ['binary-search', 'divide-and-conquer']
      },
      {
        id: 'bs-7',
        title: 'Search a 2D Matrix',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/search-a-2d-matrix/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/search-2d-matrix' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/search-in-a-sorted-2d-matrix' }
        ],
        tags: ['binary-search', 'matrix']
      }
    ],
    resources: [
      { label: 'NeetCode - Binary Search', url: 'https://neetcode.io/roadmap' },
      { label: 'Binary Search Algorithm - GFG', url: 'https://www.geeksforgeeks.org/binary-search/' }
    ]
  },

  {
    id: 'hashmap-frequency',
    name: 'HashMap / Frequency Count',
    tier: 1,
    order: 4,
    category: 'Array & String Patterns',
    explanation: `HashMaps (dictionaries) provide O(1) average-case lookup, insertion, and deletion, making them the go-to tool when you need to remember what you've seen before. The most common use cases are: counting frequencies, checking for complements (like Two Sum), grouping elements by a key, and detecting duplicates.

The classic "Two Sum" pattern stores each number's index in a map while iterating; for each new number, you check if the complement (target - num) already exists. This converts O(n^2) brute force into O(n). The same idea extends to anagram grouping (key = sorted string or character count tuple), frequency counting, and caching intermediate results.

When the key space is small and known (e.g., 26 lowercase letters), a fixed-size array can replace the hash map for better constant factors, but the conceptual pattern is identical.`,
    whenToUse: [
      'You need O(1) lookups to check if a value was seen before (Two Sum, contains duplicate)',
      'You need to count frequencies of elements (anagrams, majority element, top-k)',
      'You need to group items by some computed key (group anagrams)',
      'The brute-force solution has nested loops where the inner loop searches for a match',
      'You need to map one value to another (character mapping, isomorphic strings)'
    ],
    trick: `When stuck with O(n^2) from nested loops, ask: "Can I store what I've already seen in a hash map and look up the complement in O(1)?"`,
    codeTemplate: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen; // value -> index

    for (int i = 0; i < (int)nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.count(complement))
            return {seen[complement], i};
        seen[nums[i]] = i;
    }

    return {};
}

unordered_map<int, int> frequencyCount(vector<int>& arr) {
    unordered_map<int, int> freq;
    for (int x : arr)
        freq[x]++;
    // freq[element] gives the count
    return freq;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'hm-1',
        title: 'Two Sum',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/two-sum/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/two-integer-sum' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array' }
        ],
        tags: ['hash-map', 'complement']
      },
      {
        id: 'hm-2',
        title: 'Group Anagrams',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/group-anagrams/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/anagram-groups' }
        ],
        tags: ['hash-map', 'sorting', 'string']
      },
      {
        id: 'hm-3',
        title: 'Top K Frequent Elements',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/top-k-elements-in-list' }
        ],
        tags: ['hash-map', 'heap', 'bucket-sort']
      },
      {
        id: 'hm-4',
        title: 'Valid Anagram',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/valid-anagram/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/is-anagram' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/check-if-two-strings-are-anagrams-of-each-other' }
        ],
        tags: ['hash-map', 'frequency-count']
      },
      {
        id: 'hm-5',
        title: 'Longest Consecutive Sequence',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-consecutive-sequence' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/longest-consecutive-sequence-in-an-array' }
        ],
        tags: ['hash-set', 'sequence']
      },
      {
        id: 'hm-6',
        title: 'Subarray Sum Equals K',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/arrays/count-subarray-sum-equals-k' }
        ],
        tags: ['hash-map', 'prefix-sum']
      },
      {
        id: 'hm-7',
        title: 'Contains Duplicate',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/contains-duplicate/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/duplicate-integer' }
        ],
        tags: ['hash-set']
      }
    ],
    resources: [
      { label: 'NeetCode - Arrays & Hashing', url: 'https://neetcode.io/roadmap' },
      { label: 'Hashing Data Structure - GFG', url: 'https://www.geeksforgeeks.org/hashing-data-structure/' }
    ]
  },

  {
    id: 'monotonic-stack',
    name: 'Stack (Monotonic)',
    tier: 1,
    order: 5,
    category: 'Array & String Patterns',
    explanation: `A Monotonic Stack maintains elements in strictly increasing or decreasing order. When a new element arrives that would violate the ordering, you pop elements from the top until the invariant is restored. Each element is pushed and popped at most once, giving O(n) total time.

The classic application is "Next Greater Element": for each element, find the first element to its right that is larger. A brute-force approach is O(n^2), but a monotonic decreasing stack solves it in O(n) — when you pop an element because the current element is greater, you've found that popped element's "next greater."

Beyond NGE, monotonic stacks power problems like Largest Rectangle in Histogram (maintaining a stack of bar heights/indices), Daily Temperatures, and stock span calculations. The pattern also extends to parenthesis matching and general expression evaluation with a regular (non-monotonic) stack.`,
    whenToUse: [
      'You need the "next greater" or "next smaller" element for each position',
      'The problem involves nested or matching structures (parentheses, tags)',
      'You need to find the largest rectangle in a histogram or maximal rectangle in a matrix',
      'Daily Temperatures-style problems: "how many days until a warmer day?"',
      'You need to maintain a running min/max efficiently as elements enter/leave'
    ],
    trick: `Monotonic decreasing stack for "next greater element." Pop when current > stack top; the popped element's answer is the current element.`,
    codeTemplate: `#include <vector>
#include <stack>
#include <string>
#include <unordered_map>
using namespace std;

vector<int> nextGreaterElement(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> stk; // indices, maintaining decreasing order of values

    for (int i = 0; i < n; i++) {
        while (!stk.empty() && nums[i] > nums[stk.top()]) {
            int idx = stk.top();
            stk.pop();
            result[idx] = nums[i];
        }
        stk.push(i);
    }

    return result;
}

bool validParentheses(const string& s) {
    stack<char> stk;
    unordered_map<char, char> mapping = {
        {')', '('}, {'}', '{'}, {']', '['}
    };

    for (char c : s) {
        if (mapping.count(c)) {
            if (stk.empty() || stk.top() != mapping[c])
                return false;
            stk.pop();
        } else {
            stk.push(c);
        }
    }

    return stk.empty();
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'ms-1',
        title: 'Valid Parentheses',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/valid-parentheses/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/validate-parentheses' }
        ],
        tags: ['stack', 'matching']
      },
      {
        id: 'ms-2',
        title: 'Daily Temperatures',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/daily-temperatures/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/daily-temperatures' }
        ],
        tags: ['monotonic-stack', 'next-greater']
      },
      {
        id: 'ms-3',
        title: 'Largest Rectangle in Histogram',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/largest-rectangle-in-histogram' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/area-of-largest-rectangle-in-histogram' }
        ],
        tags: ['monotonic-stack', 'histogram']
      },
      {
        id: 'ms-4',
        title: 'Min Stack',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/min-stack/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/minimum-stack' }
        ],
        tags: ['stack', 'design']
      },
      {
        id: 'ms-5',
        title: 'Next Greater Element I',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/next-greater-element-i/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/next-greater-element-using-stack' }
        ],
        tags: ['monotonic-stack', 'hash-map']
      },
      {
        id: 'ms-6',
        title: 'Car Fleet',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/car-fleet/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/car-fleet' }
        ],
        tags: ['stack', 'sorting']
      }
    ],
    resources: [
      { label: 'NeetCode - Stack', url: 'https://neetcode.io/roadmap' },
      { label: 'Monotonic Stack - GFG', url: 'https://www.geeksforgeeks.org/introduction-to-monotonic-stack-data-structure-and-algorithm-tutorials/' }
    ]
  },

  {
    id: 'linked-list',
    name: 'Linked List',
    tier: 1,
    order: 6,
    category: 'Linked List Patterns',
    explanation: `Linked list problems test pointer manipulation skills. The three most important techniques are: (1) Fast & Slow pointers (Floyd's algorithm) for cycle detection and finding the middle node, (2) dummy head nodes to simplify edge cases when the head might change, and (3) pointer reversal for in-place list reversal.

Floyd's cycle detection uses two pointers — slow moves 1 step, fast moves 2 steps. If there's a cycle, they will meet inside it. To find the cycle start, reset one pointer to the head and advance both by 1 step; they meet at the cycle entry. For finding the middle, when fast reaches the end, slow is at the midpoint.

Reversal is a core building block: maintain prev, curr, and next pointers, and rewire curr.next = prev at each step. This technique also appears in "Reverse Nodes in k-Group" and "Reorder List." Always draw the pointer diagram before coding.`,
    whenToUse: [
      'You need to detect a cycle in a linked list or find where it starts',
      'You need to find the middle element of a linked list in one pass',
      'You need to reverse all or part of a linked list',
      'You need to merge two sorted linked lists',
      'The problem involves reordering, partitioning, or removing nodes from a linked list'
    ],
    trick: `Use a dummy node when the head might change. Fast/slow pointers: when fast hits the end, slow is at the middle.`,
    codeTemplate: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x = 0, ListNode* n = nullptr) : val(x), next(n) {}
};

ListNode* reverseLinkedList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

ListNode* findMiddle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast)
            return true;
    }
    return false;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'll-1',
        title: 'Reverse Linked List',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/reverse-linked-list/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/reverse-a-linked-list' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/reverse-a-linked-list' }
        ],
        tags: ['linked-list', 'reversal']
      },
      {
        id: 'll-2',
        title: 'Merge Two Sorted Lists',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/merge-two-sorted-linked-lists' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/merge-two-sorted-linked-lists' }
        ],
        tags: ['linked-list', 'merge']
      },
      {
        id: 'll-3',
        title: 'Linked List Cycle',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/linked-list-cycle/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/linked-list-cycle-detection' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/detect-a-cycle-in-a-linked-list' }
        ],
        tags: ['linked-list', 'fast-slow']
      },
      {
        id: 'll-4',
        title: 'Reorder List',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/reorder-list/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/reorder-linked-list' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/reorder-list' }
        ],
        tags: ['linked-list', 'fast-slow', 'reversal']
      },
      {
        id: 'll-5',
        title: 'Remove Nth Node From End of List',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/remove-node-from-end-of-linked-list' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/remove-n-th-node-from-the-end-of-a-linked-list' }
        ],
        tags: ['linked-list', 'two-pointers']
      },
      {
        id: 'll-6',
        title: 'LRU Cache',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/lru-cache' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/implement-lru-cache' }
        ],
        tags: ['linked-list', 'hash-map', 'design']
      },
      {
        id: 'll-7',
        title: 'Copy List with Random Pointer',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/copy-linked-list-with-random-pointer' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/clone-linked-list-with-random-and-next-pointer' }
        ],
        tags: ['linked-list', 'hash-map']
      }
    ],
    resources: [
      { label: 'NeetCode - Linked List', url: 'https://neetcode.io/roadmap' },
      { label: 'Linked List - GFG', url: 'https://www.geeksforgeeks.org/data-structures/linked-list/' }
    ]
  },

  {
    id: 'bfs-dfs-trees',
    name: 'BFS/DFS on Trees',
    tier: 1,
    order: 7,
    category: 'Tree & Graph Patterns',
    explanation: `Tree traversal is one of the most frequently tested categories. DFS (Depth-First Search) visits nodes by going as deep as possible before backtracking, with three orderings: preorder (root-left-right), inorder (left-root-right, gives sorted order for BSTs), and postorder (left-right-root, useful for bottom-up computation). BFS (Breadth-First Search) visits nodes level by level using a queue — this is called level-order traversal.

Most tree problems follow a recursive DFS pattern: compute the answer for the left subtree, compute for the right subtree, then combine at the current node. The key question is: "What information does each node need to return to its parent?" For problems like max depth, return 1 + max(left, right). For diameter, each node returns its height but also updates a global max for the longest path through it.

BFS is the natural choice when you need to process or return results level by level (e.g., right side view, zigzag traversal, level averages). Use a queue, and process all nodes at the current level before moving to the next.`,
    whenToUse: [
      'Any problem on a binary tree or BST (search, validate, compute height/depth)',
      'You need to process nodes level by level (BFS / level-order)',
      'You need to compute a bottom-up aggregate (max depth, diameter, balanced check)',
      'You need to find a path, LCA, or serialize/deserialize a tree',
      'BST-specific: validate BST, find kth smallest, inorder successor'
    ],
    trick: `DFS returns info bottom-up (height, subtree sum). BFS processes level-by-level using a queue with len(queue) loop.`,
    codeTemplate: `#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int x = 0, TreeNode* l = nullptr, TreeNode* r = nullptr)
        : val(x), left(l), right(r) {}
};

// DFS - recursive
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

// BFS - level order
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> level;
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            level.push_back(node->val);
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        result.push_back(level);
    }

    return result;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'tree-1',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/depth-of-binary-tree' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/maximum-depth-of-a-binary-tree' }
        ],
        tags: ['tree', 'dfs']
      },
      {
        id: 'tree-2',
        title: 'Invert Binary Tree',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/invert-binary-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/invert-a-binary-tree' }
        ],
        tags: ['tree', 'dfs']
      },
      {
        id: 'tree-3',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/level-order-traversal-of-binary-tree' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/level-order-traversal-of-a-binary-tree' }
        ],
        tags: ['tree', 'bfs']
      },
      {
        id: 'tree-4',
        title: 'Validate Binary Search Tree',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/valid-binary-search-tree' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/check-if-binary-tree-is-bst' }
        ],
        tags: ['tree', 'bst', 'dfs']
      },
      {
        id: 'tree-5',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/lowest-common-ancestor-for-two-given-nodes' }
        ],
        tags: ['tree', 'dfs', 'lca']
      },
      {
        id: 'tree-6',
        title: 'Diameter of Binary Tree',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/binary-tree-diameter' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/calculate-the-diameter-of-a-binary-tree' }
        ],
        tags: ['tree', 'dfs']
      },
      {
        id: 'tree-7',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/serialize-and-deserialize-binary-tree' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/serialize-and-deserialize-a-binary-tree' }
        ],
        tags: ['tree', 'bfs', 'design']
      }
    ],
    resources: [
      { label: 'NeetCode - Trees', url: 'https://neetcode.io/roadmap' },
      { label: 'Binary Tree Traversals - GFG', url: 'https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/' }
    ]
  },

  {
    id: 'heap-top-k',
    name: 'Heap / Top-K',
    tier: 1,
    order: 8,
    category: 'Array & String Patterns',
    explanation: `A Heap (priority queue) gives O(log n) insert and O(1) access to the min (or max) element. It is the optimal data structure when you repeatedly need "the smallest/largest among a dynamic collection." Python's heapq module implements a min-heap; negate values for a max-heap.

The "Top-K" pattern: to find the k largest elements, maintain a min-heap of size k. Each new element is compared to the heap's minimum; if larger, replace it. At the end, the heap contains exactly the k largest elements. This runs in O(n log k), which is better than sorting O(n log n) when k << n.

Heaps also excel at merge operations — "Merge K Sorted Lists" uses a heap to always pick the smallest head among k lists. Two-heap patterns (one max-heap for the lower half, one min-heap for the upper half) solve "Find Median from Data Stream" by keeping the two halves balanced.`,
    whenToUse: [
      'You need the k largest or k smallest elements from a collection',
      'You need to repeatedly extract the min or max element efficiently',
      'You need to merge k sorted lists or streams',
      'You need a running median or running top-k (stream processing)',
      'Scheduling or task prioritisation problems (process highest priority first)'
    ],
    trick: `Top-K largest: use a MIN-heap of size k (pop the smallest, keep the k biggest). Top-K smallest: use a MAX-heap of size k.`,
    codeTemplate: `#include <vector>
#include <queue>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x = 0, ListNode* n = nullptr) : val(x), next(n) {}
};

// Top K largest elements (min-heap of size k)
vector<int> topKLargest(vector<int>& nums, int k) {
    // min-heap
    priority_queue<int, vector<int>, greater<int>> minHeap;

    for (int num : nums) {
        minHeap.push(num);
        if ((int)minHeap.size() > k)
            minHeap.pop();
    }

    vector<int> result;
    while (!minHeap.empty()) {
        result.push_back(minHeap.top());
        minHeap.pop();
    }
    return result;
}

// Merge K sorted lists
ListNode* mergeKSorted(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);

    for (auto* lst : lists)
        if (lst) heap.push(lst);

    ListNode dummy(0);
    ListNode* curr = &dummy;
    while (!heap.empty()) {
        ListNode* node = heap.top();
        heap.pop();
        curr->next = node;
        curr = curr->next;
        if (node->next)
            heap.push(node->next);
    }

    return dummy.next;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'heap-1',
        title: 'Kth Largest Element in an Array',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/kth-largest-element-in-an-array' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/kth-largest-smallest-element-in-an-array' }
        ],
        tags: ['heap', 'top-k']
      },
      {
        id: 'heap-2',
        title: 'Top K Frequent Elements',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/top-k-frequent-elements/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/top-k-elements-in-list' }
        ],
        tags: ['heap', 'hash-map', 'top-k']
      },
      {
        id: 'heap-3',
        title: 'Merge k Sorted Lists',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/merge-k-sorted-linked-lists' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/linked-list/merge-k-sorted-linked-lists' }
        ],
        tags: ['heap', 'linked-list', 'merge']
      },
      {
        id: 'heap-4',
        title: 'Find Median from Data Stream',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-median-from-data-stream/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/find-median-in-a-data-stream' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/find-median-from-data-stream' }
        ],
        tags: ['heap', 'two-heaps', 'design']
      },
      {
        id: 'heap-5',
        title: 'Task Scheduler',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/task-scheduler/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/task-scheduling' }
        ],
        tags: ['heap', 'greedy']
      },
      {
        id: 'heap-6',
        title: 'K Closest Points to Origin',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/k-closest-points-to-origin' }
        ],
        tags: ['heap', 'top-k', 'geometry']
      }
    ],
    resources: [
      { label: 'NeetCode - Heap / Priority Queue', url: 'https://neetcode.io/roadmap' },
      { label: 'Heap Data Structure - GFG', url: 'https://www.geeksforgeeks.org/heap-data-structure/' }
    ]
  },

  // ============================================================
  // TIER 2 — Highly Important (70%+ interviews)
  // ============================================================
  {
    id: 'graph-bfs-dfs',
    name: 'Graph BFS/DFS',
    tier: 2,
    order: 9,
    category: 'Tree & Graph Patterns',
    explanation: `Graph traversal extends tree BFS/DFS to general graphs, which may have cycles, multiple connected components, and both directed and undirected edges. The two key differences from trees: (1) you must track visited nodes to avoid infinite loops in cycles, and (2) you might need to start traversal from every unvisited node to cover all components.

BFS on graphs is used for shortest-path problems in unweighted graphs (each edge has cost 1). Starting BFS from a source, the first time you reach any node is the shortest path. DFS is used for connectivity, cycle detection, topological ordering, and exploring all reachable nodes. Both run in O(V + E) time.

Common graph representations: adjacency list (dict of lists, most common in interviews), adjacency matrix (for dense graphs), and implicit graphs (like grids where each cell connects to its 4 neighbours). Grid problems ("number of islands", "rotting oranges") are graph problems in disguise — each cell is a node, adjacent cells are edges.`,
    whenToUse: [
      'You are given a grid/matrix and need to explore connected regions (islands, flood fill)',
      'You need the shortest path in an unweighted graph (BFS)',
      'You need to detect cycles in a directed or undirected graph',
      'You need to count connected components or check if two nodes are connected',
      'The problem involves relationships between entities (social network, course prerequisites)'
    ],
    trick: `Grid = implicit graph. BFS = shortest path (unweighted). DFS = connectivity & cycle detection. Always track visited.`,
    codeTemplate: `#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

// BFS on a grid (e.g., Number of Islands)
void bfsGrid(vector<vector<char>>& grid, int sr, int sc) {
    int rows = grid.size(), cols = grid[0].size();
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    queue<pair<int,int>> q;
    q.push({sr, sc});
    visited[sr][sc] = true;
    int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};

    while (!q.empty()) {
        auto [r, c] = q.front();
        q.pop();
        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                && !visited[nr][nc] && grid[nr][nc] == '1') {
                visited[nr][nc] = true;
                q.push({nr, nc});
            }
        }
    }
}

// DFS on adjacency list
void dfs(vector<vector<int>>& graph, int node, vector<bool>& visited) {
    visited[node] = true;
    for (int neighbor : graph[node]) {
        if (!visited[neighbor])
            dfs(graph, neighbor, visited);
    }
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'graph-1',
        title: 'Number of Islands',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/number-of-islands/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/count-number-of-islands' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/number-of-islands' }
        ],
        tags: ['graph', 'bfs', 'dfs', 'grid']
      },
      {
        id: 'graph-2',
        title: 'Clone Graph',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/clone-graph/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/clone-graph' }
        ],
        tags: ['graph', 'bfs', 'hash-map']
      },
      {
        id: 'graph-3',
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/pacific-atlantic-water-flow' }
        ],
        tags: ['graph', 'dfs', 'grid']
      },
      {
        id: 'graph-4',
        title: 'Rotting Oranges',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/rotting-oranges/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/rotting-fruit' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/rotten-oranges-min-time-to-rot-all-oranges-bfs' }
        ],
        tags: ['graph', 'bfs', 'grid']
      },
      {
        id: 'graph-5',
        title: 'Course Schedule',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/course-schedule' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/course-schedule-i-and-ii-pre-requisite-tasks-topological-sort-g-24' }
        ],
        tags: ['graph', 'topological-sort', 'cycle-detection']
      },
      {
        id: 'graph-6',
        title: 'Surrounded Regions',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/surrounded-regions/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/surrounded-regions' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/graph/surrounded-regions-replace-os-with-xs' }
        ],
        tags: ['graph', 'dfs', 'grid']
      },
      {
        id: 'graph-7',
        title: 'Word Ladder',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/word-ladder/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/word-ladder' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/graph/word-ladder-i-g-29' }
        ],
        tags: ['graph', 'bfs', 'string']
      }
    ],
    resources: [
      { label: 'NeetCode - Graphs', url: 'https://neetcode.io/roadmap' },
      { label: 'Graph Algorithms - GFG', url: 'https://www.geeksforgeeks.org/graph-data-structure-and-algorithms/' }
    ]
  },

  {
    id: 'backtracking',
    name: 'Backtracking',
    tier: 2,
    order: 10,
    category: 'Tree & Graph Patterns',
    explanation: `Backtracking systematically explores all possible solutions by building candidates incrementally and abandoning ("pruning") a candidate as soon as it is clear it cannot lead to a valid solution. Think of it as DFS on a decision tree, where each level represents a choice and each leaf is a complete candidate.

The template is: (1) Check if the current state is a valid solution — if yes, add it to results. (2) For each possible next choice, make the choice (add to current path), recurse, then undo the choice (backtrack). The "undo" step is what distinguishes backtracking from plain DFS — it allows reusing the same data structure for the current state.

Common optimisations: sort the input first to enable skipping duplicates ("if i > start and nums[i] == nums[i-1]: continue"), prune branches early when the remaining elements can't possibly satisfy the constraint (e.g., remaining sum is negative), and use visited sets for permutation-style problems.`,
    whenToUse: [
      'The problem asks for "all possible" combinations, permutations, subsets, or arrangements',
      'You need to generate all valid configurations (N-Queens, Sudoku solver)',
      'The problem involves making a sequence of choices where each choice constrains future ones',
      'You see constraints like n <= 20 or n <= 15 (exponential solutions are expected)',
      'The brute-force is exponential and no polynomial DP formulation exists'
    ],
    trick: `Backtracking = DFS + undo. At each step: choose, explore, un-choose. Sort first to skip duplicates easily.`,
    codeTemplate: `#include <vector>
#include <algorithm>
using namespace std;

void backtrack(vector<int>& nums, int start, vector<int>& path,
               vector<vector<int>>& result) {
    result.push_back(path); // found a valid candidate

    for (int i = start; i < (int)nums.size(); i++) {
        // Skip duplicates (if input is sorted)
        if (i > start && nums[i] == nums[i - 1])
            continue;

        path.push_back(nums[i]);          // choose
        backtrack(nums, i + 1, path, result); // explore
        path.pop_back();                  // un-choose (backtrack)
    }
}

vector<vector<int>> subsets(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> result;
    vector<int> path;
    backtrack(nums, 0, path, result);
    return result;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'bt-1',
        title: 'Subsets',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/subsets/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/subsets' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/subset-ii-print-all-the-unique-subsets' }
        ],
        tags: ['backtracking', 'subsets']
      },
      {
        id: 'bt-2',
        title: 'Combination Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/combination-sum/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/combination-target-sum' }
        ],
        tags: ['backtracking', 'combinations']
      },
      {
        id: 'bt-3',
        title: 'Permutations',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/permutations/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/permutations' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/print-all-permutations-of-a-string-array' }
        ],
        tags: ['backtracking', 'permutations']
      },
      {
        id: 'bt-4',
        title: 'Word Search',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/word-search/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/search-for-word' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/word-search-leetcode' }
        ],
        tags: ['backtracking', 'grid', 'dfs']
      },
      {
        id: 'bt-5',
        title: 'Letter Combinations of a Phone Number',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/combination-target-sum' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/letter-combinations-of-a-phone-number' }
        ],
        tags: ['backtracking', 'string']
      },
      {
        id: 'bt-6',
        title: 'N-Queens',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/n-queens/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/n-queens' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/n-queen-problem-return-all-distinct-solutions-to-the-n-queens-puzzle' }
        ],
        tags: ['backtracking', 'constraint-satisfaction']
      },
      {
        id: 'bt-7',
        title: 'Palindrome Partitioning',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/palindrome-partitioning/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/palindrome-partitioning' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/palindrome-partitioning' }
        ],
        tags: ['backtracking', 'string', 'palindrome']
      }
    ],
    resources: [
      { label: 'NeetCode - Backtracking', url: 'https://neetcode.io/roadmap' },
      { label: 'Backtracking Introduction - GFG', url: 'https://www.geeksforgeeks.org/introduction-to-backtracking-data-structure-and-algorithm-tutorials/' }
    ]
  },

  {
    id: 'dp-1d',
    name: 'Dynamic Programming - 1D',
    tier: 2,
    order: 11,
    category: 'Dynamic Programming',
    explanation: `1D Dynamic Programming solves problems where the answer at position i depends only on previously computed answers at positions < i. You define a recurrence (e.g., dp[i] = dp[i-1] + dp[i-2] for Fibonacci / Climbing Stairs) and fill a 1D table from left to right. The time is typically O(n) and space can often be reduced to O(1) by keeping only the last few values.

The framework: (1) Define the state — what does dp[i] represent? (2) Find the recurrence — how does dp[i] relate to previous states? (3) Identify the base cases — dp[0], dp[1], etc. (4) Determine the iteration order — usually left to right. (5) Locate the answer — usually dp[n] or dp[n-1].

Classic examples: Climbing Stairs (Fibonacci), House Robber (take or skip), Coin Change (min coins to make amount), Longest Increasing Subsequence (O(n^2) or O(n log n) with binary search). The "take or skip" pattern — dp[i] = max(dp[i-1], dp[i-2] + value[i]) — appears in many interview problems.`,
    whenToUse: [
      'The problem has "optimal substructure": the optimal solution contains optimal solutions to subproblems',
      'The problem has "overlapping subproblems": the same subproblem is solved multiple times in recursion',
      'You see "minimum cost", "maximum profit", "number of ways" to reach a target',
      'The brute-force recursion has exponential time but the state space is polynomial',
      'The problem can be framed as "at position i, what is the best I can do given decisions so far?"'
    ],
    trick: `Ask: "What is the last decision I make?" That gives you the recurrence. dp[i] usually depends on dp[i-1] (skip) or dp[i-2]+val (take).`,
    codeTemplate: `#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

// Climbing Stairs / Fibonacci pattern
int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

// House Robber pattern (take or skip)
int rob(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

// Coin Change pattern (min operations)
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] != INT_MAX)
                dp[i] = min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'dp1-1',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/climbing-stairs/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/climbing-stairs' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/dynamic-programming-climbing-stairs' }
        ],
        tags: ['dp', 'fibonacci']
      },
      {
        id: 'dp1-2',
        title: 'House Robber',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/house-robber/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/house-robber' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/dynamic-programming-house-robber-dp-6' }
        ],
        tags: ['dp', 'take-or-skip']
      },
      {
        id: 'dp1-3',
        title: 'House Robber II',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/house-robber-ii/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/house-robber-ii' }
        ],
        tags: ['dp', 'circular']
      },
      {
        id: 'dp1-4',
        title: 'Coin Change',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/coin-change/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/coin-change' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/minimum-coins-dp-20' }
        ],
        tags: ['dp', 'unbounded-knapsack']
      },
      {
        id: 'dp1-5',
        title: 'Longest Increasing Subsequence',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-increasing-subsequence' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/longest-increasing-subsequence-dp-41' }
        ],
        tags: ['dp', 'binary-search']
      },
      {
        id: 'dp1-6',
        title: 'Word Break',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/word-break/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/word-break' }
        ],
        tags: ['dp', 'string']
      },
      {
        id: 'dp1-7',
        title: 'Decode Ways',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/decode-ways/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/decode-ways' }
        ],
        tags: ['dp', 'string']
      }
    ],
    resources: [
      { label: 'NeetCode - 1-D Dynamic Programming', url: 'https://neetcode.io/roadmap' },
      { label: 'Dynamic Programming - GFG', url: 'https://www.geeksforgeeks.org/dynamic-programming/' }
    ]
  },

  {
    id: 'dp-2d',
    name: 'Dynamic Programming - 2D',
    tier: 2,
    order: 12,
    category: 'Dynamic Programming',
    explanation: `2D DP extends the 1D idea to problems where the state requires two parameters. Common state definitions: dp[i][j] = answer for the subproblem using the first i items with capacity j (Knapsack), dp[i][j] = answer for the substring s[i..j] (interval DP), or dp[i][j] = answer at grid position (i, j).

For grid-based problems like "Unique Paths" or "Minimum Path Sum," dp[i][j] depends on dp[i-1][j] and dp[i][j-1] — the cell above and to the left. For Knapsack-style problems, dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i]) — skip item i or take it. Space can often be optimised from O(n*m) to O(m) by using a single row and processing in the right order.

The key to 2D DP is correctly identifying the two dimensions of the state and ensuring the recurrence only depends on previously computed cells (i.e., the fill order is correct).`,
    whenToUse: [
      'The problem involves two sequences (LCS, edit distance) or a sequence with two parameters',
      'Grid traversal problems asking for number of paths, minimum cost path, etc.',
      'Knapsack-style problems: items with weight and value, capacity constraint',
      'Interval problems on a string or array: dp[i][j] for the subproblem on range [i, j]',
      'The 1D state is not enough to capture the full subproblem (need two changing parameters)'
    ],
    trick: `Draw the DP table on paper. Fill cell (i,j) from its dependencies. For two strings, rows = s1, cols = s2. For grid, fill top-to-bottom, left-to-right.`,
    codeTemplate: `#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// Unique Paths (grid DP)
int uniquePaths(int m, int n) {
    vector<vector<int>> dp(m, vector<int>(n, 1));
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
    return dp[m-1][n-1];
}

// 0/1 Knapsack
int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w]; // skip item i
            if (weights[i-1] <= w)
                dp[i][w] = max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
        }
    }

    return dp[n][capacity];
}

// Longest Common Subsequence
int lcs(const string& text1, const string& text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i-1] == text2[j-1])
                dp[i][j] = dp[i-1][j-1] + 1;
            else
                dp[i][j] = max(dp[i-1][j], dp[i][j-1]);
        }
    }

    return dp[m][n];
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'dp2-1',
        title: 'Unique Paths',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/unique-paths/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/count-paths' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/grid-unique-paths-dp-on-grids-dp8' }
        ],
        tags: ['dp', 'grid']
      },
      {
        id: 'dp2-2',
        title: 'Longest Common Subsequence',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-common-subsequence' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/longest-common-subsequence-dp-25' }
        ],
        tags: ['dp', 'two-strings']
      },
      {
        id: 'dp2-3',
        title: 'Target Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/target-sum/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/target-sum' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/target-sum-dp-21' }
        ],
        tags: ['dp', 'knapsack']
      },
      {
        id: 'dp2-4',
        title: 'Interleaving String',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/interleaving-string/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/interleaving-string' }
        ],
        tags: ['dp', 'two-strings']
      },
      {
        id: 'dp2-5',
        title: 'Minimum Path Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/minimum-path-sum/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/minimum-path-sum-in-a-grid-dp-10' }
        ],
        tags: ['dp', 'grid']
      },
      {
        id: 'dp2-6',
        title: 'Partition Equal Subset Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/partition-equal-subset-sum' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/partition-equal-subset-sum-dp-15' }
        ],
        tags: ['dp', 'knapsack']
      }
    ],
    resources: [
      { label: 'NeetCode - 2-D Dynamic Programming', url: 'https://neetcode.io/roadmap' },
      { label: '0/1 Knapsack Problem - GFG', url: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/' }
    ]
  },

  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    tier: 2,
    order: 13,
    category: 'Array & String Patterns',
    explanation: `A Prefix Sum array stores cumulative sums: prefix[i] = sum of elements from index 0 to i-1. Once built in O(n), any subarray sum can be computed in O(1) as prefix[right+1] - prefix[left]. This converts problems that would otherwise require O(n) per query into O(1) per query after O(n) preprocessing.

The technique is especially powerful combined with hash maps. For "Subarray Sum Equals K," you iterate and maintain a running prefix sum. For each position, you ask: "Is there a previous prefix sum such that current_prefix - previous_prefix = k?" This is the complement lookup pattern from Two Sum, but applied to prefix sums. Store prefix sum frequencies in a hash map for O(1) lookup.

Prefix sums generalise to 2D (for matrix region sums), prefix XOR (for subarray XOR queries), and prefix products. The core idea is always the same: precompute cumulative aggregates so range queries become O(1).`,
    whenToUse: [
      'You need to compute the sum of many subarrays or ranges efficiently',
      'The problem asks "how many subarrays have sum equal to / divisible by / at most K"',
      'You need to answer multiple range-sum queries on a static array',
      'The problem involves "contiguous subarray sum" and combining with a hash map',
      'You need 2D region sums in a matrix'
    ],
    trick: `prefix[r+1] - prefix[l] = sum(arr[l..r]). Combine with a hash map storing prefix sum frequencies for "subarray sum = k" problems.`,
    codeTemplate: `#include <vector>
#include <unordered_map>
using namespace std;

// Build prefix sum
vector<int> buildPrefix(vector<int>& nums) {
    vector<int> prefix(nums.size() + 1, 0);
    for (int i = 0; i < (int)nums.size(); i++)
        prefix[i + 1] = prefix[i] + nums[i];
    return prefix;
}

// Range sum query
int rangeSum(vector<int>& prefix, int left, int right) {
    return prefix[right + 1] - prefix[left];
}

// Subarray Sum Equals K (prefix sum + hash map)
int subarraySum(vector<int>& nums, int k) {
    int count = 0, prefixSum = 0;
    unordered_map<int, int> prefixCounts;
    prefixCounts[0] = 1;

    for (int num : nums) {
        prefixSum += num;
        if (prefixCounts.count(prefixSum - k))
            count += prefixCounts[prefixSum - k];
        prefixCounts[prefixSum]++;
    }

    return count;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'ps-1',
        title: 'Subarray Sum Equals K',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' }
        ],
        tags: ['prefix-sum', 'hash-map']
      },
      {
        id: 'ps-2',
        title: 'Product of Array Except Self',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/product-of-array-except-self/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/products-of-array-discluding-self' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/arrays/product-of-array-except-itself' }
        ],
        tags: ['prefix-product', 'array']
      },
      {
        id: 'ps-3',
        title: 'Range Sum Query - Immutable',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/range-sum-query-immutable/' }
        ],
        tags: ['prefix-sum', 'design']
      },
      {
        id: 'ps-4',
        title: 'Range Sum Query 2D - Immutable',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/range-sum-query-2d-immutable/' }
        ],
        tags: ['prefix-sum', '2d']
      },
      {
        id: 'ps-5',
        title: 'Continuous Subarray Sum',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/continuous-subarray-sum/' }
        ],
        tags: ['prefix-sum', 'hash-map', 'modulo']
      },
      {
        id: 'ps-6',
        title: 'Find Pivot Index',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-pivot-index/' }
        ],
        tags: ['prefix-sum']
      }
    ],
    resources: [
      { label: 'Prefix Sum Array - GFG', url: 'https://www.geeksforgeeks.org/prefix-sum-array-implementation-applications-competitive-programming/' },
      { label: 'NeetCode - Arrays & Hashing', url: 'https://neetcode.io/roadmap' }
    ]
  },

  {
    id: 'intervals',
    name: 'Intervals',
    tier: 2,
    order: 14,
    category: 'Array & String Patterns',
    explanation: `Interval problems deal with ranges [start, end] and operations like merging overlapping intervals, inserting a new interval, or finding the minimum number of intervals to remove to eliminate overlaps. The universal first step is to sort intervals by start time (or sometimes by end time for greedy problems).

After sorting, the merge algorithm is straightforward: iterate through intervals, and if the current interval overlaps with the last merged interval (current.start <= merged.end), extend the merged interval's end. Otherwise, start a new merged interval. This runs in O(n log n) for sorting + O(n) for the merge pass.

For "minimum removals" or "maximum non-overlapping intervals," sort by end time and greedily pick the interval that ends earliest (activity selection problem). For "meeting rooms" problems, separate all start and end times, sort them, and sweep through with a counter.`,
    whenToUse: [
      'The input is a list of intervals [start, end] and you need to merge, insert, or remove overlaps',
      'Meeting rooms / scheduling: "can all meetings fit?" or "how many rooms needed?"',
      'The problem asks for the maximum number of non-overlapping intervals',
      'You need to insert a new interval into a sorted list of non-overlapping intervals',
      'You see "start time" and "end time" in the problem'
    ],
    trick: `Sort by start time for merging. Sort by end time for greedy selection (pick earliest finish). Two intervals overlap if a.start < b.end and b.start < a.end.`,
    codeTemplate: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};

    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1])
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        else
            merged.push_back(intervals[i]);
    }

    return merged;
}

// Meeting Rooms II (minimum rooms needed)
int minMeetingRooms(vector<vector<int>>& intervals) {
    vector<int> starts, ends;
    for (auto& iv : intervals) {
        starts.push_back(iv[0]);
        ends.push_back(iv[1]);
    }
    sort(starts.begin(), starts.end());
    sort(ends.begin(), ends.end());

    int rooms = 0, maxRooms = 0;
    int s = 0, e = 0;
    while (s < (int)starts.size()) {
        if (starts[s] < ends[e]) {
            rooms++;
            s++;
        } else {
            rooms--;
            e++;
        }
        maxRooms = max(maxRooms, rooms);
    }

    return maxRooms;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'iv-1',
        title: 'Merge Intervals',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/merge-intervals/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/merge-intervals' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/merge-overlapping-sub-intervals' }
        ],
        tags: ['intervals', 'sorting']
      },
      {
        id: 'iv-2',
        title: 'Insert Interval',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/insert-interval/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/insert-new-interval' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/insert-new-interval' }
        ],
        tags: ['intervals', 'merge']
      },
      {
        id: 'iv-3',
        title: 'Non-overlapping Intervals',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/non-overlapping-intervals/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/non-overlapping-intervals' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/non-overlapping-intervals' }
        ],
        tags: ['intervals', 'greedy']
      },
      {
        id: 'iv-4',
        title: 'Meeting Rooms',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/meeting-rooms/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/meeting-schedule' }
        ],
        tags: ['intervals', 'sorting']
      },
      {
        id: 'iv-5',
        title: 'Meeting Rooms II',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/meeting-rooms-ii/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/meeting-schedule-ii' }
        ],
        tags: ['intervals', 'sweep-line', 'heap']
      },
      {
        id: 'iv-6',
        title: 'Minimum Number of Arrows to Burst Balloons',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/' }
        ],
        tags: ['intervals', 'greedy']
      }
    ],
    resources: [
      { label: 'NeetCode - Intervals', url: 'https://neetcode.io/roadmap' },
      { label: 'Merge Overlapping Intervals - GFG', url: 'https://www.geeksforgeeks.org/merging-intervals/' }
    ]
  },

  {
    id: 'greedy',
    name: 'Greedy',
    tier: 2,
    order: 15,
    category: 'Array & String Patterns',
    explanation: `Greedy algorithms make the locally optimal choice at each step, hoping it leads to a globally optimal solution. Unlike DP, greedy doesn't consider all possibilities — it commits to the best-looking option right now. This works only when the problem has the "greedy choice property": a locally optimal choice is part of some globally optimal solution.

Classic examples: Jump Game (can you reach the end? Track the farthest reachable index), Gas Station (find the starting station for a circular tour), and activity selection (pick the event that finishes earliest). The tricky part is proving correctness — in an interview, explain why greedy works for this specific problem.

Greedy problems often feel like they could be solved with DP, but are simpler. If you see a problem where sorting + a simple scan gives the right answer, it's likely greedy. The key signal: you never need to reconsider a previous decision.`,
    whenToUse: [
      'You need to make sequential decisions and the optimal choice at each step is clear (no need to look ahead)',
      'The problem involves scheduling, selecting items, or assigning resources optimally',
      'Sorting the input by some criterion gives a natural ordering for processing',
      'You can prove that the locally optimal choice never hurts the global solution',
      'The problem asks "can you reach the end?" or "minimum number of jumps/steps"'
    ],
    trick: `Sort by the criterion that matters (end time, ratio, deadline). Process in order and greedily pick the best option. If you'd never undo a choice, it's greedy.`,
    codeTemplate: `#include <vector>
#include <algorithm>
using namespace std;

// Jump Game: can you reach the end?
bool canJump(vector<int>& nums) {
    int farthest = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        if (i > farthest) return false;
        farthest = max(farthest, i + nums[i]);
    }
    return true;
}

// Jump Game II: minimum jumps to reach end
int jump(vector<int>& nums) {
    int jumps = 0, currentEnd = 0, farthest = 0;

    for (int i = 0; i < (int)nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }

    return jumps;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'gr-1',
        title: 'Jump Game',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/jump-game/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/jump-game' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/Greedy/jump-game-i' }
        ],
        tags: ['greedy', 'reachability']
      },
      {
        id: 'gr-2',
        title: 'Jump Game II',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/jump-game-ii/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/jump-game-2' }
        ],
        tags: ['greedy', 'bfs']
      },
      {
        id: 'gr-3',
        title: 'Gas Station',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/gas-station/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/gas-station' }
        ],
        tags: ['greedy', 'circular']
      },
      {
        id: 'gr-4',
        title: 'Maximum Subarray',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/maximum-subarray/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/maximum-subarray' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/kadanes-algorithm-maximum-subarray-sum-in-an-array' }
        ],
        tags: ['greedy', 'dp', 'kadane']
      },
      {
        id: 'gr-5',
        title: 'Hand of Straights',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/hand-of-straights/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/hand-of-straights' }
        ],
        tags: ['greedy', 'hash-map', 'sorting']
      },
      {
        id: 'gr-6',
        title: 'Partition Labels',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/partition-labels/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/partition-labels' }
        ],
        tags: ['greedy', 'hash-map']
      }
    ],
    resources: [
      { label: 'NeetCode - Greedy', url: 'https://neetcode.io/roadmap' },
      { label: 'Greedy Algorithms - GFG', url: 'https://www.geeksforgeeks.org/greedy-algorithms/' }
    ]
  },

  // ============================================================
  // TIER 3 — Advanced (Differentiators)
  // ============================================================
  {
    id: 'trie',
    name: 'Trie',
    tier: 3,
    order: 16,
    category: 'Advanced Patterns',
    explanation: `A Trie (prefix tree) stores a set of strings where each edge represents a character. Every node has up to 26 children (for lowercase English), and nodes are marked as "end of word." Tries support O(L) insert, search, and prefix-search, where L is the word length — independent of the total number of stored words.

The main advantage over a hash set is prefix queries: "are there any words starting with 'pre'?" A hash set can't answer this without iterating all entries, but a trie can answer in O(prefix_length). This makes tries ideal for autocomplete systems, spell checkers, and word games.

In coding interviews, Trie most commonly appears in: (1) Implement Trie (basic insert/search/startsWith), (2) Word Search II (DFS on a grid + Trie for efficient multi-word lookup), and (3) Design Add and Search Words (supporting '.' wildcard). The Trie node is typically a dict of children plus a boolean flag.`,
    whenToUse: [
      'You need to search for words by prefix efficiently (autocomplete)',
      'The problem involves multiple pattern searches against a dictionary (Word Search II)',
      'You need to find the longest common prefix among strings',
      'The problem requires wildcard or partial matching of strings',
      'You are building a dictionary that supports insert, search, and startsWith operations'
    ],
    trick: `Trie node = {children: {}, is_end: bool}. Insert/search by walking char-by-char. For Word Search II, build trie from words, DFS from each grid cell.`,
    codeTemplate: `#include <string>
#include <unordered_map>
using namespace std;

struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root;
public:
    Trie() { root = new TrieNode(); }

    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c))
                node->children[c] = new TrieNode();
            node = node->children[c];
        }
        node->isEnd = true;
    }

    bool search(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c))
                return false;
            node = node->children[c];
        }
        return node->isEnd;
    }

    bool startsWith(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (!node->children.count(c))
                return false;
            node = node->children[c];
        }
        return true;
    }
};`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'trie-1',
        title: 'Implement Trie (Prefix Tree)',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/implement-prefix-tree' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/implement-trie-1' }
        ],
        tags: ['trie', 'design']
      },
      {
        id: 'trie-2',
        title: 'Design Add and Search Words Data Structure',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/design-word-search-data-structure' }
        ],
        tags: ['trie', 'dfs', 'design']
      },
      {
        id: 'trie-3',
        title: 'Word Search II',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/word-search-ii/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/search-for-word-ii' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/word-search-ii' }
        ],
        tags: ['trie', 'backtracking', 'grid']
      },
      {
        id: 'trie-4',
        title: 'Longest Word in Dictionary',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-word-in-dictionary/' }
        ],
        tags: ['trie', 'sorting']
      },
      {
        id: 'trie-5',
        title: 'Replace Words',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/replace-words/' }
        ],
        tags: ['trie', 'string']
      }
    ],
    resources: [
      { label: 'NeetCode - Tries', url: 'https://neetcode.io/roadmap' },
      { label: 'Trie Data Structure - GFG', url: 'https://www.geeksforgeeks.org/trie-insert-and-search/' }
    ]
  },

  {
    id: 'union-find',
    name: 'Union-Find (DSU)',
    tier: 3,
    order: 17,
    category: 'Advanced Patterns',
    explanation: `Union-Find (Disjoint Set Union) maintains a collection of non-overlapping sets with two operations: Find (which set does element x belong to?) and Union (merge the sets containing x and y). With path compression and union by rank, both operations run in nearly O(1) amortised time (technically O(alpha(n)), the inverse Ackermann function).

The data structure uses a parent array where parent[x] points to x's parent; the root of each tree is the set representative. Path compression makes Find flatten the tree by pointing all traversed nodes directly to the root. Union by rank attaches the shorter tree under the taller tree's root.

Union-Find is preferred over BFS/DFS when: (1) edges arrive one at a time and you need to dynamically check connectivity (e.g., "does adding this edge create a cycle?"), (2) counting connected components as edges are added, or (3) the problem involves grouping by equivalence relations (accounts merge, redundant connections).`,
    whenToUse: [
      'You need to dynamically merge groups and check if two elements belong to the same group',
      'The problem asks "is there a cycle in an undirected graph?" (adding edges one by one)',
      'You need to count connected components as edges are added over time',
      'The problem involves grouping items by equivalence (accounts merge, similar sentences)',
      'Graph connectivity queries where DFS/BFS would be too slow for repeated queries'
    ],
    trick: `parent[] array + find with path compression + union by rank. find(x): follow parent pointers to root, flatten on the way back.`,
    codeTemplate: `#include <vector>
#include <numeric>
using namespace std;

class UnionFind {
    vector<int> parent, rank_;
    int components;
public:
    UnionFind(int n) : parent(n), rank_(n, 0), components(n) {
        iota(parent.begin(), parent.end(), 0); // parent[i] = i
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // path compression
        return parent[x];
    }

    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false; // already connected
        // union by rank
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
        components--;
        return true;
    }

    bool connected(int x, int y) {
        return find(x) == find(y);
    }

    int getComponents() { return components; }
};`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'uf-1',
        title: 'Number of Connected Components in an Undirected Graph',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/count-connected-components' }
        ],
        tags: ['union-find', 'graph']
      },
      {
        id: 'uf-2',
        title: 'Redundant Connection',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/redundant-connection/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/redundant-connection' }
        ],
        tags: ['union-find', 'cycle-detection']
      },
      {
        id: 'uf-3',
        title: 'Graph Valid Tree',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/graph-valid-tree/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/valid-tree' }
        ],
        tags: ['union-find', 'graph']
      },
      {
        id: 'uf-4',
        title: 'Accounts Merge',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/accounts-merge/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/accounts-merge-dsu-g-50' }
        ],
        tags: ['union-find', 'hash-map']
      },
      {
        id: 'uf-5',
        title: 'Longest Consecutive Sequence',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-consecutive-sequence' }
        ],
        tags: ['union-find', 'hash-set']
      }
    ],
    resources: [
      { label: 'NeetCode - Graphs (Advanced)', url: 'https://neetcode.io/roadmap' },
      { label: 'Disjoint Set Union - GFG', url: 'https://www.geeksforgeeks.org/introduction-to-disjoint-set-data-structure-or-union-find-algorithm/' }
    ]
  },

  {
    id: 'topological-sort',
    name: 'Topological Sort',
    tier: 3,
    order: 18,
    category: 'Tree & Graph Patterns',
    explanation: `Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v. It's the natural ordering for dependency resolution: "before you can take course B, you must complete course A."

There are two standard algorithms: (1) Kahn's Algorithm (BFS-based): maintain in-degree counts, start with nodes of in-degree 0, process them and decrement neighbours' in-degrees, add newly zero-in-degree nodes to the queue. (2) DFS-based: run DFS and push nodes to a stack after all descendants are processed; reverse the stack for the topological order.

Kahn's algorithm has the added benefit of detecting cycles: if the number of processed nodes is less than the total number of nodes, there's a cycle (and no valid topological ordering exists). This makes it the standard approach for "Course Schedule" style problems.`,
    whenToUse: [
      'The problem involves ordering tasks/courses with prerequisites (dependency graph)',
      'You need to detect if a directed graph has a cycle',
      'You need to find a valid execution order for tasks with dependencies',
      'The problem says "before X, you must complete Y" (DAG ordering)',
      'You need to process nodes in dependency order (build systems, compilation order)'
    ],
    trick: `Kahn's: start with in-degree 0 nodes, BFS, decrement neighbours. If processed < total nodes, there's a cycle.`,
    codeTemplate: `#include <vector>
#include <queue>
using namespace std;

vector<int> topologicalSort(int numNodes, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numNodes);
    vector<int> inDegree(numNodes, 0);

    for (auto& p : prerequisites) {
        int dest = p[0], src = p[1];
        graph[src].push_back(dest);
        inDegree[dest]++;
    }

    // Start with nodes that have no prerequisites
    queue<int> q;
    for (int i = 0; i < numNodes; i++)
        if (inDegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        order.push_back(node);
        for (int neighbor : graph[node]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0)
                q.push(neighbor);
        }
    }

    // If order contains all nodes, valid topological sort exists
    return (int)order.size() == numNodes ? order : vector<int>{};
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'ts-1',
        title: 'Course Schedule',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/course-schedule' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/course-schedule-i-and-ii-pre-requisite-tasks-topological-sort-g-24' }
        ],
        tags: ['topological-sort', 'cycle-detection']
      },
      {
        id: 'ts-2',
        title: 'Course Schedule II',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/course-schedule-ii/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/course-schedule-ii' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/course-schedule-i-and-ii-pre-requisite-tasks-topological-sort-g-24' }
        ],
        tags: ['topological-sort', 'ordering']
      },
      {
        id: 'ts-3',
        title: 'Alien Dictionary',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/alien-dictionary/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/foreign-dictionary' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/alien-dictionary-topological-sort-g-26' }
        ],
        tags: ['topological-sort', 'string']
      },
      {
        id: 'ts-4',
        title: 'Find All Possible Recipes from Given Supplies',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/' }
        ],
        tags: ['topological-sort', 'hash-map']
      },
      {
        id: 'ts-5',
        title: 'Minimum Height Trees',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/minimum-height-trees/' }
        ],
        tags: ['topological-sort', 'tree', 'bfs']
      }
    ],
    resources: [
      { label: 'NeetCode - Graphs (Advanced)', url: 'https://neetcode.io/roadmap' },
      { label: 'Topological Sort - GFG', url: 'https://www.geeksforgeeks.org/topological-sorting/' }
    ]
  },

  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    tier: 3,
    order: 19,
    category: 'Advanced Patterns',
    explanation: `Bit manipulation operates directly on the binary representation of integers using bitwise operators: AND (&), OR (|), XOR (^), NOT (~), left shift (<<), and right shift (>>). These operations run in O(1) and can replace loops for certain tasks.

Key tricks: (1) XOR of a number with itself is 0, and XOR with 0 is the number itself — so XORing all elements where every number appears twice except one isolates the single number. (2) n & (n-1) turns off the rightmost set bit — useful for counting set bits. (3) n & (-n) isolates the rightmost set bit. (4) Check if n is a power of 2: n > 0 && (n & (n-1)) == 0.

Interview problems tend to focus on XOR tricks (single number, missing number) and bit counting. Understanding binary representation also helps with problems like "Reverse Bits" and "Counting Bits." These problems often have elegant O(1) or O(log n) solutions that feel like magic.`,
    whenToUse: [
      'The problem asks to find a unique/missing number where all others appear twice (XOR trick)',
      'You need to count set bits, check power of 2, or manipulate individual bits',
      'The problem mentions "bitwise operations" or works with binary representations',
      'You need O(1) space for a problem that seems to require a set or map',
      'Encoding/decoding two values into a single integer'
    ],
    trick: `XOR: a ^ a = 0, a ^ 0 = a. Use XOR to find the single unique number. n & (n-1) removes the lowest set bit. n & (-n) isolates the lowest set bit.`,
    codeTemplate: `#include <vector>
using namespace std;

// Single Number (XOR all elements)
int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int num : nums)
        result ^= num;
    return result;
}

// Count set bits (Brian Kernighan's algorithm)
int countBits(int n) {
    int count = 0;
    while (n) {
        n &= (n - 1); // remove lowest set bit
        count++;
    }
    return count;
}

// Check power of 2
bool isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

// Get / Set / Clear bit at position i
int getBit(int n, int i)   { return (n >> i) & 1; }
int setBit(int n, int i)   { return n | (1 << i); }
int clearBit(int n, int i) { return n & ~(1 << i); }`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'bit-1',
        title: 'Single Number',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/single-number/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/bit-manipulation/single-number-i' }
        ],
        tags: ['bit-manipulation', 'xor']
      },
      {
        id: 'bit-2',
        title: 'Number of 1 Bits',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/number-of-1-bits/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/number-of-one-bits' }
        ],
        tags: ['bit-manipulation']
      },
      {
        id: 'bit-3',
        title: 'Counting Bits',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/counting-bits/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/counting-bits' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/counting-bits' }
        ],
        tags: ['bit-manipulation', 'dp']
      },
      {
        id: 'bit-4',
        title: 'Reverse Bits',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/reverse-bits/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/reverse-bits' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/bit-manipulation/reverse-bits' }
        ],
        tags: ['bit-manipulation']
      },
      {
        id: 'bit-5',
        title: 'Missing Number',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/missing-number/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/missing-number' }
        ],
        tags: ['bit-manipulation', 'xor', 'math']
      },
      {
        id: 'bit-6',
        title: 'Sum of Two Integers',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/sum-of-two-integers/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/sum-of-two-integers' }
        ],
        tags: ['bit-manipulation']
      }
    ],
    resources: [
      { label: 'NeetCode - Bit Manipulation', url: 'https://neetcode.io/roadmap' },
      { label: 'Bit Manipulation Tricks - GFG', url: 'https://www.geeksforgeeks.org/bits-manipulation-important-tactics/' }
    ]
  },

  {
    id: 'dp-strings',
    name: 'DP on Strings',
    tier: 3,
    order: 20,
    category: 'Dynamic Programming',
    explanation: `DP on Strings is a specialisation of 2D DP where the two dimensions correspond to positions in one or two strings. The state dp[i][j] typically represents the answer for the subproblem involving s1[0..i-1] and s2[0..j-1] (or for a single string, the substring s[i..j]).

The classic problems are: Edit Distance (dp[i][j] = min operations to convert s1[0..i-1] to s2[0..j-1], with insert/delete/replace transitions), Longest Common Subsequence (match characters or skip), and Longest Palindromic Subsequence (LCS of s and reverse(s)). For single-string interval DP, dp[i][j] = answer for substring s[i..j], filled diagonally by increasing length.

These problems appear frequently in interviews at top companies. The key is to identify the correct recurrence by considering what happens at the boundary characters: if s1[i-1] == s2[j-1], take the diagonal + 1; otherwise, try all possible operations and pick the best.`,
    whenToUse: [
      'The problem asks for edit distance, LCS, or longest palindromic subsequence/substring',
      'You need to compare two strings character by character and find optimal alignment',
      'The problem involves transforming one string into another with allowed operations',
      'You need to find the longest or shortest string with certain properties involving two inputs',
      'The problem involves palindromes on a string (interval DP on s[i..j])'
    ],
    trick: `For two strings: dp[i][j] for s1[:i] and s2[:j]. If chars match, go diagonal. If not, try all ops (insert/delete/replace) and take best.`,
    codeTemplate: `#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// Edit Distance
int editDistance(const string& word1, const string& word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));

    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i-1] == word2[j-1])
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + min({
                    dp[i-1][j],     // delete
                    dp[i][j-1],     // insert
                    dp[i-1][j-1]    // replace
                });
        }
    }

    return dp[m][n];
}

// Longest Palindromic Substring (expand around center)
string longestPalindrome(const string& s) {
    int start = 0, maxLen = 0;
    int n = s.size();

    for (int i = 0; i < n; i++) {
        // Try odd and even length palindromes
        for (auto [l, r] : vector<pair<int,int>>{{i, i}, {i, i+1}}) {
            while (l >= 0 && r < n && s[l] == s[r]) {
                if (r - l + 1 > maxLen) {
                    start = l;
                    maxLen = r - l + 1;
                }
                l--;
                r++;
            }
        }
    }

    return s.substr(start, maxLen);
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'dps-1',
        title: 'Longest Palindromic Substring',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-palindromic-substring/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-palindromic-substring' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/longest-palindromic-substring' }
        ],
        tags: ['dp', 'string', 'palindrome']
      },
      {
        id: 'dps-2',
        title: 'Edit Distance',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/edit-distance/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/edit-distance' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/edit-distance-dp-33' }
        ],
        tags: ['dp', 'string', 'two-strings']
      },
      {
        id: 'dps-3',
        title: 'Longest Common Subsequence',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-subsequence/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/longest-common-subsequence' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/longest-common-subsequence-dp-25' }
        ],
        tags: ['dp', 'string', 'two-strings']
      },
      {
        id: 'dps-4',
        title: 'Palindromic Substrings',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/palindromic-substrings/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/palindromic-substrings' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/palindromic-substrings' }
        ],
        tags: ['dp', 'string', 'palindrome']
      },
      {
        id: 'dps-5',
        title: 'Distinct Subsequences',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/distinct-subsequences/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/count-subsequences' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/distinct-subsequences-dp-32' }
        ],
        tags: ['dp', 'string']
      },
      {
        id: 'dps-6',
        title: 'Regular Expression Matching',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/regular-expression-matching/' }
        ],
        tags: ['dp', 'string', 'pattern-matching']
      }
    ],
    resources: [
      { label: 'NeetCode - 2-D Dynamic Programming', url: 'https://neetcode.io/roadmap' },
      { label: 'Edit Distance - GFG', url: 'https://www.geeksforgeeks.org/edit-distance-dp-5/' }
    ]
  },

  {
    id: 'segment-tree',
    name: 'Segment Tree / BIT',
    tier: 3,
    order: 21,
    category: 'Advanced Patterns',
    explanation: `A Segment Tree is a binary tree that stores aggregate information (sum, min, max, GCD, etc.) for segments (ranges) of an array. Each leaf holds one element, and each internal node holds the aggregate of its children's ranges. It supports both point updates and range queries in O(log n) time.

A Binary Indexed Tree (BIT / Fenwick Tree) is a simpler, more space-efficient alternative that supports prefix sum queries and point updates in O(log n). BIT uses a clever indexing scheme based on the lowest set bit: index i is responsible for elements in the range [i - lowbit(i) + 1, i]. BIT is easier to implement but less flexible than a segment tree (it handles prefix queries naturally but arbitrary range queries require tricks).

These data structures are overkill for most interviews but appear at top-tier companies (Google, Meta) and competitive programming. Use them when the problem requires both updates and range queries — a prefix sum array can't handle updates efficiently.`,
    whenToUse: [
      'You need both range queries (sum, min, max) AND point or range updates on the same array',
      'The problem involves "mutable" range sums (vs immutable prefix sum)',
      'You need to count elements in a range or find the k-th smallest in a dynamic set',
      'Competitive programming problems with query + update operations',
      'The problem requires O(log n) per query and update on an array'
    ],
    trick: `BIT: update(i) goes up (i += i & -i), query(i) goes down (i -= i & -i). Segment tree: build recursively, query/update by splitting ranges at midpoints.`,
    codeTemplate: `#include <vector>
using namespace std;

// Binary Indexed Tree (Fenwick Tree)
class BIT {
    int n;
    vector<int> tree;
public:
    BIT(int n) : n(n), tree(n + 1, 0) {}

    void update(int i, int delta) {
        for (; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    int query(int i) {
        int s = 0;
        for (; i > 0; i -= i & (-i))
            s += tree[i];
        return s;
    }

    int rangeQuery(int l, int r) {
        return query(r) - query(l - 1);
    }
};

// Segment Tree (sum queries)
class SegmentTree {
    int n;
    vector<int> tree;
public:
    SegmentTree(vector<int>& nums) : n(nums.size()), tree(2 * nums.size(), 0) {
        // build
        for (int i = 0; i < n; i++)
            tree[n + i] = nums[i];
        for (int i = n - 1; i > 0; i--)
            tree[i] = tree[2*i] + tree[2*i+1];
    }

    void update(int i, int val) {
        i += n;
        tree[i] = val;
        while (i > 1) {
            i /= 2;
            tree[i] = tree[2*i] + tree[2*i+1];
        }
    }

    int query(int l, int r) { // [l, r)
        int res = 0;
        for (l += n, r += n; l < r; l /= 2, r /= 2) {
            if (l & 1) res += tree[l++];
            if (r & 1) res += tree[--r];
        }
        return res;
    }
};`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'seg-1',
        title: 'Range Sum Query - Mutable',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/range-sum-query-mutable/' }
        ],
        tags: ['segment-tree', 'bit']
      },
      {
        id: 'seg-2',
        title: 'Count of Smaller Numbers After Self',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/' }
        ],
        tags: ['segment-tree', 'bit', 'merge-sort']
      },
      {
        id: 'seg-3',
        title: 'Reverse Pairs',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/reverse-pairs/' }
        ],
        tags: ['segment-tree', 'merge-sort']
      },
      {
        id: 'seg-4',
        title: 'Count of Range Sum',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/count-of-range-sum/' }
        ],
        tags: ['segment-tree', 'merge-sort']
      }
    ],
    resources: [
      { label: 'Segment Tree - GFG', url: 'https://www.geeksforgeeks.org/segment-tree-data-structure/' },
      { label: 'Fenwick Tree (BIT) - GFG', url: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/' }
    ]
  },

  {
    id: 'graph-advanced',
    name: 'Graph Advanced (Dijkstra, etc.)',
    tier: 3,
    order: 22,
    category: 'Tree & Graph Patterns',
    explanation: `Advanced graph algorithms handle weighted graphs and more complex constraints. Dijkstra's Algorithm finds the shortest path from a source to all vertices in a graph with non-negative edge weights, using a min-heap. It runs in O((V + E) log V) with a priority queue. At each step, extract the node with the smallest known distance and relax its neighbours.

Bellman-Ford handles negative weights (but no negative cycles) in O(V * E) by relaxing all edges V-1 times. Floyd-Warshall computes all-pairs shortest paths in O(V^3). For minimum spanning trees, Kruskal's algorithm sorts edges by weight and adds them greedily using Union-Find, while Prim's grows a tree from a starting node using a min-heap.

In interviews, Dijkstra is by far the most common advanced graph algorithm. It appears as "cheapest flights within k stops," "network delay time," and "swim in rising water." The key insight: BFS = Dijkstra with all weights = 1.`,
    whenToUse: [
      'The graph has weighted edges and you need the shortest path (Dijkstra)',
      'You need the shortest path with negative edges but no negative cycles (Bellman-Ford)',
      'You need a minimum spanning tree (Kruskal or Prim)',
      'The problem asks for "minimum cost to reach destination" in a weighted graph',
      'You see "network delay", "cheapest flights", or "shortest path with constraints"'
    ],
    trick: `Dijkstra = BFS with a min-heap instead of a queue. Never revisit a node once it's been finalised (popped from heap). Only works with non-negative weights.`,
    codeTemplate: `#include <vector>
#include <queue>
#include <climits>
using namespace std;

vector<int> dijkstra(int n, vector<vector<int>>& edges, int source) {
    vector<vector<pair<int,int>>> graph(n);
    for (auto& e : edges)
        graph[e[0]].push_back({e[1], e[2]});

    vector<int> dist(n, INT_MAX);
    dist[source] = 0;
    // min-heap: {distance, node}
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> heap;
    heap.push({0, source});

    while (!heap.empty()) {
        auto [d, u] = heap.top();
        heap.pop();
        if (d > dist[u]) continue; // skip stale entries
        for (auto [v, w] : graph[u]) {
            int newDist = d + w;
            if (newDist < dist[v]) {
                dist[v] = newDist;
                heap.push({newDist, v});
            }
        }
    }

    return dist;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'ga-1',
        title: 'Network Delay Time',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/network-delay-time/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/network-delay-time' }
        ],
        tags: ['dijkstra', 'graph', 'shortest-path']
      },
      {
        id: 'ga-2',
        title: 'Cheapest Flights Within K Stops',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/g-38-cheapest-flights-within-k-stops' }
        ],
        tags: ['bellman-ford', 'bfs', 'graph']
      },
      {
        id: 'ga-3',
        title: 'Swim in Rising Water',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/swim-in-rising-water/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/swim-in-rising-water' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/swim-in-rising-water' }
        ],
        tags: ['dijkstra', 'binary-search', 'grid']
      },
      {
        id: 'ga-4',
        title: 'Min Cost to Connect All Points',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/min-cost-to-connect-points' }
        ],
        tags: ['mst', 'prim', 'kruskal']
      },
      {
        id: 'ga-5',
        title: 'Path with Maximum Probability',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/path-with-maximum-probability/' }
        ],
        tags: ['dijkstra', 'graph']
      },
      {
        id: 'ga-6',
        title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/' }
        ],
        tags: ['floyd-warshall', 'dijkstra', 'graph']
      }
    ],
    resources: [
      { label: 'NeetCode - Graphs (Advanced)', url: 'https://neetcode.io/roadmap' },
      { label: 'Dijkstra Algorithm - GFG', url: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/' }
    ]
  },

  {
    id: 'design-oop',
    name: 'Design / OOP Problems',
    tier: 3,
    order: 23,
    category: 'Advanced Patterns',
    explanation: `Design problems ask you to implement a data structure or system class with specific operations, each meeting certain time/space complexity requirements. Unlike algorithmic problems, these test your ability to compose multiple data structures and manage state cleanly.

Common patterns: (1) Hash Map + Doubly Linked List for O(1) LRU/LFU Cache, (2) Array + Hash Map for O(1) insert/delete/getRandom (RandomizedSet), (3) Stack of stacks or queue of queues for nested iteration (Flatten Nested List), (4) Prefix arrays or hash maps for time-based key-value stores.

The key to these problems is starting by listing the required operations and their target complexities, then working backwards to find a data structure combination that achieves all of them. Often, a single data structure isn't enough — you need to combine two (e.g., hash map for O(1) lookup + linked list for O(1) ordering).`,
    whenToUse: [
      'The problem says "Design a class that supports..." with specific operations',
      'You need to achieve O(1) for multiple operations that normally conflict (lookup + ordering)',
      'The problem involves implementing a cache (LRU, LFU), iterator, or data stream processor',
      'You need to build a system component (rate limiter, file system, Twitter feed)',
      'The problem requires combining two or more data structures for optimal complexity'
    ],
    trick: `List required operations and their target complexities. Find the data structure combo that achieves all of them. Hash Map + Linked List is the most common combo.`,
    codeTemplate: `#include <unordered_map>
using namespace std;

// LRU Cache: Hash Map + Doubly Linked List
struct Node {
    int key, val;
    Node *prev, *next;
    Node(int k = 0, int v = 0) : key(k), val(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
    int cap;
    unordered_map<int, Node*> cache; // key -> Node
    Node *head, *tail; // dummy head (most recent), dummy tail (least recent)

    void remove(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    void addToFront(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }

public:
    LRUCache(int capacity) : cap(capacity) {
        head = new Node();
        tail = new Node();
        head->next = tail;
        tail->prev = head;
    }

    int get(int key) {
        if (!cache.count(key)) return -1;
        Node* node = cache[key];
        remove(node);
        addToFront(node);
        return node->val;
    }

    void put(int key, int value) {
        if (cache.count(key))
            remove(cache[key]);
        Node* node = new Node(key, value);
        cache[key] = node;
        addToFront(node);
        if ((int)cache.size() > cap) {
            Node* lru = tail->prev;
            remove(lru);
            cache.erase(lru->key);
            delete lru;
        }
    }
};`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'design-1',
        title: 'LRU Cache',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/lru-cache/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/lru-cache' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/implement-lru-cache' }
        ],
        tags: ['design', 'hash-map', 'linked-list']
      },
      {
        id: 'design-2',
        title: 'Insert Delete GetRandom O(1)',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/' }
        ],
        tags: ['design', 'hash-map', 'array']
      },
      {
        id: 'design-3',
        title: 'Design Twitter',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/design-twitter/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/design-twitter-feed' }
        ],
        tags: ['design', 'heap', 'hash-map']
      },
      {
        id: 'design-4',
        title: 'Time Based Key-Value Store',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/time-based-key-value-store/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/time-based-key-value-store' }
        ],
        tags: ['design', 'binary-search', 'hash-map']
      },
      {
        id: 'design-5',
        title: 'Implement Queue using Stacks',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/implement-queue-using-stacks/' }
        ],
        tags: ['design', 'stack', 'queue']
      },
      {
        id: 'design-6',
        title: 'Design Circular Queue',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/design-circular-queue/' }
        ],
        tags: ['design', 'queue', 'array']
      }
    ],
    resources: [
      { label: 'NeetCode - Design Problems', url: 'https://neetcode.io/roadmap' },
      { label: 'System Design Interview - GFG', url: 'https://www.geeksforgeeks.org/system-design-tutorial/' }
    ]
  },

  // ============================================================
  // TIER 4 — Niche
  // ============================================================
  {
    id: 'math-geometry',
    name: 'Math & Geometry',
    tier: 4,
    order: 24,
    category: 'Advanced Patterns',
    explanation: `Math and geometry problems require recognising mathematical patterns, formulas, or properties rather than standard data structure techniques. Common themes include: modular arithmetic, prime numbers, GCD/LCM, combinatorics, matrix operations (rotate, spiral traversal), and coordinate geometry.

Matrix problems like "Rotate Image" (rotate 90 degrees in-place) and "Spiral Matrix" (traverse in spiral order) are pattern-based: for rotation, first transpose (swap rows and columns), then reverse each row. For spiral, maintain four boundaries (top, bottom, left, right) and shrink them as you traverse.

Number theory problems include "Power of Three" (check if n = 3^k), "Happy Number" (detect cycle using fast/slow or hash set), and "Count Primes" (Sieve of Eratosthenes). These often have elegant O(1) or O(sqrt(n)) solutions but require knowing the underlying math.`,
    whenToUse: [
      'The problem involves matrix rotation, spiral traversal, or in-place matrix manipulation',
      'You need to use modular arithmetic, GCD, or prime number properties',
      'The problem can be solved with a mathematical formula rather than an algorithm',
      'You see geometric concepts: distance, area, collinear points, convex hull',
      'The problem involves number properties: palindrome number, happy number, power of N'
    ],
    trick: `Rotate matrix: transpose + reverse rows. Spiral: 4 boundaries (top/bottom/left/right), shrink after each pass. Modulo: (a+b)%m = ((a%m)+(b%m))%m.`,
    codeTemplate: `#include <vector>
#include <algorithm>
using namespace std;

// Rotate Matrix 90 degrees clockwise (in-place)
void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // Reverse each row
    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}

// Spiral Matrix
vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;

    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++)
            result.push_back(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++)
            result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom) {
            for (int j = right; j >= left; j--)
                result.push_back(matrix[bottom][j]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--)
                result.push_back(matrix[i][left]);
            left++;
        }
    }

    return result;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'math-1',
        title: 'Rotate Image',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/rotate-image/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/rotate-matrix' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/rotate-image-by-90-degree' }
        ],
        tags: ['matrix', 'in-place']
      },
      {
        id: 'math-2',
        title: 'Spiral Matrix',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/spiral-matrix/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/spiral-matrix' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/spiral-traversal-of-matrix' }
        ],
        tags: ['matrix', 'simulation']
      },
      {
        id: 'math-3',
        title: 'Set Matrix Zeroes',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/set-matrix-zeroes/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/set-zeroes-in-matrix' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/set-matrix-zero' }
        ],
        tags: ['matrix', 'in-place']
      },
      {
        id: 'math-4',
        title: 'Happy Number',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/happy-number/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/non-cyclical-number' }
        ],
        tags: ['math', 'cycle-detection']
      },
      {
        id: 'math-5',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/powx-n/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/pow-x-n' }
        ],
        tags: ['math', 'binary-exponentiation']
      },
      {
        id: 'math-6',
        title: 'Count Primes',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/count-primes/' }
        ],
        tags: ['math', 'sieve']
      }
    ],
    resources: [
      { label: 'NeetCode - Math & Geometry', url: 'https://neetcode.io/roadmap' },
      { label: 'Matrix Rotation - GFG', url: 'https://www.geeksforgeeks.org/rotate-a-matrix-by-90-degree-in-clockwise-direction-without-using-any-extra-space/' }
    ]
  },

  {
    id: 'string-algorithms',
    name: 'String Algorithms',
    tier: 4,
    order: 25,
    category: 'Advanced Patterns',
    explanation: `String algorithm problems go beyond basic string manipulation to involve pattern matching, encoding, and transformation algorithms. The most important one for interviews is the KMP (Knuth-Morris-Pratt) algorithm for substring search in O(n + m), but many interview problems use simpler techniques like two pointers, sliding window, or hash-based methods on strings.

Key interview string techniques: (1) Character frequency counting with arrays or hash maps (anagram detection, character rearrangement). (2) String encoding/decoding (run-length encoding, encode/decode strings with length prefix). (3) Palindrome checking with two pointers or expand-around-center. (4) String-to-integer and integer-to-string conversions with careful edge case handling.

The Rabin-Karp algorithm uses rolling hash functions for O(n) average-case pattern matching. While rarely asked directly, the rolling hash technique appears in problems like "Repeated DNA Sequences" and "Longest Duplicate Substring."`,
    whenToUse: [
      'The problem involves substring search or pattern matching',
      'You need to encode, decode, or compress strings',
      'The problem involves string transformation or comparison operations',
      'You need to find repeated patterns or longest repeated substrings',
      'The problem involves converting between string and numeric representations'
    ],
    trick: `KMP builds a "failure function" (longest proper prefix that is also a suffix). For most interviews, two pointers + hash map on strings is sufficient.`,
    codeTemplate: `#include <string>
#include <vector>
using namespace std;

// KMP Pattern Matching
vector<int> kmpSearch(const string& text, const string& pattern) {
    // Build failure/LPS array
    int m = pattern.size();
    vector<int> lps(m, 0);
    int length = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[length]) {
            lps[i++] = ++length;
        } else if (length) {
            length = lps[length - 1];
        } else {
            lps[i++] = 0;
        }
    }

    // Search
    vector<int> matches;
    int ti = 0, pi = 0;
    int n = text.size();
    while (ti < n) {
        if (text[ti] == pattern[pi]) {
            ti++;
            pi++;
        }
        if (pi == m) {
            matches.push_back(ti - pi);
            pi = lps[pi - 1];
        } else if (ti < n && text[ti] != pattern[pi]) {
            if (pi) pi = lps[pi - 1];
            else ti++;
        }
    }

    return matches;
}

// Encode and Decode Strings
string encode(vector<string>& strs) {
    string result;
    for (auto& s : strs)
        result += to_string(s.size()) + "#" + s;
    return result;
}

vector<string> decode(const string& s) {
    vector<string> result;
    int i = 0;
    while (i < (int)s.size()) {
        int j = s.find('#', i);
        int length = stoi(s.substr(i, j - i));
        result.push_back(s.substr(j + 1, length));
        i = j + 1 + length;
    }
    return result;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'str-1',
        title: 'Encode and Decode Strings',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/encode-and-decode-strings/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/string-encode-and-decode' }
        ],
        tags: ['string', 'encoding']
      },
      {
        id: 'str-2',
        title: 'Longest Common Prefix',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-common-prefix/' }
        ],
        tags: ['string', 'prefix']
      },
      {
        id: 'str-3',
        title: 'String to Integer (atoi)',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/string-to-integer-atoi/' }
        ],
        tags: ['string', 'parsing']
      },
      {
        id: 'str-4',
        title: 'Find the Index of the First Occurrence in a String',
        difficulty: 'easy',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/' }
        ],
        tags: ['string', 'kmp']
      },
      {
        id: 'str-5',
        title: 'Repeated DNA Sequences',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/repeated-dna-sequences/' }
        ],
        tags: ['string', 'hash-map', 'rolling-hash']
      },
      {
        id: 'str-6',
        title: 'Multiply Strings',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/multiply-strings/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/multiply-strings' }
        ],
        tags: ['string', 'math']
      }
    ],
    resources: [
      { label: 'KMP Algorithm - GFG', url: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/' },
      { label: 'NeetCode - Arrays & Hashing', url: 'https://neetcode.io/roadmap' }
    ]
  },

  {
    id: 'monotonic-queue',
    name: 'Monotonic Queue / Deque',
    tier: 4,
    order: 26,
    category: 'Advanced Patterns',
    explanation: `A Monotonic Queue (implemented with a deque) maintains elements in sorted order (increasing or decreasing) while supporting efficient insertion and removal from both ends. It is the optimal solution for "sliding window maximum/minimum" problems — finding the max or min in every window of size k in O(n) total time.

The key insight: when a new element enters the window and is larger than elements already in the deque, those older elements can never be the maximum again (the new element is both larger and will stay in the window longer). So, pop them from the back. The front of the deque always holds the current maximum. When the front element falls outside the window, pop it from the front.

This pattern is rarer than monotonic stacks in interviews, but "Sliding Window Maximum" is a well-known hard problem that appears at top companies. The same deque technique also applies to "shortest subarray with sum at least K" (using prefix sums with a monotonic deque).`,
    whenToUse: [
      'You need the maximum or minimum in every sliding window of size k (Sliding Window Maximum)',
      'You need to maintain a sorted window while elements enter and leave from both ends',
      'A monotonic stack problem but elements also need to be removed from the front (expiring elements)',
      'Shortest subarray with sum >= k (monotonic deque on prefix sums)',
      'Optimising DP transitions where you need the min/max of dp[j] for j in a sliding range'
    ],
    trick: `Deque stores indices in decreasing order of values. Pop from back if new value >= back value. Pop from front if index is out of window. Front = current max.`,
    codeTemplate: `#include <vector>
#include <deque>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq; // stores indices, values in decreasing order
    vector<int> result;

    for (int i = 0; i < (int)nums.size(); i++) {
        // Remove elements outside the window
        while (!dq.empty() && dq.front() < i - k + 1)
            dq.pop_front();

        // Remove elements smaller than current (they can never be max)
        while (!dq.empty() && nums[dq.back()] <= nums[i])
            dq.pop_back();

        dq.push_back(i);

        // Window is fully formed starting at index k-1
        if (i >= k - 1)
            result.push_back(nums[dq.front()]);
    }

    return result;
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'mq-1',
        title: 'Sliding Window Maximum',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/sliding-window-maximum/' },
          { label: 'NeetCode', url: 'https://neetcode.io/problems/sliding-window-maximum' },
          { label: 'TakeUForward', url: 'https://takeuforward.org/data-structure/sliding-window-maximum' }
        ],
        tags: ['monotonic-queue', 'deque', 'sliding-window']
      },
      {
        id: 'mq-2',
        title: 'Shortest Subarray with Sum at Least K',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/' }
        ],
        tags: ['monotonic-queue', 'prefix-sum']
      },
      {
        id: 'mq-3',
        title: 'Jump Game VI',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/jump-game-vi/' }
        ],
        tags: ['monotonic-queue', 'dp']
      },
      {
        id: 'mq-4',
        title: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/' }
        ],
        tags: ['monotonic-queue', 'sliding-window']
      },
      {
        id: 'mq-5',
        title: 'Constrained Subsequence Sum',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/constrained-subsequence-sum/' }
        ],
        tags: ['monotonic-queue', 'dp']
      }
    ],
    resources: [
      { label: 'Sliding Window Maximum - GFG', url: 'https://www.geeksforgeeks.org/sliding-window-maximum-maximum-of-all-subarrays-of-size-k/' },
      { label: 'NeetCode - Sliding Window', url: 'https://neetcode.io/roadmap' }
    ]
  },

  {
    id: 'dp-bitmask',
    name: 'DP with Bitmask',
    tier: 4,
    order: 27,
    category: 'Dynamic Programming',
    explanation: `Bitmask DP uses an integer's binary representation to encode a subset of items. If there are n items (typically n <= 20), a bitmask of n bits represents which items have been "used" or "visited." The state is dp[mask] (or dp[mask][i] where i is the current position), and transitions flip bits to include or exclude items.

The classic application is the Travelling Salesman Problem (TSP): dp[mask][i] = minimum cost to visit the set of cities represented by mask, ending at city i. Transition: for each city j not in mask, dp[mask | (1 << j)][j] = min(dp[mask][i] + dist[i][j]). Time complexity is O(2^n * n^2), space is O(2^n * n).

Other applications include assigning n workers to n jobs optimally, counting Hamiltonian paths, and partition problems where you need to track which elements have been assigned to which group. The key constraint is n <= 20 (since 2^20 = ~10^6 states).`,
    whenToUse: [
      'The problem involves assigning or visiting n items optimally where n <= 20',
      'You need to track "which subset of items has been used" as part of the DP state',
      'The problem is a variant of TSP (visit all nodes with minimum cost)',
      'Brute-force would try all n! permutations but many subsets lead to the same state',
      'The problem asks to partition items into groups optimally'
    ],
    trick: `Use integer bits to represent subsets. Check if bit i is set: mask & (1 << i). Set bit i: mask | (1 << i). n must be <= 20 for this to be feasible.`,
    codeTemplate: `#include <vector>
#include <climits>
#include <algorithm>
using namespace std;

// Travelling Salesman Problem (TSP)
int tsp(vector<vector<int>>& dist) {
    int n = dist.size();
    int INF = INT_MAX / 2;
    // dp[mask][i] = min cost to visit cities in mask, ending at i
    vector<vector<int>> dp(1 << n, vector<int>(n, INF));
    dp[1][0] = 0; // start at city 0

    for (int mask = 0; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (dp[mask][u] == INF) continue;
            if (!(mask & (1 << u))) continue;
            for (int v = 0; v < n; v++) {
                if (mask & (1 << v)) continue; // already visited
                int newMask = mask | (1 << v);
                dp[newMask][v] = min(dp[newMask][v], dp[mask][u] + dist[u][v]);
            }
        }
    }

    int fullMask = (1 << n) - 1;
    // Return to start: min over all ending cities
    int ans = INF;
    for (int i = 0; i < n; i++)
        ans = min(ans, dp[fullMask][i] + dist[i][0]);
    return ans;
}

// Count subsets using bitmask
void enumerateSubsets(int n) {
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++)
            if (mask & (1 << i))
                subset.push_back(i);
        // process subset
    }
}`,
    codeLanguage: 'cpp',
    problems: [
      {
        id: 'dpb-1',
        title: 'Partition to K Equal Sum Subsets',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/' }
        ],
        tags: ['dp', 'bitmask', 'backtracking']
      },
      {
        id: 'dpb-2',
        title: 'Shortest Path Visiting All Nodes',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/shortest-path-visiting-all-nodes/' }
        ],
        tags: ['dp', 'bitmask', 'bfs']
      },
      {
        id: 'dpb-3',
        title: 'Maximum Students Taking Exam',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/maximum-students-taking-exam/' }
        ],
        tags: ['dp', 'bitmask']
      },
      {
        id: 'dpb-4',
        title: 'Find the Shortest Superstring',
        difficulty: 'hard',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/find-the-shortest-superstring/' }
        ],
        tags: ['dp', 'bitmask', 'tsp']
      },
      {
        id: 'dpb-5',
        title: 'Can I Win',
        difficulty: 'medium',
        links: [
          { label: 'LeetCode', url: 'https://leetcode.com/problems/can-i-win/' }
        ],
        tags: ['dp', 'bitmask', 'game-theory']
      }
    ],
    resources: [
      { label: 'Bitmask DP - GFG', url: 'https://www.geeksforgeeks.org/bitmasking-and-dynamic-programming-set-1-count-ways-to-assign-unique-cap-to-every-person/' },
      { label: 'TSP using DP - GFG', url: 'https://www.geeksforgeeks.org/travelling-salesman-problem-using-dynamic-programming/' }
    ]
  }
];
