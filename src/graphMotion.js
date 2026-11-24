const lerp = (start, end, amount) => start + (end - start) * amount
const mapIds = (items) => new Map(items.map((item) => [item.id, item]))

export function graphState(demo, frame) {
  const positions = frame.positions ?? demo.positions
  const active = frame.active ?? []
  const nodes = frame.values.map((value, index) => ({
    id: demo.motion === 'tree' ? typeof value + ':' + value : String(index),
    value,
    x: positions[index][0],
    y: positions[index][1],
    active: active.includes(index),
    muted: frame.muted?.includes(index),
    label: frame.labels?.[index],
    opacity: 1,
  }))
  const edges = (frame.edges ?? demo.edges).map(([first, second, weight]) => {
    const from = nodes[first].id
    const to = nodes[second].id
    const endpoints = demo.directed ? [from, to] : [from, to].sort()
    return { id: JSON.stringify(endpoints), from: endpoints[0], to: endpoints[1], weight, visible: 1 }
  })
  const cursorNode = demo.motion !== 'tree' && active.length === 1 ? nodes[active[0]] : undefined
  const cursor = cursorNode ? { x: cursorNode.x, y: cursorNode.y, opacity: 1 } : null
  return { nodes, edges, cursor }
}

function blendItems(from, to, getItem) {
  const oldItems = mapIds(from)
  const newItems = mapIds(to)
  return [...new Set([...newItems.keys(), ...oldItems.keys()])].map(
    (id) => getItem(oldItems.get(id), newItems.get(id)),
  )
}

export function interpolateGraph(from, to, progress) {
  if (progress <= 0) return from
  if (progress >= 1) return to

  const destinations = mapIds(to.nodes)
  const nodes = blendItems(from.nodes, to.nodes, (start, end) => {
    const first = start ?? end
    const last = end ?? start
    const dx = last.x - first.x
    const dy = last.y - first.y
    const distance = Math.hypot(dx, dy)
    // Pass on opposite sides when two nodes exchange the same two positions.
    const isSwap = distance > 0 && from.nodes.some((node) => {
      if (node.x !== last.x || node.y !== last.y) return false
      const destination = destinations.get(node.id)
      return destination?.x === first.x && destination.y === first.y
    })
    const detour = isSwap ? 9 * Math.sin(Math.PI * progress) / distance : 0
    return {
      ...last,
      x: lerp(first.x, last.x, progress) - dy * detour,
      y: lerp(first.y, last.y, progress) + dx * detour,
      opacity: lerp(start?.opacity ?? 0, end?.opacity ?? 0, progress),
    }
  })
  const edges = blendItems(from.edges, to.edges, (start, end) => ({
    ...(end ?? start),
    visible: lerp(start?.visible ?? 0, end?.visible ?? 0, progress),
  }))
  const start = from.cursor
  const end = to.cursor
  const cursor = start || end ? {
    x: lerp(start?.x ?? end.x, end?.x ?? start.x, progress),
    y: lerp(start?.y ?? end.y, end?.y ?? start.y, progress),
    opacity: lerp(start?.opacity ?? 0, end?.opacity ?? 0, progress),
  } : null
  return { nodes, edges, cursor }
}
