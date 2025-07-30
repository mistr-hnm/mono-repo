import { Student } from '@/modules/student/student'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/students')({
  component: Student,
})
