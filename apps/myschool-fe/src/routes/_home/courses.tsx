import { Courses } from '@/modules/courses/course'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/courses')({
  component: Courses,
})
