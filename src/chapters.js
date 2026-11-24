export const chapters = [
  {
    id: 2, title: 'Algorithm foundations', group: 'Foundations', mark: 'O(n)',
    intro: 'Turn a problem into clear instructions, then estimate how the work grows with the input.',
    topics: [
      ['Problem-solving process', 'Define the problem and success criteria. Analyze the inputs and constraints, design a solution, implement it, test it, and refine it.', 4, 13],
      ['Solving strategies', 'Divide and conquer splits a task into smaller problems. Pattern recognition reuses a familiar structure. Root-cause analysis traces a symptom back to the underlying issue.', 14, 17],
      ['Pseudocode and input–process–output', 'Describe the logic in structured language. Start with the input, apply clear conditions or loops, and state the output. Trace an example before implementing it.', 18, 25],
      ['Big O notation', 'Big O describes an asymptotic upper bound. Constant, logarithmic, linear, and quadratic work grow at different rates. Name the input size and distinguish runtime from extra memory.', 26, 35],
      ['Practice puzzles', 'Trace the river-crossing constraints, measure exactly 4 liters with 5- and 3-liter containers, or locate one heavier box with a balance scale. Describe the algorithm and its cost.', 36, 40],
    ],
  },
  {
    id: 3, title: 'Arrays & Java basics', group: 'Foundations', mark: '[ ]',
    intro: 'Connect abstract data types to concrete storage, and see how Java programs use arrays and strings.',
    topics: [
      ['Data structures and abstract data types', 'A data structure implements a way to organize data. An abstract data type (ADT) specifies operations and behavior separately from storage. A list, for example, can be backed by an array or by linked nodes.', 6, 20],
      ['Control flow', 'Use conditions to choose a branch, loops to repeat a step, break to exit a loop, and continue to skip to the next iteration.', 23, 23],
      ['Static and dynamic arrays', 'Java arrays have fixed length and zero-based indexing. An ArrayList grows as needed, typically by allocating a larger backing array and copying entries. Index access is O(1), and appending is amortized O(1).', 21, 33],
      ['String handling', 'Java strings are immutable. Operations such as substring and replace return a result without changing the original string. Use equals to compare contents.', 34, 36],
      ['Java program structure', 'The source covers keywords, packages, the compiler and JVM, comments, class declarations, and the main method. The compiler produces bytecode for the JVM.', 37, 49],
      ['Sudoku exercise', 'Use a two-dimensional array to represent a grid. Check the row, column, and 3 × 3 box when considering a candidate.', 50, 50],
    ],
  },
  {
    id: 4, title: 'Nodes & linked lists', group: 'Data structures', mark: '↔',
    intro: 'Follow the links between nodes and trace what changes when a list grows, shrinks, or wraps around.',
    topics: [
      ['Sudoku and backtracking', 'Fill cells with legal candidates. If a cell has no legal candidate, return to a previous choice and try another. Check rows, columns, and boxes before placing a digit.', 3, 11],
      ['Nodes and singly linked lists', 'A node holds data and a reference to the next node. Traverse from the head to find a value. Once the predecessor is known, inserting or removing the next node takes O(1) pointer changes.', 12, 26],
      ['Doubly linked lists', 'Each node stores next and previous references. Update both links when adding or removing nodes. Handle head, tail, and one-node cases explicitly.', 27, 44],
      ['Circular linked lists', 'The tail points back to the head. Bound traversal by a node count or stop when the head is reached again. For the elimination exercise, continue counting from the node after each removal.', 45, 46],
    ],
  },
  {
    id: 5, title: 'Stacks, queues & recursion', group: 'Data structures', mark: '≡',
    intro: 'Compare removal order, trace recursive calls, and see how backtracking undoes a choice.',
    topics: [
      ['Stacks and LIFO', 'Push adds to the top, pop removes the top, and peek reads it. A fixed-capacity array stack can use top = −1 for empty. Guard against removing from an empty stack and adding to a full one.', 3, 14],
      ['Queues and FIFO', 'Enqueue adds at the rear, dequeue removes from the front, and peek reads the front. A circular array queue wraps front and rear with modulo arithmetic and tracks the number of stored items.', 15, 32],
      ['Recursion and the call stack', 'A base case stops recursion. Every recursive path should progress toward it. Each active call consumes a stack frame. Factorial has one call per level, while naïve Fibonacci repeats many subproblems.', 33, 51],
      ['Backtracking', 'Try a choice, check constraints, recurse, and undo the choice if it fails. Prune invalid branches early. Trace how Sudoku and similar puzzles explore a decision tree.', 52, 61],
    ],
  },
  {
    id: 6, title: 'Searching algorithms', group: 'Search & sort', mark: '⌕',
    intro: 'Find a target by scanning, halving, estimating a position, or growing a search range.',
    topics: [
      ['Linear search', 'Check one item at a time until the target appears or the array ends. It works on unsorted input and takes O(n) time in the worst case.', 4, 6],
      ['Binary search', 'In a sorted array, compare with the middle element and discard the half that cannot contain the target. An iterative implementation uses O(log n) time and O(1) extra space.', 7, 12],
      ['Interpolation search', 'In a sorted numeric array, estimate a position by comparing the target with the endpoint values. Roughly uniform spacing can give expected O(log log n) probes. Worst-case time is O(n).', 13, 18],
      ['Exponential search', 'Probe indices 1, 2, 4, and so on, then binary search the bracketed range. A target at index i can be found in O(log(i + 1)) time for i ≥ 1.', 19, 24],
      ['Practice with Java', 'Search the student ID lists. Record comparisons, try missing targets, and compare how changing the input order affects which methods apply.', 25, 30],
    ],
  },
  {
    id: 7, title: 'Sorting algorithms', group: 'Search & sort', mark: '▥',
    intro: 'Watch values move into order and compare time, extra space, stability, and input sensitivity.',
    topics: [
      ['Sorting trade-offs', 'Stable sorts preserve the order of equal keys. An in-place sort rearranges the existing array, and an adaptive sort can exploit input that is already partly ordered.', 3, 10],
      ['Bubble, selection, and insertion', 'Bubble sort swaps adjacent out-of-order items. Selection sort finds and places the minimum remaining item. Insertion sort shifts larger items to insert a key into the sorted prefix.', 11, 16],
      ['Merge sort', 'Split repeatedly until ranges are trivial, then merge sorted halves. Merging in favor of the left side on a tie gives stability. Array merge sort uses O(n log n) time and O(n) extra space.', 17, 19],
      ['Quick sort', 'Partition around a pivot, then sort the two sides. Good partitions yield O(n log n) work. Highly unbalanced partitions can take O(n²) time and O(n) stack space with naïve recursion.', 20, 22],
      ['Heap sort', 'Build a max-heap, then swap its root with the last unsorted item and restore the heap. Heap sort runs in O(n log n) time and can use constant auxiliary space with iterative heap repair.', 23, 25],
      ['Compare implementations', 'Compare stability and adaptiveness, then run the chapter’s Java sorting exercise and track algorithm behavior on arrays of different sizes.', 26, 28],
    ],
  },
  {
    id: 8, title: 'Hash tables', group: 'Data structures', mark: '#',
    intro: 'Map a key to a bucket and see what happens when multiple keys land in the same place.',
    topics: [
      ['Keys, hash functions, and buckets', 'A deterministic hash maps each key to an index. A well-distributed hash and controlled load support expected O(1) lookup. Worst-case lookup can still be O(n).', 4, 9],
      ['Hash function methods', 'The slides discuss division, multiplication, mid-square, folding, string hashing, and cryptographic digests. Table indexing needs good distribution. Cryptographic digests serve different goals, and passwords require a dedicated password-hashing function.', 10, 17],
      ['Collisions and separate chaining', 'A collision occurs when different keys map to the same bucket. Separate chaining stores colliding keys together in a bucket and checks them during lookup.', 18, 23],
      ['Open addressing', 'Store entries directly in the table. On collision, follow a repeatable probe sequence. Linear probing advances by one, quadratic probing changes the offset quadratically, and double hashing uses a second hash for the step.', 24, 29],
      ['Load and applications', 'Load factor is entries divided by bucket count. Resize and rehash as needed. Hash tables power maps, sets, caches, and indexing. In the practice problem, use modulo 13 and trace linear probing with wraparound.', 30, 35],
    ],
  },
  {
    id: 9, title: 'Trees & heaps', group: 'Data structures', mark: '⌘',
    intro: 'Follow a hierarchy from root to leaf, then compare search ordering, balance, and heap priority.',
    topics: [
      ['Binary trees', 'A tree organizes nodes into parent–child relationships. A binary node has at most two children. Preorder visits the root first, inorder visits it between its subtrees, and postorder visits it last.', 3, 8],
      ['Binary search trees', 'Use the key to choose left or right. Inorder traversal gives sorted keys. Search and insert take O(h) for height h. To remove a node with two children, replace its key with its inorder successor or predecessor and remove that replacement node.', 9, 12],
      ['AVL balance and rotations', 'An AVL tree keeps the two subtree heights at each node within one. LL and RR imbalances need one rotation. LR and RL need two. Rotations preserve the search order.', 13, 20],
      ['Heaps and priority queues', 'A binary heap is complete and can be stored in an array. In a min-heap, a parent is no greater than its children. Peek takes O(1), while inserting and removing the root take O(log n).', 21, 24],
    ],
  },
  {
    id: 10, title: 'Graphs & traversal', group: 'Graphs', mark: '◇',
    intro: 'Represent relationships and compare the orders produced by depth-first and breadth-first search.',
    topics: [
      ['Vertices and edges', 'Graphs model relationships. A directed edge has an orientation, an undirected edge works both ways, and weights encode costs or distances.', 3, 7],
      ['Adjacency matrix and list', 'A matrix uses O(V²) space and offers O(1) edge checks. An adjacency list uses O(V + E) space and iterates directly over each vertex’s neighbors.', 8, 17],
      ['Depth-first search', 'Follow a branch before returning to explore others. Use a stack or recursion and record visited vertices to handle cycles. With adjacency lists, traversal costs O(V + E).', 18, 23],
      ['Breadth-first search', 'Use a FIFO queue to explore one distance layer at a time. Mark neighbors visited when you enqueue them. BFS gives minimum edge counts from the start in an unweighted graph.', 24, 29],
      ['Java graph implementations', 'The source includes programs for a matrix, an adjacency list, DFS, and BFS. Neighbor order affects the traversal sequence. Restart from unvisited vertices when you need to cover a disconnected graph.', 30, 44],
    ],
  },
  {
    id: 11, title: 'Shortest paths & MSTs', group: 'Graphs', mark: '↗',
    intro: 'Use edge weights to compare shortest routes and minimum-cost networks.',
    topics: [
      ['Shortest-path problems', 'A shortest path minimizes the sum of edge weights. A problem can ask for a single source, a single pair, or every pair of vertices.', 3, 9],
      ['Dijkstra’s algorithm', 'With nonnegative edge weights, choose the unsettled vertex with minimum tentative distance and relax its outgoing edges. Keep predecessors to reconstruct a path.', 10, 25],
      ['Bellman–Ford algorithm', 'Relax all edges up to V − 1 times. If a reachable edge can still improve a distance on another pass, a reachable negative cycle exists. The algorithm handles negative weights and takes O(VE) time.', 26, 40],
      ['Minimum spanning trees', 'An MST connects all vertices of a connected, weighted, undirected graph with V − 1 edges and minimum total weight. It minimizes the whole tree’s cost, while a shortest-path tree minimizes distances from a source.', 41, 43],
      ['Kruskal’s and Prim’s algorithms', 'Kruskal considers edges globally in increasing weight and uses disjoint sets to avoid cycles. Prim grows one tree by repeatedly taking a cheapest edge crossing from the tree to an outside vertex.', 44, 54],
      ['Campus network exercise', 'Use the weighted campus graph to compare routes from one building and the cost of connecting all buildings. Work through edge relaxation or edge selection by hand.', 55, 55],
    ],
  },
  {
    id: 12, title: 'Algorithmic paradigms', group: 'Foundations', mark: 'ƒ',
    intro: 'Compare greedy choices, divide-and-conquer decomposition, and two ways to reuse subproblem results.',
    topics: [
      ['Greedy algorithms', 'Make the best available choice at each step. Prove that these local choices can yield a global optimum for the problem. For unweighted activity selection, repeatedly pick the compatible activity that finishes earliest.', 4, 9],
      ['Divide and conquer', 'Split the input, solve the parts, and combine their results. Merge sort is a classic example. Its balanced split creates logarithmically many levels, with linear merging work per level.', 10, 14],
      ['Memoization', 'Start from the requested result and recursively solve only the subproblems needed. Store completed results so later calls can reuse them.', 15, 19],
      ['Tabulation', 'Start with base cases and fill a table in dependency order. Both Fibonacci methods reduce repeated work to O(n) time. Tabulation avoids recursive call frames, and Fibonacci needs only the previous two values if you only want the final result.', 20, 24],
    ],
  },
]
