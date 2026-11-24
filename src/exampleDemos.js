const frame = (values, caption, active, focus, details = {}) => ({ values, caption, active, focus, ...details })

const sudokuLabels = ['R1C1', 'R1C2', 'R1C3']
const sudoku = {
  title: 'Sudoku backtracking',
  kind: 'cells',
  frames: [
    frame(['·', 3, '·'], 'Reduced view of a 9×9 puzzle showing the first three cells. The first empty cell is R1C1.', [0], 'cell ← first empty cell', { labels: sudokuLabels }),
    frame([4, 3, '·'], 'Try 4 at R1C1. It passes the row, column, and box checks.', [0], 'place digit at cell', { labels: sudokuLabels }),
    frame([4, 3, '·'], 'The recursive call reaches R1C3. Its column and box rule out every digit except 4, but 4 is now in the row. The call returns false.', [2], 'RETURN false', { labels: sudokuLabels }),
    frame(['·', 3, '·'], 'Undo the 4 at R1C1 and resume the digit loop in the earlier call.', [0], 'clear cell', { labels: sudokuLabels }),
    frame([5, 3, '·'], 'The next candidate, 5, also passes all three checks at R1C1.', [0], 'place digit at cell', { labels: sudokuLabels }),
    frame([5, 3, 4], 'The recursive call can now place 4 at R1C3 and continue solving the rest of the board.', [2], ['place digit at cell', 'IF SOLVE(board) THEN RETURN true'], { labels: sudokuLabels }),
  ],
}

const fibonacci = {
  title: 'Recursive Fibonacci trace',
  kind: 'graph',
  positions: [[50, 12], [28, 33], [17, 56], [9, 79], [30, 79], [44, 56], [73, 33], [62, 56], [86, 56]],
  frames: [],
}

const callArguments = [4, 3, 2, 1, 0, 1, 2, 1, 0]
const parents = [null, 0, 1, 2, 2, 1, 0, 6, 6]
const callEdges = parents.slice(1).map((parent, index) => [parent, index + 1])
const callLabels = []

function traceCall(index) {
  const argument = callArguments[index]
  callLabels.push('Pending')
  const addFrame = (caption, focus) => {
    fibonacci.frames.push(frame(callArguments.slice(0, callLabels.length), caption, [index], focus, {
      labels: [...callLabels],
      edges: callEdges.slice(0, callLabels.length - 1),
    }))
  }
  const call = 'fibonacci(' + argument + ')'
  const baseCase = argument <= 1
  if (baseCase) {
    callLabels[index] = '→ ' + argument
    addFrame(call + ' hits the base case and returns ' + argument + '.', 'return n;')
    return argument
  }

  const children = parents.flatMap((parent, child) => parent === index ? [child] : [])
  addFrame(call + ' calls fibonacci(' + (argument - 1) + ') first. The second call waits for the first to return.', 'int result = fibonacci(n - 1) + fibonacci(n - 2)')
  const left = traceCall(children[0])
  const right = traceCall(children[1])
  const result = left + right
  callLabels[index] = '→ ' + result
  addFrame(call + ' adds ' + left + ' + ' + right + ' and returns ' + result + '.', 'return result;')
  return result
}

traceCall(0)

const binaryTree = {
  title: 'Build a binary tree',
  kind: 'graph',
  positions: [[50, 27], [24, 68], [76, 68]],
  frames: [
    frame([10], 'Create the root with value 10. Its left and right child references start as null.', [0], 'tree.root = new Node(10)', { labels: ['Root'], edges: [] }),
    frame([10, 5], 'Set the root’s left reference to a new node containing 5.', [1], 'tree.root.left = new Node(5)', { labels: ['Root', 'Left child'], edges: [[0, 1]] }),
    frame([10, 5, 15], 'Set the root’s right reference to a new node containing 15.', [2], 'tree.root.right = new Node(15)', { labels: ['Root', 'Left child', 'Right child'], edges: [[0, 1], [0, 2]] }),
    frame([10, 5, 15], 'Read and print the three values in order. Root 10, left child 5, right child 15.', [0, 1, 2], ['tree.root.data', 'tree.root.left.data', 'tree.root.right.data'], { labels: ['Root', 'Left child', 'Right child'], edges: [[0, 1], [0, 2]] }),
  ],
}

const vertexCount = 4
const edges = [[0, 1], [0, 2], [1, 2], [2, 3]]
const matrixLabels = Array.from({ length: vertexCount ** 2 }, (_, index) =>
  Math.floor(index / vertexCount) + ', ' + (index % vertexCount),
)
const matrix = Array(vertexCount ** 2).fill(0)
const adjacencyMatrix = {
  title: 'Adjacency matrix',
  kind: 'cells',
  columns: vertexCount,
  frames: [
    frame([...matrix], 'Allocate a 4×4 matrix initialized with zeros. Each label gives the row and column.', [], 'matrix = new int[vertices][vertices]', { labels: matrixLabels }),
    ...edges.map(([from, to]) => {
      const forward = from * vertexCount + to
      const reverse = to * vertexCount + from
      matrix[forward] = matrix[reverse] = 1
      return frame([...matrix], 'Add the edge between ' + from + ' and ' + to + '. Both directions are stored as 1.', [forward, reverse],
        ['matrix[i][j] = 1', 'matrix[j][i] = 1'], { labels: matrixLabels })
    }),
    frame([...matrix], 'Print the entries from left to right, one row per line.', [], 'System.out.print(matrix[i][j]', { labels: matrixLabels }),
  ],
}

const neighbors = Array.from({ length: vertexCount }, () => [])
const listLabels = neighbors.map((_, index) => 'Vertex ' + index)
const formatNeighbors = () => neighbors.map((list) => '[' + list.join(', ') + ']')
const adjacencyList = {
  title: 'Adjacency list',
  kind: 'cells',
  frames: [
    frame(formatNeighbors(), 'Initialize a separate empty neighbor list for each vertex.', [], 'adjList.add(new ArrayList<>())', { labels: listLabels }),
    ...edges.map(([from, to]) => {
      neighbors[from].push(to)
      neighbors[to].push(from)
      return frame(formatNeighbors(), 'Add the edge between ' + from + ' and ' + to + '. Append ' + to + ' to the list for ' + from + ' and ' + from + ' to the list for ' + to + '.', [from, to],
        ['adjList.get(i).add(j)', 'adjList.get(j).add(i)'], { labels: listLabels })
    }),
    frame(formatNeighbors(), 'Print each vertex followed by its neighbors in insertion order.', [], 'for (int neighbor : adjList.get(i))', { labels: listLabels }),
  ],
}

export const exampleDemos = {
  4: [sudoku],
  5: [fibonacci],
  9: [binaryTree],
  10: [adjacencyMatrix, adjacencyList],
}
