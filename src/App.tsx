import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'
import Skeleton from './components/Skeleton'
import EmptyState from './components/EmptyState'
import ErrorState from './components/ErrorState'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'
import TaskCategoryBarChart from './components/TaskCategoryBarChart'
import WeeklyProgressChart from './components/WeeklyProgressChart'
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
  { label: 'Monthly Recurring Revenue', value: '$0', description: 'Revenue recognized this month from active subscriptions.' },
  { label: 'Net MRR Growth', value: '+0%', description: 'Month-over-month expansion and churn net change.' },
  { label: 'Customer Churn', value: '0.0%', description: 'Percent of customers lost over the past 30 days.' },
  { label: 'ARR Projection', value: '$0.0M', description: 'Annual revenue run rate based on current subscription bookings.' },
]

const projectRows: ProjectRow[] = [
  { name: 'Onboarding Launch', category: 'Customer Success', owner: 'Lena Patel', status: 'Active', progress: 68 },
  { name: 'Renewal Campaign', category: 'Growth', owner: 'Marcus Reed', status: 'At risk', progress: 42 },
  { name: 'Product Release', category: 'Engineering', owner: 'Nina Chen', status: 'Completed', progress: 100 },
  { name: 'Churn Analysis', category: 'Analytics', owner: 'Priya Singh', status: 'Active', progress: 55 },
  { name: 'Pricing Review', category: 'Finance', owner: 'Omar Diaz', status: 'Active', progress: 73 },
  { name: 'Support SLA Audit', category: 'Operations', owner: 'Mia Brooks', status: 'Completed', progress: 100 },
  { name: 'Feature Adoption', category: 'Product', owner: 'Ethan Cole', status: 'At risk', progress: 39 },
  { name: 'Campaign Tracking', category: 'Marketing', owner: 'Sara Kim', status: 'Active', progress: 82 },
  { name: 'Usage Review', category: 'Customer Success', owner: 'Noah Grant', status: 'Completed', progress: 100 },
  { name: 'Referral Boost', category: 'Growth', owner: 'Ava Moore', status: 'Active', progress: 61 },
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
  const [hasProjectError, setHasProjectError] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const handleRetryProjects = () => {
    setHasProjectError(false)
    setLoading(true)
    window.setTimeout(() => setLoading(false), 500)
  }

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
          {loading ? (
            <div className="chart-card">
              <Skeleton variant="rect" className="chart-skeleton" />
            </div>
          ) : (
            <WeeklyProgressChart />
          )}

          <div className="chart-card">
            <div className="chart-card-header">
              <p>Tasks by category</p>
              <span>Current work distribution</span>
            </div>
            {loading ? (
              <Skeleton variant="rect" className="chart-skeleton" />
            ) : (
              <TaskCategoryBarChart />
            )}
          </div>
        </section>

        <section className="table-section">
          <div className="table-toolbar">
            <div>
              <h2>Customer success roadmap</h2>
              <p>Track launches, renewals, and engagement campaigns across teams.</p>
            </div>
            <input
              type="search"
              placeholder="Search initiatives"
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

            {!loading && hasProjectError ? (
              <ErrorState onRetry={handleRetryProjects} />
            ) : !loading && filteredProjects.length === 0 ? (
              <EmptyState
                title="No projects match"
                description="Try changing your search terms or removing filters to see more projects."
                actionLabel="Reset search"
                onAction={() => setSearchTerm('')}
              />
            ) : null}
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
