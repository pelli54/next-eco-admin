import { getUser } from '@/lib/utils'
import moment from 'moment'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export interface APIGETResponseOverview {
  productsSales: number
  totalSale: number
  totalWeek: number
  totalMonth: number
  recentSales: {
    namaClient: string
    code: string
    total: number
  }[]
  dataToChart: {
    code: string
    total: number
  }[]
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse) && user.isAdmin) {
      const sales = await prisma?.orders.findMany({
        orderBy: {
          id: 'desc',
        },
        include: {
          products: true,
        },
      })
      const salesAtWeek = await prisma?.orders.findMany({
        where: {
          createdAt: {
            lte: moment().toDate(),
            gte: moment().subtract(7, 'days').toDate(),
          },
        },
      })
      const salesAtMonth = await prisma?.orders.findMany({
        where: {
          createdAt: {
            lte: moment().toDate(),
            gte: moment().subtract(1, 'month').toDate(),
          },
        },
      })
      const prodcutsSales = await prisma?.productsOnOrder.findMany({
        orderBy: {
          id: 'desc',
        },
      })
      if (sales && prodcutsSales && salesAtMonth && salesAtWeek) {
        const productsSales = prodcutsSales.reduce((acc, product) => {
          return acc + product.quantity
        }, 0)
        const totalSale = sales.reduce((acc, order) => {
          return acc + order.total
        }, 0)
        const totalWeek = salesAtWeek?.reduce((acc, order) => {
          return acc + order.total
        }, 0)
        const totalMonth = salesAtMonth?.reduce((acc, order) => {
          return acc + order.total
        }, 0)
        const recentSales = sales.slice(0, 10).map((order) => ({
          namaClient: order.nameClient,
          code: order.code,
          total: order.total,
        }))
        const dataToChart = recentSales.map((doc) => ({
          code: doc.code,
          total: doc.total,
        })).reverse()
        return NextResponse.json({
          productsSales,
          totalSale,
          totalWeek,
          totalMonth,
          recentSales,
          dataToChart,
        })
      }else {
        return NextResponse.json({ message: 'Error server' }, { status: 500 })
      }
    } else {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }
  } catch (error) {}
}
