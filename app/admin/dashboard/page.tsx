'use client'
import { APIGETResponseOverview } from '@/app/api/overview/route'
import Loading from '@/components/Loading'
import { OverviewSales } from '@/components/overviewSale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetcher } from '@/lib/utils'
import { DollarSign } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

const page = () => {
  const { data, isLoading, error } = useSWR<APIGETResponseOverview>(
    '/api/overview',
    fetcher
  )

  if (isLoading) {
    return <Loading />
  }
  if (error) {
    return <h1>An Error has Ocurried</h1>
  }
  if (data) {
    return (
      <div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between  space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign width={'1rem'} height={'1rem'} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $ {data.totalSale.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                weekly sales
              </CardTitle>
              <DollarSign width={'1rem'} height={'1rem'} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $ {data.totalWeek.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                monthly sales
              </CardTitle>
              <DollarSign width={'1rem'} height={'1rem'} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $ {data.totalMonth.toFixed(2)}{' '}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                total products sold
              </CardTitle>
              <DollarSign width={'1rem'} height={'1rem'} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.productsSales} </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-3">
          <Card className="col-span-7">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-medium">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <OverviewSales data={data.dataToChart} />
            </CardContent>
          </Card>

          <Card className="col-span-5">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {data.recentSales.map((sale) => (
                <div className="flex justify-between rounded-lg transition ease-linear hover:bg-accent p-2" key={sale.code}>
                  <div>
                    <p className="font-medium leading-none">{sale.namaClient}</p>
                    <p className="text-sm text-muted-foreground">{sale.code}</p>
                  </div>
                  <div className="font-medium text-lg">+${sale.total.toFixed(2)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}

export default page
