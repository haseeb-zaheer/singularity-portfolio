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
    body: 'Built a multi-agent system to compare and reconcile large regulatory datasets across legacy database-backed flows and modern API-driven sources.',
    metrics: [
      ['SYSTEM:', 'Multi-agent orchestration'],
      ['TOOLS:', 'MCP + SQL/API interfaces'],
      ['CONTROL:', 'Guardrails + observability'],
    ],
  },
  {
    title: 'Regulatory Data Pipeline',
    meta: '2025 / 3E',
    body: 'Developed ingestion and transformation workflows that moved API-sourced regulatory data into downstream application tables and product-ready structures.',
    metrics: [
      ['SOURCE:', 'API ingestion'],
      ['LAYER:', 'Staging + transforms'],
      ['OUTCOME:', 'Consolidated processing paths'],
    ],
  },
  {
    title: 'AI Workflow Automation',
    meta: '2025 / 3E',
    body: 'Designed agentic workflows for planning, implementation, testing, review, and delivery, while optimizing enterprise AI translation quality and request flow.',
    metrics: [
      ['IMPACT:', '~50% cycle-time reduction'],
      ['QUALITY:', '+15% translation accuracy'],
      ['DEPLOY:', 'Docker + AWS Lambda'],
    ],
  },
]

const loadingStatusMessages = [
  { text: 'Loading portfolio assets...', code: 'LOAD_AST' },
  { text: 'Mounting visual library...', code: 'MNT_VISUAL' },
  { text: 'Calibrating display engine...', code: 'CALIB_DISP' },
  { text: 'Optimizing render paths...', code: 'OPT_RENDER' },
  { text: 'Synchronizing content modules...', code: 'SYNC_MOD' },
  { text: 'Finalizing composition...', code: 'FIN_COMP' },
  { text: 'Establishing connection...', code: 'CONN_EST' },
  { text: 'Welcome.', code: 'READY' },
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
          schedule(onDone, 1500)
        }, 500)
      }, 500)
    }

    const updateLoading = (currentProgress) => {
      if (currentProgress >= 100) {
        setProgress(100)
        setMessageIndex(loadingStatusMessages.length - 1)
        completeLoading()
        return
      }

      const increment = Math.random() * 8
      const nextProgress = Math.min(100, currentProgress + increment)
      const nextMessageIndex = Math.floor((nextProgress / 100) * (loadingStatusMessages.length - 1))

      setProgress(nextProgress)
      setMessageIndex(nextMessageIndex)
      schedule(() => updateLoading(nextProgress), Math.random() * 300 + 100)
    }

    schedule(() => updateLoading(0), 250)

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
          <div className="serif-text loader-name">H_ZAHEER</div>
          <div className="mono-text loader-version">Portfolio System v2.0.4</div>
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

      <div className="loader-footer">Loading Experience // Please wait</div>
    </div>
  )
}

LoadingOverlay.propTypes = {
  onDone: PropTypes.func.isRequired,
  onReveal: PropTypes.func.isRequired,
}

function NeuralField() {
  const mountRef = useRef(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return undefined

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d0015)

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(0, 0, 60)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const numLines = 8000
    const segmentsPerLine = 60
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(numLines * segmentsPerLine * 3)
    const indices = []

    let pIndex = 0
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
        indices.push(a, b)
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setIndex(indices)

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
    let animationFrame = 0

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate)
      const elapsedSeconds = (performance.now() - startTime) / 1000
      linesMesh.rotation.y = elapsedSeconds * 0.04
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    animate()
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="webgl-container" aria-hidden="true" />
}

function Header() {
  return (
    <header className="site-header">
      <div className="brand-cluster">
        <div className="serif-text brand-name">h_zaheer</div>
        <div className="status-muted">Agentic AI Engineer @ 3E</div>
      </div>
      <div className="system-status">
        <span>Core.Process: Running</span>
        <span className="status-active">[ACTIVE] SOC_2.LBL</span>
      </div>
    </header>
  )
}

function Annotation({ align = 'left' }) {
  const left = align === 'left'
  const data = left
    ? {
        title: ['Core Model', 'Diagnostics'],
        rows: [
          ['0.08', 'Loss', 'Converge'],
          ['175B', 'Params', 'Active'],
          ['98.4', '%', 'Precision'],
        ],
      }
    : {
        title: ['Inference', 'Vector Map'],
        rows: [
          ['12ms', 'Latency', 'Target'],
          ['40k', 'Tokens', 'Min-P'],
          ['1.2T', 'Tokens', 'Processed'],
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
          Building agentic workflows, regulatory data pipelines, and AI-assisted delivery systems for production
          engineering teams.
        </div>
        <nav className="hero-nav" aria-label="Portfolio sections">
          <a href="#about" onClick={(event) => scrollToSection(event, '#about')}>
            [ 01. PERSPECTIVE ]
          </a>
          <a href="#projects" onClick={(event) => scrollToSection(event, '#projects')}>
            [ 02. FIELD WORK ]
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
        <div>Currently building production AI workflows for regulatory intelligence.</div>
        <blockquote className="serif-text">&quot;Reliable agents start with reliable systems.&quot;</blockquote>
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
    body: PropTypes.string.isRequired,
    meta: PropTypes.string.isRequired,
    metrics: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
}

function FieldWorkSection() {
  return (
    <section id="projects" className="content-section projects-section">
      <SectionHeader title="Field Work" section="02" />
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
        <h2 className="serif-text">Initialize Protocol</h2>
        <p>Open for research collaborations, high-bandwidth compute discussions, and architectural advisory.</p>
        <div className="contact-links">
          <a href="mailto:h.zaheer@latent.manifold">
            <span>EMAIL:</span>
            <strong>h.zaheer@latent.manifold</strong>
          </a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            <span>GITHUB:</span>
            <strong>/zaheer_h</strong>
          </a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            <span>X/TWITTER:</span>
            <strong>@zaheer_latent</strong>
          </a>
        </div>
        <div className="footer-code">2024 HASEEB ZAHEER // NOVEL INTELLIGENCE SYSTEMS // [51.5074 N, 0.1278 W]</div>
      </div>
    </section>
  )
}

function App() {
  const [isSiteVisible, setIsSiteVisible] = useState(false)
  const [isLoaderMounted, setIsLoaderMounted] = useState(true)
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

  return (
    <>
      <NeuralField />
      <div className={`ui-wrapper ${isSiteVisible ? 'visible-content' : 'hidden-content'}`}>
        <Header />
        <main>
          <Hero onSectionScroll={scrollToSection} />
          <ExpertiseSection />
          <FieldWorkSection />
          <ContactSection />
        </main>
      </div>
      {isLoaderMounted && <LoadingOverlay onDone={removeLoader} onReveal={revealSite} />}
    </>
  )
}

export default App
