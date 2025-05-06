"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { AddFieldDialog } from "./add-field-dialog"
import { EditFieldDialog } from "./edit-field-dialog"
import { DeleteFieldDialog } from "./delete-field-dialog"
import { API_BASE_URL } from "@/lib/constants"

export type Field = {
    _id: string
    title: string
    description: string
    category: string
    type: string
    createdAt: string
    updatedAt: string
    __v: number
}

const filterFields = (searchTerm: string, field: Field): boolean => {
    const searchLower = searchTerm.toLowerCase()
    return (
        field.title.toLowerCase().includes(searchLower) ||
        field.description.toLowerCase().includes(searchLower) ||
        field.category.toLowerCase().includes(searchLower)
    )
}

export function DataTable() {
    // Table state
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [globalFilter, setGlobalFilter] = React.useState("")

    // Dialog state
    const [editDialogOpen, setEditDialogOpen] = React.useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [selectedField, setSelectedField] = React.useState<Field | null>(null)

    // Data state
    const [data, setData] = React.useState<Field[]>([])
    const [loading, setLoading] = React.useState(true)

    const fetchFields = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/fields/get-fields`)
            if (!response.ok) throw new Error('Failed to fetch fields')
            const fields = await response.json()
            setData(fields)
        } catch (error) {
            console.error('Error fetching fields:', error)
            toast.error('Failed to fetch fields')
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchFields()
    }, [fetchFields])

    const handleEdit = React.useCallback((field: Field) => {
        setSelectedField(field)
        setEditDialogOpen(true)
    }, [])

    const handleDelete = React.useCallback((field: Field) => {
        setSelectedField(field)
        setDeleteDialogOpen(true)
    }, [])

    const handleSaveEdit = React.useCallback(async (updatedField: Field) => {
        try {
            const response = await fetch(`${API_BASE_URL}/fields/update-field/${updatedField._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedField),
            });

            if (!response.ok) {
                throw new Error('Failed to update field');
            }

            setData(prevData => prevData.map(field => 
                field._id === updatedField._id ? updatedField : field
            ));
            setEditDialogOpen(false);
            setSelectedField(null);
            toast.success('Field updated successfully');
        } catch (error) {
            console.error('Error updating field:', error);
            toast.error('Failed to update field');
        }
    }, []);

    const handleConfirmDelete = React.useCallback(async () => {
        if (selectedField) {
            try {
                const response = await fetch(`${API_BASE_URL}/fields/delete-field/${selectedField._id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete field');
                }

                setData(prevData => prevData.filter(field => field._id !== selectedField._id));
                setDeleteDialogOpen(false);
                setSelectedField(null);
                toast.success('Field deleted successfully');
            } catch (error) {
                console.error('Error deleting field:', error);
                toast.error('Failed to delete field');
            }
        }
    }, [selectedField]);

    const handleDialogClose = React.useCallback(() => {
        setEditDialogOpen(false)
        setDeleteDialogOpen(false)
        setSelectedField(null)
    }, [])

    const columns = React.useMemo<ColumnDef<Field>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "title",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <div>{row.getValue("title")}</div>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <div>{row.getValue("description")}</div>,
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => {
                const value = row.getValue("category") as string
                return <div className="capitalize">{value}</div>
            },
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => {
                const value = row.getValue("type") as string
                return <div className="capitalize">{value}</div>
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const field = row.original
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(field)
                                }}
                            >
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(field)
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [handleEdit, handleDelete])

    const table = useReactTable({
        data,
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
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => filterFields(filterValue, row.original),
    })

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search by title, category..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <AddFieldDialog onFieldAdded={fetchFields} />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
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

            {selectedField && (
                <>
                    <EditFieldDialog
                        open={editDialogOpen}
                        onOpenChange={(open) => {
                            if (!open) handleDialogClose()
                            else setEditDialogOpen(true)
                        }}
                        field={selectedField}
                        onSave={handleSaveEdit}
                    />
                    <DeleteFieldDialog
                        open={deleteDialogOpen}
                        onOpenChange={(open) => {
                            if (!open) handleDialogClose()
                            else setDeleteDialogOpen(true)
                        }}
                        field={selectedField}
                        onConfirm={handleConfirmDelete}
                    />
                </>
            )}
        </div>
    )
}
