'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Plus } from 'lucide-react'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'
import { Category } from '@prisma/client'
import { cn } from '@/lib/utils'

const CategoryDialog = ({categoryMutate}: {categoryMutate: () => void }) => {
    const { register, handleSubmit } = useForm<{categoryname: string}>()
    const [error, setError] = useState<string>('')

    const onSubmit = async (value: {categoryname: string}) => {
        try {
            await axios.post<Category>('/api/category', {name: value.categoryname})
            setError('')
            categoryMutate()
        } catch (error) {
            if(error instanceof AxiosError){
                setError(error.response?.data.message)
            }
        }
        
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={'icon'}>
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <div>
                    <div className={cn(error==''?'hidden':'block','w-full py-4 text-center bg-red-500 rounded-lg mb-3')}><span>{error}</span></div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
                        <Label>Name Category</Label>
                        <Input
                            {...register('categoryname')}
                        />
                        <Button className='w-full'>Create</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryDialog
