import { ThemeProvider } from '@/contexts/theme-provider'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className='m-10'>
                    <Outlet />
                </div>
            </ThemeProvider>
            <TanStackRouterDevtools />
        </>
    ),
})


