import './App.css'
import { ThemeProvider } from './contexts/theme-provider'
import { Student } from './modules/student/student'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Student /> 
      </ThemeProvider>
    </>
  )
}

export default App
