import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Phone, Mail, MapPin, Download, ExternalLink,
  Shield, Network, Server, Terminal, Monitor, Zap,
  ChevronDown, ArrowUpRight, Circle
} from 'lucide-react'
import './index.css'

gsap.registerPlugin(ScrollTrigger)

function LinkedInIcon({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect x="2" y="9" width="4" height="12"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

/* ─── DATA ─────────────────────────────────────────── */
const SKILLS = [
  { name: 'Mikrotik MTCNA',         level: 70, icon: Network,  color: '#1A6B45' },
  { name: 'Fortinet NSE 1, 2, 3',   level: 60, icon: Shield,   color: '#F4522A' },
  { name: 'Routage BGP / OSPF / MPLS', level: 60, icon: Network, color: '#5C2A7F' },
  { name: 'VPN IPSec / WireGuard',  level: 60, icon: Shield,   color: '#1A6B45' },
  { name: 'Admin Win / Linux',      level: 70, icon: Server,   color: '#F4522A' },
  { name: 'GLPI · Zabbix · Ansible',level: 60, icon: Monitor,  color: '#5C2A7F' },
]

const EXPERIENCES = [
  {
    role: 'IT Support',
    company: 'BAKER TILLY Côte d\'Ivoire',
    location: 'Abidjan-Marcory',
    period: 'Janv. 2025 → Aujourd\'hui',
    accent: '#F4522A',
    bg: '#FFF0EC',
    bullets: [
      'Déploiement et administration de GLPI pour la gestion des incidents et du parc.',
      'Supervision temps réel du parc informatique avec Zabbix.',
      'Implémentation d\'une architecture Zero Trust Security.',
      'Automatisation des tâches d\'administration réseau avec Ansible.',
      'Référent IA : formation des collaborateurs et accompagnement des services métiers.',
      'Support Microsoft 365 : Teams, Outlook, SharePoint.',
    ],
  },
  {
    role: 'Technicien Réseau & Système',
    company: 'Prestataire indépendant',
    location: 'Abidjan',
    period: 'Nov. 2023 → Déc. 2024',
    accent: '#1A6B45',
    bg: '#E8F5EE',
    bullets: [
      'Installation et configuration d\'équipements réseau et points d\'accès.',
      'Dépannage réseau et connexion aux serveurs Active Directory.',
      'Configuration et déploiement de postes utilisateurs.',
    ],
  },
  {
    role: 'Technicien Réseau & Système',
    company: 'Sud\'Prestige',
    location: 'Abidjan-Yopougon',
    period: 'Août 2020 → Nov. 2023',
    accent: '#5C2A7F',
    bg: '#F2EBF8',
    bullets: [
      'Implémentation et administration d\'un serveur Active Directory 2016.',
      'Configuration des GPOs et gestion des comptes utilisateurs.',
      'Gestion et contrôle du système d\'information.',
      'Responsable des achats et du parc matériel informatique.',
    ],
  },
]

const FORMATIONS = [
  { title: 'Formation FortiGate', subtitle: 'Cursus Fortinet NSE 4 — Certifié NSE 1, 2, 3', period: 'Mars 2026 → Juil. 2026', badge: 'En cours', badgeColor: '#F4522A' },
  { title: 'Formation Mikrotik MTCNA', subtitle: 'Attestation de fin de formation obtenue', period: 'Févr. 2025 → Mai 2025', badge: 'Obtenu', badgeColor: '#1A6B45' },
  { title: 'Stage — Administration Réseaux & Systèmes', subtitle: 'Okassa Technology, Côte d\'Ivoire', period: 'Sept. 2019 → Août 2020', badge: null },
  { title: 'BTS Réseau Info. & Télécommunication', subtitle: 'Diplôme obtenu', period: 'Août 2019', badge: 'Diplôme', badgeColor: '#5C2A7F' },
  { title: 'Baccalauréat — Série D', subtitle: null, period: 'Juillet 2010', badge: null },
]

const SOFT_SKILLS = [
  'Rigoureux & méthodique', 'Orienté objectifs',
  'Sens de l\'analyse', 'Travail sous pression', 'Esprit d\'équipe & pédagogue',
]

const NAV_LINKS = [
  { label: 'Profil', href: '#about' },
  { label: 'Expérience', href: '#experience' },
  { label: 'Compétences', href: '#skills' },
  { label: 'Formation', href: '#formation' },
  { label: 'Contact', href: '#contact' },
]

const SOFT_COLORS = ['#E8F5EE', '#FFF0EC', '#F2EBF8', '#E8F5EE', '#FFF0EC']
const SOFT_TEXT   = ['#1A6B45', '#F4522A', '#5C2A7F', '#1A6B45', '#F4522A']

/* ─── NAVBAR ───────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`fixed top-0 z-50 transition-all duration-300 nav-pill px-6 py-3 ${
      scrolled ? 'shadow-md' : 'shadow-sm'
    }`} style={{ left: '10%', right: '10%' }}>
      <div className="flex items-center justify-between gap-8">
        <span className="font-fira text-forest text-sm tracking-widest hidden md:block font-medium">EKJ</span>
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href}
                className="font-sora text-ink/50 hover:text-ink text-sm transition-all duration-200 hover:-translate-y-px inline-block font-medium">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/photo.jpg" download className="btn-coral text-sm py-2 px-5 hidden md:inline-flex">
          <Download size={13} /> CV
        </a>
        <button className="md:hidden text-ink p-2" onClick={() => setMenuOpen(v => !v)}>
          <div className="w-5 space-y-1">
            <span className={`block h-0.5 bg-ink transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-ink transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-ink transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 bg-white rounded-3xl px-6 py-5 border border-border shadow-sm">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="text-ink/60 hover:text-forest font-sora text-sm font-medium transition-colors">{l.label}</a>
          ))}
          <a href="/photo.jpg" download className="btn-coral text-sm py-2 px-4 self-start">
            <Download size={13} /> CV
          </a>
        </div>
      )}
    </nav>
  )
}

/* ─── HERO ──────────────────────────────────────────── */
function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-label',  { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' })
      gsap.from('.hero-name',   { opacity: 0, y: 70, duration: 1.1, ease: 'power3.out', delay: 0.15 })
      gsap.from('.hero-title',  { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: 0.35 })
      gsap.from('.hero-desc',   { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out', delay: 0.5 })
      gsap.from('.hero-stats .stat-item', { opacity: 0, y: 20, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.65 })
      gsap.from('.hero-cta',    { opacity: 0, y: 20, stagger: 0.1, duration: 0.7, ease: 'power3.out', delay: 0.85 })
      gsap.from('.hero-photo',  { opacity: 0, scale: 0.85, duration: 1.1, ease: 'power3.out', delay: 0.25 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={heroRef} id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
      style={{ background: 'linear-gradient(160deg, #FEFEFE 60%, #E8F5EE 100%)' }}>

      {/* Orbs */}
      <div className="orb w-96 h-96" style={{ background: '#1A6B45', top: '-80px', right: '-60px' }} />
      <div className="orb w-64 h-64" style={{ background: '#F4522A', bottom: '60px', left: '-40px' }} />
      <div className="orb w-48 h-48" style={{ background: '#5C2A7F', top: '50%', left: '40%' }} />

      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center pt-24 pb-16">

        {/* Left */}
        <div className="flex flex-col gap-5">
          <span className="hero-label section-label">Administrateur Réseaux & Systèmes</span>

          <h1 className="hero-name font-sora font-extrabold leading-[0.92] tracking-tight text-ink"
            style={{ fontSize: 'clamp(3.2rem, 7.5vw, 7rem)' }}>
            EZAN<br />
            <span className="text-coral">KOUASSAN</span><br />
            JACOB
          </h1>

          <p className="hero-title font-instrument italic text-forest text-xl md:text-2xl leading-snug">
            Infrastructure · Sécurité · Automatisation
          </p>

          <div className="divider-forest" />

          <p className="hero-desc font-sora text-ink-dim text-base leading-relaxed max-w-md">
            Technicien spécialisé avec plus de <span className="text-ink font-semibold">4 ans d'expérience</span>.
            Mikrotik, Fortinet, Zero Trust, Ansible — et référent IA chez Baker Tilly CI.
          </p>

          {/* Stats */}
          <div className="hero-stats flex gap-8 flex-wrap">
            {[
              { value: '4+', label: 'Ans d\'exp.', color: '#1A6B45' },
              { value: 'NSE 3', label: 'Fortinet',   color: '#F4522A' },
              { value: 'MTCNA', label: 'Mikrotik',   color: '#5C2A7F' },
            ].map(s => (
              <div key={s.label} className="stat-item flex flex-col">
                <span className="font-fira text-2xl font-medium" style={{ color: s.color }}>{s.value}</span>
                <span className="font-sora text-ink-dim text-xs tracking-wider uppercase mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="hero-cta flex gap-4 flex-wrap">
            <a href="#contact"    className="btn-coral"><Mail size={15} /> Me contacter</a>
            <a href="#experience" className="btn-outline">Mon parcours <ArrowUpRight size={15} /></a>
          </div>
        </div>

        {/* Right — Photo */}
        <div className="hero-photo flex justify-center md:justify-end">
          <div className="relative float-anim">
            {/* Déco frame */}
            <div className="absolute -top-4 -left-4 w-full h-full rounded-[2.5rem]"
              style={{ border: '2px dashed rgba(26,107,69,0.25)', borderRadius: '2.5rem' }} />
            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-[2.5rem]"
              style={{ border: '2px solid rgba(244,82,42,0.2)', borderRadius: '2.5rem' }} />

            <div className="relative w-64 h-72 md:w-80 md:h-[26rem] rounded-[2.5rem] overflow-hidden"
              style={{ border: '3px solid rgba(26,107,69,0.3)', boxShadow: '0 20px 60px rgba(26,107,69,0.15)' }}>
              <img src="/photo.jpg" alt="Ezan Kouassan Jacob"
                className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(26,107,69,0.15) 0%, transparent 50%)' }} />
            </div>

            {/* Badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 nav-pill px-4 py-2 flex items-center gap-2 whitespace-nowrap">
              <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: '#1A6B45' }} />
              <span className="font-fira text-xs text-forest font-medium">Disponible immédiatement</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink/25 hover:text-forest transition-colors">
        <ChevronDown size={15} className="animate-bounce" />
      </a>
    </section>
  )
}

/* ─── ABOUT ─────────────────────────────────────────── */
function About() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-left',  { scrollTrigger: { trigger: ref.current, start: 'top 78%' }, opacity: 0, x: -40, duration: 0.9, ease: 'power3.out' })
      gsap.from('.about-right', { scrollTrigger: { trigger: ref.current, start: 'top 78%' }, opacity: 0, x:  40, duration: 0.9, ease: 'power3.out', delay: 0.15 })
      gsap.from('.soft-chip',   { scrollTrigger: { trigger: ref.current, start: 'top 68%' }, opacity: 0, scale: 0.85, stagger: 0.08, duration: 0.5, ease: 'power3.out' })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={ref} className="py-28 px-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-start">

        {/* Left */}
        <div className="about-left">
          <span className="section-label">Qui suis-je ?</span>
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-ink mt-4 mb-6 leading-tight">
            Ingénieur de<br />
            <span className="font-instrument italic text-coral">l'infrastructure.</span>
          </h2>
          <div className="divider-forest mb-7" />

          <p className="font-sora text-ink-dim text-base leading-relaxed mb-4">
            Technicien spécialisé en infrastructures réseaux et systèmes informatiques avec plus de
            <span className="text-ink font-semibold"> 4 ans d'expérience</span>, j'interviens sur l'administration
            des infrastructures, la gestion des incidents et la sécurité des systèmes.
          </p>
          <p className="font-sora text-ink-dim text-base leading-relaxed mb-4">
            Expérience concrète sur les équipements <span className="text-ink font-semibold">Mikrotik</span> et
            <span className="text-ink font-semibold"> Fortinet</span>, la supervision de parcs et la gestion d'actifs.
          </p>
          <p className="font-sora text-ink-dim text-base leading-relaxed">
            Actuellement en déploiement de solutions de supervision
            <span className="text-forest font-semibold"> (Zabbix)</span>, d'automatisation
            <span className="text-forest font-semibold"> (Ansible)</span> et de sécurité
            <span className="text-coral font-semibold"> Zero Trust</span>.
          </p>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[
              { icon: MapPin,    label: 'Localisation', value: 'Abidjan / Yopougon', color: '#F4522A' },
              { icon: Circle,   label: 'Nationalité',  value: 'Ivoirien',            color: '#1A6B45' },
              { icon: Zap,      label: 'Disponibilité',value: 'Immédiate',           color: '#F4522A' },
              { icon: Terminal, label: 'Permis de conduire', value: 'A B C D E',      color: '#5C2A7F' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={14} className="mt-1 flex-shrink-0" style={{ color }} />
                <div>
                  <p className="font-fira text-xs text-ink-dim/60 mb-0.5 uppercase tracking-wider">{label}</p>
                  <p className="font-sora text-sm text-ink font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="about-right">
          <span className="section-label">Soft skills</span>
          <div className="flex flex-wrap gap-3 mt-4 mb-10">
            {SOFT_SKILLS.map((s, i) => (
              <span key={s} className="soft-chip font-sora text-sm px-4 py-2 rounded-2xl font-medium transition-transform hover:scale-105"
                style={{ background: SOFT_COLORS[i], color: SOFT_TEXT[i] }}>
                {s}
              </span>
            ))}
          </div>

          <span className="section-label">Centres d'intérêt</span>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { emoji: '🔭', label: 'Veille techno',  sub: 'Réseau · Cybersécurité · IA', bg: '#E8F5EE', accent: '#1A6B45' },
              { emoji: '✈️', label: 'Voyage',          sub: 'Découverte du monde',          bg: '#FFF0EC', accent: '#F4522A' },
              { emoji: '📚', label: 'Lecture',         sub: 'Tech & développement',         bg: '#F2EBF8', accent: '#5C2A7F' },
              { emoji: '🎵', label: 'Musique',         sub: 'Passion sonore',               bg: '#E8F5EE', accent: '#1A6B45' },
            ].map(({ emoji, label, sub, bg, accent }) => (
              <div key={label} className="card-natural rounded-2xl p-4 cursor-default"
                style={{ background: bg, borderColor: `${accent}22` }}>
                <span className="text-2xl">{emoji}</span>
                <p className="font-sora text-sm font-semibold mt-2" style={{ color: accent }}>{label}</p>
                <p className="font-fira text-xs text-ink-dim/70 mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── EXPERIENCE ─────────────────────────────────────── */
function Experience() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exp-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
        opacity: 0, y: 50, stagger: 0.15, duration: 0.85, ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={ref} className="py-28 px-6" style={{ background: '#F8F5F1' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">Parcours professionnel</span>
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-ink mt-4 leading-tight">
            Expériences<br />
            <span className="font-instrument italic text-forest">professionnelles</span>
          </h2>
        </div>

        {/* Desktop timeline */}
        <div className="relative hidden md:block">
          <div className="timeline-line" />
          <div className="flex flex-col gap-16">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className={`exp-card flex items-start gap-8 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="flex-1">
                  <div className="card-natural rounded-[2rem] p-8 bg-white">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
                      <div>
                        <h3 className="font-sora font-bold text-xl text-ink">{exp.role}</h3>
                        <p className="font-sora font-semibold mt-1" style={{ color: exp.accent }}>{exp.company}</p>
                        <p className="font-fira text-xs text-ink-dim/50 mt-1">{exp.location}</p>
                      </div>
                      <span className="font-fira text-xs px-3 py-1.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: exp.bg, color: exp.accent }}>
                        {exp.period}
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: exp.accent }} />
                          <span className="font-sora text-sm text-ink-dim leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center" style={{ width: '20px' }}>
                  <div className="w-4 h-4 rounded-full mt-8 ring-2 ring-offset-2 ring-offset-surface"
                    style={{ background: exp.accent, '--tw-ring-color': exp.accent }} />
                </div>
                <div className="flex-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-5">
          {EXPERIENCES.map((exp, i) => (
            <div key={i} className="exp-card card-natural rounded-[2rem] p-6 bg-white">
              <span className="font-fira text-xs px-3 py-1 rounded-full inline-block mb-3 font-medium"
                style={{ background: exp.bg, color: exp.accent }}>{exp.period}</span>
              <h3 className="font-sora font-bold text-lg text-ink">{exp.role}</h3>
              <p className="font-sora font-semibold text-sm mb-4 mt-1" style={{ color: exp.accent }}>
                {exp.company} — {exp.location}
              </p>
              <ul className="space-y-2">
                {exp.bullets.map((b, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: exp.accent }} />
                    <span className="font-sora text-xs text-ink-dim leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── SKILLS ─────────────────────────────────────────── */
function Skills() {
  const ref    = useRef(null)
  const barsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-item', {
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
        opacity: 0, x: -30, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      })
      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        gsap.fromTo(bar, { scaleX: 0 }, {
          scaleX: SKILLS[i].level / 100,
          duration: 1.2, ease: 'power2.inOut', delay: i * 0.1,
          scrollTrigger: { trigger: ref.current, start: 'top 72%' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={ref} className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">Expertise technique</span>
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-ink mt-4 leading-tight">
            Compétences<br />
            <span className="font-instrument italic text-aubergine">techniques</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {SKILLS.map((skill, i) => {
            const Icon = skill.icon
            return (
              <div key={skill.name} className="skill-item card-natural rounded-[2rem] p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${skill.color}18` }}>
                      <Icon size={16} style={{ color: skill.color }} />
                    </div>
                    <span className="font-sora text-sm font-semibold text-ink">{skill.name}</span>
                  </div>
                  <span className="font-fira text-xs font-medium" style={{ color: skill.color }}>
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full h-0.5 rounded-full overflow-hidden bg-border">
                  <div ref={el => barsRef.current[i] = el}
                    className="skill-bar-fill"
                    style={{ width: '100%', transform: 'scaleX(0)' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── FORMATION ──────────────────────────────────────── */
function Formation() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.forma-card', {
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
        opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="formation" ref={ref} className="py-28 px-6" style={{ background: '#F8F5F1' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-label">Parcours académique</span>
          <h2 className="font-sora font-bold text-4xl md:text-5xl text-ink mt-4 leading-tight">
            Formation &<br />
            <span className="font-instrument italic text-coral">certifications</span>
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {FORMATIONS.map((f, i) => (
            <div key={i}
              className="forma-card card-natural rounded-[1.5rem] p-6 flex items-start justify-between gap-4 flex-wrap bg-white">
              <div className="flex items-start gap-4">
                <div className="mt-2 w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: f.badgeColor || '#DFD8CF' }} />
                <div>
                  <h3 className="font-sora font-semibold text-base text-ink">{f.title}</h3>
                  {f.subtitle && <p className="font-sora text-sm text-ink-dim mt-1">{f.subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {f.badge && (
                  <span className="font-fira text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      background: `${f.badgeColor}18`,
                      color: f.badgeColor,
                      border: `1px solid ${f.badgeColor}33`,
                    }}>
                    {f.badge}
                  </span>
                )}
                <span className="font-fira text-xs text-ink-dim/50">{f.period}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-headline', {
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
      })
      gsap.from('.contact-link', {
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
        opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'power3.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const links = [
    { icon: Phone,       label: '+225 07 79 74 54 01',    href: 'tel:+2250779745401',            color: '#1A6B45', bg: '#E8F5EE' },
    { icon: Mail,        label: 'kouassanjacob@gmail.com', href: 'mailto:kouassanjacob@gmail.com', color: '#F4522A', bg: '#FFF0EC' },
    { icon: MapPin,      label: 'Abidjan / Yopougon',      href: '#',                              color: '#5C2A7F', bg: '#F2EBF8' },
    { icon: LinkedInIcon,label: 'linkedin.com/in/jekrey',  href: 'https://linkedin.com/in/jekrey', color: '#1A6B45', bg: '#E8F5EE' },
  ]

  return (
    <section id="contact" ref={ref} className="py-32 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FEFEFE 0%, #E8F5EE 100%)' }}>

      <div className="orb w-64 h-64" style={{ background: '#1A6B45', top: '-40px', right: '10%' }} />
      <div className="orb w-48 h-48" style={{ background: '#F4522A', bottom: '0',   left:  '5%' }} />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span className="section-label">Restons en contact</span>
        <h2 className="contact-headline font-sora font-extrabold text-ink mt-6 mb-4 leading-tight"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}>
          Travaillons<br />
          <span className="font-instrument italic text-forest">ensemble.</span>
        </h2>
        <p className="font-sora text-ink-dim text-base mb-12 max-w-md mx-auto">
          Disponible immédiatement pour toute opportunité en administration réseaux, systèmes ou sécurité.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {links.map(({ icon: Icon, label, href, color, bg }) => (
            <a key={label} href={href}
              target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
              className="contact-link card-natural rounded-2xl p-5 flex items-center gap-4 text-left bg-white">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="font-sora text-sm text-ink-dim hover:text-ink transition-colors font-medium">{label}</span>
            </a>
          ))}
        </div>

        <a href="mailto:kouassanjacob@gmail.com" className="btn-coral text-base px-8 py-4">
          <Mail size={16} /> Envoyer un message
        </a>

        {/* Référence */}
        <div className="mt-16 rounded-2xl p-6 text-left card-natural bg-white">
          <span className="section-label">Référence professionnelle</span>
          <div className="flex items-start gap-4 mt-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E8F5EE' }}>
              <ExternalLink size={14} className="text-forest" />
            </div>
            <div>
              <p className="font-sora font-bold text-ink">M. NGUESSAN Moïse</p>
              <p className="font-sora text-ink-dim text-sm mt-0.5">Chef Service Informatique — YZAS BAKERTILLY CI</p>
              <a href="mailto:nkmoise@bakertilly.ci"
                className="font-fira text-xs text-forest hover:text-forest-deep transition-colors mt-1 inline-block">
                nkmoise@bakertilly.ci
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER ─────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-8 px-6 text-center" style={{ borderTop: '1px solid #DFD8CF', background: '#F8F5F1' }}>
      <div className="flex items-center justify-center gap-3">
        <span className="pulse-dot w-2 h-2 rounded-full inline-block" style={{ background: '#1A6B45' }} />
        <span className="font-fira text-xs text-ink-dim/50">En ligne · Disponible</span>
        <span className="font-fira text-xs text-ink-dim/30">·</span>
        <span className="font-fira text-xs text-ink-dim/30">Ezan Kouassan Jacob © 2026</span>
      </div>
    </footer>
  )
}

/* ─── APP ────────────────────────────────────────────── */
export default function App() {
  return (
    <div style={{ background: '#FEFEFE', color: '#0F0F0F', fontFamily: 'Sora, sans-serif', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Formation />
      <Contact />
      <Footer />
    </div>
  )
}
