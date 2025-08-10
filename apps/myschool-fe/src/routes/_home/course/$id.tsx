import { CourseForm } from '@/modules/courses/CourseForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/course/$id')({
  component: CourseForm,
  beforeLoad : () => ({
    id : ''
  })
})
 