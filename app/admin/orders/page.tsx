'use client'
import Loading from '@/components/Loading'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { calculateTotaOfCart, fetcher } from '@/lib/utils'
import { Orders, ProductsOnOrder } from '@prisma/client'
import moment from 'moment'
import React from 'react'
import useSWR from 'swr'

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
    <div className="space-y-3 flex flex-col h-full">
      <div>
        <h1 className="text-2xl">Orders</h1>
      </div>
      <ScrollArea className='flex-1'>
        <div>
          {data?.map((order) => (
            <Card className="p-3 mb-3" key={order.id}>
              <div>
                <div className="flex justify-between border-b pb-2 mb-3">
                  <span className="text-xl font-semibold">
                    Oder: #{order.code}
                  </span>
                  <span className="text-muted-foreground">{moment(order.createdAt).format('L')}</span>
                </div>
                <div className="grid grid-cols-4 gap-y-3">
                  <div>
                    <span className="text-muted-foreground">Client: </span>
                    <span>{order.nameClient}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contact: </span>
                    <span>{order.contact}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status: </span>
                    <span>{order.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Total Amount:{' '}
                    </span>
                    <span>$ {order.total.toFixed(2)}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-muted-foreground">Direction: </span>
                    <span>{order.direction}</span>
                  </div>
                  <div className="col-span-4">
                    <span className="text-muted-foreground">Notes: </span>
                    <span>{order.note}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h1 className="text-2xl">Products</h1>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.productCode}</TableCell>
                          <TableCell>{product.productName}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            $ {product.productPrice.toFixed(2)}
                          </TableCell>
                          <TableCell>$ {product.discount.toFixed(2)}</TableCell>
                          <TableCell>
                            ${' '}
                            {(product.quantity * product.productPrice).toFixed(
                              2
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={5}></TableCell>
                        <TableCell className="font-semibold">
                          $ {calculateTotaOfCart(order.products).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default page
