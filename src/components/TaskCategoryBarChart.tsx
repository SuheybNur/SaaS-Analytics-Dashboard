import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const taskCategoryData = [
  { category: 'Design', tasks: 8, color: '#6366f1' },
  { category: 'Development', tasks: 15, color: '#7c3aed' },
  { category: 'Testing', tasks: 6, color: '#22c55e' },
  { category: 'Deployment', tasks: 4, color: '#f97316' },
]

const axisTickStyle = {
  fill: 'var(--text)',
  fontSize: 12,
}

export default function TaskCategoryBarChart() {
  return (
    <div className="grid gap-5">
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={taskCategoryData}
            margin={{ top: 20, right: 12, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" vertical={false} />
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={axisTickStyle}
              tickMargin={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={axisTickStyle}
              tickMargin={12}
              width={32}
            />
            <Tooltip
              formatter={(value) => [`${value ?? 0} tasks`, 'Tasks']}
              cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
              contentStyle={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                color: 'var(--text)',
                fontSize: 13,
                padding: '10px 12px',
              }}
              labelStyle={{ color: 'var(--text-muted)' }}
            />
            <Bar dataKey="tasks" radius={[12, 12, 0, 0]}>
              {taskCategoryData.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {taskCategoryData.map((entry) => (
          <div key={entry.category} className="flex items-center gap-2 text-sm text-slate-900 dark:text-slate-100">
            <span
              className="inline-block h-3 w-3 rounded-full shadow-inner"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.category}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
