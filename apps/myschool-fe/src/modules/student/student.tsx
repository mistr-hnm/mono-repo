import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
  type ColumnDef
} from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import * as z from 'zod/v4'
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileUpload } from "@/components/ui/file-upload"
import { Calendar } from "@/components/ui/calendar"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useGetStudents } from "@/services/queries/student"
import { useGetCourses } from "@/services/queries/course"
import { useCreateMutation, useDeleteMutation, useUpdateMutation } from "@/services/mutation/student"
import type { FileUploadResponse } from "@/schema/file"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

export function Student() {

  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})


  const { data: studentData, isPending } = useGetStudents()
  const { data: courseData } = useGetCourses();

  const createMutation = useCreateMutation()
  const updateMutation = useUpdateMutation()
  const deleteMutation = useDeleteMutation()



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



  const columns: ColumnDef<Student>[] = [
    {
      id: "picture",
      enableHiding: true,
      cell: ({ row }) => {
        const picture: { _id: string, buffer: string } = row.original.picture as any;
        return <>
          <div className="flex justify-center">
            <Avatar>
              <AvatarImage src={`${picture.buffer}`} />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
        </>
      }
    },
    {
      accessorKey: "enrollmentNumber",
      header: "Enrollment Number",
      cell: ({ row }) => (
        <>
          <div className="capitalize text-center">{row.getValue("enrollmentNumber")}</div>
        </>
      ),
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center" >{row.getValue("fullname")}</div>
    },
    {
      accessorKey: "enrollmentCourse",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Course
          </Button>
        )
      },
      cell: ({ row }) => {
        const enrollmentCourse: any = row.getValue("enrollmentCourse")
        return <div className="text-center">{enrollmentCourse?.name}</div>
      }
    },
    {
      accessorKey: "dateofbirth",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DOB
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("dateofbirth"))
        const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`
        return <div className="text-center font-medium">{formattedDate}</div>
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">Added on</div>,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`
        return <div className="text-right font-medium">{formattedDate}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <div className="flex justify-end ">
            <Button variant="outline" disabled={deleteMutation.isPending} onClick={() => {
              onEdit(row.original);
            }}>
              Edit
            </Button>
            <Button variant="outline" className="mx-2" disabled={deleteMutation.isPending} onClick={() => {
              onDelete(row.original);
            }}>
              Delete
            </Button>
          </div>
        )
      },
    }
  ]

  const table = useReactTable({
    data: studentData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

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

      if (payLoad?._id) {
        const { _id, ...bodyToUpdate } = payLoad
        updateMutation.mutate({ id: _id, body: bodyToUpdate }, {
          onSuccess: () => {
            toast.success("Student updated.")
            setIsDialogOpen(false)
          },
          onError: (error: any) => {
            console.log("error", error);
            const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
            toast.error(msg)
          }
        })
      } else {
        createMutation.mutate(payLoad, {
          onSuccess: () => {
            toast.success("Student added.")
            setIsDialogOpen(false)
          },
          onError: (error: any) => {
            const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
            toast.error(msg)
          }
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsDialogOpen(false)
    }
  }

  const onEdit = async (student: Student) => {
    setIsDialogOpen(true)
    const { _id, enrollmentNumber, fullname, dateofbirth, enrollmentCourse, } = student
    form.setValue('enrollmentNumber', enrollmentNumber)
    form.setValue('fullname', fullname)
    form.setValue('_id', _id)
    form.setValue('dateofbirth', dateofbirth)
    form.setValue('enrollmentCourse', enrollmentCourse?._id)
    form.setValue('picture', student.picture?._id || "")
  }

  const onDelete = async (raw: Student) => {
    try {
      deleteMutation.mutate({ id: raw._id }, {
        onSuccess: () => {
          toast.success("Student deleted successfully.")
          setIsDialogOpen(false)
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
          toast.error(msg)
          setIsDialogOpen(false)
        }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsDialogOpen(false)
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


  const hasData = studentData && studentData.length > 0;
  
  return (
    <div className="w-full">
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex justify-end my-2">
          <AlertDialogTrigger asChild className="">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(true);
              form.reset();
            }
            }>
              Insert
            </Button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Student form</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Please fill out the form below to continue.
          </AlertDialogDescription>
          <div className="text-muted-foreground text-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="enrollmentNumber"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>DOB</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild className="w-full">
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-left shadow-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Calendar
                            mode="single"
                            onSelect={field.onChange}
                          />
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
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            courseData.map((course: any) => {
                              return <SelectItem key={course._id} value={course._id}>{course?.name}</SelectItem>
                            })
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Loading..." : "Submit"}
                  </Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {hasData ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {hasData
        ?
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div> : null}
    </div>
  )

}

export type Student = {
  _id: string
  enrollmentNumber: number
  fullname: string
  dateofbirth: Date
  enrollmentCourse: { _id: string, courseId: number, name: string }
  picture: { _id: string, url: string }
  description: string
  status?: string
  createdAt: Date
  updatedAt: Date
} 