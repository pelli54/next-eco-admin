'use client'
import { CheckoutFormSchema, CheckoutFormSchemaType } from '@/Schemas/Schemas'
import Title from '@/components/Title'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { onPost } from '@/lib/utils'
import { useCartStore, useShopStore } from '@/stores/shopStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const page = () => {
  const form = useForm<CheckoutFormSchemaType>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      contact: '',
      direction: '',
      isDelivery: true,
      nameClient: '',
      note: '',
    },
  })

  const setOpenCart = useShopStore(state => state.setOpenCart)
  const productsOnCart = useCartStore(state => state.productsOnCart)
  const total = useCartStore(state => state.total)

  const onSubmit = (values: CheckoutFormSchemaType) => {
    if(productsOnCart.length === 0){
      toast.message('Dont have products in Cart')
      return  
    }
    onPost<CheckoutFormSchemaType>('/api/order', values)
    form.reset()
  }

  return (
    <>
      <Title content="Checkout" />
      <div className="flex items-center justify-between border-y py-3 mb-3">
        <div className="flex gap-4 ">
          <div className="w-24">
            <span className="text-muted-foreground text-sm">Total</span>
            <h1 className="text-2xl font-semibold">
              <span>$</span>{total.toFixed(2)}
            </h1>
          </div>
          <div className="w-24">
            <span className="text-muted-foreground text-sm">Products</span>
            <h1 className="text-2xl font-semibold">{productsOnCart.length}</h1>
          </div>
        </div>
        <div>
          <Button size={'icon'} onClick={() => setOpenCart(true)} >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div>
          <Form {...form}>
            <form className="space-y-3 px-1"  >
              <FormField
                control={form.control}
                name="nameClient"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Name Client</FormLabel>
                    <FormControl>
                      <Input {...field}/>
                    </FormControl>
                    <FormDescription>Name Client</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Phone Number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="direction"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Direction</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Direction</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Additional information</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </ScrollArea>
      <div className="pt-3 border-t">
        <Button disabled={productsOnCart.length === 0} onClick={form.handleSubmit(values => onSubmit(values))}  className="w-full">Complete</Button>
      </div>
    </>
  )
}

export default page
