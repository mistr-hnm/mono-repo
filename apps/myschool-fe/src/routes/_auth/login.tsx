import { Login } from '@/modules/auth/login'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/login')({
  component: Login,
})