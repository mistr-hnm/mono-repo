import { StudentList } from '@/modules/student/StudentList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/students')({
  component: StudentList,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page ?? 1),
      limit: Number(search.limit ?? 10)
    }
  }
})
