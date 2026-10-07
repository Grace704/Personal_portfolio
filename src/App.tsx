import { useEffect, useRef, useState, useCallback, MouseEvent } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'hobbies', label: 'Hobbies' },
]

const ROLES = ['Actuarial Science', 'Data Analysis', 'Quant Research', 'Problem Solver', 'Table Tennis Player']

type ExperienceTrack = 'All' | 'Data Analysis' | 'Leadership'

const EXPERIENCE: {
  role: string
  org: string
  dates: string
  desc: string
  tags: string[]
  track: Exclude<ExperienceTrack, 'All'>
  award?: string
}[] = [
  {
    role: 'Technology & Data Analyst',
    org: 'EcoServants',
    dates: 'Apr 2026 – Present',
    desc: 'Analyzed website traffic, survey data, and IRS / ProPublica foundation records to support a nonprofit’s digital strategy and funding research.',
    tags: ['Python', 'R', 'pandas', 'Google Analytics'],
    track: 'Data Analysis',
  },
  {
    role: 'Assistant Manager',
    org: 'Dairy Queen Grill & Chill',
    award: 'Co-op Award Nominee',
    dates: 'May – Aug 2026',
    desc: 'Ran daily store operations — opening, inventory, cake prep, and crew scheduling. Trained and interviewed new employees, and took on full manager responsibilities during a manager’s absence.',
    tags: ['Operations', 'Training', 'Customer Service'],
    track: 'Leadership',
  },
  {
    role: 'Orientation Leader',
    org: 'University of Waterloo',
    dates: '2026',
    desc: 'Coordinated a team of roughly 350 orientation staff supporting incoming students, helping welcome and integrate a first-year class of about 2,000.',
    tags: ['Communication', 'Event Coordination'],
    track: 'Leadership',
  },
  {
    role: 'Ping-Pong Coach',
    org: 'Winnipeg Table Tennis Training Center',
    dates: 'Sep 2023 – Jun 2025',
    desc: 'Coached younger table tennis players at the training center, drawing on years of competitive experience on the Manitoba provincial team.',
    tags: ['Coaching', 'Mentorship'],
    track: 'Leadership',
  },
  {
    role: 'Team Captain',
    org: 'Manitoba Provincial Table Tennis Team',
    dates: '2018 – 2024',
    desc: 'Represented Manitoba at the provincial level for six years, serving as a team leader and captain. Competed at the 2023 Canada Winter Games, winning silver in doubles.',
    tags: ['Leadership', 'Teamwork', 'Competition'],
    track: 'Leadership',
  },
  {
    role: 'Robotics Club — Founder',
    org: "St. John's-Ravenscourt",
    dates: 'High School',
    desc: 'Founded a robotics club after being turned down by nine teachers before finding support. Led the team to a 3rd-place finish at a provincial robotics competition.',
    tags: ['Initiative', 'Robotics'],
    track: 'Leadership',
  },
]

type ProjectCategory = 'Actuarial & Finance' | 'Data Analysis' | 'Pure Mathematics'

const PROJECTS: {
  title: string
  desc: string
  tags: string[]
  category: Exclude<ProjectCategory, 'All'>
  github?: string
  demo?: string
}[] = [
  {
    title: 'Quantitative Equity Research Platform',
    desc: 'A Python platform that takes a stock ticker and builds a full valuation pipeline — DCF, comparable, and P/E-based models layered with Monte Carlo simulation and sensitivity analysis to estimate intrinsic value under uncertainty.',
    tags: ['Python', 'pandas', 'yfinance', 'Statistics', 'Valuation'],
    category: 'Actuarial & Finance',
    github: '#',
  },
  {
    title: 'Life Trajectory',
    desc: 'A productivity analytics platform for tracking academics, career preparation, goals, reflection, and daily priorities in one minimalist dashboard.',
    tags: ['Productivity', 'Data', 'Personal Analytics'],
    category: 'Data Analysis',
  },
  {
    title: 'Reading: Random Walks on Finite Groups',
    desc: 'A guided reading program on random walks on finite groups, exploring how probability and algebra combine to explain how randomness spreads and mixes over time.',
    tags: ['Probability', 'Markov Chains', 'Group Theory'],
    category: 'Pure Mathematics',
  },
]

const PROJECT_SYMBOL: Record<ProjectCategory, string> = {
  'Actuarial & Finance': 'Σ',
  'Data Analysis': '∫',
  'Pure Mathematics': '∼',
}

const SKILL_CATEGORIES = ['Actuarial & Quant', 'Data & Programming', 'AI & ML'] as const

const SKILLS: Record<string, { name: string; x: number; y: number }[]> = {
  'Actuarial & Quant': [
    { name: 'Probability', x: 80, y: 55 },
    { name: 'Statistics', x: 160, y: 30 },
    { name: 'Financial Mathematics', x: 250, y: 60 },
    { name: 'Risk Analysis', x: 130, y: 100 },
    { name: 'Equity Valuation', x: 310, y: 40 },
    { name: 'Backtesting', x: 220, y: 115 },
  ],
  'Data & Programming': [
    { name: 'Python', x: 70, y: 50 },
    { name: 'R', x: 150, y: 28 },
    { name: 'SQL', x: 230, y: 58 },
    { name: 'pandas', x: 115, y: 105 },
    { name: 'Data Cleaning', x: 200, y: 108 },
    { name: 'Google Analytics', x: 320, y: 40 },
  ],
  'AI & ML': [
    { name: 'Machine Learning', x: 90, y: 52 },
    { name: 'ChatGPT', x: 195, y: 28 },
    { name: 'Claude', x: 285, y: 60 },
    { name: 'GitHub Copilot', x: 160, y: 108 },
  ],
}

const CONSTELLATION_EDGES: Record<string, [number, number][]> = {
  'Actuarial & Quant': [[0, 1], [1, 2], [0, 3], [2, 4], [1, 5], [3, 4]],
  'Data & Programming': [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4]],
  'AI & ML': [[0, 1], [1, 2], [0, 3], [2, 3]],
}

const FEATURED_COMPETITION = {
  name: 'Canada Winter Games',
  year: '2023',
  result: 'Silver Medal, Table Tennis Doubles',
  desc: 'Represented Manitoba in table tennis doubles at the 2023 Canada Winter Games, competing against the top junior players in the country.',
}

const CASE_COMPETITIONS: {
  name: string
  year: string
  result?: string
  desc: string
  upcoming?: boolean
}[] = [
  {
    name: 'ASNA Case Competition',
    year: 'Upcoming',
    desc: 'Preparing for this upcoming case competition.',
    upcoming: true,
  },
  {
    name: 'Quantify AI',
    year: 'Fall 2026',
    result: 'Advanced to Round 2',
    desc: 'Served as risk analyst and data lead for team Quartile One in an insurance analytics competition, advancing to the second round.',
  },
  {
    name: 'SOA Case Study Competition',
    year: 'March 2026',
    desc: 'Analyzed a space insurance case study with my team and developed a recommendation for the product.',
  },
  {
    name: 'RISCC',
    year: 'February 2026',
    desc: 'Worked with a team to build a customized life insurance recommendation for a family, based on their needs and financial situation.',
  },
  {
    name: 'Waterloo Consulting Case Competition',
    year: 'Winter 2026',
    desc: 'Led data analysis, cleaning, and visualization for a case on how much Aramco should invest in new energy, and helped size and defend the investment split across areas.',
  },
  {
    name: 'UTD ASA Case Competition',
    year: 'Fall 2025',
    desc: 'Taught myself loss triangles and the chain ladder method in my first case competition to build and present a reserving recommendation for a workers\' compensation case.',
  },
  {
    name: 'HackRx',
    year: 'Fall 2025',
    result: '2nd Place',
    desc: 'Placed second on a team of four, designing a Figma prototype with an AI component to track patients\' medication routines and well-being.',
  },
]

const CERTIFICATIONS = [
  {
    name: 'SOA Exam P',
    body: 'Society of Actuaries',
    status: 'Passed',
    desc: 'Probability — covers the probability tools used to assess and quantify risk, a foundational exam for actuarial and quantitative risk work.',
  },
  {
    name: 'SOA Exam FM',
    body: 'Society of Actuaries',
    status: 'Passed',
    desc: 'Financial Mathematics — covers interest theory and time value of money concepts that underpin actuarial and financial modeling.',
  },
]

const EDUCATION = [
  {
    school: 'University of Waterloo',
    program: 'Honours Mathematics, Co-op',
    years: '2025 – Present',
    coursework: ['MATH 135', 'MATH 138', 'MATH 237', 'MATH 235', 'STAT 230', 'CS 135', 'CS 136', 'ECON 101'],
    activities: ['Orientation Leader', 'Directed Reading Program (Fall 2026)', 'Math Club'],
    sports: [] as string[],
    awards: '~85% average, working toward 90%+',
  },
  {
    school: "St. John's-Ravenscourt",
    program: 'High School Diploma',
    years: 'Manitoba',
    coursework: [] as string[],
    activities: ['Robotics Club Founder', 'Math Club Leader', 'Ping-Pong Club Leader'],
    sports: ['Track and Field', 'Badminton', 'Basketball Team'],
    awards: '',
  },
  {
    school: 'University of Manitoba',
    program: 'Concurrent Study, Mathematics',
    years: 'Completed 2025',
    coursework: ['MATH 136', 'MATH 137'],
    activities: ['Completed while in high school'],
    sports: [] as string[],
    awards: 'MATH 136: A · MATH 137: 100% (A+, transfer credit)',
  },
]

const HOBBIES = [
  {
    name: 'Table Tennis',
    caption: 'Competed for Manitoba at the provincial level for six years and won silver in doubles at the 2023 Canada Winter Games.',
    mark: 'TT',
    wide: true,
  },
  {
    name: 'Quantitative Curiosity',
    caption: 'Small experiments in blackjack probability, stock volatility, and backtesting — mostly just to see what the numbers say.',
    mark: 'Σ',
    wide: true,
  },
  {
    name: 'Reading & English Practice',
    caption: "Working through books like Alice's Adventures in Wonderland to build vocabulary and think more naturally in English.",
    mark: 'Aa',
    wide: false,
  },
  {
    name: 'Cryptography',
    caption: 'A long-running interest since grade 10 — RSA, mathematical cryptography, and post-quantum schemes like Kyber and Dilithium.',
    mark: 'RSA',
    wide: false,
  },
  {
    name: 'Coaching & Mentorship',
    caption: 'Coached younger table tennis players from 2023–2025, and tutored students academically.',
    mark: 'PP',
    wide: false,
  },
]

// ─── Particle Canvas ─────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number; opacity: number
  hue: number; blurred: boolean
  parallaxFactor: number
}

function createParticle(w: number, h: number): Particle {
  const blurred = Math.random() < 0.4
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: Math.random() * 0.35 + 0.08,
    size: blurred ? Math.random() * 50 + 15 : Math.random() * 2.2 + 0.8,
    opacity: blurred ? Math.random() * 0.1 + 0.12 : Math.random() * 0.45 + 0.08,
    hue: Math.random() * 360,
    blurred,
    parallaxFactor: blurred ? 0.7 : Math.random() * 0.35 + 0.05,
  }
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)
  const reducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (reducedMotion.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = document.documentElement.scrollHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const isMobile = window.innerWidth < 768
    const count = isMobile ? 120 : 260
    const particles = Array.from({ length: count }, () => createParticle(canvas.width, canvas.height))

    const onMouse = (e: globalThis.MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouse)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const mx = (mouseRef.current.x - canvas.width / 2) / canvas.width
      const my = (mouseRef.current.y - window.innerHeight / 2) / window.innerHeight

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y > canvas.height + 20) p.y = -20
        if (p.x > canvas.width + 20) p.x = -20
        if (p.x < -20) p.x = canvas.width + 20

        const rx = p.x - mx * p.parallaxFactor * 70
        const ry = p.y - my * p.parallaxFactor * 50

        ctx.save()
        ctx.globalAlpha = p.opacity
        if (p.blurred) {
          ctx.shadowBlur = Math.min(p.size * 4, 80)
          ctx.shadowColor = `hsl(${p.hue}, 75%, 75%)`
        }
        ctx.fillStyle = `hsl(${p.hue}, 75%, 75%)`
        ctx.beginPath()
        ctx.arc(rx, ry, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }
      },
      { threshold: 0.12 }
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

// ─── Active Section Hook ──────────────────────────────────────────────────────

function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { threshold: 0.35 }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
  return active
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ active }: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        background: scrolled ? 'rgba(6,4,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(139,92,246,0.12)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
      }}
    >
      <button
        onClick={() => scrollTo('home')}
        className="font-display text-xl italic"
        style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}
      >
        Grace.
      </button>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.03em',
              color: active === id ? 'var(--violet-light)' : 'var(--text-muted)',
              transition: 'color 0.25s ease',
              textTransform: 'uppercase',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setMenuOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              display: 'block',
              width: 22,
              height: 1.5,
              background: 'var(--text)',
              borderRadius: 1,
              transition: 'transform 0.25s ease, opacity 0.25s ease',
              transform: menuOpen
                ? i === 0 ? 'translateY(7px) rotate(45deg)'
                : i === 2 ? 'translateY(-7px) rotate(-45deg)'
                : 'scaleX(0)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 flex flex-col"
          style={{
            background: 'rgba(6,4,16,0.96)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {NAV_ITEMS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-left px-6 py-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: active === id ? 'var(--violet-light)' : 'var(--text-muted)',
                borderBottom: '1px solid rgba(139,92,246,0.07)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [roleKey, setRoleKey] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setRoleIdx(i => (i + 1) % ROLES.length)
      setRoleKey(k => k + 1)
    }, 2800)
    return () => clearInterval(t)
  }, [])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center min-h-screen text-center"
      style={{ padding: '0 1.5rem' }}
    >
      {/* Glowing orb behind text */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -55%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(219,39,119,0.1) 40%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="relative" style={{ zIndex: 1, maxWidth: 820 }}>
        <p
          className="reveal"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--violet-light)',
            marginBottom: '1.5rem',
          }}
        >
          Actuarial Science · Data Analysis
        </p>

        <h1
          className="font-display reveal reveal-delay-1"
          style={{
            fontSize: 'clamp(3.5rem, 10vw, 8rem)',
            lineHeight: 1.02,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text)',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
          }}
        >
          Hi, I'm Grace.
        </h1>

        <p
          className="reveal reveal-delay-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            fontWeight: 300,
            color: 'var(--text-muted)',
            maxWidth: 560,
            margin: '0 auto 1.5rem',
            lineHeight: 1.7,
          }}
        >
          I'm an Honours Mathematics student at the University of Waterloo. I'm building two main
          paths — actuarial science and data analysis — and I like turning messy data and risk
          problems into something useful.
        </p>

        <div
          className="reveal reveal-delay-3"
          style={{ height: '2.2rem', marginBottom: '2.8rem', overflow: 'hidden' }}
        >
          <span
            key={roleKey}
            className="role-text"
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--pink-light)',
            }}
          >
            {ROLES[roleIdx]}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 justify-center reveal reveal-delay-4">
          <button
            onClick={() => scrollTo('projects')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text)',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.8), rgba(219,39,119,0.7))',
              border: '1px solid rgba(139,92,246,0.35)',
              padding: '0.85rem 2.2rem',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'opacity 0.25s ease, transform 0.25s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Explore My Work
          </button>
          <button
            onClick={() => scrollTo('about')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.88rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              background: 'transparent',
              border: '1px solid var(--border)',
              padding: '0.85rem 2.2rem',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'border-color 0.25s ease, color 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.45)'
              e.currentTarget.style.color = 'var(--text)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            About Me
          </button>
        </div>

        <div className="flex flex-wrap gap-5 justify-center reveal reveal-delay-4" style={{ marginTop: '1.75rem' }}>
          {[
            { label: 'Resume', href: '/Grace_Qi_Resume.pdf' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/grace-qi-56a19831a/' },
            { label: 'GitHub', href: 'https://github.com/Grace704' },
            { label: 'Email', href: 'mailto:qigrace0@gmail.com' },
          ].map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--violet-light)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(167,139,250,0.3)',
                paddingBottom: '0.1rem',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    label: '01 · Actuarial Science',
    title: 'Probability, risk, and financial mathematics.',
    desc: 'I passed SOA Exams P and FM, competed in insurance analytics, and apply the same tools to quantitative finance — valuation models and strategy backtests.',
  },
  {
    label: '02 · Data Analysis',
    title: 'Messy real-world data, cleaned and explained.',
    desc: 'Python, R, and SQL on nonprofit funding records, web analytics at EcoServants, and productivity analytics for my own goals.',
  },
]

function About() {
  return (
    <section
      id="about"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <p
          className="reveal"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--violet-light)',
            marginBottom: '1.25rem',
          }}
        >
          About Me
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            lineHeight: 1.08,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text)',
            marginBottom: '1.75rem',
          }}
        >
          Finding structure in disorder.
        </h2>
        <p
          className="reveal reveal-delay-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            fontWeight: 300,
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            maxWidth: 720,
            marginBottom: '3rem',
          }}
        >
          Two threads run through my work. I like problems where the answer isn't obvious, and
          outside of school I compete in table tennis and lead teams — from a restaurant crew to
          a robotics club I founded in high school after nine rejections.
        </p>

        <div
          className="reveal reveal-delay-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          {PILLARS.map(p => (
            <div
              key={p.label}
              className="glow-border"
              style={{
                padding: '2rem',
                border: '1px solid var(--border)',
                borderRadius: 3,
                background: 'var(--surface)',
              }}
            >
              <p style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--pink-light)', marginBottom: '0.9rem' }}>
                {p.label}
              </p>
              <h3 className="font-display" style={{ fontSize: '1.55rem', fontStyle: 'italic', fontWeight: 400, color: 'var(--text)', lineHeight: 1.2, marginBottom: '0.9rem' }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.92rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="reveal reveal-delay-4"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem 2.5rem',
          }}
        >
          {[
            ['Location', 'Waterloo, Ontario, Canada'],
            ['Program', 'Honours Mathematics, Co-op'],
            ['Focus', 'Actuarial Science & Data Analysis'],
            ['Certifications', 'SOA Exam P · FM'],
          ].map(([label, value]) => (
            <div key={label}>
              <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.3rem' }}>
                {label}
              </p>
              <p style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--text)' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

const EXPERIENCE_TRACKS: ExperienceTrack[] = ['All', 'Data Analysis', 'Leadership']

function Experience() {
  const [filter, setFilter] = useState<ExperienceTrack>('All')
  const [hovered, setHovered] = useState<number | null>(null)
  const items = filter === 'All' ? EXPERIENCE : EXPERIENCE.filter(e => e.track === filter)

  return (
    <section
      id="experience"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p
          className="reveal"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--violet-light)',
            marginBottom: '1.25rem',
          }}
        >
          Experience
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text)',
            marginBottom: '2rem',
          }}
        >
          Where I've worked.
        </h2>

        <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {EXPERIENCE_TRACKS.map(track => (
            <button
              key={track}
              onClick={() => setFilter(track)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.4rem 1rem',
                borderRadius: 2,
                border: '1px solid',
                borderColor: filter === track ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.18)',
                background: filter === track ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: filter === track ? 'var(--violet-light)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {track}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Timeline vertical line */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 8,
              bottom: 8,
              width: 1,
              background: 'linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(219,39,119,0.3), transparent)',
            }}
          />

          {items.map((exp, i) => (
            <div
              key={exp.role}
              className="reveal visible"
              style={{ position: 'relative', marginBottom: i < items.length - 1 ? '3.5rem' : 0 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Timeline node */}
              <div
                style={{
                  position: 'absolute',
                  left: -36,
                  top: 6,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: hovered === i ? 'var(--violet-light)' : 'rgba(124,58,237,0.4)',
                  border: `1px solid ${hovered === i ? 'var(--violet-light)' : 'rgba(124,58,237,0.35)'}`,
                  boxShadow: hovered === i ? '0 0 16px rgba(124,58,237,0.6)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              />

              <div
                style={{
                  padding: '1.5rem 1.75rem',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: hovered === i ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.1)',
                  background: hovered === i ? 'rgba(124,58,237,0.06)' : 'transparent',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.15rem' }}>
                      {exp.role}
                    </h3>
                    {exp.award && (
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--pink-light)', marginBottom: '0.2rem' }}>
                        {exp.award}
                      </p>
                    )}
                    <p style={{ fontSize: '0.88rem', fontWeight: 400, color: 'var(--violet-light)' }}>
                      {exp.org}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-subtle)', whiteSpace: 'nowrap' }}>
                      {exp.dates}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--pink-light)', marginTop: '0.3rem' }}>
                      {exp.track}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '0.92rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75, margin: '0.85rem 0 1rem' }}>
                  {exp.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {exp.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectVisual({ category, large }: { category: Exclude<ProjectCategory, 'All'>; large?: boolean }) {
  return (
    <div
      style={{
        height: large ? 320 : 200,
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(219,39,119,0.14))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <span
        className="font-display"
        aria-hidden="true"
        style={{
          fontSize: large ? '9rem' : '6rem',
          fontStyle: 'italic',
          color: 'rgba(237,233,255,0.14)',
          lineHeight: 1,
        }}
      >
        {PROJECT_SYMBOL[category]}
      </span>
      <span
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(124,58,237,0.25)',
          border: '1px solid rgba(139,92,246,0.3)',
          color: 'var(--violet-light)',
          fontSize: '0.68rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '0.2rem 0.6rem',
          borderRadius: 2,
        }}
      >
        {category}
      </span>
    </div>
  )
}

function ProjectCard({
  project,
  large,
}: {
  project: typeof PROJECTS[number]
  large?: boolean
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const cx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const cy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    setTilt({ x: cy * -5, y: cx * 5 })
  }, [])

  return (
    <div
      ref={cardRef}
      className="tilt-card glow-border"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        border: '1px solid var(--border)',
        borderRadius: 4,
        overflow: 'hidden',
        background: 'rgba(9,6,32,0.6)',
        transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        cursor: 'default',
      }}
    >
      <ProjectVisual category={project.category} large={large} />
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: large ? '1.35rem' : '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>
          {project.title}
        </h3>
        <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '1rem' }}>
          {project.desc}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
          {project.tags.map(t => <span key={t} className="skill-tag">{t}</span>)}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {project.github && (
            <a
              href={project.github}
              style={{
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(237,233,255,0.15)',
                paddingBottom: '0.1rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              GitHub ↗
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              style={{
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--violet-light)',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(167,139,250,0.3)',
                paddingBottom: '0.1rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--pink-light)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--violet-light)')}
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function Projects() {

  return (
    <section
      id="projects"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Project & Reading
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3rem' }}>
          <h2
            className="font-display reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)' }}
          >
            Things I've built.
          </h2>
        </div>

        <div
          className="reveal reveal-delay-1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {PROJECTS.map(p => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Skills ──────────────────────────────────────────────────────────────────

function ConstellationViz({ category }: { category: string }) {
  const skills = SKILLS[category] || []
  const edges = CONSTELLATION_EDGES[category] || []
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <svg
      viewBox="0 0 420 140"
      style={{ width: '100%', maxWidth: 500, height: 140, display: 'block', margin: '0 auto 2.5rem' }}
      aria-hidden="true"
    >
      {/* Connection lines */}
      {edges.map(([a, b], i) => {
        const pa = skills[a], pb = skills[b]
        if (!pa || !pb) return null
        return (
          <line
            key={i}
            x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
            stroke="rgba(139,92,246,0.18)"
            strokeWidth={0.8}
          />
        )
      })}
      {/* Skill nodes */}
      {skills.map((s, i) => (
        <g
          key={s.name}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          style={{ cursor: 'default' }}
        >
          <circle
            cx={s.x} cy={s.y}
            r={hovered === i ? 5 : 3.5}
            fill={hovered === i ? 'var(--violet-light)' : 'rgba(139,92,246,0.55)'}
            style={{ transition: 'r 0.2s ease, fill 0.2s ease' }}
          />
          {hovered === i && (
            <circle
              cx={s.x} cy={s.y} r={9}
              fill="none"
              stroke="rgba(167,139,250,0.3)"
              strokeWidth={1}
            />
          )}
          <text
            x={s.x} y={s.y + 16}
            textAnchor="middle"
            fill={hovered === i ? 'var(--violet-light)' : 'var(--text-subtle)'}
            fontSize="8.5"
            fontFamily="var(--font-body)"
            fontWeight="500"
            style={{ transition: 'fill 0.2s ease' }}
          >
            {s.name}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Skills() {
  const [activeTab, setActiveTab] = useState<string>(SKILL_CATEGORIES[0])

  return (
    <section
      id="skills"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Skills
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)', marginBottom: '3rem' }}
        >
          What I work with.
        </h2>

        {/* Category tabs */}
        <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '0.45rem 1.1rem',
                borderRadius: 2,
                border: '1px solid',
                borderColor: activeTab === cat ? 'rgba(219,39,119,0.4)' : 'rgba(139,92,246,0.15)',
                background: activeTab === cat ? 'rgba(219,39,119,0.1)' : 'transparent',
                color: activeTab === cat ? 'var(--pink-light)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Constellation */}
        <div className="reveal reveal-delay-3">
          <ConstellationViz category={activeTab} />
        </div>

        {/* Accessible tag list */}
        <div
          className="reveal reveal-delay-4"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.6rem',
            padding: '1.5rem',
            borderRadius: 3,
            border: '1px solid var(--border)',
            background: 'rgba(124,58,237,0.04)',
          }}
        >
          {(SKILLS[activeTab] || []).map(s => (
            <span
              key={s.name}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                fontWeight: 400,
                color: 'var(--text-muted)',
                padding: '0.35rem 1rem',
                border: '1px solid rgba(139,92,246,0.2)',
                borderRadius: 2,
                background: 'rgba(124,58,237,0.07)',
                transition: 'color 0.2s ease, border-color 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'var(--text-muted)'
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.2)'
              }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Competitions ─────────────────────────────────────────────────────────────

function Competitions() {
  return (
    <section
      id="competitions"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Competitions
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)', marginBottom: '4rem' }}
        >
          Recognition.
        </h2>

        <div
          className="reveal glow-border"
          style={{
            padding: '2rem',
            border: '1px solid rgba(219,39,119,0.35)',
            borderRadius: 3,
            background: 'rgba(219,39,119,0.05)',
            position: 'relative',
            marginBottom: '5rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, var(--violet), var(--magenta))',
              borderRadius: '3px 3px 0 0',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--pink-light)' }}>
              {FEATURED_COMPETITION.result}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{FEATURED_COMPETITION.year}</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>
            {FEATURED_COMPETITION.name}
          </h3>
          <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75 }}>
            {FEATURED_COMPETITION.desc}
          </p>
        </div>

        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '2.5rem' }}>
          Case & Hackathon Competitions
        </p>

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'linear-gradient(to bottom, rgba(219,39,119,0.45), rgba(124,58,237,0.25), transparent)',
            }}
          />
          {CASE_COMPETITIONS.map((c, i) => (
            <div
              key={c.name}
              className="reveal"
              style={{ position: 'relative', marginBottom: i < CASE_COMPETITIONS.length - 1 ? '2.5rem' : 0, transitionDelay: `${i * 0.08}s` }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -37,
                  top: 8,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: `1.5px solid ${c.upcoming ? 'var(--magenta)' : 'rgba(124,58,237,0.4)'}`,
                  background: c.upcoming ? 'rgba(219,39,119,0.3)' : 'rgba(124,58,237,0.15)',
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{c.name}</h3>
                <span style={{ fontSize: '0.78rem', color: c.upcoming ? 'var(--pink-light)' : 'var(--text-subtle)', fontWeight: c.upcoming ? 600 : 400 }}>
                  {c.year}
                </span>
              </div>
              {c.result && (
                <p style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--violet-light)', marginBottom: c.desc ? '0.5rem' : 0 }}>
                  {c.result}
                </p>
              )}
              {c.desc && (
                <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                  {c.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Certifications ───────────────────────────────────────────────────────────

function Certifications() {
  return (
    <section
      id="certifications"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Certifications
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)', marginBottom: '4rem' }}
        >
          Exams passed.
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={cert.name}
              className="reveal glow-border"
              style={{
                padding: '2rem',
                border: '1px solid var(--border)',
                borderRadius: 3,
                background: 'var(--surface)',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--violet-light)',
                  }}
                >
                  {cert.status}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{cert.body}</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>
                {cert.name}
              </h3>
              <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                {cert.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Education ────────────────────────────────────────────────────────────────

function Education() {
  return (
    <section
      id="education"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Education
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)', marginBottom: '4rem' }}
        >
          Where I've studied.
        </h2>

        <div style={{ position: 'relative', paddingLeft: 32 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'linear-gradient(to bottom, rgba(219,39,119,0.45), rgba(124,58,237,0.25), transparent)',
            }}
          />
          {EDUCATION.map((edu, i) => (
            <div
              key={i}
              className="reveal"
              style={{ position: 'relative', marginBottom: i < EDUCATION.length - 1 ? '3.5rem' : 0, transitionDelay: `${i * 0.15}s` }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -37,
                  top: 8,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  border: `1.5px solid ${i === 0 ? 'var(--magenta)' : 'rgba(124,58,237,0.4)'}`,
                  background: i === 0 ? 'rgba(219,39,119,0.3)' : 'rgba(124,58,237,0.15)',
                }}
              />
              <div style={{ padding: '0 0 0 0.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{edu.school}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{edu.years}</span>
                </div>
                <p style={{ fontSize: '0.9rem', fontWeight: 500, color: i === 0 ? 'var(--pink-light)' : 'var(--violet-light)', marginBottom: '0.9rem' }}>
                  {edu.program}
                </p>
                {edu.awards && (
                  <p style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-muted)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    {edu.awards}
                  </p>
                )}
                {edu.coursework.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                      Coursework
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {edu.coursework.map(c => <span key={c} className="skill-tag">{c}</span>)}
                    </div>
                  </div>
                )}
                <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-subtle)' }}>
                  {edu.activities.join(' · ')}
                </p>
                {edu.sports.length > 0 && (
                  <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-subtle)', marginTop: '0.35rem' }}>
                    {edu.sports.join(' · ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Hobbies ──────────────────────────────────────────────────────────────────

function HobbyCard({ hobby }: { hobby: typeof HOBBIES[number] }) {
  return (
    <div
      className="hobby-img glow-border"
      style={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        aspectRatio: hobby.wide ? '16/9' : '3/4',
        border: '1px solid var(--border)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(219,39,119,0.12))',
      }}
    >
      <span
        className="font-display"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: hobby.wide ? '5rem' : '3.5rem',
          fontStyle: 'italic',
          color: 'rgba(237,233,255,0.12)',
          whiteSpace: 'nowrap',
        }}
      >
        {hobby.mark}
      </span>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(6,4,16,0.92) 0%, rgba(6,4,16,0.15) 55%, transparent)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: hobby.wide ? '1.5rem' : '1.25rem',
        }}
      >
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: hobby.wide ? 'var(--pink-light)' : 'var(--violet-light)', marginBottom: '0.4rem' }}>
          {hobby.name}
        </p>
        <p className="caption" style={{ fontSize: hobby.wide ? '0.88rem' : '0.82rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {hobby.caption}
        </p>
      </div>
    </div>
  )
}

function Hobbies() {
  const wide = HOBBIES.filter(h => h.wide)
  const narrow = HOBBIES.filter(h => !h.wide)

  return (
    <section
      id="hobbies"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Hobbies
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)', marginBottom: '3rem' }}
        >
          Life outside the screen.
        </h2>

        {/* Wide row */}
        <div
          className="reveal reveal-delay-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {wide.map(h => <HobbyCard key={h.name} hobby={h} />)}
        </div>

        {/* Narrow row */}
        <div
          className="reveal reveal-delay-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {narrow.map(h => <HobbyCard key={h.name} hobby={h} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      if (orbRef.current) {
        const rect = orbRef.current.parentElement!.getBoundingClientRect()
        const dx = (e.clientX - rect.left - rect.width / 2) * 0.06
        const dy = (e.clientY - rect.top - rect.height / 2) * 0.06
        orbRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const socials = [
    { label: 'Email', href: 'mailto:qigrace0@gmail.com', value: 'qigrace0@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/Grace704', value: '@Grace704' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/grace-qi-56a19831a/', value: '/in/grace-qi' },
  ]

  return (
    <section
      id="contact"
      style={{
        padding: 'clamp(100px, 14vw, 180px) clamp(1.5rem, 8vw, 8rem)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '2rem',
        borderTop: '1px solid rgba(139,92,246,0.1)',
      }}
    >
      <div
        ref={orbRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700,
          height: 400,
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.14) 0%, rgba(219,39,119,0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.5rem' }}>
          Contact
        </p>
        <h2
          className="font-display reveal reveal-delay-1"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1.05,
            color: 'var(--text)',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
          }}
        >
          Let's connect.
        </h2>
        <p
          className="reveal reveal-delay-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            fontWeight: 300,
            color: 'var(--text-muted)',
            lineHeight: 1.75,
            maxWidth: 480,
            margin: '0 auto 3.5rem',
          }}
        >
          Open to actuarial, data analysis, and quantitative finance opportunities — feel free to reach out.
        </p>

        <div
          className="reveal reveal-delay-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1.5rem',
            maxWidth: 640,
            margin: '0 auto 4rem',
          }}
        >
          {socials.map(s => (
            <a
              key={s.label}
              href={s.href}
              style={{
                display: 'block',
                padding: '1.25rem 1rem',
                border: '1px solid var(--border)',
                borderRadius: 3,
                background: 'var(--surface)',
                textDecoration: 'none',
                transition: 'border-color 0.3s ease, background 0.3s ease',
                textAlign: 'center',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
                e.currentTarget.style.background = 'rgba(124,58,237,0.09)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.35rem' }}>
                {s.label}
              </p>
              <p style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--violet-light)' }}>
                {s.value}
              </p>
            </a>
          ))}
        </div>

        <p className="reveal reveal-delay-4" style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-body)' }}>
          © 2026 Grace Qi. Built with care.
        </p>
      </div>
    </section>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const active = useActiveSection()
  useReveal()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', position: 'relative' }}>
      <ParticleCanvas />

      {/* Ambient background gradients */}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '45vw',
          height: '55vh',
          background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.07) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          left: 0,
          width: '35vw',
          height: '40vh',
          background: 'radial-gradient(ellipse at left, rgba(219,39,119,0.05) 0%, transparent 65%)',
        }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav active={active} />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Competitions />
        <Certifications />
        <Education />
        <Hobbies />
        <Contact />
      </div>
    </div>
  )
}
