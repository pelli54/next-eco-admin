import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Category, Product } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'

export const columns: ColumnDef<Product & { category: Category }>[] = [
    {
        accessorKey: 'code',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Code
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        
    },
    {
        accessorKey: 'CategoryId',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{row.original.category.name}</div>,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: 'costPrice',
        header: 'Cost',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('costPrice'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)

            return <div className="text-center font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: 'sellPrice',
        header: 'Price Sale',
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('sellPrice'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)

            return <div className="text-center font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('isActive') ? 'Active' : 'Disable'

            return (
                <div className="text-center font-medium ">
                    <span
                        className={cn(
                            'px-2 py-1 rounded-lg',
                            row.getValue('isActive')
                                ? 'bg-green-500'
                                : 'bg-red-300'
                        )}
                    >
                        {status}
                    </span>
                </div>
            )
        },
    },
]
