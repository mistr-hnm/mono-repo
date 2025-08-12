import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
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
import { useState } from "react"
import { useDeleteMutation } from "@/services/mutation/course"
import { useGetCourses } from "@/services/queries/course"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Route } from "@/routes/_home/courses"
import { useMemo } from 'react'
import { useNavigate } from "@tanstack/react-router"

export function CourseList() {

  const navigate = useNavigate();

  const { page, limit } = Route.useSearch();
  const [isLoading, setIsLoading] = useState(false)

  const pagination = useMemo<PaginationState>(() => ({
    pageIndex: page,
    pageSize: limit,
  }), [page, limit]);


  const setPagination = (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
    const newPagination = typeof updaterOrValue === 'function'
      ? updaterOrValue(pagination)
      : updaterOrValue;

    navigate({
      to: '/courses',
      search: {
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      },
      replace: true,
    });
  }

  const [searchTerm, setSearchTerm] = useState("");

  const {isPending , data : courseData} = useGetCourses(pagination,searchTerm);

  const deleteMutation = useDeleteMutation();

  const onDelete = async (raw: Course) => {
    deleteMutation.mutate({ id: raw._id }, {
      onSuccess: () => {
        toast.success("Course added.")
        setIsLoading(false);
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message?.message ?? 'Something went wrong'
        toast.error(msg)
        setIsLoading(false)
      }
    });
  }

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
              // onEdit(row.original);
              navigate({
                to: '/course/$id',
                params: { id: row.original._id }
              })
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

  const goToPage = (pageNumber: number) => {
    navigate({
      to: '/courses',
      search: {
        page: pageNumber,
        limit: pagination.pageSize,
      },
      replace: true,
    });
  }


  const changePageSize = (newPageSize: number) => {
    navigate({
      to: '/courses',
      search: {
        page: 1,
        limit: newPageSize,
      },
      replace: true,
    });
  }


  const table = useReactTable({
    data: courseData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: courseData?.pagination?.totalPages || 0,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
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


  const hasData = courseData?.data && courseData?.data?.length > 0;


  function debounce(func: any) {
    let timeoutId: any;

    return function (inputValue: any) {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        func(inputValue);
      }, 1000)
    }
  }

  // Create debounced version
  const debouncedSearch = debounce((value: any) => {
     setSearchTerm(value);
  })

  return (
    <div className="w-full">
      <div className="flex justify-end items-center my-2">
        <input
          type="text"
          placeholder="Search course..."
          className="border rounded p-2 w-1/5 mr-4"
          onChange={(e) => {
            debouncedSearch(e.target.value);
          }}
        />
        <Button variant="outline" onClick={() => {
          navigate({
            to: '/course/$id',
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
      {hasData
        ?

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
              disabled={!courseData?.pagination?.hasNext}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => goToPage(courseData?.pagination.totalPages || 1)}
              disabled={!courseData?.pagination?.hasNext}>
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {page} of{' '}
                {courseData?.pagination?.totalPages || 1}
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
              JSON.stringify(courseData?.pagination)
            } */}
          </div>
        </div>
        : null
      }
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