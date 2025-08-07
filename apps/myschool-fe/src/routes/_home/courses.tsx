import { CourseList } from '@/modules/courses/CourseList'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/courses')({
  component: CourseList,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      page: Number(search.page ?? 1),
      limit: Number(search.limit ?? 10)
    }
  }
})
