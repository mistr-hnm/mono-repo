import './App.css'
import { ThemeProvider } from './contexts/theme-provider'
// import Login from './modules/auth/Login'
// import { DataTableDemo } from './modules/courses/course'
import { StudentTable } from './modules/student/student'

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* <DataTableDemo />  */}
        <StudentTable /> 
        {/* <Login /> */}
      </ThemeProvider>
    </>
  )
}

export default App
