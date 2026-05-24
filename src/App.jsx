import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Lenis from 'lenis'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import * as THREE from 'three'
import { articles, getArticleBySlug, getYouTubeVideoId, resolveArticleImage } from './content/articles'
import './App.css'

const expertise = [
  {
    title: ['Agentic AI', 'Systems'],
    items: [
      ['ORCHESTRATION', 'Multi-agent workflows with orchestrators, domain agents, and tool-backed execution paths.'],
      ['MCP TOOLING', 'Source-specific MCP interfaces for querying, mapping, progress tracking, and controlled automation.'],
      ['GUARDRAILS', 'Risk-aware agent design with boundaries for sensitive data handling, reliability, and traceability.'],
    ],
  },
  {
    title: ['Regulatory Data', 'Engineering'],
    items: [
      ['MODERNIZATION', 'Migration support across legacy database-backed systems and modern API-driven data platforms.'],
      ['INGESTION', 'API data ingestion into downstream application tables with cleaner, consolidated processing paths.'],
      ['TRANSFORMS', 'Staging and transformation workflows that shape raw regulatory data into product-ready structures.'],
    ],
  },
  {
    title: ['AI Workflow', 'Automation'],
    items: [
      ['DELIVERY LOOPS', 'AI-assisted planning, implementation, testing, review, git operations, and handoff workflows.'],
      ['EVALUATION', 'Translation quality optimization using multilingual validation and evaluation-driven iteration.'],
      ['DEPLOYMENT', 'Dockerized agent and workflow deployment patterns for cloud/serverless environments.'],
    ],
  },
]

const fieldWork = [
  {
    title: 'Multi-Agent Regulatory Analysis',
    meta: '2025 / 3E',
    body: (
      <>
        Built a <span className="text-accent">multi-agent regulatory mapping system</span> with orchestrated domain
        agents, scoped <span className="text-accent">MCP tools</span>, <span className="text-accent">guardrails</span>,
        tracking, and <span className="text-accent">observability</span> for long-running parity workflows.
      </>
    ),
    metrics: [
      ['ARCHITECTURE:', 'Orchestrator + domain agents'],
      ['SAFETY:', 'Guardrails + scoped tools'],
      ['VISIBILITY:', 'Tracking + observability'],
    ],
  },
  {
    title: 'StudyScribe',
    meta: '2026 / AI STUDY PRODUCT',
    body: (
      <>
        An <span className="text-accent">AI-powered study workspace</span> that turns YouTube lectures into
        transcripts, exam notes, and transcript-grounded Q&A through a <span className="text-accent">RAG chatbot</span>.
        Built with <span className="text-accent">Upstash Vector</span> for embedding retrieval and{' '}
        <span className="text-accent">Upstash Redis</span> for rate limiting and caching.
      </>
    ),
    metrics: [
      ['INPUT:', 'YouTube lectures'],
      ['AI FLOW:', 'RAG chatbot + exam notes'],
      ['SYSTEM:', 'Gemini + Upstash Vector/Redis'],
    ],
  },
  {
    title: 'Regulatory Data Pipeline',
    meta: '2025 / 3E',
    body: (
      <>
        Built <span className="text-accent">API ingestion</span> and{' '}
        <span className="text-accent">transformation workflows</span> that create cleaner handoff points for{' '}
        <span className="text-accent">downstream data models</span> and product-ready regulatory structures.
      </>
    ),
    metrics: [
      ['SOURCE:', 'API ingestion'],
      ['HANDOFF:', 'Downstream data readiness'],
      ['OUTCOME:', 'Consolidated processing paths'],
    ],
  },
  {
    title: 'AI Workflow Automation',
    meta: '2025 / 3E',
    body: (
      <>
        Designed <span className="text-accent">AI-assisted</span> planning, implementation, testing, review, and{' '}
        <span className="text-accent">delivery workflows</span>, while improving multilingual translation quality
        through <span className="text-accent">evaluation-backed iteration</span>.
      </>
    ),
    metrics: [
      ['DELIVERY:', '~50% cycle-time reduction'],
      ['QUALITY:', '+15% translation accuracy'],
      ['VALIDATION:', 'Evaluation-backed changes'],
    ],
  },
]

const loadingStatusMessages = [
  { text: 'Indexing applied AI work...', code: 'IDX_WORK' },
  { text: 'Loading agentic workflow traces...', code: 'LOAD_AGENT' },
  { text: 'Resolving project context...', code: 'RES_CTX' },
  { text: 'Preparing neural field...', code: 'PREP_FIELD' },
  { text: 'Composing portfolio interface...', code: 'COMP_UI' },
  { text: 'Finalizing contact layer...', code: 'FIN_CONTACT' },
  { text: 'Ready.', code: 'READY' },
]

function LoadingOverlay({ onDone, onReveal }) {
  const [progress, setProgress] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const status = loadingStatusMessages[messageIndex]

  useEffect(() => {
    const timeouts = new Set()

    const schedule = (callback, delay) => {
      const id = window.setTimeout(() => {
        timeouts.delete(id)
        callback()
      }, delay)
      timeouts.add(id)
    }

    const completeLoading = () => {
      schedule(() => {
        setIsScanning(true)
        schedule(() => {
          onReveal()
          setIsExiting(true)
          schedule(onDone, 1100)
        }, 450)
      }, 350)
    }

    const updateLoading = (currentProgress) => {
      if (currentProgress >= 100) {
        setProgress(100)
        setMessageIndex(loadingStatusMessages.length - 1)
        completeLoading()
        return
      }

      const increment = Math.random() * 7 + 7
      const nextProgress = Math.min(100, currentProgress + increment)
      const nextMessageIndex = Math.floor((nextProgress / 100) * (loadingStatusMessages.length - 1))

      setProgress(nextProgress)
      setMessageIndex(nextMessageIndex)
      schedule(() => updateLoading(nextProgress), Math.random() * 120 + 120)
    }

    schedule(() => updateLoading(0), 150)

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id))
      timeouts.clear()
    }
  }, [onDone, onReveal])

  return (
    <div className={`loading-overlay ${isExiting ? 'loading-overlay-exit' : ''}`}>
      <div className="initialization-grid" />
      <div className={`reveal-scanline ${isScanning ? 'scanning' : ''}`} />

      <div className="loader-container">
        <div className="loader-heading">
          <div className="serif-text loader-name">HASEEB ZAHEER</div>
          <div className="mono-text loader-version">Agentic AI Portfolio</div>
        </div>

        <div className="loader-meta">
          <span>{`${Math.floor(progress).toString().padStart(2, '0')}%`}</span>
          <span>{status.code}</span>
        </div>

        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="status-text-container" aria-live="polite">
          <div className="status-line" key={status.text}>
            {status.text}
          </div>
        </div>
      </div>

      <div className="loader-footer">Initializing Interface</div>
    </div>
  )
}

LoadingOverlay.propTypes = {
  onDone: PropTypes.func.isRequired,
  onReveal: PropTypes.func.isRequired,
}

const neuralFieldQualityPresets = {
  reduced: { dpr: 1, fps: 0, lines: 1200, segments: 24 },
  medium: { dpr: 1.25, fps: 30, lines: 3500, segments: 40 },
}

function getNeuralFieldQuality() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return neuralFieldQualityPresets.reduced

  return neuralFieldQualityPresets.medium
}

function NeuralField() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return undefined

    const quality = getNeuralFieldQuality()
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d0015)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 60)

    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr))
    container.appendChild(renderer.domElement)

    const numLines = quality.lines
    const segmentsPerLine = quality.segments
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(numLines * segmentsPerLine * 3)
    const indices = new Uint32Array(numLines * (segmentsPerLine - 1) * 2)

    let pIndex = 0
    let iIndex = 0
    const height = 60
    const radiusBase = 20

    for (let i = 0; i < numLines; i += 1) {
      const angleOffset = Math.random() * Math.PI * 2
      const radiusOffset = Math.random()
      const curveFactor = Math.random() * 0.4 + 0.6

      for (let j = 0; j < segmentsPerLine; j += 1) {
        const t = j / (segmentsPerLine - 1)
        const y = (t - 0.5) * height
        const normalizedY = y / (height / 2)
        let pinch = Math.abs(normalizedY) ** 1.6
        pinch = pinch * 0.9 + 0.1

        const currentRadius = radiusBase * pinch * (radiusOffset * 0.5 + 0.5)
        const twist = normalizedY * 2 * curveFactor
        const currentAngle = angleOffset + twist
        const noiseScale = 0.4 * (1 - pinch)

        let x = Math.cos(currentAngle) * currentRadius
        let z = Math.sin(currentAngle) * currentRadius

        x += Math.sin(y * 0.4 + i * 0.15) * noiseScale
        z += Math.cos(y * 0.2 + i * 0.15) * noiseScale
        x += normalizedY * 6

        positions[pIndex] = x
        positions[pIndex + 1] = y
        positions[pIndex + 2] = z
        pIndex += 3
      }
    }

    for (let i = 0; i < numLines; i += 1) {
      for (let j = 0; j < segmentsPerLine - 1; j += 1) {
        const a = i * segmentsPerLine + j
        const b = i * segmentsPerLine + j + 1
        indices[iIndex] = a
        indices[iIndex + 1] = b
        iIndex += 2
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))

    const material = new THREE.LineBasicMaterial({
      color: 0x8855aa,
      transparent: true,
      opacity: 0.009,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const linesMesh = new THREE.LineSegments(geometry, material)
    linesMesh.rotation.z = -0.15
    linesMesh.position.x = -8
    scene.add(linesMesh)

    const startTime = performance.now()
    const frameInterval = quality.fps > 0 ? 1000 / quality.fps : 0
    let animationFrame = 0
    let lastRenderTime = 0

    const renderFrame = (timestamp = performance.now()) => {
      const elapsedSeconds = (timestamp - startTime) / 1000
      linesMesh.rotation.y = elapsedSeconds * 0.04
      renderer.render(scene, camera)
    }

    const animate = (timestamp) => {
      animationFrame = window.requestAnimationFrame(animate)
      if (timestamp - lastRenderTime < frameInterval) return

      lastRenderTime = timestamp
      renderFrame(timestamp)
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality.dpr))
      renderFrame()
    }

    if (quality.fps === 0) {
      renderFrame()
    } else {
      animationFrame = window.requestAnimationFrame(animate)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} className="webgl-container" aria-hidden="true" />
}

function Header({ isHidden }) {
  return (
    <header className={`site-header ${isHidden ? 'site-header-hidden' : ''}`}>
      <div className="brand-cluster">
        <div className="serif-text brand-name">Haseeb Zaheer</div>
        <div className="status-muted">Agentic AI Engineer @ 3E</div>
      </div>
      <div className="system-status">
        <span>Agent.Runtime: Online</span>
        <span className="status-active">[ACTIVE] PORTFOLIO_V1</span>
      </div>
    </header>
  )
}

Header.propTypes = {
  isHidden: PropTypes.bool.isRequired,
}

function Annotation({ align = 'left' }) {
  const left = align === 'left'
  const data = left
    ? {
        title: ['Agent', 'Workflow'],
        rows: [
          ['04', 'Systems', 'Built'],
          ['MCP', 'Tools', 'Active'],
          ['15%', 'Quality', 'Gain'],
        ],
      }
    : {
        title: ['Delivery', 'Signal'],
        rows: [
          ['~50%', 'Cycle', 'Reduction'],
          ['AWS', 'Lambda', 'Deploy'],
          ['3E', 'Production', 'Work'],
        ],
      }

  return (
    <div className={`annotation ${left ? 'annotation-left' : 'annotation-right'}`}>
      <div className="annotation-copy">
        <div className="serif-text annotation-title">
          {data.title[0]}
          <br />
          {data.title[1]}
        </div>
        {data.rows.map(([value, label, sublabel]) => (
          <div className="annotation-row" key={`${value}-${label}`}>
            <span className="annotation-value">{value}</span>
            <div className="data-label">
              {label}
              <br />
              {sublabel}
            </div>
          </div>
        ))}
      </div>
      {[48, 64, 80].map((width, index) => (
        <div className="leader-line" style={{ width: `${width / 4}rem`, top: `${4 + index * 2}rem` }} key={width}>
          <div className="leader-circle" />
        </div>
      ))}
    </div>
  )
}

Annotation.propTypes = {
  align: PropTypes.oneOf(['left', 'right']),
}

const secondBrainStarterQuestions = [
  'Who is Haseeb?',
  'What kinds of AI systems does Haseeb build?',
  'How does Haseeb like to work with teams?',
]

function createChatMessage(role, content, options = {}) {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
    ...options,
  }
}

function parseSseBlock(block) {
  let event = 'message'
  const data = []

  block.split('\n').forEach((line) => {
    if (!line || line.startsWith(':')) return

    const separatorIndex = line.indexOf(':')
    const field = separatorIndex === -1 ? line : line.slice(0, separatorIndex)
    const value = separatorIndex === -1 ? '' : line.slice(separatorIndex + 1).replace(/^ /, '')

    if (field === 'event') {
      event = value
    } else if (field === 'data') {
      data.push(value)
    }
  })

  return {
    event,
    data: data.join('\n'),
  }
}

async function readSseStream(response, onEvent) {
  if (!response.body) {
    throw new Error('The second brain returned an empty stream.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, '\n')

      while (buffer.includes('\n\n')) {
        const separatorIndex = buffer.indexOf('\n\n')
        const block = buffer.slice(0, separatorIndex)
        buffer = buffer.slice(separatorIndex + 2)

        if (block.trim()) {
          onEvent(parseSseBlock(block))
        }
      }
    }

    buffer = (buffer + decoder.decode()).replace(/\r\n/g, '\n').trim()

    if (buffer) {
      onEvent(parseSseBlock(buffer))
    }
  } finally {
    reader.releaseLock()
  }
}

function parseSseJson(data) {
  try {
    return JSON.parse(data)
  } catch {
    return {}
  }
}

function ChatMessageContent({ message }) {
  if (message.role === 'user') {
    return <span className="chat-message-text">{message.content}</span>
  }

  if (!message.content && message.streaming) {
    return <span className="chat-message-text chat-message-pending">Streaming...</span>
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a({ children, href }) {
          return (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {children}
            </a>
          )
        },
      }}
    >
      {message.content}
    </ReactMarkdown>
  )
}

ChatMessageContent.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['user', 'assistant']).isRequired,
    streaming: PropTypes.bool,
  }).isRequired,
}

function SecondBrainChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesRef = useRef(null)

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isSending])

  const sendMessage = async (content) => {
    const trimmed = content.trim()

    if (!trimmed || isSending) return

    const userMessage = createChatMessage('user', trimmed)
    const assistantMessage = createChatMessage('assistant', '', { streaming: true })
    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }))

    const updateAssistantMessage = (updater) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) => (message.id === assistantMessage.id ? updater(message) : message)),
      )
    }

    setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage])
    setInput('')
    setError('')
    setIsSending(true)

    let streamedAnswer = ''

    try {
      const response = await fetch('/api/second-brain-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history,
        }),
      })

      const contentType = response.headers.get('content-type') || ''

      if (!contentType.toLowerCase().includes('text/event-stream')) {
        const payload = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(payload.error || 'The second brain is unavailable right now.')
        }

        streamedAnswer = payload.answer || 'I could not find an answer for that.'
        updateAssistantMessage((message) => ({
          ...message,
          content: streamedAnswer,
          streaming: false,
        }))
        return
      }

      if (!response.ok) {
        throw new Error('The second brain is unavailable right now.')
      }

      let completed = false

      await readSseStream(response, ({ event, data }) => {
        const payload = parseSseJson(data)

        if (event === 'delta' && typeof payload.text === 'string') {
          streamedAnswer += payload.text
          updateAssistantMessage((message) => ({
            ...message,
            content: streamedAnswer,
          }))
        }

        if (event === 'done') {
          completed = true
          updateAssistantMessage((message) => ({
            ...message,
            streaming: false,
          }))
        }

        if (event === 'error') {
          throw new Error(payload.error || 'The second brain stream was interrupted.')
        }
      })

      if (!completed) {
        throw new Error('The second brain stream ended early.')
      }
    } catch (sendError) {
      if (streamedAnswer) {
        updateAssistantMessage((message) => ({
          ...message,
          content: streamedAnswer,
          streaming: false,
        }))
      } else {
        setMessages((currentMessages) => currentMessages.filter((message) => message.id !== assistantMessage.id))
      }
      setError(sendError instanceof Error ? sendError.message : 'Something went wrong.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    void sendMessage(input)
  }

  return (
    <div className="second-brain-chat" aria-label="Second brain chat">
      <div className="chatbox-header">
        <span>Second Brain</span>
        <span>{isSending ? 'Retrieving Context' : 'Context Online'}</span>
      </div>
      <div className="chatbox-messages" data-lenis-prevent ref={messagesRef} aria-live="polite">
        {messages.length === 0 ? (
          <div className="chatbox-empty">
            <p>Ask my second brain about projects, articles, workflows, or how I think through AI systems.</p>
            <div className="chatbox-suggestions">
              {secondBrainStarterQuestions.map((question) => (
                <button disabled={isSending} key={question} onClick={() => void sendMessage(question)} type="button">
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div className={`chat-message chat-message-${message.role}`} key={message.id}>
              <ChatMessageContent message={message} />
            </div>
          ))
        )}
      </div>
      {error ? <div className="chatbox-error">{error}</div> : null}
      <form className="chatbox-form" onSubmit={handleSubmit}>
        <textarea
          aria-label="Ask my second brain"
          maxLength={4000}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return

            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void sendMessage(input)
            }
          }}
          placeholder="Ask about Haseeb..."
          value={input}
        />
        <button disabled={isSending || !input.trim()} type="submit">
          Send
        </button>
      </form>
    </div>
  )
}

function Hero({ onSectionScroll }) {
  const scrollToSection = (event, id) => {
    event.preventDefault()
    onSectionScroll(id)
  }

  return (
    <section id="hero" className="hero-section">
      <div />
      <div className="hero-centerline">
        <Annotation align="left" />
        <div className="hero-core">
          <div className="hero-title-block">
            <h1 className="serif-text hero-title">Haseeb Zaheer</h1>
            <p className="mono-text hero-kicker">Engineering Multi-Agent AI Workflows</p>
          </div>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="hero-action hero-action-primary" href="#second-brain" onClick={(event) => scrollToSection(event, '#second-brain')}>
              Talk to my second brain
            </a>
            <a className="hero-action" href="#projects" onClick={(event) => scrollToSection(event, '#projects')}>
              View applied work
            </a>
          </div>
        </div>
        <Annotation align="right" />
      </div>
      <div className="hero-footer">
        <div className="hero-summary">
          Building <span className="text-accent">multi-agent systems</span>,{' '}
          <span className="text-accent">AI-enabled workflows</span>, and automation pipelines that turn complex
          operational problems into <span className="text-accent">reliable engineering products</span>.
        </div>
        <nav className="hero-nav" aria-label="Portfolio sections">
          <a href="#second-brain" onClick={(event) => scrollToSection(event, '#second-brain')}>
            [ 01. SECOND BRAIN ]
          </a>
          <a href="#about" onClick={(event) => scrollToSection(event, '#about')}>
            [ 02. PERSPECTIVE ]
          </a>
          <a href="#projects" onClick={(event) => scrollToSection(event, '#projects')}>
            [ 03. APPLIED AI WORK ]
          </a>
          <a href="#contact" onClick={(event) => scrollToSection(event, '#contact')}>
            [ 04. CONNECT ]
          </a>
          <a href="/articles">[ 05. ARTICLES ]</a>
        </nav>
      </div>
    </section>
  )
}

Hero.propTypes = {
  onSectionScroll: PropTypes.func.isRequired,
}

function SectionHeader({ title, section }) {
  return (
    <div className="section-header">
      <h2 className="serif-text section-title">{title}</h2>
      <div className="section-index">Section // {section}</div>
    </div>
  )
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
}

function TerminalBlock({ items }) {
  return (
    <div className="terminal-block">
      {items.map(([label, body]) => (
        <div className="terminal-item" key={label}>
          <span>{label}</span>
          <br />
          {body}
        </div>
      ))}
    </div>
  )
}

TerminalBlock.propTypes = {
  items: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
}

function SecondBrainSection() {
  return (
    <section id="second-brain" className="content-section second-brain-section">
      <SectionHeader title="Ask My Second Brain" section="01" />
      <div className="second-brain-panel">
        <div className="second-brain-copy">
          <div className="second-brain-eyebrow">Private RAG Interface</div>
          <p className="second-brain-lead">
            Ask about my AI systems, engineering work, collaboration style, or fit for a role.
          </p>
          <div className="second-brain-signal-stack" aria-label="Second brain context signals">
            <div className="second-brain-signal">
              <span>Corpus</span>
              <strong>Projects, notes, articles</strong>
            </div>
            <div className="second-brain-signal">
              <span>Route</span>
              <strong>Portfolio proxy</strong>
            </div>
            <div className="second-brain-signal">
              <span>Mode</span>
              <strong>Streaming retrieval</strong>
            </div>
          </div>
        </div>
        <div className="second-brain-console">
          <div className="second-brain-console-rail" aria-hidden="true">
            <span>01</span>
            <span>RAG</span>
            <span>SSE</span>
          </div>
          <SecondBrainChat />
        </div>
      </div>
    </section>
  )
}

function ExpertiseSection() {
  return (
    <section id="about" className="content-section about-section">
      <SectionHeader title="Domain Expertise" section="02" />
      <div className="expertise-grid">
        {expertise.map((column) => (
          <article className="expertise-col" key={column.title.join('-')}>
            <div className="serif-text expertise-title">
              {column.title[0]}
              <br />
              {column.title[1]}
            </div>
            <TerminalBlock items={column.items} />
          </article>
        ))}
      </div>
      <div className="about-footer">
        <div>
          Designing <span className="text-accent">practical AI systems</span> with{' '}
          <span className="text-accent">guardrails</span>, <span className="text-accent">observability</span>, and
          maintainable handoff paths.
        </div>
        <blockquote className="serif-text">&quot;Practical architecture over novelty for its own sake.&quot;</blockquote>
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3 className="serif-text">{project.title}</h3>
        <span>{project.meta}</span>
      </div>
      <p>{project.body}</p>
      <div className="metric-block">
        {project.metrics.map(([label, value]) => (
          <div className="metric-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    body: PropTypes.node.isRequired,
    meta: PropTypes.string.isRequired,
    metrics: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
}

function FieldWorkSection() {
  return (
    <section id="projects" className="content-section projects-section">
      <SectionHeader title="Applied AI Work" section="03" />
      <div className="project-grid">
        {fieldWork.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-inner">
        <div className="transparent-card">
          <h2 className="serif-text">Get in Touch</h2>
          <p>
            Open to <span className="text-accent">full-time roles</span>,{' '}
            <span className="text-accent">Agentic AI</span>, and{' '}
            <span className="text-accent">selective product builds</span>.
          </p>
          <div className="contact-links">
            <a href="mailto:haseebzaheer26@gmail.com">
              <span>EMAIL:</span>
              <strong>haseebzaheer26@gmail.com</strong>
            </a>
            <a href="https://github.com/haseeb-zaheer" target="_blank" rel="noreferrer">
              <span>GITHUB:</span>
              <strong>/haseeb-zaheer</strong>
            </a>
            <a href="https://www.linkedin.com/in/haseeb-zaheer" target="_blank" rel="noreferrer">
              <span>LINKEDIN:</span>
              <strong>/in/haseeb-zaheer</strong>
            </a>
          </div>
        </div>
        <FooterCode />
      </div>
    </section>
  )
}

function FooterCode() {
  return <div className="footer-code">2026 HASEEB ZAHEER // AGENTIC AI SYSTEMS // HASEEBZAHEER.DEV</div>
}

function YouTubeEmbed({ videoId }) {
  return (
    <span className="youtube-embed">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="Embedded YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </span>
  )
}

YouTubeEmbed.propTypes = {
  videoId: PropTypes.string.isRequired,
}

function ArticleMarkdown({ article }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a({ children, href }) {
          const videoId = getYouTubeVideoId(href)
          if (videoId) return <YouTubeEmbed videoId={videoId} />

          return (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {children}
            </a>
          )
        },
        img({ alt, src }) {
          return <img alt={alt || ''} src={resolveArticleImage(article.slug, src)} loading="lazy" />
        },
      }}
    >
      {article.content}
    </ReactMarkdown>
  )
}

ArticleMarkdown.propTypes = {
  article: PropTypes.shape({
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
}

function ArticleDetailPage({ article }) {
  return (
    <main>
      <section className="article-page">
        <div className="article-return">
          <a href="/articles">[ ALL ARTICLES ]</a>
        </div>

        <header className="article-hero">
          <div className="article-meta-rail">
            <div>
              <span>TYPE</span>
              <strong>{article.type}</strong>
            </div>
            <div>
              <span>DATE</span>
              <strong>{article.date}</strong>
            </div>
            <div>
              <span>READ</span>
              <strong>{article.readTime}</strong>
            </div>
          </div>

          <div className="article-heading">
            <div className="article-kicker">Article // {article.tags[0] || 'Field Note'}</div>
            <h1 className="serif-text">{article.title}</h1>
            <p>{article.description}</p>
          </div>
        </header>

        <article className="article-content">
          <ArticleMarkdown article={article} />
        </article>

        <FooterCode />
      </section>
    </main>
  )
}

ArticleDetailPage.propTypes = {
  article: PropTypes.shape({
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    readTime: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
}

function ArticlesIndexPage() {
  return (
    <main>
      <section className="article-page article-index-page">
        <div className="article-return">
          <a href="/">[ RETURN HOME ]</a>
        </div>
        <header className="section-header">
          <h1 className="serif-text section-title">Articles</h1>
          <div className="section-index">Index // Notes</div>
        </header>
        <div className="article-index-grid">
          {articles.map((article) => (
            <a className="article-list-card" href={`/articles/${article.slug}`} key={article.slug}>
              <div className="article-list-meta">
                <span>{article.type}</span>
                <span>{article.date}</span>
              </div>
              <h2 className="serif-text">{article.title}</h2>
              <p>{article.description}</p>
              <div className="article-tag-row">
                {article.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
        <FooterCode />
      </section>
    </main>
  )
}

function ArticleNotFoundPage() {
  return (
    <main>
      <section className="article-page article-empty-page">
        <div className="article-return">
          <a href="/articles">[ ALL ARTICLES ]</a>
        </div>
        <div className="article-empty-state">
          <div className="article-kicker">Article // Missing</div>
          <h1 className="serif-text">Article Not Found</h1>
          <p>The requested article does not exist in the current article index.</p>
        </div>
        <FooterCode />
      </section>
    </main>
  )
}

function App() {
  const [isSiteVisible, setIsSiteVisible] = useState(false)
  const [isLoaderMounted, setIsLoaderMounted] = useState(true)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const pathname = window.location.pathname.replace(/\/$/, '') || '/'
  const isArticlesIndexRoute = pathname === '/articles'
  const articleSlug = pathname.startsWith('/articles/') ? decodeURIComponent(pathname.replace('/articles/', '')) : null
  const activeArticle = articleSlug ? getArticleBySlug(articleSlug) : null
  const lenisRef = useRef(null)

  const revealSite = useCallback(() => {
    setIsSiteVisible(true)
  }, [])

  const removeLoader = useCallback(() => {
    setIsLoaderMounted(false)
  }, [])

  const scrollToSection = useCallback((target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.45,
        easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      })
      return
    }

    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!isLoaderMounted) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isLoaderMounted])

  useEffect(() => {
    if (!isSiteVisible) return undefined

    const lenis = new Lenis({
      lerp: 0.075,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.85,
    })
    let animationFrame = 0

    const raf = (time) => {
      lenis.raf(time)
      animationFrame = window.requestAnimationFrame(raf)
    }

    lenisRef.current = lenis
    animationFrame = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isSiteVisible])

  useEffect(() => {
    if (!isSiteVisible) return undefined

    const handleScroll = () => {
      setIsHeaderHidden(window.scrollY >= 48)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isSiteVisible])

  return (
    <>
      <NeuralField />
      <div className={`ui-wrapper ${isSiteVisible ? 'visible-content' : 'hidden-content'}`}>
        <Header isHidden={isHeaderHidden} />
        {isArticlesIndexRoute ? (
          <ArticlesIndexPage />
        ) : articleSlug && activeArticle ? (
          <ArticleDetailPage article={activeArticle} />
        ) : articleSlug ? (
          <ArticleNotFoundPage />
        ) : (
          <main>
            <Hero onSectionScroll={scrollToSection} />
            <SecondBrainSection />
            <ExpertiseSection />
            <FieldWorkSection />
            <ContactSection />
          </main>
        )}
      </div>
      {isLoaderMounted && <LoadingOverlay onDone={removeLoader} onReveal={revealSite} />}
    </>
  )
}

export default App
