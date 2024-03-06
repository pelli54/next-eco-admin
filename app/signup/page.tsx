'use client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { registerSchema } from '@/Schemas/Schemas'
import axios, { AxiosError } from 'axios'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const RegisterPage = () => {
    const router = useRouter()
    const [errorMessage, setErrorMessage] = useState<string>('')
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        try {
            const res = await axios.post('/api/auth/register', values)
            if(res.status == 200){
                router.push('/shop')
            }
        } catch (error) {
            if(error instanceof AxiosError){
                setErrorMessage(error.response?.data.message)
            }
        }
    }

    return (
        <div className="h-screen flex justify-center items-center p-3">
            <Card className="w-full max-w-xl">
                <CardHeader>
                    <h1 className="text-center text-4xl font-semibold mb-6">
                        LOGO
                    </h1>
                    <h2 className="text-center text-xl">Sign Up</h2>
                </CardHeader>
                <CardContent>
                    <div className={cn(errorMessage==''?'hidden':'block', 'py-4 px-3 bg-red-500 rounded-lg text-center')}>
                        <span>{errorMessage}</span>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="********"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="********"
                                                type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full">SignUp</Button>
                        </form>
                            <div className="text-center mt-3">
                                <span>
                                    Already have an account?{' '}
                                    <a href="#">Login</a>{' '}
                                    {/** TODO add login url */}
                                </span>
                            </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterPage
