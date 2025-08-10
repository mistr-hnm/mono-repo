import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useCreateMutation, useUpdateMutation } from '@/services/mutation/course';
import { useGetCourseById } from '@/services/queries/course';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod/v4'


export function CourseForm() {
    const { id } = useParams({ from: '/_home/course/$id' });

    const createMutation = useCreateMutation();
    const updateMutation = useUpdateMutation();

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const formSchema = z.object({
        _id: z.string().optional(),
        courseId: z.number().min(1, "Please enter course id"),
        name: z.string().min(1, "Please enter name"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: standardSchemaResolver(formSchema),
        defaultValues: {
            courseId: 0,
            name: '',
        }
    })

    let courseData: any = { courseId: 0, name: '', _id: undefined };
    let isPending = false;

    if (id !== "new") {
        const queryResult = useGetCourseById(id);
        isPending = queryResult.isPending;
        courseData = queryResult.data || courseData;

        console.log("courseData",courseData);

        form.setValue('name', courseData?.data?.name);
        form.setValue('courseId', courseData?.data?.courseId);
        form.setValue('_id', courseData?.data?._id);
    }



    const onSubmit = async () => {
        const result = formSchema.safeParse({ ...form.getValues() });

        if (!result.success) {
            toast.error("validation failed")
            return
        }

        const payLoad = result.data;
        setIsLoading(true)
        if (payLoad?._id) {
            const body = { courseId: payLoad.courseId, name: payLoad.name };
            updateMutation.mutate({ id: payLoad._id, body: body }, {
                onSuccess: () => {
                    toast.success("Course updated.")
                    setIsLoading(false);
                    navigate({
                        to : '/courses',
                        search : { page : 1, limit : 10 }
                    })
                },
                onError: (error: any) => {
                    console.log("error", error);
                    const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
                    toast.error(msg)
                    setIsLoading(false)
                }
            });
        } else {
            createMutation.mutate(payLoad, {
                onSuccess: () => {
                    toast.success("Course added.")
                    setIsLoading(false);
                    navigate({
                        to : '/courses',
                        search : { page : 1, limit : 10 }
                    })
                },
                onError: (error: any) => {
                    const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
                    toast.error(msg)
                    setIsLoading(false)
                }
            });
        }
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center h-48">
                <p className="font-semibold">
                    Loading
                </p>
                <div className="px-2">
                    <Skeleton className="h-[10px] w-[50px] rounded-full" />
                </div>
            </div>
        );
    }


    return <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardHeader>
                        <CardDescription>Enter course details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="courseId"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Course Id</FormLabel>
                                    <FormControl>
                                        <Input

                                            placeholder="Course Id"
                                            type="number"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")} // Convert to number
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name"  {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <div className='flex justify-end'>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Submit"}
                            </Button>
                            <Button type="button" className='mx-2' disabled={isLoading} onClick={()=>{
                                navigate({
                                    to : '/courses',
                                    search : { page : 1, limit : 10 }
                                })
                            }}>
                                Cancel
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    </div>
}