'use client'
import React from 'react'
import { DataTable } from './data-table'
import useSWR from 'swr'
import { fetcher } from '@/lib/utils'
import Loading from '@/components/Loading'
import { columns } from './columns'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Page = () => {
    const { data: products, isLoading } = useSWR('/api/product', fetcher)
    const router = useRouter()
    if (isLoading) {
        return <Loading />
    }
    return (
        <div className='flex flex-col h-full'>
            <div className="mb-3 flex justify-between">
                <h1 className="text-2xl">Products</h1>
                <Button onClick={() => router.push('/admin/products/form')}>
                    <Plus/>
                    Create Product.
                </Button>
            </div>
            <DataTable data={products} columns={columns} />
        </div>
    )
}

export default Page
