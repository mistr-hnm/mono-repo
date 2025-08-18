import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client' 
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import './index.css'
 
import { routeTree } from './routeTree.gen'
import { Toaster } from 'sonner'


const router = createRouter({ routeTree }) // @todo : add more options
const queryClient = new QueryClient()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return <RouterProvider router={router} />
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
       <QueryClientProvider client={queryClient}>
          <App/>
          <Toaster />
      </QueryClientProvider>
    </StrictMode>
  )
}

