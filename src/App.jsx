import { useEffect, useRef, useState } from 'react'
import { chapters } from './chapters'
import { demos } from './demos'
import { exampleDemos } from './exampleDemos'
import { examples } from './examples'
import GraphDiagram from './GraphDiagram'
import slideExamples from './slideExamples.json'
import slideNotes from './slideNotes.json'
import './App.css'

const sources = import.meta.glob('../raw_lessons/*.pdf', {
  eager: true,
  query: '?url',
  import: 'default',
})
const tabs = ['Lesson', 'Code', 'Source slides']
const chapterNumber = (id) => String(id).padStart(2, '0')

function readLocation() {
  const [id, tab] = window.location.hash.slice(1).split('/')
  return {
    id: chapters.find((chapter) => String(chapter.id) === id)?.id ?? chapters[0].id,
    tab: tabs.find((item) => item.toLowerCase().replace(' ', '-') === tab) ?? tabs[0],
  }
}

function route(id, tab = tabs[0]) {
  return '#' + id + '/' + tab.toLowerCase().replace(' ', '-')
}

function sourceUrl(id, page) {
  const pdf = sources['../raw_lessons/Chapter ' + chapterNumber(id) + '.pdf']
  return pdf ? pdf + (page ? '#page=' + page : '') : undefined
}

function ValueTransfer({ demo, step, fromStep }) {
  if (Math.abs(step - fromStep) !== 1) return null
  const backward = step < fromStep
  const frame = demo.frames[Math.max(step, fromStep)]
  const transfer = frame.transfer
  if (!transfer) return null

  const center = (index) => (index + .5) / frame.values.length * 100 + '%'
  const buffer = { left: '14%', key: '50%', right: '86%' }
  const from = buffer[transfer.from] ?? center(transfer.from)
  const to = center(transfer.to)
  return (
    <span className="value-transfer" aria-hidden="true" style={{
      '--from': backward ? to : from,
      '--to': backward ? from : to,
    }}>{transfer.value}</span>
  )
}

function Diagram({ demo, step, fromStep, id }) {
  const frame = demo.frames[step]
  const { kind } = demo
  const { values, active = [] } = frame
  if (kind === 'graph') return <GraphDiagram demo={demo} frame={frame} />

  const variableRow = !demo.columns && kind !== 'bars' &&
    demo.frames.some((item) => item.values.length !== values.length)
  const tileKey = (value, index) => demo.reorder || demo.trackValues ? value : index
  const tiles = values.map((value, index) => ({ value, index, count: values.length, leaving: false }))
  if (variableRow && fromStep !== step) {
    const previousValues = demo.frames[fromStep].values
    const keys = new Set(values.map(tileKey))
    previousValues.forEach((value, index) => {
      if (!keys.has(tileKey(value, index))) {
        tiles.push({ value, index, count: previousValues.length, leaving: true })
      }
    })
  }

  const hasProbe = (id === 6 || id === 8 || id === 12) && kind === 'cells'
  const probe = hasProbe ? demo.frames.slice(0, step + 1).findLast((item) => item.active?.length === 1)?.active[0] ?? 0 : 0
  const max = kind === 'bars' ? Math.max(...values, 1) : 1
  return (
    <div className={'diagram ' + kind + (demo.reorder ? ' reordered-bars' : '') +
      (hasProbe ? ' probed-cells' : '') + (demo.columns ? ' matrix-cells' : '') +
      (variableRow ? ' variable-row' : '')}
      style={{ '--count': values.length, '--probe': probe, '--columns': demo.columns }}>
      {hasProbe && <span className={'probe-cursor' + (active.length === 1 ? ' is-visible' : '')} aria-hidden="true" />}
      <ValueTransfer demo={demo} step={step} fromStep={fromStep} key={fromStep + '-' + step} />
      {tiles.map(({ value, index, count, leaving }) => {
        const tileFrame = leaving ? demo.frames[fromStep] : frame
        const selected = tileFrame.active?.includes(index)
        const dimmed = tileFrame.muted?.includes(index)
        return (
          <div className={'diagram-item' + (leaving ? ' is-leaving' : '')} key={tileKey(value, index)}
            style={{ '--index': index, '--item-count': count }} aria-hidden={leaving || undefined}>
            <div
              className={'tile ' + (selected ? 'is-active' : '') + (dimmed ? ' is-muted' : '')}
              style={kind === 'bars' ? { '--height': 20 + 80 * value / max + '%' } : undefined}
            ><span className="tile-value" key={value}>{value}</span></div>
            <span className="tile-label">{tileFrame.labels?.[index] ?? (kind === 'cells' ? index : '')}</span>
          </div>
        )
      })}
    </div>
  )
}

function StepDetail({ demo, frame, previous }) {
  if (!previous) return null
  const isGraph = demo.kind === 'graph'
  const prior = isGraph ? previous.labels ?? [] : previous.values
  const current = isGraph ? frame.labels ?? [] : frame.values
  const changes = Array.from({ length: Math.max(prior.length, current.length) }, (_, index) => index)
    .filter((index) => prior[index] !== current[index])

  if (!changes.length) return null
  return (
    <ul className="step-detail" aria-label="Changes from the previous step">
      {changes.map((index) => (
        <li key={index}>
          <span>{isGraph ? frame.values[index] : demo.kind === 'bars' ? frame.labels?.[index] ?? '[' + index + ']' : '[' + index + ']'}</span>
          {prior[index] ?? '∅'} <span aria-label="changes to">→</span> {current[index] ?? '∅'}
        </li>
      ))}
    </ul>
  )
}

function VisualLab({ id, options, selected, onSelect, step, fromStep, setStep }) {
  const demo = options[selected]
  const frame = demo.frames[step]
  const last = demo.frames.length - 1

  return (
    <section className="visual" aria-labelledby="visual-title">
      <header className="visual-header">
        <div>
          <div className="kicker visual-kicker"><span /> Visual walkthrough</div>
          <h2 id="visual-title">{demo.title}</h2>
        </div>
        {options.length > 1 && (
          <label className="demo-picker">
            <span className="sr-only">Choose walkthrough</span>
            <select value={selected} onChange={(event) => onSelect(Number(event.target.value))}>
              {options.map((item, i) => <option key={item.title} value={i}>{item.title}</option>)}
            </select>
          </label>
        )}
      </header>
      <div className="visual-stage">
        <Diagram demo={demo} step={step} fromStep={fromStep} id={id} key={selected} />
      </div>
      <div className="frame-caption">
        <p aria-live="polite"><span className="step-text" key={selected + ':' + step}>{frame.caption}</span></p>
        <StepDetail demo={demo} frame={frame} previous={demo.frames[step - 1]} />
      </div>
      <div className="visual-controls">
        <div className="steps">
          <span>Step {step + 1} of {last + 1}</span>
          <input
            aria-label="Walkthrough step"
            type="range"
            min="0"
            max={last}
            step="1"
            value={step}
            onChange={(event) => setStep(Number(event.target.value))}
          />
        </div>
        <div className="step-buttons">
          <button className="step-button" onClick={() => setStep(0)} disabled={step === 0}>Reset</button>
          <button className="step-button" onClick={() => setStep(step - 1)} disabled={step === 0}>Back</button>
          <button className="step-button primary-button" onClick={() => setStep(step + 1)} disabled={step === last}>Next step</button>
        </div>
      </div>
    </section>
  )
}

function SlideReference({ id, first, last }) {
  const href = sourceUrl(id, first)
  const label = first === last ? 'Slide ' + first : 'Slides ' + first + '–' + last
  return href ? <a href={href} target="_blank" rel="noreferrer">{label}</a> : <span>{label}</span>
}

const sortingCosts = [
  ['Bubble', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', 'Yes'],
  ['Selection', 'O(n²)', 'O(n²)', 'O(n²)', 'O(1)', 'No'],
  ['Insertion', 'O(n)', 'O(n²)', 'O(n²)', 'O(1)', 'Yes'],
  ['Merge', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(n)', 'Yes'],
  ['Quick', 'O(n log n)', 'O(n log n)', 'O(n²)', 'O(n) worst case', 'No'],
  ['Heap', 'O(n log n)', 'O(n log n)', 'O(n log n)', 'O(1)', 'No'],
]

function SortingTable() {
  return (
    <div className="comparison" tabIndex="0" role="region" aria-label="Sorting algorithm comparison">
      <table>
        <caption>Compare sorting algorithms</caption>
        <thead><tr>{['Algorithm', 'Best time', 'Average time', 'Worst time', 'Extra space', 'Stable'].map(
          (heading) => <th scope="col" key={heading}>{heading}</th>,
        )}</tr></thead>
        <tbody>{sortingCosts.map(([name, ...costs]) => (
          <tr key={name}>
            <th scope="row">{name}</th>
            {costs.map((cost, index) => <td key={index}>{cost}</td>)}
          </tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function Lesson({ chapter }) {
  return (
    <>
      <section className="lesson" aria-labelledby="theory-title">
        <div className="section-header">
          <h2 id="theory-title">Lesson &amp; theory</h2>
        </div>
        <div className="topic-grid">
          {chapter.topics.map(([title, description, first, last]) => (
            <div className="topic" key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className="slide-reference"><SlideReference id={chapter.id} first={first} last={last} /></div>
            </div>
          ))}
        </div>
      </section>
      {chapter.id === 7 && <SortingTable />}
    </>
  )
}

const codeTokens = /(\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:public|private|protected|static|final|class|new|void|int|long|double|boolean|const|let|function|of|return|for|while|if|else|import|break|continue|null|true|false|START|END|IF|ELSE|THEN|FOR|WHILE|RETURN|REPEAT|INPUT|DISPLAY|STOP|REPORT)\b|\b\d+\b)/g

function CodeLine({ text }) {
  return text.split(codeTokens).map((token, index) => {
    if (index % 2 === 0) return token
    let type = 'token-keyword'
    if (token.startsWith('//')) type = 'token-comment'
    else if (/^["'\d]/.test(token)) type = 'token-value'
    return <span className={type} key={index}>{token}</span>
  })
}

function CodeCard({ example, focus, chooser }) {
  const [title, language, reference, code] = example
  const [copyResult, setCopyResult] = useState(null)
  const scrollbox = useRef(null)
  const focusFragments = Array.isArray(focus) ? focus : focus ? [focus] : []

  useEffect(() => {
    const box = scrollbox.current
    const line = box.querySelector('.code-line.is-focused')
    if (!line) return
    const bounds = box.getBoundingClientRect()
    const target = line.getBoundingClientRect()
    if (target.top >= bounds.top && target.bottom <= bounds.bottom) return
    box.scrollTo({
      top: box.scrollTop + target.top - bounds.top - box.clientHeight / 3,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }, [focus, title])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopyResult({ title, message: 'Copied' })
    } catch {
      setCopyResult({ title, message: 'Select and copy the code' })
    }
  }

  return (
    <article className="code-card">
      <header className="code-heading">
        <div>
          {chooser || <h3>{title}</h3>}
          <p>{language} · {reference}</p>
        </div>
        <button className="quiet-button" onClick={copy} aria-label={'Copy ' + title}>Copy</button>
      </header>
      <p className="copy-status" aria-live="polite">{copyResult?.title === title ? copyResult.message : ''}</p>
      <pre key={title} ref={scrollbox} tabIndex="0" aria-label={title + ' source code'}><code>{code.split('\n').map((line, index) => (
        <span
          className={'code-line' + (focusFragments.some((fragment) => line.includes(fragment)) ? ' is-focused' : '')}
          key={index}
        ><CodeLine text={line} /></span>
      ))}</code></pre>
    </article>
  )
}

const pairedTitles = {
  'Stack · last in, first out': 'Stack and queue operations',
  'Queue · first in, first out': 'Fixed-size circular queue',
  'Walk the factorial call stack': 'Recursive factorial',
  'Traverse a circular list': 'Circular linked list',
  'Input, process, and output': 'Age check',
  'Read and update an array': 'Fixed array and ArrayList',
  'Grow a backing array': 'Fixed array and ArrayList',
  'Bubble sort': 'Bubble, selection, and insertion sort',
  'Selection sort': 'Bubble, selection, and insertion sort',
  'Insertion sort': 'Bubble, selection, and insertion sort',
  'Merge sort': 'Merge, quick, and heap sort',
  'Quick sort': 'Merge, quick, and heap sort',
  'Heap sort': 'Merge, quick, and heap sort',
  'Linear probing': 'Division hashing and linear probing',
  'Search a binary search tree': 'Binary search tree operations',
  'Repair an AVL imbalance': 'AVL right rotation',
  'AVL left rotation': 'AVL left and double rotations',
  'AVL left-right rotation': 'AVL left and double rotations',
  'AVL right-left rotation': 'AVL left and double rotations',
  'Insert into a min-heap': 'Min-heap priority queue',
  'Dijkstra’s shortest path': 'Dijkstra and Bellman–Ford',
  'Bellman–Ford edge relaxation': 'Dijkstra and Bellman–Ford',
  'Kruskal’s minimum spanning tree': 'Kruskal and Prim',
  'Prim’s minimum spanning tree': 'Kruskal and Prim',
  'Tabulate Fibonacci numbers': 'Fibonacci, top-down and bottom-up',
  'Memoize Fibonacci results': 'Fibonacci, top-down and bottom-up',
}

function chapterCode(id) {
  return [...(slideExamples[id] ?? []), ...(examples[id] ?? [])]
}

function PairedCode({ snippets, selection, onSelect, focus }) {
  return (
    <section className="paired-code" aria-labelledby="paired-code-title">
      <div className="paired-code-header">
        <h2 id="paired-code-title">Code example</h2>
      </div>
      <CodeCard
        example={snippets.find(([title]) => title === selection)}
        focus={focus}
        chooser={snippets.length > 1 && (
          <div className="snippet-picker">
            <select aria-label="Choose code example" value={selection} onChange={(event) => onSelect(event.target.value)}>
              {snippets.map(([title]) => <option key={title} value={title}>{title}</option>)}
            </select>
          </div>
        )}
      />
    </section>
  )
}

function StudyWorkspace({ id, expandedCode }) {
  const [selected, setSelected] = useState(0)
  const [{ step, fromStep }, setProgress] = useState({ step: 0, fromStep: 0 })
  const options = [...demos[id], ...(exampleDemos[id] ?? [])]
  const snippets = chapterCode(id)
  const titleFor = (demo) => pairedTitles[demo.title] ?? demo.title
  const demo = options[selected]
  const snippetTitle = titleFor(demo)
  const setStep = (next) => setProgress((prior) => next === prior.step ? prior : {
    step: next, fromStep: prior.step,
  })
  const selectDemo = (index) => {
    setSelected(index)
    setProgress({ step: 0, fromStep: 0 })
  }

  return (
    <div className="study-area">
      <div className={'study-grid' + (expandedCode ? ' expanded-code' : '')}>
        <VisualLab id={id} options={options} selected={selected} step={step} fromStep={fromStep} setStep={setStep} onSelect={selectDemo} />
        <PairedCode snippets={snippets} selection={snippetTitle} focus={demo.frames[step].focus} onSelect={(title) => {
          const index = options.findIndex((option) => titleFor(option) === title)
          if (index >= 0) selectDemo(index)
        }} />
      </div>
    </div>
  )
}

function Source({ id }) {
  const [filter, setFilter] = useState('')
  const query = filter.trim().toLowerCase()
  const slides = slideNotes[id].filter(([page, body]) => body.toLowerCase().includes(query) || String(page) === query)
  const href = sourceUrl(id)

  return (
    <section aria-labelledby="source-title">
      <div className="section-header first-section">
        <h2 id="source-title">Source slides</h2>
        {href && <a className="quiet-button" href={href} target="_blank" rel="noreferrer">Open chapter PDF</a>}
      </div>
      {id === 11 && <p className="source-note">These notes were extracted from scanned slides.{href && ' Use the PDF to check diagrams, tables, and symbols.'}</p>}
      <label className="search source-search">
        <span aria-hidden="true">⌕</span>
        <input type="search" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Find text or a slide number" aria-label="Search source slides" />
      </label>
      <p className="sr-only" role="status">{slides.length} matching slides</p>
      <div className="slide-list">
        {slides.map(([page, body]) => {
          const [heading] = body.trimStart().split('\n')
          return (
            <details className="slide-row" key={page}>
              <summary><span className="slide-number">{chapterNumber(page)}</span><span>{heading.trim()}</span></summary>
              <pre>{body}</pre>
              <div className="slide-reference"><SlideReference id={id} first={page} last={page} /></div>
            </details>
          )
        })}
        {slides.length === 0 && <p>No slides match this search.</p>}
      </div>
    </section>
  )
}

const chapterGroups = [
  ['Foundations & structures', 2, 5],
  ['Search, sort & lookup', 6, 8],
  ['Trees, graphs & paradigms', 9, 12],
]

function Sidebar({ currentId, opened, close }) {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const matched = chapters.filter((chapter) =>
    [chapter.id, chapterNumber(chapter.id), chapter.title, chapter.intro, ...chapter.topics.flatMap(([title, text]) => [title, text])]
      .some((value) => String(value).toLowerCase().includes(query)),
  )
  return (
    <aside className={'sidebar ' + (opened ? 'sidebar-open' : '')} id="course-navigation">
      <a className="brand" href={route(chapters[0].id)} onClick={close}>
        <span className="brand-mark" aria-hidden="true">[ ]</span>
        <span><strong>Algorithm Studio</strong><small>COMP 006</small></span>
      </a>
      <label className="search">
        <span aria-hidden="true">⌕</span>
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a lesson" aria-label="Find a lesson" />
      </label>
      <nav aria-label="Chapters">
        {chapterGroups.map(([label, first, last]) => {
          const list = matched.filter((chapter) => first <= chapter.id && chapter.id <= last)
          if (!list.length) return null
          return (
            <div className="nav-group" key={label}>
              <h2>{label}</h2>
              {list.map((chapter) => (
                <a className="chapter-link" key={chapter.id} href={route(chapter.id)} onClick={close} aria-current={chapter.id === currentId ? 'page' : undefined}>
                  <span>{chapterNumber(chapter.id)}</span>{chapter.title}
                </a>
              ))}
            </div>
          )
        })}
        {!matched.length && <p className="no-results" role="status">No matching lessons.</p>}
      </nav>
    </aside>
  )
}

function App() {
  const [location, setLocation] = useState(readLocation)
  const [menuOpen, setMenuOpen] = useState(false)
  const chapter = chapters.find((item) => item.id === location.id)
  const previous = chapters.find((item) => item.id === chapter.id - 1)
  const next = chapters.find((item) => item.id === chapter.id + 1)

  useEffect(() => {
    function onHashChange() {
      setLocation(readLocation())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <div className="app">
      <a href="#main-content" className="skip-link" onClick={(event) => {
        event.preventDefault()
        document.getElementById('main-content').focus()
      }}>Skip to lesson</a>
      <header className="topbar">
        <button className="menu-button quiet-button" aria-expanded={menuOpen} aria-controls="course-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Hide chapters' : 'Show chapters'}
        </button>
        <span className="course-name">Data Structures &amp; Algorithms</span>
        <span className="top-meta">COMP 006</span>
      </header>
      <Sidebar currentId={chapter.id} opened={menuOpen} close={() => {
        setMenuOpen(false)
        if (menuOpen) document.getElementById('main-content').focus()
      }} />
      <main className="content" id="main-content" tabIndex="-1">
        <div className="chapter-header" key={chapter.id}>
          <div>
            <div className="chapter-meta"><span>Chapter {chapterNumber(chapter.id)}</span><span className="meta-divider" />{chapter.group}</div>
            <h1>{chapter.title}</h1>
            <p>{chapter.intro}</p>
          </div>
          <div className="chapter-mark" aria-hidden="true">{chapter.mark}</div>
        </div>
        <nav className="view-nav" aria-label="Chapter sections">
          {tabs.map((tab) => <a key={tab} href={route(chapter.id, tab)} aria-current={tab === location.tab ? 'page' : undefined}>{tab}</a>)}
        </nav>
        {location.tab !== 'Source slides' && <StudyWorkspace key={chapter.id} id={chapter.id} expandedCode={location.tab === 'Code'} />}
        {location.tab === 'Lesson' && <Lesson chapter={chapter} />}
        {location.tab === 'Source slides' && <Source key={chapter.id} id={chapter.id} />}
        <nav className="chapter-footer" aria-label="Continue to another chapter">
          {previous && <a href={route(previous.id)}><small>Previous chapter</small>{previous.title}</a>}
          {next && <a className="next-lesson" href={route(next.id)}><small>Next chapter</small>{next.title}</a>}
        </nav>
      </main>
    </div>
  )
}

export default App
