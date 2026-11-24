export const examples = {
  2: [
    ['Age check', 'Pseudocode', 'Slide 20', `START
INPUT user_age
IF user_age >= 18 THEN
    DISPLAY "Access granted"
ELSE
    DISPLAY "Access denied"
END IF
END`],
    ['Compare growth rates', 'JavaScript', 'Visual trace', `for (const n of [2, 4, 8, 16]) {
    const constant = 1;
    const logarithmic = Math.log2(n);
    const linear = n;
    const quadratic = n * n;
    console.log(n, [constant, logarithmic, linear, quadratic]);
}
// At n = 8, the illustrative counts are [1, 3, 8, 64].`],
  ],
  3: [
    ['Fixed array and ArrayList', 'Java', 'Based on slides 21–36 and 47–49', `import java.util.ArrayList;

public class ArraysLesson {
    public static void main(String[] args) {
        int[] fixed = {10, 20, 30};
        fixed[1] = 25;

        var growing = new ArrayList<Integer>();
        for (int value : fixed) growing.add(value);
        growing.add(40);

        String label = "Algorithms";
        System.out.println(label.substring(0, 4)); // Algo
        System.out.println(growing); // [10, 25, 30, 40]
    }
}`],
  ],
  4: [
    ['Sudoku backtracking', 'Pseudocode', 'Based on slides 3–11', `SOLVE(board)
    cell ← first empty cell
    IF no empty cell exists THEN RETURN true

    FOR digit FROM 1 TO 9
        IF digit is absent from cell's row, column, and 3×3 box
            place digit at cell
            IF SOLVE(board) THEN RETURN true
            clear cell
    RETURN false`],
    ['Circular linked list', 'Java', 'Based on slide 45', `class CircularLinkedList {
    private static class Node {
        final int value;
        Node next;
        Node(int value) { this.value = value; }
    }

    private Node head, tail;

    void append(int value) {
        Node node = new Node(value);
        if (head == null) head = node;
        else tail.next = node;

        tail = node;
        tail.next = head;
    }

    void display(int count) {
        Node current = head;
        for (int i = 0; current != null && i < count; i++) {
            System.out.println(current.value);
            current = current.next;
        }
    }
}`],
    ['Insert and remove links', 'Pseudocode', 'Visual trace', `head ← A
A.next ← C
C.next ← D
D.next ← null

// Insert B after A: save the old link first.
B.next ← A.next
A.next ← B

// Remove C by linking B to C's successor.
B.next ← C.next

// Remove A by advancing the head to B.
head ← head.next`],
  ],
  5: [
    ['Stack and queue operations', 'Java', 'Based on slides 8 and 19', `import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

class RemovalOrder {
    public static void main(String[] args) {
        Deque<String> books = new ArrayDeque<>();
        books.push("Book A");
        books.push("Book B");
        System.out.println(books.pop()); // Book B

        Queue<String> tasks = new ArrayDeque<>();
        tasks.add("Task A");
        tasks.add("Task B");
        System.out.println(tasks.remove()); // Task A
    }
}`],
    ['Fixed-size circular queue', 'Java', 'Based on slides 26–30', `class SimpleQueue {
    private final int[] items;
    private int front;
    private int size;

    SimpleQueue(int capacity) {
        if (capacity <= 0) throw new IllegalArgumentException("Capacity must be positive");
        items = new int[capacity];
    }

    boolean enqueue(int value) {
        if (size == items.length) return false;
        int rear = (front + size) % items.length;
        items[rear] = value;
        size++;
        return true;
    }

    Integer dequeue() {
        if (isEmpty()) return null;
        int value = items[front];
        front = (front + 1) % items.length;
        size--;
        return value;
    }

    Integer peek() { return isEmpty() ? null : items[front]; }
    boolean isEmpty() { return size == 0; }
}`],
  ],
  6: [
    ['Exponential search', 'Java', 'Adapted from slide 28', `class ExponentialSearch {
    static int search(int[] sorted, int target) {
        if (sorted.length == 0) return -1;
        if (sorted[0] == target) return 0;

        long bound = 1;
        while (bound < sorted.length && sorted[(int) bound] < target) bound *= 2;

        int low = (int) (bound / 2);
        int high = (int) Math.min(bound, sorted.length - 1);
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (sorted[mid] == target) return mid;
            if (sorted[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`],
    ['Interpolation search', 'Java', 'Corrected from slide 29', `class InterpolationSearch {
    static int search(int[] sorted, int target) {
        int low = 0, high = sorted.length - 1;
        while (low <= high && target >= sorted[low] && target <= sorted[high]) {
            long range = (long) sorted[high] - sorted[low];
            if (range == 0) return low;

            long offset = ((long) target - sorted[low]) * (high - low);
            int pos = low + (int) (offset / range);

            if (sorted[pos] == target) return pos;
            if (sorted[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        return -1;
    }
}`],
  ],
  7: [
    ['Bubble, selection, and insertion sort', 'Java', 'Based on slides 11–16', `class SimpleSorts {
    static void bubble(int[] a) {
        for (int end = a.length - 1; end > 0; end--) {
            boolean swapped = false;
            for (int j = 0; j < end; j++) {
                if (a[j] > a[j + 1]) {
                    swap(a, j, j + 1);
                    swapped = true;
                }
            }
            if (!swapped) return;
        }
    }

    static void selection(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            int min = i;
            for (int j = i + 1; j < a.length; j++) {
                if (a[j] < a[min]) min = j;
            }
            swap(a, i, min);
        }
    }

    static void insertion(int[] a) {
        for (int i = 1; i < a.length; i++) {
            int key = a[i], j = i - 1;
            while (j >= 0 && a[j] > key) {
                a[j + 1] = a[j];
                j--;
            }
            a[j + 1] = key;
        }
    }

    static void swap(int[] a, int i, int j) {
        int value = a[i];
        a[i] = a[j];
        a[j] = value;
    }
}`],
    ['Merge, quick, and heap sort', 'Java', 'Based on slides 17–25', `import java.util.Arrays;

class AdvancedSorts {
    static void mergeSort(int[] a) {
        if (a.length < 2) return;
        int mid = a.length / 2;
        int[] left = Arrays.copyOfRange(a, 0, mid);
        int[] right = Arrays.copyOfRange(a, mid, a.length);
        mergeSort(left);
        mergeSort(right);

        int i = 0, j = 0;
        for (int k = 0; k < a.length; k++) {
            if (j == right.length || (i < left.length && left[i] <= right[j])) {
                a[k] = left[i++];
            } else {
                a[k] = right[j++];
            }
        }
    }

    static void quickSort(int[] a, int low, int high) {
        if (low >= high) return;
        int pivot = a[high], next = low;
        for (int i = low; i < high; i++) {
            if (a[i] <= pivot) swap(a, next++, i);
        }
        swap(a, next, high);
        quickSort(a, low, next - 1);
        quickSort(a, next + 1, high);
    }

    static void heapSort(int[] a) {
        for (int i = a.length / 2 - 1; i >= 0; i--) siftDown(a, i, a.length);
        for (int end = a.length - 1; end > 0; end--) {
            swap(a, 0, end);
            siftDown(a, 0, end);
        }
    }

    static void siftDown(int[] a, int root, int size) {
        while (root < size / 2) {
            int child = 2 * root + 1;
            if (child + 1 < size && a[child + 1] > a[child]) child++;
            if (a[root] >= a[child]) return;
            swap(a, root, child);
            root = child;
        }
    }

    static void swap(int[] a, int i, int j) {
        int value = a[i];
        a[i] = a[j];
        a[j] = value;
    }
}`],
  ],
  8: [
    ['Division hashing and linear probing', 'Java', 'Based on slides 16 and 24–35', `class LinearProbing {
    static int put(Integer[] table, int key) {
        int index = Math.floorMod(key, table.length);
        for (int attempt = 0; attempt < table.length; attempt++) {
            if (table[index] == null || table[index] == key) {
                table[index] = key;
                return index;
            }
            index = (index + 1) % table.length;
        }
        return -1; // Table full
    }

    public static void main(String[] args) {
        Integer[] table = new Integer[13];
        for (int key : new int[] {5, 18, 31, 44, 57, 70, 83, 96}) {
            System.out.println(key + " lands at " + put(table, key));
        }
    }
}`],
    ['Separate chaining', 'JavaScript', 'Visual trace', `const buckets = Array.from({ length: 5 }, () => []);
for (const key of [4, 9, 14, 2]) {
    const home = key % buckets.length;
    buckets[home].push(key);
}
// Bucket 2 contains [2]. Bucket 4 contains [4, 9, 14].`],
  ],
  9: [
    ['AVL left and double rotations', 'Java', 'Based on slides 13–20 · uses AVLTree from the right-rotation example', `class MoreAVLRotations extends AVLTree {
    AVLNode leftRotate(AVLNode x) {
        AVLNode y = x.right;
        AVLNode middle = y.left;

        y.left = x;
        x.right = middle;

        x.height = Math.max(height(x.left), height(x.right)) + 1;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        return y;
    }

    AVLNode leftRight(AVLNode root) {
        root.left = leftRotate(root.left);
        return rightRotate(root);
    }

    AVLNode rightLeft(AVLNode root) {
        root.right = rightRotate(root.right);
        return leftRotate(root);
    }
}`],
  ],
  11: [
    ['Dijkstra and Bellman–Ford', 'Pseudocode', 'Based on slides 11–40', `DIJKSTRA(graph, source)
    set all distances to infinity and distance[source] to 0
    WHILE a reachable unsettled vertex remains
        u ← unsettled vertex with least distance
        settle u
        FOR each edge u → v of weight w
            IF distance[u] + w < distance[v]
                distance[v] ← distance[u] + w
                predecessor[v] ← u
    RETURN distances and predecessors

BELLMAN_FORD(graph, source)
    set all distances to infinity and distance[source] to 0
    REPEAT at most |V| − 1 times
        FOR each edge u → v of weight w
            IF u is reachable, relax u → v as above
        IF no distance changed THEN STOP repeating
    IF any reachable edge can still be relaxed
        REPORT a reachable negative cycle
    ELSE RETURN distances and predecessors`],
    ['Kruskal and Prim', 'Pseudocode', 'Based on slides 44–54', `KRUSKAL(graph)
    put each vertex into its own component
    FOR each edge (u, v) in increasing weight order
        IF u and v are in different components
            add (u, v) to the tree
            unite the components of u and v
    RETURN tree

PRIM(graph, start)
    reached ← {start}
    WHILE an unreached vertex remains
        choose a least-weight edge from reached to unreached
        add the edge to the tree
        add its new endpoint to reached
    RETURN tree`],
  ],
  12: [
    ['Fibonacci, top-down and bottom-up', 'Java', 'Adapted from slides 19 and 22', `import java.util.Arrays;

class FibonacciDP {
    static long memoized(int n) {
        checkIndex(n);
        long[] memo = new long[n + 1];
        Arrays.fill(memo, -1);
        return fib(n, memo);
    }

    private static long fib(int n, long[] memo) {
        if (n < 2) return n;
        if (memo[n] == -1) memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
        return memo[n];
    }

    static long tabulated(int n) {
        checkIndex(n);
        if (n < 2) return n;
        long[] dp = new long[n + 1];
        dp[1] = 1;
        for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
        return dp[n];
    }

    private static void checkIndex(int n) {
        if (n < 0 || n > 92) throw new IllegalArgumentException("Use 0 to 92");
    }
}`],
    ['Schedule activities by finish time', 'JavaScript', 'Visual trace', `const activities = [
    ['A', 1, 3], ['B', 2, 5], ['C', 3, 6],
    ['D', 5, 7], ['E', 6, 9],
];
activities.sort((a, b) => a[2] - b[2]);

const selected = [];
let lastFinish = -Infinity;
for (const [name, start, finish] of activities) {
    if (start < lastFinish) continue;
    selected.push(name);
    lastFinish = finish;
}
console.log(selected); // ['A', 'C', 'E']`],
  ],
};
