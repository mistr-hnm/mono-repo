import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Link, useNavigate } from "@tanstack/react-router";
import { userBodySchema } from "@myschool/schema/api/user";
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
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSignupUser } from "@/services/mutation/user";

export function Signup() {

  const navigate = useNavigate();

  const useSignupUserMutation = useSignupUser();
  const onSubmit = () => { 
    const user = {...signUpForm.getValues()}
    useSignupUserMutation.mutate(user,{
      onError : (error) => {
        console.log("error",error);   //@todo : add toast
      },
      onSuccess : async (response, variables) => {
        console.log("response",response);
        console.log("variables",variables);
        navigate({to : "/login"});     //@todo : add toast
      }
    })
    return;
  }

  const signUpForm = useForm<any>({
    resolver: standardSchemaResolver(userBodySchema),
    defaultValues : {
      name     : "",
      email    : "",
      password : "",
    }
  });


  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-20" >
                 {useSignupUserMutation.isPending ? <LoadingSpinner /> : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Link to="/login" className="text-blue-600" replace={true}>
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );

}
