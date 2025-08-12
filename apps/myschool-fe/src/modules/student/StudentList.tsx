import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  getPaginationRowModel,
  type PaginationState
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useMemo, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGetStudents } from "@/services/queries/student"
import { useDeleteMutation } from "@/services/mutation/student"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "@tanstack/react-router"
import { Route } from "@/routes/_home/students"

export function StudentList() {

  const navigate = useNavigate();

  const { page, limit } = Route.useSearch();

  const pagination = useMemo<PaginationState>(() => ({
    pageIndex: page,
    pageSize: limit,
  }), [page, limit]);

  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: studentData, isPending } = useGetStudents(searchTerm,pagination)

  const setPagination = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
    const newPagination = typeof updaterOrValue === 'function'
      ? updaterOrValue(pagination)
      : updaterOrValue;

    navigate({
      to: '/students',
      search: {
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      },
      replace: true,
    });
  }

  const deleteMutation = useDeleteMutation()

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
              navigate({
                to: '/student/$id',
                params: { id: row.original._id }
              })
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
      }
    }
  ]

  const goToPage = (pageNumber: number) => {
    navigate({
      to: '/students',
      search: {
        page: pageNumber,
        limit: pagination.pageSize,
      },
      replace: true,
    });
  }


  const changePageSize = (newPageSize: number) => {
    navigate({
      to: '/students',
      search: {
        page: 1,
        limit: newPageSize,
      },
      replace: true,
    });
  }


  const table = useReactTable({
    data: studentData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: studentData?.pagination?.totalPages || 0,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
  })


  const onDelete = async (raw: Student) => {
    try {
      deleteMutation.mutate({ id: raw._id }, {
        onSuccess: () => {
          toast.success("Student deleted successfully.")
        },
        onError: (error: any) => {
          const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
          toast.error(msg)
        }
      })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
    }
  }

  function debounce(func: any) {
    let timeoutId: any;

    return function (inputValue: any) {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        func(inputValue);
      }, 1000)
    }
  }

  const debouncedSearch = debounce((value: any) => {
     setSearchTerm(value);   
  })


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


  const hasData = studentData?.data && studentData?.data?.length > 0;

  return (
    <div className="w-full">

    <div className="flex justify-end items-center my-2">
        <input
          type="text"
          placeholder="Search student..."
          className="border rounded p-2 w-1/5 mr-4"
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
        />
        <Button variant="outline" onClick={() => {
          navigate({
            to: '/student/$id',
            params: { id: 'new' }
          });
        }}>
          New
        </Button>
      </div>

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

      {hasData ?
        <div className="flex justify-end py-2" >
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => goToPage(1)}
              disabled={page == 1}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(page - 1)}
              disabled={page == 1}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(page + 1)}
              disabled={!studentData?.pagination?.hasNext}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(studentData?.pagination.totalPages || 1)}
              disabled={!studentData?.pagination?.hasNext}>
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {page} of{' '}
                {studentData?.pagination?.totalPages || 1}
              </strong>
            </span>
            <select
              value={limit}
              onChange={e => {
                changePageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            {/* {
              JSON.stringify(studentData?.pagination)
            } */}
          </div>
        </div>
        : null
      }

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