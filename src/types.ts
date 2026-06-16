export type ProjectRow = {
  name: string
  status: 'Active' | 'Completed' | 'At risk' | 'Delayed'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  dueDate: string
  progress: number
}
