import { getUser } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma?.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json({ message: 'Error server' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    const user = await getUser(session?.user?.email as string)
    if (!(user instanceof NextResponse)) {
      if (!user.isAdmin) {
        return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
      }
      const data = await req.json()
      if (!data.name) {
        return NextResponse.json({ message: 'data invalid' }, { status: 400 })
      }
      const categoryFound = await prisma?.category.findFirst({
        where: { name: data.name },
      })
      if (categoryFound) {
        return NextResponse.json(
          { message: 'Category already Exist' },
          { status: 400 }
        )
      }
      const category = await prisma?.category.create({
        data: {
          name: data.name,
        },
      })
      return NextResponse.json(category)
    }
  } catch (error) {
    console.log(error)
  }
}
