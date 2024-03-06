import { registerSchema } from '@/Schemas/Schemas'
import { RegisterParamsAPI } from '@/types/Types'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import prisma from '@/db/client'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const data: RegisterParamsAPI = await req.json()
    registerSchema.safeParse(data)

    const userFound = await prisma.users.findUnique({
      where: { email: data.email },
    })
    if (userFound) {
      return NextResponse.json(
        { message: 'user Already Exist' },
        { status: 401 }
      )
    }

    const { confirmPassword, password, ...userdata } = data
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.users.create({
      data: {
        password: hashedPassword,
        ...userdata,
      },
    })
    await prisma?.cart.create({
      data: {
        status: 'active',
        userId: user.id,
      },
    })
    return NextResponse.json({ message: 'User Created Successfully' })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: 'input invalid' }, { status: 403 })
    }
    console.log(error)
    return NextResponse.json({ message: 'Error in server' }, { status: 500 })
  }
}
