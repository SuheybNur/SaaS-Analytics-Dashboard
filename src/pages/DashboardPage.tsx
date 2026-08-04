import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import Sidebar from '../components/Sidebar'
import Skeleton from '../components/Skeleton'
import StatCard from '../components/StatCard'

const TaskCategoryBarChart = lazy(() => import('../components/TaskCategoryBarChart'))
const WeeklyProgressChart = lazy(() => import('../components/WeeklyProgressChart'))

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
type SortKey = keyof ProjectRow
type SortDirection = 'asc' | 'desc'
type SortState = { key: SortKey; direction: SortDirection }

const THEME_KEY = 'saas-dashboard-theme'
const PAGE_SIZE = 10

const columns: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Item' },
  { key: 'category', label: 'Type' },
  { key: 'owner', label: 'Owner' },
  { key: 'status', label: 'State' },
  { key: 'progress', label: 'Rate' },
]

const kpiStats: DashboardStat[] = [
  { label: 'Total Projects', value: '24', description: 'Total projects in the workspace.' },
  { label: 'Active Tasks', value: '12', description: 'Tasks currently active across projects.' },
  { label: 'Team Members', value: '8', description: 'People contributing to projects.' },
  { label: 'Completion Rate', value: '76%', description: 'Overall task completion rate.' },
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
  { name: 'Data Migration', category: 'Engineering', owner: 'Liam Foster', status: 'Active', progress: 47 },
  { name: 'NPS Survey', category: 'Analytics', owner: 'Zoe Bennett', status: 'Completed', progress: 100 },
  { name: 'Billing Revamp', category: 'Finance', owner: 'Kai Nguyen', status: 'At risk', progress: 34 },
  { name: 'Docs Overhaul', category: 'Product', owner: 'Ruby Shah', status: 'Active', progress: 58 },
  { name: 'Partner Portal', category: 'Growth', owner: 'Leo Martins', status: 'Active', progress: 71 },
  { name: 'Incident Review', category: 'Operations', owner: 'Ivy Turner', status: 'Completed', progress: 100 },
  { name: 'Mobile Rollout', category: 'Engineering', owner: 'Jack Owens', status: 'At risk', progress: 45 },
  { name: 'Email Sequences', category: 'Marketing', owner: 'Mila Rossi', status: 'Active', progress: 66 },
  { name: 'Health Scoring', category: 'Customer Success', owner: 'Ezra Cole', status: 'Active', progress: 52 },
  { name: 'Quarterly Review', category: 'Finance', owner: 'Nora Diaz', status: 'Completed', progress: 100 },
  { name: 'Access Controls', category: 'Operations', owner: 'Finn Walsh', status: 'Active', progress: 63 },
  { name: 'Roadmap Planning', category: 'Product', owner: 'Aria Khan', status: 'At risk', progress: 40 },
]

function DashboardPage() {
  const { logout } = useAuth()
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sort, setSort] = useState<SortState | null>(null)
  const [activePage, setActivePage] = useState(1)
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

  const sortedProjects = useMemo(() => {
    if (!sort) return projectRows
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...projectRows].sort((a, b) => {
      const aValue = a[sort.key]
      const bValue = b[sort.key]
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * factor
      }
      return String(aValue).localeCompare(String(bValue)) * factor
    })
  }, [sort])

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return sortedProjects
    return sortedProjects.filter((row) => row.name.toLowerCase().includes(query))
  }, [searchTerm, sortedProjects])

  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE))
  const currentPage = Math.min(activePage, pageCount)
  const visibleRows = filteredProjects.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = filteredProjects.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredProjects.length)

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setActivePage(1)
  }

  const handleSort = (key: SortKey) => {
    setSort((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
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
            : kpiStats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} description={stat.description} />
              ))}
        </section>

        <section className="chart-section">
          {loading ? (
            <div className="chart-card">
              <Skeleton variant="rect" className="chart-skeleton" />
            </div>
          ) : (
            <Suspense fallback={<div className="chart-card"><Skeleton variant="rect" className="chart-skeleton" /></div>}>
              <WeeklyProgressChart />
            </Suspense>
          )}

          <div className="chart-card">
            <div className="chart-card-header">
              <p>Tasks by category</p>
              <span>Current work distribution</span>
            </div>
            {loading ? (
              <Skeleton variant="rect" className="chart-skeleton" />
            ) : (
              <Suspense fallback={<Skeleton variant="rect" className="chart-skeleton" />}>
                <TaskCategoryBarChart />
              </Suspense>
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
              placeholder="Search by project name"
              aria-label="Search projects by name"
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => {
                    const isSorted = sort?.key === column.key
                    return (
                      <th
                        key={column.key}
                        aria-sort={isSorted ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button
                          type="button"
                          className={`th-sort ${isSorted ? 'active' : ''}`}
                          onClick={() => handleSort(column.key)}
                          disabled={loading}
                        >
                          <span>{column.label}</span>
                          <span className="sort-indicator" aria-hidden="true">
                            {isSorted ? (sort?.direction === 'asc' ? '▲' : '▼') : '↕'}
                          </span>
                        </button>
                      </th>
                    )
                  })}
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
                onAction={() => handleSearchChange('')}
              />
            ) : null}
          </div>

          {!loading && !hasProjectError && filteredProjects.length > 0 && (
            <div className="table-pagination">
              <p className="pagination-label">
                Showing {rangeStart}-{rangeEnd} of {filteredProjects.length}
              </p>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => setActivePage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="pagination-page">
                  Page {currentPage} of {pageCount}
                </span>
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => setActivePage(Math.min(pageCount, currentPage + 1))}
                  disabled={currentPage >= pageCount}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default DashboardPage
