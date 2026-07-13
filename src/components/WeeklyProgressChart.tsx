import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const weeklyProgressData = [
  { day: 'Mon', tasks: 10 },
  { day: 'Tue', tasks: 18 },
  { day: 'Wed', tasks: 12 },
  { day: 'Thu', tasks: 20 },
  { day: 'Fri', tasks: 24 },
  { day: 'Sat', tasks: 15 },
  { day: 'Sun', tasks: 8 },
]

const axisTickStyle = {
  fill: 'var(--text)',
  fontSize: 12,
}

export default function WeeklyProgressChart() {
  return (
    <section className="chart-card">
      <div className="mb-5 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
          Weekly progress
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
          Tasks completed
        </h2>
        <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Track completed tasks across the work week with a responsive line chart and hover tooltip.
        </p>
      </div>

      <div className="h-[240px] w-full sm:h-[280px] lg:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyProgressData} margin={{ top: 16, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.24)" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={axisTickStyle}
              tickMargin={12}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={axisTickStyle}
              tickMargin={12}
              width={38}
            />
            <Tooltip
              formatter={(value) => [`${value ?? 0} tasks`, 'Completed']}
              cursor={{ stroke: '#c7d2fe', strokeWidth: 2, strokeDasharray: '5 5' }}
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
            <Line
              type="monotone"
              dataKey="tasks"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: '#ffffff', stroke: '#6366f1', strokeWidth: 3 }}
              activeDot={{ r: 7, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
