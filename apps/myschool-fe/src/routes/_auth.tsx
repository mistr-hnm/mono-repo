import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: Auth,
})

function Auth() {
  return <Outlet/>
}
