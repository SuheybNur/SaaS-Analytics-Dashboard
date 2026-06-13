import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Skeleton from './components/Skeleton'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './auth/useAuth'

type DashboardStat = {
  label: string
  value: string
  description: string
}

type ProjectRow = {
  name: string
  category: string
  owner: string
  status: 'Active' | 'Completed' | 'At risk'
  progress: number
}

type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'saas-dashboard-theme'

const statCards: DashboardStat[] = [
  { label: 'Metric A', value: '00', description: 'Placeholder description' },
  { label: 'Metric B', value: '00', description: 'Placeholder description' },
  { label: 'Metric C', value: '00', description: 'Placeholder description' },
  { label: 'Metric D', value: '00', description: 'Placeholder description' },
]

const projectRows: ProjectRow[] = [
  { name: 'Item 1', category: 'Type A', owner: 'User A', status: 'Active', progress: 0 },
  { name: 'Item 2', category: 'Type B', owner: 'User B', status: 'At risk', progress: 0 },
  { name: 'Item 3', category: 'Type C', owner: 'User C', status: 'Completed', progress: 0 },
  { name: 'Item 4', category: 'Type D', owner: 'User D', status: 'Active', progress: 0 },
  { name: 'Item 5', category: 'Type E', owner: 'User E', status: 'Active', progress: 0 },
  { name: 'Item 6', category: 'Type F', owner: 'User F', status: 'Completed', progress: 0 },
  { name: 'Item 7', category: 'Type G', owner: 'User G', status: 'At risk', progress: 0 },
  { name: 'Item 8', category: 'Type H', owner: 'User H', status: 'Active', progress: 0 },
  { name: 'Item 9', category: 'Type I', owner: 'User I', status: 'Completed', progress: 0 },
  { name: 'Item 10', category: 'Type J', owner: 'User J', status: 'Active', progress: 0 },
]

function App() {
  const { isAuthenticated, login, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activePage] = useState(1)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return projectRows
    return projectRows.filter((row) =>
      [row.name, row.category, row.owner, row.status]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm])

  const visibleRows = filteredProjects.slice((activePage - 1) * 10, activePage * 10)

  const handleLogin = () => {
    login()
    navigate('/', { replace: true })
  }

  const dashboard = (
    <div className="app-layout">
      <Sidebar />
      <main className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Analytics dashboard.</h1>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <button type="button" className="logout-button" onClick={() => logout()}>
              Logout
            </button>
          </div>
        </header>

        <section className="stat-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <article key={index} className="stat-card">
                  <Skeleton height="1.5rem" width="35%" className="skeleton-heading" />
                  <Skeleton height="3rem" width="60%" className="skeleton-value" />
                  <Skeleton height="1rem" width="85%" className="skeleton-text" />
                </article>
              ))
            : statCards.map((stat) => (
                <article key={stat.label} className="stat-card">
                  <p className="stat-label">{stat.label}</p>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-note">{stat.description}</p>
                </article>
              ))}
        </section>

        <section className="chart-section">
          <div className="chart-card">
            <div className="chart-card-header">
              <p>Placeholder chart</p>
              <span>Placeholder</span>
            </div>
            {loading ? (
              <Skeleton variant="rect" className="chart-skeleton" />
            ) : (
              <div className="chart-placeholder">
                <div className="chart-point">A</div>
                <div className="chart-point active">B</div>
                <div className="chart-point">C</div>
                <div className="chart-point active">D</div>
              </div>
            )}
          </div>

          <div className="chart-card">
            <div className="chart-card-header">
              <p>Placeholder chart</p>
              <span>Placeholder</span>
            </div>
            {loading ? (
              <Skeleton variant="rect" className="chart-skeleton" />
            ) : (
              <div className="chart-bars">
                <div>
                  <span>Type A</span>
                  <div className="bar ui" />
                </div>
                <div>
                  <span>Type B</span>
                  <div className="bar backend" />
                </div>
                <div>
                  <span>Type C</span>
                  <div className="bar ops" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="table-section">
          <div className="table-toolbar">
            <div>
              <h2>Placeholder table</h2>
              <p>Placeholder details.</p>
            </div>
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Owner</th>
                  <th>State</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className="table-row-skeleton">
                        <td>
                          <Skeleton height="1rem" width="70%" />
                        </td>
                        <td>
                          <Skeleton height="1rem" width="50%" />
                        </td>
                        <td>
                          <Skeleton height="1rem" width="60%" />
                        </td>
                        <td>
                          <Skeleton height="1rem" width="55%" />
                        </td>
                        <td>
                          <Skeleton height="1rem" width="80%" />
                        </td>
                      </tr>
                    ))
                  : visibleRows.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.category}</td>
                        <td>{row.owner}</td>
                        <td>
                          <span className={`status-badge ${row.status.replace(' ', '-').toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>{row.progress}%</td>
                      </tr>
                    ))}
              </tbody>
            </table>

            {!loading && filteredProjects.length === 0 && (
              <div className="empty-state">No matches.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login onSuccess={handleLogin} />
          )
        }
      />
      <Route path="/" element={<ProtectedRoute>{dashboard}</ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
