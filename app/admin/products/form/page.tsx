'use client'
import { useSearchParams } from 'next/navigation'
import { productSchema } from '@/Schemas/Schemas'
import CategoryDialog from '@/components/categoryDialog'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useSWR from 'swr'
import { Category, Product } from '@prisma/client'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import ImageProductForm from '@/components/ImageProductForm'
import { fetcher } from '@/lib/utils'
import Loading from '@/components/Loading'

const Page = () => {
    const params = useSearchParams()

    const {
        data: category,
        isLoading,
        mutate,
    } = useSWR<Category[]>('/api/category', fetcher)
    const [isEdit, setIsEdit] = useState(false)

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            code: '',
            categoryId: 1,
            costPrice: 0,
            description: '',
            name: '',
            sellPrice: 0,
        },
    })

    const getAnProduct = async (code: string) => {
        const { data: product } = await axios.get<Product[] | null>(
            '/api/product/search?q=' + code,
            { withCredentials: true }
        )
        return product!=null&&product.length>0?product[0]:null
    }

    const setFieldsProduct = async (code: string) => {
        const product = await getAnProduct(code)
        if (product == null) {
            setIsEdit(false)
            form.setValue('code', code)
            form.setValue('categoryId', 1)
            form.setValue('name', '')
            form.setValue('description', '')
            form.setValue('costPrice', 0)
            form.setValue('sellPrice', 0)
        } else {
            setIsEdit(true)
            form.setValue('code', code)
            form.setValue('categoryId', product.CategoryId)
            form.setValue('name', product.name)
            form.setValue('description', product.description)
            form.setValue('costPrice', product.costPrice)
            form.setValue('sellPrice', product.sellPrice)
        }
    }
    const onSubmit = async (values: z.infer<typeof productSchema>) => {
        try {
            if (!isEdit) {
                const result = await axios.post('/api/product', values, {
                    withCredentials: true,
                })
                if (result.status === 200) {
                    toast.success('Product Created')
                }
            } else if (isEdit) {
                const result = await axios.put('/api/product', values, {
                    withCredentials: true,
                })
                if (result.status === 200) {
                    toast.success('Product Update')
                }
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
        }
    }
    const onCodeChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if(e.target.value === ''){
            return
        }
        const product = await getAnProduct(e.target.value as string)
        if (product == null) {
            setIsEdit(false)
            form.setValue('categoryId', 1)
            form.setValue('name', '')
            form.setValue('description', '')
            form.setValue('costPrice', 0)
            form.setValue('sellPrice', 0)
        } else {
            setIsEdit(true)
            form.setValue('categoryId', product.CategoryId)
            form.setValue('name', product.name)
            form.setValue('description', product.description)
            form.setValue('costPrice', product.costPrice)
            form.setValue('sellPrice', product.sellPrice)
        }
    }

    useEffect(() => {
        const codeParams = params.get('code')
        if (codeParams) {
            setFieldsProduct(codeParams)
        }
    }, [])

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl">Product Form</h1>
            </div>
            <div>
                <Form {...form}>
                    <form
                        className="gap-3 flex flex-wrap"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onBlur={onCodeChange}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Code unique of Product
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex-1 flex gap-3 items-center">
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={String(field.value)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="">
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {category?.map((cat) => (
                                                    <SelectItem
                                                        value={String(cat.id)}
                                                        key={cat.id}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>
                                            category to which the product
                                            belongs
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <CategoryDialog categoryMutate={mutate} />
                        </div>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Product Name{' '}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Product Description{' '}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="costPrice"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Price Cost</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormDescription>
                                        product cost price
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sellPrice"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Sale Price</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormDescription>
                                        product sales price
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full">
                            <Button>Save</Button>
                        </div>
                    </form>
                </Form>
                <div className='mt-3'>
                    {
                        form.getValues('code')!=='' &&<ImageProductForm productCode={form.getValues('code')} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Page
