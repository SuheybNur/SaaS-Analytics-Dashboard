import { useState } from 'react'

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

  return (
    <>
      {/* Sidebar */}
      <div
        style={{
          position: isOpen ? 'fixed' : 'fixed',
          left: isOpen ? 0 : -256,
          top: 0,
          width: 256,
          height: '100vh',
          backgroundColor: '#ffffff',
          color: '#1e293b',
          transition: 'left 0.3s ease-in-out',
          zIndex: 40,
        }}
        className="lg:static lg:left-0"
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Logo */}
          <div
            style={{
              padding: '24px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: '#4f46e5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              SA
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>
                Logo Placeholder
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Dashboard
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setActiveItem(item.label)
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor:
                    activeItem === item.label ? '#4f46e5' : 'transparent',
                  color: activeItem === item.label ? '#ffffff' : '#64748b',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'background-color 0.2s',
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div
            style={{
              padding: '24px',
              borderTop: '1px solid #e2e8f0',
              fontSize: '12px',
              color: '#64748b',
            }}
          >
            © 2026 SaaS Dashboard
          </div>
        </div>
      </div>

      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '48px',
          height: '48px',
          backgroundColor: '#4f46e5',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: isOpen ? 'flex' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}
        className="lg:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 30,
          }}
          className="lg:hidden"
        />
      )}
    </>
  )
}
