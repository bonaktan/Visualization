import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { graphState, interpolateGraph } from './graphMotion'

const pointStyle = ({ x, y, opacity }) => ({ left: x + '%', top: y + '%', opacity })

export default function GraphDiagram({ demo, frame }) {
  const arrowId = useId()
  const target = useMemo(() => graphState(demo, frame), [demo, frame])
  const [display, setDisplay] = useState(target)
  const current = useRef(target)
  const isTree = demo.motion === 'tree'
  const duration = isTree ? 960 : 500

  useEffect(() => {
    const from = current.current
    if (from === target) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let start
    let animation
    function tick(time) {
      start ??= time
      const progress = preference.matches ? 1 : Math.min((time - start) / duration, 1)
      const eased = progress * progress * (3 - 2 * progress)
      current.current = interpolateGraph(from, target, eased)
      setDisplay(current.current)
      if (progress < 1) animation = requestAnimationFrame(tick)
    }
    animation = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animation)
  }, [target, duration])

  const nodes = new Map(display.nodes.map((node) => [node.id, node]))
  const edgeDescription = (frame.edges ?? demo.edges).map(([from, to, weight]) =>
    frame.values[from] + (demo.directed ? ' to ' : ' and ') + frame.values[to] + (weight == null ? '' : ', weight ' + weight),
  ).join('. ')

  return (
    <div className={'graph' + (isTree ? ' moving-tree' : '')}>
      <span className="sr-only">Edges {edgeDescription || 'none'}</span>
      <svg className="graph-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {demo.directed && (
          <defs>
            <marker id={arrowId} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="2" markerHeight="4" orient="auto" markerUnits="userSpaceOnUse" preserveAspectRatio="none">
              <path d="M0 0 L6 3 L0 6 Z" fill="#a8c4b3" />
            </marker>
          </defs>
        )}
        {display.edges.map(({ id, from, to, visible }) => {
          const { x, y } = nodes.get(from)
          const { x: endX, y: endY } = nodes.get(to)
          return demo.directed ? (
            <polyline key={id} opacity={visible} markerMid={'url(#' + arrowId + ')'}
              points={[[x, y], [x + .72 * (endX - x), y + .72 * (endY - y)], [endX, endY]].join(' ')} />
          ) : (
            <line key={id} x1={x} y1={y} x2={endX} y2={endY}
              opacity={visible} pathLength="1" strokeDasharray={visible < 1 ? 1 : undefined} strokeDashoffset={1 - visible} />
          )
        })}
      </svg>
      {display.edges.map(({ id, from, to, weight, visible }) => {
        if (weight == null) return null
        const first = nodes.get(from)
        const second = nodes.get(to)
        return <span className="edge-label" key={id} aria-hidden="true"
          style={pointStyle({ x: (first.x + second.x) / 2, y: (first.y + second.y) / 2, opacity: visible })}>{weight}</span>
      })}
      {display.cursor && <span className="graph-cursor" style={pointStyle(display.cursor)} aria-hidden="true" />}
      {display.nodes.map((node) => (
        <div className={'vertex' + (node.active ? ' is-active' : '') + (node.muted ? ' is-muted' : '')}
          key={node.id} style={pointStyle(node)} aria-hidden={node.opacity < 1}>
          {node.value}
          {node.label != null && node.label !== '' && <span className="vertex-label" key={node.label}>{node.label}</span>}
        </div>
      ))}
    </div>
  )
}
