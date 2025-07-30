import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
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
  return (
    <div>
      <div className='flex justify-between'>
        <div className="p-2 flex gap-2">
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/">
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/courses">
                    Courses
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link to="/students">
                    Student
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        </div>
        <div className="p-2  gap-2"  >
          <Link to="/" onClick={() => { localStorage.clear() }} >
            Logout
          </Link>
        </div>
      </div>
      <hr />
      <Outlet />



    </div>
  )
}
