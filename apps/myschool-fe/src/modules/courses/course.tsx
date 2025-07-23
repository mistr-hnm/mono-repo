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

import * as z from 'zod/v4'

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useCreateMutation, useDeleteMutation, useUpdateMutation } from "@/services/mutation/course"
import { useGetCourses } from "@/services/queries/course"
import { toast } from "sonner"


export function Courses() {

  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)


  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

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

  const { isError, isPending, data } = useGetCourses();
  const createMutation = useCreateMutation();
  const updateMutation = useUpdateMutation();
  const deleteMutation = useDeleteMutation();


  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "courseId",
      header: "Course Id",
      cell: ({ row }) => (
        <div className="capitalize text-center">{row.getValue("courseId")}</div>
      ),
    },
    {
      accessorKey: "name",
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
      cell: ({ row }) => <div className="text-center" >{row.getValue("name")}</div>
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
            <Button variant="outline" disabled={isLoading} onClick={() => {
              onEdit(row.original);
            }}>
              Edit
            </Button>
            <Button variant="outline" className="mx-2" disabled={isLoading} onClick={() => {
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
    data: data,
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
          setIsDialogOpen(false)
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
          setIsDialogOpen(false)
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
          toast.error(msg)
          setIsLoading(false)
        }
      });
    }
  }

  const onEdit = async (raw: Course) => {
    setIsDialogOpen(true);
    const { courseId, name, _id } = raw;
    form.setValue('name', name);
    form.setValue('courseId', courseId);
    form.setValue('_id', _id);
  }

  const onDelete = async (raw: Course) => {
    deleteMutation.mutate({ id: raw._id }, {
      onSuccess: () => {
        toast.success("Course added.")
        setIsLoading(false);
        setIsDialogOpen(false)
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
        toast.error(msg)
        setIsLoading(false)
        setIsDialogOpen(false)
      }
    })

  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-xl text-gray-600">Loading Course data...</p>
      </div>
    );
  }

 

  return (

    <div className="w-full">

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="flex justify-end my-2">
          <AlertDialogTrigger asChild className="">
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(true)
              form.reset();
            }
            }>
              New
            </Button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Course form</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Please fill out the form below to continue.
          </AlertDialogDescription>
          <div className="text-muted-foreground text-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Name"  {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Submit"}
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
            {table.getRowModel().rows?.length ? (
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
      </div>

    </div>
  )
}
type Course = {
  _id: string
  courseId: number
  name: string
  createdAt: Date
  updatedAt: Date
} 