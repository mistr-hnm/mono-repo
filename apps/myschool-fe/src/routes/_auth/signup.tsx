import { Signup } from '@/modules/auth/signup'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/signup')({
  component: Signup,
})