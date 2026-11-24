const frame = (values, caption, active = [], details = {}) => ({ values, caption, active, ...details })
const cells = (title, frames) => ({ title, kind: 'cells', frames })

const growth = {
  title: 'Compare growth rates',
  kind: 'bars',
  frames: [2, 4, 8, 16].map((n) => {
    const log = Math.log2(n)
    return frame([1, log, n, n * n],
      'At n = ' + n + ', these example counts are 1, ' + log + ', ' + n + ', and ' + n * n + '. The counts illustrate growth rates.',
      [], {
        labels: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        focus: ['const constant =', 'const logarithmic =', 'const linear =', 'const quadratic ='],
      })
  }),
}

const process = cells('Input, process, and output', [
  frame(['Age', '≥ 18?', 'Decision'], 'The example takes an age as input and returns an access decision.', [], { labels: ['Input', 'Process', 'Output'] }),
  frame([19, '≥ 18?', 'Decision'], 'Read 19 as the input age.', [0], { labels: ['Input', 'Process', 'Output'], focus: 'INPUT user_age' }),
  frame([19, 'True', 'Decision'], 'Evaluate the condition. An age of 19 meets the minimum.', [1], { labels: ['Input', 'Process', 'Output'], focus: 'IF user_age >= 18' }),
  frame([19, 'True', 'Granted'], 'Output the decision. The true branch displays “Access granted.”', [2], { labels: ['Input', 'Process', 'Output'], focus: 'DISPLAY "Access granted"' }),
])

const indexedArray = cells('Read and update an array', [
  frame([14, 23, 32, 41], 'Four cells have indices 0 through 3.', [], { labels: ['0', '1', '2', '3'], focus: 'int[] fixed =' }),
  frame([14, 23, 32, 41], 'Read a[2]. Index 2 is the third cell, so the result is 32.', [2], { labels: ['0', '1', '2', '3'] }),
  frame([14, 23, 99, 41], 'Assign a[2] = 99. The value changes and the array length stays four.', [2], { labels: ['0', '1', '2', '3'], focus: 'fixed[1] = 25' }),
  frame([14, 23, 99, 41], 'Trying to access index 4 in Java would throw an ArrayIndexOutOfBoundsException.', [], { labels: ['0', '1', '2', '3'] }),
])

const dynamicArray = cells('Grow a backing array', [
  frame([4, 7, 9], 'The backing array has capacity 3 and all three cells are occupied.'),
  frame(['–', '–', '–', '–', '–', '–'], 'An append triggers allocation of a larger backing array. This example doubles the capacity to 6.'),
  frame([4, 7, 9, '–', '–', '–'], 'Copy the old values in index order into the new backing array.', [0, 1, 2]),
  frame([4, 7, 9, 12, '–', '–'], 'Write 12 at index 3. The size is 4 and the capacity is 6.', [3], { focus: 'growing.add(40)' }),
])

const links = {
  title: 'Insert and remove links',
  kind: 'links',
  trackValues: true,
  frames: [
    frame(['A', 'C', 'D'], 'Start at the head A. The next links lead to C and D, then terminate.', [0],
      { labels: ['Head', '', 'Tail'], focus: ['head ← A', 'A.next ← C', 'C.next ← D', 'D.next ← null'] }),
    frame(['A', 'B', 'C', 'D'], 'To insert B after A, first set B.next to C, then set A.next to B.', [0, 1],
      { labels: ['Head', '', '', 'Tail'], focus: ['B.next ← A.next', 'A.next ← B'] }),
    frame(['A', 'B', 'D'], 'To remove C, set B.next to D. Traversal now skips C.', [1, 2],
      { labels: ['Head', '', 'Tail'], focus: 'B.next ← C.next' }),
    frame(['B', 'D'], 'To remove the head A, advance head to A.next, which is B.', [0],
      { labels: ['Head', 'Tail'], focus: 'head ← head.next' }),
  ],
}

const circular = {
  title: 'Traverse a circular list',
  kind: 'graph',
  directed: true,
  positions: [[17, 47], [50, 18], [83, 47], [50, 80]],
  edges: [[0, 1, 'next'], [1, 2, 'next'], [2, 3, 'next'], [3, 0, 'next']],
  frames: ['Start at head A.', 'Follow A.next to B.', 'Follow B.next to C.', 'At tail D, the next reference points to A.', 'A second visit to A completes one full pass.']
    .map((caption, i) => frame(['A', 'B', 'C', 'D'], caption, [i % 4],
      { labels: ['Head', '', '', 'Tail'], focus: i === 0 ? 'Node current = head' : 'current = current.next' })),
}

function removalOrder(isStack) {
  const first = isStack ? 'C' : 'A'
  const initial = ['A', 'B', 'C']
  const afterFirst = isStack ? ['A', 'B'] : ['B', 'C']
  const afterSecond = isStack ? ['A'] : ['C']
  const add = isStack ? 'Push' : 'Enqueue'
  const remove = isStack ? 'Pop' : 'Dequeue'
  const pushFocus = 'items[rear] = value'
  const popFocus = isStack ? 'books.pop()' : ['int value = items[front]', 'front = (front + 1)', 'size--']
  return { ...cells(isStack ? 'Stack · last in, first out' : 'Queue · first in, first out', [
    frame(['A'], add + ' A.', [0], { focus: isStack ? 'books.push("Book A")' : pushFocus }),
    frame(['A', 'B'], add + ' B.', [1], { focus: isStack ? 'books.push("Book B")' : pushFocus }),
    frame(initial, add + ' C. The next removal returns ' + first + '.',
      [isStack ? initial.length - 1 : 0], { labels: isStack ? ['', '', 'Top'] : ['Front', '', 'Rear'], focus: isStack ? undefined : pushFocus }),
    frame(afterFirst, remove + ' returns ' + first + '. The next removal returns B.',
      [isStack ? afterFirst.length - 1 : 0], { labels: isStack ? ['', 'Top'] : ['Front', 'Rear'], focus: popFocus }),
    frame(afterSecond, remove + ' returns B. One item remains.', [0], { focus: isStack ? undefined : popFocus }),
  ]), trackValues: true }
}

const recursion = cells('Walk the factorial call stack', [
  frame(['3!'], 'The initial call waits for the result of 2! before multiplying by 3.', [0], { focus: 'return n * factorial(n - 1)' }),
  frame(['3!', '2!'], 'The call for 2! waits for 1!.', [1], { focus: 'return n * factorial(n - 1)' }),
  frame(['3!', '2!', '1!'], 'The base case returns 1.', [2]),
  frame(['3!', '2!'], 'The call for 2! receives 1 and returns 2 × 1 = 2.', [1], { focus: 'return n * factorial(n - 1)' }),
  frame(['3!'], 'The first call receives 2 and returns 3 × 2 = 6.', [0], { focus: 'return n * factorial(n - 1)' }),
  frame([6], 'All calls have returned. The result is 6, and the call stack for this calculation is empty.', [0]),
])

const searchValues = [4, 9, 12, 18, 25, 31, 39, 46]
const searchTarget = 31
const searchLabels = searchValues.map((_, i) => String(i))

function searchTrace(title, mode) {
  let low = 0
  let high = searchValues.length - 1
  const frames = []
  const snapshot = (caption, active = [], focus) => {
    frames.push(frame(searchValues, caption, active, {
      labels: searchLabels,
      muted: searchValues.flatMap((_, i) => i < low || i > high ? [i] : []),
      focus,
    }))
  }

  snapshot('Find ' + searchTarget + '. The small labels are array indices.')
  if (mode === 'exponential') {
    snapshot('Compare index 0 with the target. The value 4 is too small.', [0], 'sorted[0] == target')
    let bound = 1
    while (bound <= high && searchValues[bound] < searchTarget) {
      snapshot('Index ' + bound + ' contains ' + searchValues[bound] + ', below the target.', [bound], 'sorted[(int) bound] < target')
      bound *= 2
      snapshot('Double the bound to ' + bound + '.', [], 'bound *= 2')
    }
    low = Math.floor(bound / 2)
    high = Math.min(bound, high)
    snapshot('The bound exceeds the last index. Search from ' + low + ' through ' + high + '.', [],
      ['bound / 2', 'Math.min(bound'])
  }

  const probeName = mode === 'interpolation' ? 'pos' : 'mid'
  const searchArray = mode === 'binary' || mode === 'linear' ? 'arr' : 'sorted'
  const item = searchArray + '[' + (mode === 'linear' ? 'i' : probeName) + ']'
  while (low <= high) {
    let probe = low
    if (mode === 'interpolation') {
      const span = searchValues[high] - searchValues[low]
      const offset = (searchTarget - searchValues[low]) * (high - low)
      snapshot('The end values span ' + span + '. Scale the distance from the lower end to get an offset numerator of ' + offset + '.',
        [low, high], ['long range =', 'long offset ='])
      probe = low + Math.floor(offset / span)
      snapshot('Compute the estimated index: ' + low + ' + floor(' + offset + ' / ' + span + ') = ' + probe + '.',
        [probe], 'int pos =')
    } else if (mode !== 'linear') {
      probe = Math.floor((low + high) / 2)
      snapshot('Compute the midpoint of indices ' + low + ' and ' + high + '. Round down to ' + probe + '.', [probe], 'int mid =')
    }

    const value = searchValues[probe]
    snapshot('Compare the value at index ' + probe + ', ' + value + ', with the target ' + searchTarget + '.',
      [probe], item + ' == target')
    if (value === searchTarget) {
      snapshot('They match. Return index ' + probe + '.', [probe], 'return ' + (mode === 'linear' ? 'i;' : probeName))
      break
    }

    if (mode === 'linear') {
      low++
      snapshot('The values differ. Advance to index ' + low + '.', [low], 'i++')
    } else {
      const tooSmall = value < searchTarget
      const direction = tooSmall ? 'below' : 'above'
      snapshot(value + ' is ' + direction + ' the target. Keep only the indices ' + (tooSmall ? 'after' : 'before') + ' ' + probe + '.',
        [probe], item + ' < target')
      if (tooSmall) low = probe + 1
      else high = probe - 1
      snapshot('Update the search range to indices ' + low + ' through ' + high + '.', [tooSmall ? low : high],
        (tooSmall ? 'low = ' : 'high = ') + probeName)
    }
  }
  return cells(title, frames)
}

function sortingDemo(title, run, reorder = true) {
  const values = [9, 4, 7, 2, 5]
  const frames = [frame([...values], 'Start with the unsorted array.')]
  const snapshot = (caption, active, focus, muted, transfer) =>
    frames.push(frame([...values], caption, active, { focus, muted, transfer }))
  const swap = (a, b) => { [values[a], values[b]] = [values[b], values[a]] }

  run(values, snapshot, swap)
  snapshot('The array is sorted in ascending order.', values.map((_, i) => i))
  return { title, kind: 'bars', reorder, frames }
}

const bubbleSort = sortingDemo('Bubble sort', (values, snapshot, swap) => {
  for (let end = values.length - 1; end > 0; end--) {
    let swapped = false
    for (let i = 0; i < end; i++) {
      const a = values[i]
      const b = values[i + 1]
      snapshot('Compare neighbors ' + a + ' and ' + b + '.', [i, i + 1], 'if (a[j] > a[j + 1])')
      if (a <= b) {
        snapshot('The neighbors are in order. Move to the next pair.', [i, i + 1], 'j < end')
        continue
      }
      swap(i, i + 1)
      snapshot(a + ' is larger than ' + b + '. Swap them.', [i, i + 1], 'swap(a, j, j + 1)')
      swapped = true
    }
    snapshot(swapped ? values[end] + ' is now in its final position.' : 'This pass made no swaps. Stop early.',
      [end], 'if (!swapped)')
    if (!swapped) break
  }
})

const selectionSort = sortingDemo('Selection sort', (values, snapshot, swap) => {
  for (let i = 0; i < values.length - 1; i++) {
    let min = i
    snapshot('Start with ' + values[min] + ' as the smallest value seen in this pass.', [min], 'int min = i')
    for (let j = i + 1; j < values.length; j++) {
      snapshot('Compare ' + values[j] + ' with the current minimum, ' + values[min] + '.', [j, min], 'if (a[j] < a[min])')
      if (values[j] < values[min]) {
        min = j
        snapshot('Track ' + values[min] + ' as the new minimum.', [min], 'min = j')
      }
    }
    const chosen = values[min]
    swap(i, min)
    const caption = i === min ? chosen + ' is already in the right position.' : 'Swap the minimum, ' + chosen + ', into index ' + i + '.'
    snapshot(caption, [i, min], 'swap(a, i, min)')
  }
})

const insertionSort = sortingDemo('Insertion sort', (values, snapshot) => {
  for (let i = 1; i < values.length; i++) {
    const key = values[i]
    let j = i
    snapshot('Save ' + key + ' as the key. The values to its left are sorted.', [i], 'int key = a[i]')
    while (j > 0) {
      const previous = values[j - 1]
      snapshot('Compare the key ' + key + ' with ' + previous + ' on its left.', [j - 1, j], 'a[j] > key')
      if (previous <= key) break
      values[j] = previous
      snapshot('Shift ' + previous + ' right into index ' + j + '. The key ' + key + ' is still saved.',
        [j - 1, j], 'a[j + 1] = a[j]', undefined, { from: j - 1, to: j, value: previous })
      j--
    }
    values[j] = key
    snapshot('Write the key ' + key + ' into index ' + j + '.', [j], 'a[j + 1] = key',
      undefined, { from: 'key', to: j, value: key })
  }
}, false)

const mergeSort = sortingDemo('Merge sort', (values, snapshot) => {
  function sort(start, end) {
    if (end - start < 2) return
    const mid = start + Math.floor((end - start) / 2)
    snapshot('Split indices ' + start + ' through ' + (end - 1) + ' before index ' + mid + '.',
      [mid - 1, mid], ['int[] left =', 'int[] right ='])
    sort(start, mid)
    sort(mid, end)

    const left = values.slice(start, mid)
    const right = values.slice(mid, end)
    let i = 0
    let j = 0
    for (let k = start; k < end; k++) {
      if (i < left.length && j < right.length) {
        snapshot('Compare the next values from the two halves, ' + left[i] + ' and ' + right[j] + '.',
          [k], 'left[i] <= right[j]')
      } else {
        snapshot('The ' + (i === left.length ? 'left' : 'right') + ' half is exhausted. Take from the other half.',
          [k], 'j == right.length')
      }
      const takeLeft = j === right.length || (i < left.length && left[i] <= right[j])
      values[k] = takeLeft ? left[i++] : right[j++]
      snapshot('Copy ' + values[k] + ' from the ' + (takeLeft ? 'left' : 'right') + ' half into index ' + k + '.',
        [k], takeLeft ? 'a[k] = left[i++]' : 'a[k] = right[j++]',
        undefined, { from: takeLeft ? 'left' : 'right', to: k, value: values[k] })
    }
  }
  sort(0, values.length)
}, false)

const quickSort = sortingDemo('Quick sort', (values, snapshot, swap) => {
  function sort(low, high) {
    if (low >= high) return
    const pivot = values[high]
    let next = low
    snapshot('Choose ' + pivot + ' at index ' + high + ' as the pivot for this range.', [high], 'int pivot = a[high]')
    for (let i = low; i < high; i++) {
      const value = values[i]
      snapshot('Compare ' + value + ' with the pivot ' + pivot + '.', [i, high], 'if (a[i] <= pivot)')
      if (value <= pivot) {
        swap(next, i)
        snapshot('Place ' + value + ' in the lower group at index ' + next + '.', [next, i], 'swap(a, next++, i)')
        next++
      } else {
        snapshot(value + ' is larger than the pivot. Leave it in the upper group.', [i, high], 'if (a[i] <= pivot)')
      }
    }
    swap(next, high)
    snapshot('Put the pivot ' + pivot + ' in its final position at index ' + next + '.', [next, high], 'swap(a, next, high)')
    sort(low, next - 1)
    sort(next + 1, high)
  }
  sort(0, values.length - 1)
})

const heapSort = sortingDemo('Heap sort', (values, snapshot, swap) => {
  function siftDown(root, size) {
    const sorted = values.flatMap((_, i) => i >= size ? [i] : [])
    while (root < Math.floor(size / 2)) {
      let child = 2 * root + 1
      if (child + 1 < size) {
        snapshot('Compare children ' + values[child] + ' and ' + values[child + 1] + ' to choose the larger one.',
          [child, child + 1], 'a[child + 1] > a[child]', sorted)
        if (values[child + 1] > values[child]) child++
      }
      snapshot('Compare parent ' + values[root] + ' with child ' + values[child] + '.',
        [root, child], 'a[root] >= a[child]', sorted)
      if (values[root] >= values[child]) {
        snapshot('The parent is larger. This part of the max-heap is in order.',
          [root, child], 'a[root] >= a[child]', sorted)
        return
      }
      swap(root, child)
      snapshot('Move the larger child, ' + values[root] + ', up to index ' + root + '.',
        [root, child], 'swap(a, root, child)', sorted)
      root = child
    }
  }

  for (let root = Math.floor(values.length / 2) - 1; root >= 0; root--) {
    snapshot('Build the max-heap by checking the parent at index ' + root + '.', [root], 'siftDown(a, i, a.length)')
    siftDown(root, values.length)
  }
  for (let end = values.length - 1; end > 0; end--) {
    snapshot('The root ' + values[0] + ' is the largest remaining value.', [0], 'swap(a, 0, end)')
    swap(0, end)
    snapshot('Swap the largest value, ' + values[end] + ', into its final position at index ' + end + '.',
      [0, end], 'swap(a, 0, end)', values.flatMap((_, i) => i > end ? [i] : []))
    siftDown(0, end)
  }
})


function hashTrace(chaining) {
  const table = Array.from({ length: 5 }, () => [])
  const labels = table.map((_, i) => String(i))
  const state = () => table.map((bucket) => bucket.length ? bucket.join(' · ') : '–')
  const hash = chaining ? 'const home = key % buckets.length' : 'Math.floorMod(key, table.length)'
  const place = chaining ? 'buckets[home].push(key)' : 'table[index] = key'
  const frames = [frame(state(), 'Use h(k) = k mod 5. The small labels are bucket indices.', [], { labels, focus: hash })]
  for (const key of [4, 9, 14, 2]) {
    const home = key % table.length
    let index = home
    while (!chaining && table[index].length) {
      const next = (index + 1) % table.length
      const action = next < index ? 'Wrap around to bucket ' : 'Probe bucket '
      frames.push(frame(state(), 'Key ' + key + ' meets an occupied bucket ' + index + '. ' + action + next + '.', [index],
        { labels, focus: 'index = (index + 1) % table.length' }))
      index = next
    }
    const collision = chaining && table[index].length
    table[index].push(key)
    const caption = collision
      ? 'Append ' + key + ' to the chain in bucket ' + index + '.'
      : 'Place ' + key + ' in bucket ' + index + ' (home bucket ' + home + ').'
    frames.push(frame(state(), caption, [index], { labels, focus: place }))
  }
  return cells(chaining ? 'Separate chaining' : 'Linear probing', frames)
}

const treePositions = [[50, 15], [25, 45], [75, 45], [13, 77], [37, 77], [63, 77], [87, 77]]
const treeEdges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]
const bst = {
  title: 'Search a binary search tree',
  kind: 'graph',
  positions: treePositions,
  edges: treeEdges,
  frames: [
    frame([8, 4, 12, 2, 6, 10, 14], 'Search for 10. Compare it with the root, 8, and choose the right subtree.', [0],
      { focus: 'search(root.right, key)' }),
    frame([8, 4, 12, 2, 6, 10, 14], '10 is less than 12. Choose the left child of 12.', [2],
      { muted: [1, 3, 4], focus: 'search(root.left, key)' }),
    frame([8, 4, 12, 2, 6, 10, 14], 'The left child is 10. The search stops at a match.', [5],
      { muted: [1, 3, 4, 6], focus: 'if (root.data == key) return true' }),
  ],
}

const movingTree = (title, frames) => ({ title, kind: 'graph', motion: 'tree', frames })
const rightRotationFocus = ['x.right = y', 'y.left = T2', 'return x;']
const balancedEdges = [[0, 1], [0, 2]]

const rotate = movingTree('Repair an AVL imbalance', [
  frame([30, 20, 40, 10, 25, 5], 'Inserting 5 makes 30 left-heavy. Its left subtree has height 3, and its right subtree has height 1.',
    [0, 1, 5], {
      positions: [[60, 14], [37, 39], [84, 39], [22, 64], [49, 64], [12, 88]],
      edges: [[0, 1], [0, 2], [1, 3], [1, 4], [3, 5]],
    }),
  frame([20, 10, 30, 5, 25, 40], 'Rotate right at 30. The node 20 rises, 30 moves down to its right, and the middle subtree rooted at 25 transfers from 20 to the left of 30.',
    [0, 2, 4], {
      positions: [[50, 14], [26, 39], [74, 39], [14, 64], [61, 64], [87, 64]],
      edges: [[0, 1], [0, 2], [1, 3], [2, 4], [2, 5]],
      focus: rightRotationFocus,
    }),
])

const rotateLeft = movingTree('AVL left rotation', [
  frame([10, 20, 30], 'Inserting 30 on the right of 20 makes the root 10 right-heavy.', [0, 1, 2],
    { positions: [[26, 15], [50, 45], [74, 77]], edges: [[0, 1], [1, 2]] }),
  frame([20, 10, 30], 'Rotate left at 10. The node 20 rises, 10 moves down to its left, and 30 stays the right child of 20.',
    [0, 1], { positions: treePositions.slice(0, 3), edges: balancedEdges, focus: ['y.left = x', 'x.right = middle', 'return y;'] }),
])

const rotateLeftRight = movingTree('AVL left-right rotation', [
  frame([30, 10, 20], 'The root 30 is left-heavy, and its left child 10 is right-heavy.', [0, 1],
    { positions: [[74, 15], [26, 45], [50, 77]], edges: [[0, 1], [1, 2]] }),
  frame([30, 20, 10], 'First rotate left at 10. The node 20 rises, and 10 moves down to its left.', [1, 2],
    { positions: [[74, 15], [50, 45], [26, 77]], edges: [[0, 1], [1, 2]], focus: 'root.left = leftRotate(root.left)' }),
  frame([20, 10, 30], 'Then rotate right at 30. The node 20 becomes the root with 10 on its left and 30 on its right.',
    [0, 2], { positions: treePositions.slice(0, 3), edges: balancedEdges, focus: 'return rightRotate(root)' }),
])

const rotateRightLeft = movingTree('AVL right-left rotation', [
  frame([10, 30, 20], 'The root 10 is right-heavy, and its right child 30 is left-heavy.', [0, 1],
    { positions: [[26, 15], [74, 45], [50, 77]], edges: [[0, 1], [1, 2]] }),
  frame([10, 20, 30], 'First rotate right at 30. The node 20 rises, and 30 moves down to its right.', [1, 2],
    { positions: [[26, 15], [50, 45], [74, 77]], edges: [[0, 1], [1, 2]], focus: 'root.right = rightRotate(root.right)' }),
  frame([20, 10, 30], 'Then rotate left at 10. The node 20 becomes the root with 10 on its left and 30 on its right.',
    [0, 1], { positions: treePositions.slice(0, 3), edges: balancedEdges, focus: 'return leftRotate(root)' }),
])

const heap = {
  title: 'Insert into a min-heap',
  kind: 'graph',
  motion: 'tree',
  positions: treePositions.slice(0, 3),
  frames: [
    frame([], 'Start with an empty priority queue.', [], { edges: [], focus: 'new PriorityQueue<>' }),
    frame([20], 'Insert 20 at the root.', [0], { edges: [], focus: 'minHeap.add(20)' }),
    frame([20, 5], 'Append 5 as the left child and compare it with 20.', [0, 1],
      { edges: [[0, 1]], focus: 'minHeap.add(5)' }),
    frame([5, 20], '5 is smaller than 20. Move 5 to the root and move 20 down.', [0, 1],
      { edges: [[0, 1]], focus: 'minHeap.add(5)' }),
    frame([5, 20, 15], 'Append 15 as the right child. Its parent 5 is smaller, so keep it here.', [2],
      { edges: balancedEdges, focus: 'minHeap.add(15)' }),
    frame([5, 20, 15], 'Peek reads 5 at the root without removing it.', [0],
      { edges: balancedEdges, focus: 'Min element:' }),
    frame([15, 20], 'Poll removes 5. Move the last value 15 to the root. It is smaller than 20, so the heap is ready again.', [0],
      { edges: [[0, 1]], focus: 'Extract min:' }),
    frame([15, 20], 'Peek now reads 15 at the root.', [0],
      { edges: [[0, 1]], focus: 'Next min:' }),
  ],
}

const traversalPositions = [[50, 15], [27, 44], [73, 44], [13, 77], [41, 77]]
const traversalEdges = [[0, 1], [0, 2], [1, 3], [1, 4]]
const traversalNames = [0, 1, 2, 3, 4]
function traversal(isBfs) {
  const order = isBfs ? [0, 1, 2, 3, 4] : [0, 1, 3, 4, 2]
  const strategy = isBfs ? 'Visit neighbors in first-in, first-out order.' : 'Follow each branch before backtracking.'
  const visit = isBfs ? ['int v = queue.poll()', 'System.out.print(v'] : ['visited[v] = true', 'System.out.print(v']
  return {
    title: isBfs ? 'Breadth-first search' : 'Depth-first search',
    kind: 'graph',
    positions: traversalPositions,
    edges: traversalEdges,
    frames: [frame(traversalNames, 'Begin at vertex 0. Inspect neighbors in the order the code adds them. ' + strategy, [],
      { focus: isBfs ? 'queue.add(start)' : 'g.dfs(0)' }),
      ...order.map((node, i) => {
        const visited = order.slice(0, i + 1)
        const labels = traversalNames.map((_, j) => visited.includes(j) ? String(visited.indexOf(j) + 1) : '')
        return frame(traversalNames, 'Visit ' + traversalNames[node] + '. Order so far: ' +
          visited.map((j) => traversalNames[j]).join(' → ') + '.', [node], { labels, focus: visit })
      })],
  }
}

const weightedNames = ['A', 'B', 'C', 'D', 'E', 'F']
const weightedPositions = [[12, 50], [29, 21], [29, 79], [59, 79], [59, 21], [88, 50]]
const weightedEdges = [[0, 1, 7], [0, 2, 3], [2, 1, 2], [2, 3, 8],
  [1, 3, 4], [1, 4, 6], [3, 4, 2], [3, 5, 7], [4, 5, 3]]
const settleAndRelax = ['settle u', 'distance[v] ← distance[u] + w']

const dijkstra = {
  title: 'Dijkstra’s shortest path',
  kind: 'graph',
  directed: true,
  positions: weightedPositions,
  edges: weightedEdges,
  frames: [
    [[], [0, '∞', '∞', '∞', '∞', '∞'], 'Set A to distance 0 and all other distances to infinity.'],
    [[0], [0, 7, 3, '∞', '∞', '∞'], 'Settle A. Relax its edges and discover tentative distances for B and C.'],
    [[2], [0, 5, 3, 11, '∞', '∞'], 'Settle C at distance 3. The route through C improves B to 5 and discovers D at 11.'],
    [[1], [0, 5, 3, 9, 11, '∞'], 'Settle B at distance 5. Improve D to 9 and discover E at 11.'],
    [[3], [0, 5, 3, 9, 11, 16], 'Settle D at distance 9. The route through D ties the known distance to E and discovers F at 16.'],
    [[4], [0, 5, 3, 9, 11, 14], 'Settle E at distance 11. The edge E–F improves F from 16 to 14.'],
    [[5], [0, 5, 3, 9, 11, 14], 'Settle F at distance 14. Following predecessors back gives the shortest route A → C → B → E → F.'],
  ].map(([active, labels, caption], i, steps) => frame(weightedNames, caption, active, {
    labels,
    focus: i === 0 ? 'set all distances to infinity' : i === steps.length - 1 ? ['settle u', 'RETURN distances and predecessors'] : settleAndRelax,
  })),
}

const mstEdges = [[1, 2, 1], [0, 2, 2], [0, 1, 3], [2, 3, 4], [1, 3, 5]]
const mstNames = ['A', 'B', 'C', 'D']
const mstPositions = [[15, 47], [39, 18], [58, 77], [86, 42]]

const negativeEdges = [[0, 1, 3], [1, 2, -4], [2, 3, 2], [0, 3, 9]]
const bellmanFord = {
  title: 'Bellman–Ford edge relaxation',
  kind: 'graph',
  directed: true,
  positions: [[12, 48], [35, 20], [65, 20], [88, 48]],
  edges: negativeEdges,
  frames: [
    frame(mstNames, 'Start at A. The directed edges point left to right. Scan C → D first, then B → C, A → B, and A → D.',
      [0], { labels: [0, '∞', '∞', '∞'], focus: 'set all distances to infinity' }),
    frame(mstNames, 'Pass 1. A → B sets distance 3, and A → D sets distance 9.', [1, 3],
      { labels: [0, 3, '∞', 9], focus: 'IF u is reachable, relax' }),
    frame(mstNames, 'Pass 2. B → C has weight −4, so the new distance to C is 3 − 4 = −1.', [2],
      { labels: [0, 3, -1, 9], focus: 'IF u is reachable, relax' }),
    frame(mstNames, 'Pass 3. C → D gives a shorter route to D with cost −1 + 2 = 1.', [3],
      { labels: [0, 3, -1, 1], focus: 'IF u is reachable, relax' }),
    frame(mstNames, 'A final pass improves no distances. There is no negative-weight cycle reachable from A.', [],
      { labels: [0, 3, -1, 1], focus: 'IF any reachable edge can still be relaxed' }),
  ],
}

const kruskal = {
  title: 'Kruskal’s minimum spanning tree',
  kind: 'graph',
  positions: mstPositions,
  edges: mstEdges,
  frames: [
    frame(mstNames, 'Sort edges by weight. Each vertex begins in a separate component.', [],
      { focus: ['put each vertex into its own component', 'in increasing weight order'] }),
    frame(mstNames, 'Add B–C (1). B and C now form one component.', [1, 2],
      { edges: [mstEdges[0]], focus: ['add (u, v) to the tree', 'unite the components'] }),
    frame(mstNames, 'Add A–C (2). A joins the component with B and C.', [0, 2],
      { edges: mstEdges.slice(0, 2), focus: ['add (u, v) to the tree', 'unite the components'] }),
    frame(mstNames, 'Skip A–B (3). A and B already belong to the same component, so adding their edge would create a cycle.', [0, 1],
      { edges: mstEdges.slice(0, 2), focus: 'IF u and v are in different components' }),
    frame(mstNames, 'Add C–D (4). All four vertices are now connected. The tree weighs 1 + 2 + 4 = 7.', [2, 3],
      { edges: [mstEdges[0], mstEdges[1], mstEdges[3]], focus: ['add (u, v) to the tree', 'unite the components'] }),
  ],
}

const prim = {
  title: 'Prim’s minimum spanning tree',
  kind: 'graph',
  positions: mstPositions,
  edges: mstEdges,
  frames: [
    frame(mstNames, 'Start with vertex A. Compare the edges crossing from A to vertices outside the tree.', [0], { focus: 'reached ← {start}' }),
    frame(mstNames, 'Choose A–C (2), the least-weight crossing edge. The tree now contains A and C.', [0, 2],
      { edges: [mstEdges[1]], focus: ['choose a least-weight edge', 'add the edge to the tree'] }),
    frame(mstNames, 'The frontier now includes C–B (1), which is cheaper than A–B (3) and C–D (4). Add C–B.',
      [0, 1, 2], { edges: mstEdges.slice(0, 2), focus: ['choose a least-weight edge', 'add the edge to the tree'] }),
    frame(mstNames, 'Only D remains outside. Choose C–D (4) over B–D (5). The tree weighs 2 + 1 + 4 = 7.',
      [0, 1, 2, 3], { edges: [mstEdges[0], mstEdges[1], mstEdges[3]], focus: ['choose a least-weight edge', 'add the edge to the tree'] }),
  ],
}

const fib = ['0', '1', '2', '3', '4', '5']
const tabulateEntry = { labels: fib, focus: 'dp[i] = dp[i - 1] + dp[i - 2]' }
const memoizeEntry = { labels: fib, focus: 'if (memo[n] == -1) memo[n] =' }
const tabulate = cells('Tabulate Fibonacci numbers', [
  frame([0, 1, '–', '–', '–', '–'], 'Write the base cases F(0) = 0 and F(1) = 1.', [0, 1],
    { labels: fib, focus: ['long[] dp = new long[n + 1]', 'dp[1] = 1'] }),
  frame([0, 1, 1, '–', '–', '–'], 'Use the two preceding cells. F(2) = 1 + 0 = 1.', [2], tabulateEntry),
  frame([0, 1, 1, 2, '–', '–'], 'F(3) = 1 + 1 = 2.', [3], tabulateEntry),
  frame([0, 1, 1, 2, 3, '–'], 'F(4) = 2 + 1 = 3.', [4], tabulateEntry),
  frame([0, 1, 1, 2, 3, 5], 'F(5) = 3 + 2 = 5. Each cell was computed once in dependency order.', [5], tabulateEntry),
])

const memoize = cells('Memoize Fibonacci results', [
  frame(['–', '–', '–', '–', '–', '–'], 'Begin by asking for F(5). Each call asks for its dependencies until it reaches a base case.', [5],
    { labels: fib, focus: 'return fib(n, memo)' }),
  frame(['–', '–', 1, '–', '–', '–'], 'F(2) calls F(1) and F(0), reads the base values, and stores their sum, 1.', [2], memoizeEntry),
  frame(['–', '–', 1, 2, '–', '–'], 'F(3) stores F(2) + F(1) = 2.', [3], memoizeEntry),
  frame(['–', '–', 1, 2, 3, '–'], 'F(4) uses F(3) and reads F(2) from the cache, giving 3.', [2, 4],
    { labels: fib, focus: [memoizeEntry.focus, 'return memo[n]'] }),
  frame(['–', '–', 1, 2, 3, 5], 'F(5) uses F(4) and reads F(3) from the cache, giving 5.', [3, 5],
    { labels: fib, focus: [memoizeEntry.focus, 'return memo[n]'] }),
])

const activities = ['A', 'B', 'C', 'D', 'E']
const intervals = ['1–3', '2–5', '3–6', '5–7', '6–9']
const greedy = cells('Schedule activities by finish time', [
  frame(activities, 'Choose as many nonoverlapping activities as possible. The times show each activity’s start and finish.', [],
    { labels: intervals, focus: 'activities.sort(' }),
  frame(activities, 'Choose A, which finishes earliest at time 3. B overlaps with A and is ruled out.', [0],
    { labels: intervals, muted: [1], focus: ['selected.push(name)', 'if (start < lastFinish)'] }),
  frame(activities, 'Choose C, the earliest-finishing activity that starts at or after time 3. D overlaps with C.', [0, 2],
    { labels: intervals, muted: [1, 3], focus: ['selected.push(name)', 'if (start < lastFinish)'] }),
  frame(activities, 'Choose E, which begins when C finishes. The result includes three activities: A, C, and E.', [0, 2, 4],
    { labels: intervals, muted: [1, 3], focus: ['selected.push(name)', 'console.log(selected)'] }),
])

export const demos = {
  2: [growth, process],
  3: [indexedArray, dynamicArray],
  4: [links, circular],
  5: [removalOrder(true), removalOrder(false), recursion],
  6: [searchTrace('Binary search', 'binary'), searchTrace('Linear search', 'linear'),
    searchTrace('Interpolation search', 'interpolation'), searchTrace('Exponential search', 'exponential')],
  7: [bubbleSort, selectionSort, insertionSort, mergeSort, quickSort, heapSort],
  8: [hashTrace(false), hashTrace(true)],
  9: [bst, rotate, rotateLeft, rotateLeftRight, rotateRightLeft, heap],
  10: [traversal(true), traversal(false)],
  11: [dijkstra, bellmanFord, kruskal, prim],
  12: [tabulate, memoize, greedy],
}
