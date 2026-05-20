import { useEffect, useRef, useState } from 'react'
import './Sidebar.css'

type NavItem = {
  label: string
  icon: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Projects', icon: '📁' },
  { label: 'Team', icon: '👥' },
  { label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('Dashboard')
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <aside
        id="sidebar"
        ref={panelRef}
        className={`sidebar ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen && window.innerWidth < 1024}
      >
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="brand-mark">SA</div>
            <div className="brand-text">
              <div className="brand-title">SaaS Analytics</div>
              <div className="brand-sub">Dashboard</div>
            </div>
          </div>

          <nav className="sidebar-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${activeItem === item.label ? 'active' : ''}`}
                onClick={() => {
                  setActiveItem(item.label)
                  setIsOpen(false)
                }}
                aria-current={activeItem === item.label ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden>
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">© 2026 SaaS Dashboard</div>
        </div>
      </aside>

      <button
        className="sidebar-toggle lg:hidden"
        aria-expanded={isOpen}
        aria-controls="sidebar"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((s) => !s)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && <div className="sidebar-backdrop lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
