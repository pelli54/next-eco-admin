'use client'
import Loading from '@/components/Loading'
import Title from '@/components/Title'
import { Card } from '@/components/ui/card'
import { fetcher } from '@/lib/utils'
import { Orders, ProductsOnOrder } from '@prisma/client'
import { CheckCircle2 } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'
import moment from 'moment'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const page = () => {
  const { data, isLoading, error } = useSWR<
    Array<Orders & { products: ProductsOnOrder[] }>
  >('/api/order', fetcher)

  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return <h1>An Error has Ocurried</h1>
  }
  return (
    <>
      <Title content="Orders" />
      <ScrollArea>
        <div className="space-y-3 mt-6">
          {data?.map((order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between">
                <div className="flex">
                  <CheckCircle2 className="mr-3" />
                  <span className="text-lg font-semibold">{order.code}</span>
                </div>
                <span>{moment(order.createdAt).format('L')}</span>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex ">
                  <span className="w-36 text-muted-foreground">Client:</span>
                  <span className="capitalize">{order.nameClient}</span>
                </div>
                <div className="flex ">
                  <span className="w-36 text-muted-foreground">Total:</span>
                  <span>$ {order.total.toFixed(2)}</span>
                </div>
                <div className="flex ">
                  <span className="w-36 text-muted-foreground">Products:</span>
                  <span className="">
                    {order.products
                      .map((p: ProductsOnOrder) => p.quantity)
                      .reduce((acc, x) => acc + x, 0)}
                  </span>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Products List</AccordionTrigger>
                    <AccordionContent>
                      {order.products.map((product) => (
                        <div className="mb-3">
                          <span className="text-lg mt-2 ml-3">
                            {product.productName}
                          </span>
                          <div className="flex gap-3 justify-between p-3">
                            <div>
                              <span className="text-muted-foreground">
                                Price:{' '}
                              </span>
                              <span>$ {product.productPrice.toFixed(2)}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Qty:{' '}
                              </span>
                              <span>{product.quantity.toFixed(0)}</span>
                            </div>
                            <div className="">
                              <span className="text-muted-foreground">
                                Total:{' '}
                              </span>
                              <span>$ {(product.productPrice* product.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  )
}

export default page
