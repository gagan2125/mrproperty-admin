"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { API_BASE_URL } from "@/lib/constants"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { DeleteBuyerDialog } from "./delete-buyer-dialog"

export type Buyer = {
    _id: string
    seller_name: string
    seller_email: string
    seller_phone: string
    seller_status: string
    seller_about: string
    createdAt: string
    updatedAt: string
}

function filterBuyers(searchTerm: string, buyer: Buyer): boolean {
    const searchLower = searchTerm.toLowerCase()
    return (
        buyer.seller_name.toLowerCase().includes(searchLower) ||
        buyer.seller_phone.toLowerCase().includes(searchLower)
    )
}

export function DataTable() {
    const router = useRouter()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
    const [selectedBuyer, setSelectedBuyer] = React.useState<Buyer | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [data, setData] = React.useState<Buyer[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchSellers = React.useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/sellers/get-sellers`)
            if (!response.ok) {
                throw new Error('Failed to fetch sellers')
            }
            const sellers = await response.json()
            setData(sellers)
        } catch (error) {
            console.error('Error fetching sellers:', error)
            toast.error('Failed to fetch sellers')
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchSellers()
    }, [fetchSellers])

    const handleDelete = (buyer: Buyer) => {
        setSelectedBuyer(buyer)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedBuyer) return

        setIsDeleting(true)
        try {
            const response = await fetch(`${API_BASE_URL}/sellers/delete-seller/${selectedBuyer._id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Failed to delete seller')
            }

            toast.success('Seller deleted successfully')
            fetchSellers() // Refresh the data
        } catch (error) {
            console.error('Error deleting seller:', error)
            toast.error(error instanceof Error ? error.message : 'Failed to delete seller')
        } finally {
            setIsDeleting(false)
            setDeleteDialogOpen(false)
            setSelectedBuyer(null)
        }
    }

    const columns = React.useMemo<ColumnDef<Buyer>[]>(() => [
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
            accessorKey: "seller_name",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Seller Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div>{row.getValue("seller_name")}</div>,
        },
        {
            accessorKey: "seller_email",
            header: "Seller Email",
            cell: ({ row }) => <div>{row.getValue("seller_email")}</div>,
        },
        {
            accessorKey: "seller_phone",
            header: "Seller Phone",
            cell: ({ row }) => <div>{row.getValue("seller_phone")}</div>,
        },
        {
            accessorKey: "seller_status",
            header: "Status",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("seller_status")}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const buyer = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/sellers/edit-seller/${buyer._id}`)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(buyer)
                            }}>
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ], [router])

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
        globalFilterFn: (row, columnId, filterValue) => {
            return filterBuyers(filterValue, row.original)
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search by name, phone..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-lg"
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
                                .map((column) => {
                                    return (
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
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="ml-4">
                    <Button onClick={() => router.push('/sellers/add-seller')}>
                        <Plus className="h-4 w-4" />
                        Add seller
                    </Button>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
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

            <DeleteBuyerDialog
                isOpen={deleteDialogOpen}
                onClose={() => {
                    setDeleteDialogOpen(false)
                    setSelectedBuyer(null)
                }}
                onConfirm={handleConfirmDelete}
                buyerName={selectedBuyer?.seller_name || ''}
                isDeleting={isDeleting}
            />
        </div>
    )
}
