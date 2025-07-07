import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { loginUserBodySchema } from "@myschool/schema/api/auth";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function Login() {

  const navigate = useNavigate();

  const onSubmit = () => {
    console.log("onSubmit");
    localStorage.setItem("auth", "userid");
    navigate({ to: '/' });
  }

  const loginForm = useForm<any>({
    resolver: zodResolver(loginUserBodySchema),
    defaultValues : {
      email    : "",
      password : "",
    }
  });


  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login to your Passman account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Password"
                        type="password"
                        {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  className="w-18"
                // disabled={mutateLoginUser.isPending}
                >
                  {/* {mutateLoginUser.isPending ? <LoadingSpinner /> : "Login"} */}
                  Login
                </Button>
                <Link to="/" className="text-blue-600">
                  Forgot password
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link to="/" className="text-blue-600">
            Create a new account
          </Link>
        </CardFooter>
      </Card>
    </div>
  );

}
