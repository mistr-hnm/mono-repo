import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_home')({
  component: Home,
  beforeLoad: () => {
    const data = localStorage.getItem("auth");
    if (!data) {
      throw redirect({
        to: "/login"
      })
    }
  }
})

function Home() {
  return (<div>
    <div className='flex justify-between'>
      <div className="p-2 flex gap-2">
        <Link to="/"  className="[&.active]:font-bold">
          Home
        </Link>{' '}
        <Link to="/about"  className="[&.active]:font-bold">
          About
        </Link>{' '}
        <Link to="/courses"  className="[&.active]:font-bold">
          Courses
        </Link>{' '}
        <Link to="/students"  className="[&.active]:font-bold">
          Student
        </Link>
      </div>
      <div className="p-2  gap-2"  >
        <Link to="/" onClick={()=>{ localStorage.clear()}} >
          Logout
        </Link>
      </div>
    </div>
    <hr />

    <Outlet />
  </div>)
}
