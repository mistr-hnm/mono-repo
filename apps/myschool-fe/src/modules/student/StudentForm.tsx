import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { FileUpload } from '@/components/ui/file-upload';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import type { FileUploadResponse } from '@/schema/file';
import { useCreateMutation, useUpdateMutation } from '@/services/mutation/student';
import { useGetStudentById } from '@/services/queries/student';
import { useGetCourses } from '@/services/queries/course';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod/v4'

import { ChevronDownIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Calendar } from "@/components/ui/calendar"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function StudentForm() {
    const { id } = useParams({ from: '/_home/student/$id' });

    const createMutation = useCreateMutation()
    const updateMutation = useUpdateMutation()

    const { data: courseData } = useGetCourses({ pageIndex: 1, pageSize: 25 });

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [hasSetInitialValues, setHasSetInitialValues] = useState(false)

    const [open, setOpen] = useState(false)

    const today = new Date();
    const disabedDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())


    const formSchema = z.object({
        _id: z.string().optional(),
        enrollmentNumber: z.number().min(1, "Please enter number"),
        fullname: z.string().min(1, "Please enter name"),
        dateofbirth: z.date().refine((date) => date instanceof Date && !isNaN(date.getTime()), { message: "Please select a valid date of birth." }),
        enrollmentCourse: z.string().min(1, "Please select course"),
        picture: z.string(),
        description: z.string().optional()
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: standardSchemaResolver(formSchema),
        defaultValues: {
            enrollmentNumber: 0,
            fullname: "",
            dateofbirth: new Date(),
            enrollmentCourse: "",
            picture: "",
            description: "",
        }
    });

    let studentData: any = {
        enrollmentNumber: 0,
        fullname: "",
        dateofbirth: new Date(),
        enrollmentCourse: "",
        picture: "",
        description: "",
    };

    let isPending = false;

    if (id !== "new") {
        const queryResult = useGetStudentById(id);
        isPending = queryResult.isPending;
        studentData = queryResult.data || studentData;

        if(studentData?.data && !hasSetInitialValues){
            const { _id, enrollmentNumber, fullname, dateofbirth, enrollmentCourse, } = studentData?.data;
            
            form.setValue('enrollmentNumber', enrollmentNumber)
            form.setValue('fullname', fullname)
            form.setValue('_id', _id)
            form.setValue('dateofbirth', new Date(dateofbirth))
            form.setValue('enrollmentCourse', enrollmentCourse?._id)
            form.setValue('picture', studentData?.data?.picture || "")
            setHasSetInitialValues(true);
        }
    }

    const onFileUpload = (event: FileUploadResponse) => {
        if (event.status) {
            form.setValue('picture', event.data._id)
            toast.success("File uploaded successfully")
        }
    }


    const onSubmit = async () => {
        try {
            const model = { ...form.getValues() }
            model["dateofbirth"] = new Date(model.dateofbirth)
            const result = formSchema.safeParse({ ...model })
            if (!result.success) {
                toast.error("Validation failed.")
                return
            }

            const payLoad = result.data;
            setIsLoading(true);
            if (payLoad?._id) {
                const { _id, ...bodyToUpdate } = payLoad
                updateMutation.mutate({ id: _id, body: bodyToUpdate }, {
                    onSuccess: () => {
                        toast.success("Student updated.")
                        setIsLoading(false);
                        navigate({
                            to : '/students',
                            search : { page : 1, limit : 10 }
                        })
                    },
                    onError: (error: any) => {
                        console.log("error", error);
                        const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
                        toast.error(msg)
                        setIsLoading(false);
                    }
                })
            } else {
                createMutation.mutate(payLoad, {
                    onSuccess: () => {
                        toast.success("Student added.")
                        setIsLoading(false);
                        navigate({
                            to : '/students',
                            search : { page : 1, limit : 10 }
                        })
                    },
                    onError: (error: any) => {
                        const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
                        toast.error(msg)
                        setIsLoading(false);
                    }
                })
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
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
                            name="enrollmentNumber"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Enrollment number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enrollment number"
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
                            name="fullname"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Fullname</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name"  {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="picture"
                            render={() => (
                                <FormItem className='my-5'>
                                    <FormLabel>Picture</FormLabel>
                                    <FormControl>
                                        <FileUpload onSuccess={onFileUpload} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="dateofbirth"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Date of birth {} </FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                id="date"
                                                className="w-48 justify-between font-normal w-full">
                                                {form?.getValues('dateofbirth') ? form?.getValues('dateofbirth').toDateString() : "Select date"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                disabled={{ after: disabedDate }}
                                                captionLayout="dropdown"
                                                onSelect={(date) => {
                                                    if (date) {
                                                        field.onChange(new Date(date));
                                                        setOpen(false);
                                                    }
                                                }}/>
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        Your date of birth is used to calculate your age.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="enrollmentCourse"
                            render={({ field }) => (
                                <FormItem className='my-5'>
                                    <FormLabel>Course</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a course" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                courseData?.data?.map((course: any) => {
                                                    return <SelectItem key={course._id} value={course._id}>{course?.name}</SelectItem>
                                                })
                                            }
                                        </SelectContent>
                                    </Select>
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
                            <Button type="button" className='mx-2' disabled={isLoading} onClick={() => {
                                navigate({
                                    to: '/courses',
                                    search: { page: 1, limit: 10 }
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