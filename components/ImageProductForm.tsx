import React from 'react'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { imageFormSchema } from '@/Schemas/Schemas'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { toast } from 'sonner'
import { Dialog, DialogContent } from './ui/dialog'
import { DialogTrigger } from '@radix-ui/react-dialog'
import axios, { AxiosError } from 'axios'
import { ProductImage } from '@prisma/client'
import { fetcher } from '@/lib/utils'
import useSWR from 'swr'
import Loading from './Loading'

const ImageProductForm = ({ productCode }: { productCode: string }) => {
    const { data: productImages, isLoading, mutate, error } = useSWR<ProductImage[]>(
        '/api/productImage?code=' + productCode,
        fetcher
    )
    const formImage = useForm<z.infer<typeof imageFormSchema>>({
        resolver: zodResolver(imageFormSchema),
    })

    const ImageDialog = ({ productImage }: { productImage: ProductImage }) => {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <div className="h-36">
                        <img
                            className="h-full rounded-lg"
                            alt={String(productImage.id)}
                            src={productImage.url}
                        />
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <div className="h-[480px]">
                        <img
                            className="h-full rounded-lg"
                            alt={String(productImage.id)}
                            src={productImage.url}
                        />
                    </div>
                    <div>
                        <Button
                            onClick={() => onDelete(productImage.id)}
                            className="bg-red-400"
                            variant={'secondary'}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
    const onSubmit = async (values: z.infer<typeof imageFormSchema>) => {
        try {
            const result = await axios.post(
                '/api/productImage',
                {
                    url: values.urlImage,
                    productCode,
                },
                {
                    withCredentials: true,
                }
            )
            if (result.status === 200) {
                formImage.setValue('urlImage','')
                toast.success('Image upload')
                mutate()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
        }
    }
    const onDelete = async (id: string | number) => {
        try {
            const result = await axios.delete('/api/productImage?id=' + id, {
                withCredentials: true,
            })
            if (result.status === 200) {
                toast.success('Image Deleted')
                mutate()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message)
            }
        }
    }
    if (isLoading) {
        return <Loading />
    }
    return (
        <Card className="p-3">
            <div>
                <Form {...formImage}>
                    <form
                        onSubmit={formImage.handleSubmit(onSubmit)}
                        className="flex gap-3 items-end"
                    >
                        <FormField
                            control={formImage.control}
                            name="urlImage"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Product URL Image"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button size={'icon'}>
                            <Plus />
                        </Button>
                    </form>
                </Form>
            </div>
            
            <ul className='flex gap-3'>
                {productImages?.map((im) => (
                    <li className="p-3 h-40 flex gap-3" key={im.id}>
                        <ImageDialog productImage={im} />
                    </li>
                ))}
            </ul>
        </Card>
    )
}

export default ImageProductForm
