import { useEffect, useRef, useState, useCallback, MouseEvent } from 'react'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'competitions', label: 'Competitions' },
  { id: 'education', label: 'Education' },
  { id: 'hobbies', label: 'Hobbies' },
]

const ROLES = ['Designer', 'Developer', 'Creator', 'Problem Solver', 'Builder']

const EXPERIENCE = [
  {
    role: 'Software Engineering Intern',
    org: 'TechCorp AI',
    dates: 'May – Aug 2025',
    desc: 'Built full-stack features for an AI-powered analytics platform. Led migration from REST to GraphQL, reducing client payload size by 40%.',
    tags: ['React', 'TypeScript', 'GraphQL', 'Python', 'AWS'],
  },
  {
    role: 'UI/UX Design Lead',
    org: 'University Product Studio',
    dates: 'Sep 2024 – Apr 2025',
    desc: 'Directed design for a cross-disciplinary student product team. Delivered high-fidelity prototypes adopted by two campus organizations.',
    tags: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
  },
  {
    role: 'Web Development Mentor',
    org: 'Girls Who Code Club',
    dates: 'Jan – Dec 2024',
    desc: 'Mentored 15 students in HTML, CSS, JavaScript, and React fundamentals through weekly workshops and project-based curriculum.',
    tags: ['JavaScript', 'React', 'Teaching', 'CSS'],
  },
  {
    role: 'Research Assistant',
    org: 'HCI Lab, MIT CSAIL',
    dates: 'Jun – Aug 2023',
    desc: 'Assisted research on adaptive interfaces and accessibility. Implemented prototypes evaluated in controlled user studies.',
    tags: ['Human-Computer Interaction', 'Python', 'User Studies', 'Figma'],
  },
]

type ProjectCategory = 'All' | 'Web' | 'Data' | 'AI' | 'Design' | 'Other'

const PROJECTS: {
  title: string
  desc: string
  tags: string[]
  category: ProjectCategory
  featured: boolean
  image: string
  github?: string
  demo?: string
}[] = [
  {
    title: 'Aurora',
    desc: 'An AI-powered mood board generator that translates written descriptions into cohesive visual palettes and image collections using multimodal LLMs.',
    tags: ['Next.js', 'OpenAI API', 'Tailwind CSS', 'Postgres'],
    category: 'AI',
    featured: true,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=600&fit=crop&auto=format',
    github: '#',
    demo: '#',
  },
  {
    title: 'DataViz Pro',
    desc: 'Interactive data visualization dashboard with real-time streaming, custom chart library, and natural language query support.',
    tags: ['React', 'D3.js', 'WebSockets', 'FastAPI'],
    category: 'Data',
    featured: false,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&h=480&fit=crop&auto=format',
    github: '#',
  },
  {
    title: 'Bloom',
    desc: 'Plant care companion app with personalized watering schedules, growth tracking, and disease diagnosis via computer vision.',
    tags: ['React Native', 'TensorFlow', 'SQLite', 'Expo'],
    category: 'AI',
    featured: false,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&h=480&fit=crop&auto=format',
    github: '#',
    demo: '#',
  },
  {
    title: 'Cipher',
    desc: 'Elegant browser extension for end-to-end encrypted note-taking with zero-knowledge architecture.',
    tags: ['TypeScript', 'WebCrypto API', 'Svelte'],
    category: 'Web',
    featured: false,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=480&fit=crop&auto=format',
    github: '#',
  },
  {
    title: 'Typeface Study',
    desc: 'A typographic research project exploring variable font aesthetics across international scripts. Published as an interactive digital essay.',
    tags: ['CSS', 'Variable Fonts', 'Design Research'],
    category: 'Design',
    featured: false,
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=700&h=480&fit=crop&auto=format',
    demo: '#',
  },
]

const SKILL_CATEGORIES = ['Languages', 'Frameworks', 'Tools', 'Design', 'Data / AI'] as const

const SKILLS: Record<string, { name: string; x: number; y: number }[]> = {
  Languages: [
    { name: 'Python', x: 80, y: 55 },
    { name: 'TypeScript', x: 160, y: 30 },
    { name: 'JavaScript', x: 240, y: 60 },
    { name: 'Java', x: 130, y: 100 },
    { name: 'Swift', x: 210, y: 110 },
    { name: 'SQL', x: 310, y: 40 },
  ],
  Frameworks: [
    { name: 'React', x: 90, y: 50 },
    { name: 'Next.js', x: 180, y: 25 },
    { name: 'Tailwind CSS', x: 270, y: 60 },
    { name: 'FastAPI', x: 150, y: 105 },
    { name: 'Three.js', x: 330, y: 45 },
    { name: 'React Native', x: 220, y: 115 },
  ],
  Tools: [
    { name: 'Git', x: 75, y: 50 },
    { name: 'Figma', x: 165, y: 28 },
    { name: 'Docker', x: 255, y: 55 },
    { name: 'VS Code', x: 140, y: 105 },
    { name: 'Notion', x: 320, y: 40 },
    { name: 'Vercel', x: 215, y: 110 },
  ],
  Design: [
    { name: 'UI/UX Design', x: 95, y: 55 },
    { name: 'Branding', x: 195, y: 28 },
    { name: 'Figma', x: 290, y: 65 },
    { name: 'Motion Design', x: 155, y: 108 },
    { name: 'Illustration', x: 335, y: 38 },
  ],
  'Data / AI': [
    { name: 'TensorFlow', x: 80, y: 52 },
    { name: 'scikit-learn', x: 185, y: 28 },
    { name: 'Pandas', x: 275, y: 60 },
    { name: 'OpenAI API', x: 150, y: 108 },
    { name: 'PyTorch', x: 320, y: 42 },
    { name: 'HuggingFace', x: 225, y: 115 },
  ],
}

const CONSTELLATION_EDGES: Record<string, [number, number][]> = {
  Languages: [[0,1],[1,2],[0,3],[2,4],[1,5],[3,4]],
  Frameworks: [[0,1],[1,2],[0,3],[2,4],[1,5],[3,5]],
  Tools: [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4]],
  Design: [[0,1],[1,2],[0,3],[1,4],[2,3]],
  'Data / AI': [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4]],
}

const COMPETITIONS = [
  {
    name: 'HackMIT',
    year: '2025',
    result: '1st Place',
    desc: 'Built Aurora in 24 hours. Judged on technical complexity, design, and real-world impact. Awarded best overall project out of 280 submissions.',
    accent: true,
  },
  {
    name: 'Google Solution Challenge',
    year: '2024',
    result: 'Global Top 100 Finalist',
    desc: 'Designed and presented Bloom — a plant care AI app addressing sustainable urban farming — to Google engineers and executives.',
    accent: false,
  },
  {
    name: 'Regional Robotics Championship',
    year: '2024',
    result: 'Team Champion',
    desc: 'Led software and sensor fusion for an autonomous navigation robot. First regional win for our university team in four years.',
    accent: false,
  },
  {
    name: 'ICPC North America Regional',
    year: '2023',
    result: '12th Place',
    desc: 'Competitive programming contest; team solved 8 of 11 algorithmic problems in five hours.',
    accent: false,
  },
]

const EDUCATION = [
  {
    school: 'Massachusetts Institute of Technology',
    program: 'B.S. Computer Science & Engineering',
    years: '2022 – 2026',
    coursework: ['Algorithms', 'Machine Learning', 'Computer Vision', 'Distributed Systems', 'HCI', 'Computational Biology'],
    activities: ['HackMIT Organizer', 'Society of Women Engineers', 'MIT Technology Review'],
    awards: 'Presidential Scholar, Dean\'s List 2022–2025',
  },
  {
    school: 'Westview High School',
    program: 'High School Diploma',
    years: '2018 – 2022',
    coursework: ['AP Computer Science A', 'AP Calculus BC', 'AP Physics C', 'AP Art & Design'],
    activities: ['Robotics Club Captain', 'Debate Team', 'Yearbook Editor'],
    awards: 'Valedictorian, National Merit Scholar',
  },
]

const HOBBIES = [
  {
    name: 'Photography',
    caption: 'Capturing quiet moments and urban geometry.',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600&h=700&fit=crop&auto=format',
    wide: false,
  },
  {
    name: 'Travel',
    caption: 'Thirty-two countries and counting.',
    image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&h=600&fit=crop&auto=format',
    wide: true,
  },
  {
    name: 'Music',
    caption: 'Piano since age six. Currently into ambient and jazz fusion.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=500&fit=crop&auto=format',
    wide: false,
  },
  {
    name: 'Illustration',
    caption: 'Character design and editorial illustration in my sketchbooks.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=500&fit=crop&auto=format',
    wide: false,
  },
  {
    name: 'Cooking',
    caption: 'Cooking is just chemistry you can eat.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&h=600&fit=crop&auto=format',
    wide: true,
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
  const blurred = Math.random() < 0.28
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.25,
    vy: Math.random() * 0.35 + 0.08,
    size: blurred ? Math.random() * 5 + 3 : Math.random() * 1.4 + 0.4,
    opacity: blurred ? Math.random() * 0.1 + 0.03 : Math.random() * 0.45 + 0.08,
    hue: Math.random() * 80 + 255,
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
    const count = isMobile ? 40 : 75
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
          ctx.shadowBlur = p.size * 4
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
      <div className="hidden md:flex items-center gap-7">
        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
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
          Portfolio · 2026
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
          I build thoughtful digital experiences — from data pipelines to polished interfaces.
          Currently studying at MIT, always learning.
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
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10"
        style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
      >
        <div
          style={{
            width: 1,
            height: 48,
            background: 'linear-gradient(to bottom, var(--violet-light), transparent)',
            opacity: 0.5,
          }}
        />
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section
      id="about"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'start',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {/* Photo column */}
        <div className="reveal" style={{ position: 'relative' }}>
          <div
            style={{
              width: '100%',
              maxWidth: 400,
              aspectRatio: '3/4',
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(219,39,119,0.15))',
              border: '1px solid var(--border)',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=667&fit=crop&auto=format"
              alt="Portrait placeholder"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.7) brightness(0.7)' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(219,39,119,0.2))',
                mixBlendMode: 'multiply',
              }}
            />
          </div>

          {/* Decorative accent line */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: -16,
              width: 3,
              height: '60%',
              background: 'linear-gradient(to bottom, var(--violet), var(--magenta))',
              borderRadius: 2,
            }}
          />
        </div>

        {/* Text column */}
        <div>
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
              marginBottom: '2rem',
            }}
          >
            Building things that feel alive.
          </h2>
          <p
            className="reveal reveal-delay-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              fontWeight: 300,
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              marginBottom: '1.5rem',
            }}
          >
            I'm a computer science student at MIT with a deep interest in the intersection of design
            and engineering. I believe the best products are built when aesthetic intention and
            technical craft are inseparable.
          </p>
          <p
            className="reveal reveal-delay-3"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 300,
              color: 'var(--text-muted)',
              lineHeight: 1.8,
              marginBottom: '2.5rem',
            }}
          >
            Currently focused on AI interfaces and human-computer interaction research. When I'm not
            writing code or sketching wireframes, I'm traveling, playing piano, or hunting for the
            perfect photograph.
          </p>

          <div
            className="reveal reveal-delay-4"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem 2.5rem',
            }}
          >
            {[
              ['Location', 'Cambridge, MA'],
              ['Focus', 'AI & Design Systems'],
              ['Available', 'Summer 2026 Internships'],
              ['Languages', 'EN · ZH · FR'],
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
      </div>
    </section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  const [hovered, setHovered] = useState<number | null>(null)

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
            marginBottom: '4rem',
          }}
        >
          Where I've worked.
        </h2>

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

          {EXPERIENCE.map((exp, i) => (
            <div
              key={i}
              className="reveal"
              style={{ position: 'relative', marginBottom: i < EXPERIENCE.length - 1 ? '3.5rem' : 0, transitionDelay: `${i * 0.1}s` }}
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
                    <p style={{ fontSize: '0.88rem', fontWeight: 400, color: 'var(--violet-light)' }}>
                      {exp.org}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 400, color: 'var(--text-subtle)', whiteSpace: 'nowrap', paddingTop: 2 }}>
                    {exp.dates}
                  </span>
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

const CATEGORIES: ProjectCategory[] = ['All', 'Web', 'Data', 'AI', 'Design', 'Other']

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
      <div
        style={{
          height: large ? 320 : 200,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'saturate(0.65) brightness(0.7)',
            transition: 'transform 0.5s ease, filter 0.4s ease',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'
            ;(e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.5) brightness(0.55)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'
            ;(e.currentTarget as HTMLImageElement).style.filter = 'saturate(0.65) brightness(0.7)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(to top, rgba(9,6,32,0.95), transparent)',
          }}
        />
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
          {project.category}
        </span>
      </div>
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
  const [filter, setFilter] = useState<ProjectCategory>('All')
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  const featured = filtered.find(p => p.featured)
  const rest = filtered.filter(p => !p.featured)

  return (
    <section
      id="projects"
      style={{ padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p className="reveal" style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '1.25rem' }}>
          Projects
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3rem' }}>
          <h2
            className="font-display reveal reveal-delay-1"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 400, fontStyle: 'italic', color: 'var(--text)' }}
          >
            Things I've built.
          </h2>
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.4rem 1rem',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: filter === cat ? 'rgba(139,92,246,0.5)' : 'rgba(139,92,246,0.18)',
                  background: filter === cat ? 'rgba(124,58,237,0.15)' : 'transparent',
                  color: filter === cat ? 'var(--violet-light)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <div className="reveal" style={{ marginBottom: '1.5rem' }}>
            <ProjectCard project={featured} large />
          </div>
        )}

        <div
          className="reveal reveal-delay-1"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {rest.map(p => (
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {COMPETITIONS.map((comp, i) => (
            <div
              key={i}
              className="reveal glow-border"
              style={{
                padding: '2rem',
                border: '1px solid',
                borderColor: comp.accent ? 'rgba(219,39,119,0.35)' : 'var(--border)',
                borderRadius: 3,
                background: comp.accent ? 'rgba(219,39,119,0.05)' : 'var(--surface)',
                position: 'relative',
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              {comp.accent && (
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
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: comp.accent ? 'var(--pink-light)' : 'var(--violet-light)',
                  }}
                >
                  {comp.result}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>{comp.year}</span>
              </div>
              <h3 style={{ fontSize: comp.accent ? '1.2rem' : '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>
                {comp.name}
              </h3>
              <p style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.75 }}>
                {comp.desc}
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
                <div style={{ marginBottom: '0.75rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                    Coursework
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {edu.coursework.map(c => <span key={c} className="skill-tag">{c}</span>)}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', fontWeight: 300, color: 'var(--text-subtle)' }}>
                  {edu.activities.join(' · ')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Hobbies ──────────────────────────────────────────────────────────────────

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

        {/* Narrow row */}
        <div
          className="reveal reveal-delay-2"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {narrow.map(h => (
            <div
              key={h.name}
              className="hobby-img"
              style={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                aspectRatio: '3/4',
                border: '1px solid var(--border)',
              }}
            >
              <img src={h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6,4,16,0.9) 0%, rgba(6,4,16,0.2) 50%, transparent)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.25rem',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--violet-light)', marginBottom: '0.4rem' }}>
                  {h.name}
                </p>
                <p className="caption" style={{ fontSize: '0.82rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {h.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Wide row */}
        <div
          className="reveal reveal-delay-3"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          {wide.map(h => (
            <div
              key={h.name}
              className="hobby-img"
              style={{
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                aspectRatio: '16/9',
                border: '1px solid var(--border)',
              }}
            >
              <img src={h.image} alt={h.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(6,4,16,0.9) 0%, rgba(6,4,16,0.2) 50%, transparent)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '1.5rem',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pink-light)', marginBottom: '0.4rem' }}>
                  {h.name}
                </p>
                <p className="caption" style={{ fontSize: '0.88rem', fontWeight: 300, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {h.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const mouseRef = useRef({ x: 0, y: 0 })
  const orbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: globalThis.MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
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
    { label: 'Email', href: 'mailto:grace@example.com', value: 'grace@example.com' },
    { label: 'LinkedIn', href: '#', value: '/in/grace' },
    { label: 'GitHub', href: '#', value: '@gracecodes' },
    { label: 'Instagram', href: '#', value: '@grace.creates' },
  ]

  return (
    <section
      id="hobbies"
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
            marginBottom: '3.5rem',
            maxWidth: 480,
            margin: '0 auto 3.5rem',
          }}
        >
          Open to new opportunities, collaborations, and interesting conversations.
          Don't hesitate to reach out.
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
          © 2026 Grace. Designed & built with care.
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
        <Education />
        <Hobbies />
        <Contact />
      </div>
    </div>
  )
}
