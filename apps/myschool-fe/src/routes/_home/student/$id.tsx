
import { StudentForm } from '@/modules/student/StudentForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_home/student/$id')({
  component: StudentForm,
  beforeLoad : () => ({
    id : ''
  })
})
 