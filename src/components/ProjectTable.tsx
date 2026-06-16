import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import Skeleton from './Skeleton'
import type { ProjectRow } from '../types'

interface ProjectTableProps {
  loading: boolean
  searchTerm: string
  onSearchTermChange: (value: string) => void
  sortConfig: { key: keyof ProjectRow; direction: 'asc' | 'desc' }
  onSort: (key: keyof ProjectRow) => void
  visibleRows: ProjectRow[]
  filteredRowCount: number
  hasProjectError: boolean
  onRetryProjects: () => void
  onResetSearch: () => void
}

export default function ProjectTable({
  loading,
  searchTerm,
  onSearchTermChange,
  sortConfig,
  onSort,
  visibleRows,
  filteredRowCount,
  hasProjectError,
  onRetryProjects,
  onResetSearch,
}: ProjectTableProps) {
  return (
    <section className="table-section">
      <div className="table-toolbar">
        <div>
          <h2>Project portfolio</h2>
          <p>Track delivery status, priority, due dates, and progress across SaaS initiatives.</p>
        </div>
        <input
          type="search"
          placeholder="Search projects"
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          disabled={loading}
        />
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th className="sortable" scope="col">
                <button type="button" onClick={() => onSort('name')}>
                  Project Name
                  <span className="sort-indicator">
                    {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                </button>
              </th>
              <th className="sortable" scope="col">
                <button type="button" onClick={() => onSort('status')}>
                  Status
                  <span className="sort-indicator">
                    {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                </button>
              </th>
              <th className="sortable" scope="col">
                <button type="button" onClick={() => onSort('priority')}>
                  Priority
                  <span className="sort-indicator">
                    {sortConfig.key === 'priority' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                </button>
              </th>
              <th className="sortable" scope="col">
                <button type="button" onClick={() => onSort('dueDate')}>
                  Due Date
                  <span className="sort-indicator">
                    {sortConfig.key === 'dueDate' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                </button>
              </th>
              <th className="sortable" scope="col">
                <button type="button" onClick={() => onSort('progress')}>
                  Progress
                  <span className="sort-indicator">
                    {sortConfig.key === 'progress' ? (sortConfig.direction === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                </button>
              </th>
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
                    <td>
                      <span className={`status-badge ${row.status.replace(' ', '-').toLowerCase()}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.priority}</td>
                    <td>{row.dueDate}</td>
                    <td>{row.progress}%</td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && hasProjectError ? (
          <ErrorState onRetry={onRetryProjects} />
        ) : !loading && filteredRowCount === 0 ? (
          <EmptyState
            title="No projects match"
            description="Try changing your search terms or removing filters to see more projects."
            actionLabel="Reset search"
            onAction={onResetSearch}
          />
        ) : null}
      </div>
    </section>
  )
}
