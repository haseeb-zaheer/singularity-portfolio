import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Lenis from 'lenis'
import * as THREE from 'three'
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
        <div className="hero-title-block">
          <h1 className="serif-text hero-title">Haseeb Zaheer</h1>
          <p className="mono-text hero-kicker">Engineering Multi-Agent AI Workflows</p>
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
          <a href="#about" onClick={(event) => scrollToSection(event, '#about')}>
            [ 01. PERSPECTIVE ]
          </a>
          <a href="#projects" onClick={(event) => scrollToSection(event, '#projects')}>
            [ 02. APPLIED AI WORK ]
          </a>
          <a href="#contact" onClick={(event) => scrollToSection(event, '#contact')}>
            [ 03. CONNECT ]
          </a>
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

function ExpertiseSection() {
  return (
    <section id="about" className="content-section about-section">
      <SectionHeader title="Domain Expertise" section="01" />
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
      <SectionHeader title="Applied AI Work" section="02" />
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
        <div className="footer-code">2026 HASEEB ZAHEER // AGENTIC AI SYSTEMS // HASEEBZAHEER.DEV</div>
      </div>
    </section>
  )
}

function ArticleExamplePage() {
  return (
    <main>
      <section className="article-page">
        <div className="article-return">
          <a href="/">[ RETURN HOME ]</a>
        </div>

        <header className="article-hero">
          <div className="article-meta-rail">
            <div>
              <span>TYPE</span>
              <strong>FIELD NOTE</strong>
            </div>
            <div>
              <span>DATE</span>
              <strong>2026.05.19</strong>
            </div>
            <div>
              <span>READ</span>
              <strong>06 MIN</strong>
            </div>
          </div>

          <div className="article-heading">
            <div className="article-kicker">Article // Agentic AI</div>
            <h1 className="serif-text">Designing Multi-Agent Workflows That Stay Useful</h1>
            <p>
              A practical note on building agentic systems around bounded tools, traceable handoffs, and evaluation
              loops instead of open-ended autonomy.
            </p>
          </div>
        </header>

        <article className="article-content">
          <p className="article-lede">
            The useful part of an agentic system is rarely the model call by itself. The value usually appears in the
            coordination layer: how work is decomposed, which tools are allowed, where evidence is stored, and how the
            system recovers when an intermediate step is wrong.
          </p>

          <h2 className="serif-text">Start with bounded responsibility</h2>
          <p>
            I prefer designing agents as narrow operators with explicit contracts. One agent may classify source
            material, another may map regulatory concepts, and another may validate gaps against known requirements.
            The orchestrator should make the sequence legible rather than magical.
          </p>

          <blockquote className="serif-text">
            Autonomy becomes useful when the system can explain what it did, why it did it, and what it refused to do.
          </blockquote>

          <h2 className="serif-text">Tools need scopes, not just access</h2>
          <p>
            Tool-use works best when every integration has a narrow purpose. A retrieval tool should know what corpus it
            can search. A write tool should have guardrails around what it can mutate. A progress tracker should capture
            checkpoints in language that engineers and reviewers can inspect later.
          </p>

          <div className="article-code-block">
            <span>WORKFLOW_SHAPE</span>
            <pre>{`orchestrator -> retrieve context
orchestrator -> assign domain agent
domain agent -> produce mapped output
review agent -> validate evidence
system -> persist trace + handoff`}</pre>
          </div>

          <h2 className="serif-text">Evaluation keeps the loop honest</h2>
          <p>
            Without evaluation, the workflow eventually becomes a demo. The system needs checks that measure whether
            outputs are complete, grounded, and useful to the next human or machine step. That feedback loop matters
            more than adding another agent.
          </p>
        </article>
      </section>
    </main>
  )
}

function App() {
  const [isSiteVisible, setIsSiteVisible] = useState(false)
  const [isLoaderMounted, setIsLoaderMounted] = useState(true)
  const [isHeaderHidden, setIsHeaderHidden] = useState(false)
  const isArticleRoute = window.location.pathname === '/articles/example'
  const lenisRef = useRef(null)
  const lastScrollYRef = useRef(0)

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
      const currentScrollY = window.scrollY
      const scrollDelta = currentScrollY - lastScrollYRef.current

      if (currentScrollY < 48) {
        setIsHeaderHidden(false)
      } else if (scrollDelta > 6) {
        setIsHeaderHidden(true)
      } else if (scrollDelta < -6) {
        setIsHeaderHidden(false)
      }

      lastScrollYRef.current = currentScrollY
    }

    lastScrollYRef.current = window.scrollY
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
        {isArticleRoute ? (
          <ArticleExamplePage />
        ) : (
          <main>
            <Hero onSectionScroll={scrollToSection} />
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
