type Props = {
  label: string
  value: string
  description?: string
}

export default function StatCard({ label, value, description }: Props) {
  return (
    <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow p-6">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
      {description ? (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      ) : null}
    </article>
  )
}
