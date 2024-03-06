import { productSchema } from '@/Schemas/Schemas'
import { excludeAtProduct, getUser } from '@/lib/utils'
import { ProductExtended } from '@/types/Types'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError, z } from 'zod'

export async function GET(req: NextRequest) {
    try {
        let session = await getServerSession()
        const user = await getUser(session?.user?.email as string)
        if (!(user instanceof NextResponse)) {
            const searchParams = req.nextUrl.searchParams
            const skip = Number(searchParams.get('skip')) || 0
            const take = Number(searchParams.get('take')) || 100
            const productsDB:ProductExtended[] | undefined = await prisma?.product.findMany({
                skip,
                take,
                include:{
                    category:true,
                    images:true
                },
                
            })
            if(!user.isAdmin && productsDB !== undefined){
                const result = productsDB.map(product => excludeAtProduct(product, "costPrice"))
                return NextResponse.json(result)
            }
            return NextResponse.json(productsDB)
        }
    } catch (error) {}
}

export async function POST(req: NextRequest){
    try {
        let session = await getServerSession()
        const user = await getUser(session?.user?.email as string)
        if (!(user instanceof NextResponse)) {
            if(!user.isAdmin){
                return NextResponse.json({message: 'Unauthorized'}, {status:403})
            }
            const data: z.infer<typeof productSchema> = await req.json()
            
            productSchema.safeParse(data)
            const productFound = await prisma?.product.findUnique({where: {code: data.code}})
            if(productFound){
                return NextResponse.json({message: 'product already exist'}, {status:400})
            }
            console.log(data)
            const result = await prisma?.product.create({
                data: {
                    code: data.code,
                    name: data.name,
                    costPrice: data.costPrice,
                    sellPrice: data.sellPrice,
                    description: data.description || '',
                    CategoryId: data.categoryId
                }
            })
            return NextResponse.json({product: result})
        }
    } catch (error) {
        if(error instanceof ZodError){
            return NextResponse.json({message: 'Invalid Data', zodError: error.errors}, {status:400})
        }
        if(error instanceof PrismaClientKnownRequestError){
            console.log('error', error)
            return NextResponse.json({message: 'Invalid Data'}, {status:400})
        }
        console.log('error', error)
    }
}

export async function PUT(req: NextRequest){
    try {
        let session = await getServerSession()
        const user = await getUser(session?.user?.email as string)
        if (!(user instanceof NextResponse)) {
            if(!user.isAdmin){
                return NextResponse.json({message: 'Unauthorized'}, {status:403})
            }
            const data: z.infer<typeof productSchema> = await req.json()
            
            productSchema.safeParse(data)
            const productFound = await prisma?.product.findUnique({where: {code: data.code}})
            if(!productFound){
                return NextResponse.json({message: 'product not exist'}, {status:400})
            }
            const result = await prisma?.product.update({
                where:{
                    code: data.code,
                },
                data: {
                    name: data.name,
                    costPrice: data.costPrice,
                    sellPrice: data.sellPrice,
                    description: data.description || '',
                    CategoryId: data.categoryId
                }
            })
            return NextResponse.json({product: result})
        }
    } catch (error) {
        if(error instanceof ZodError){
            return NextResponse.json({message: 'Invalid Data', zodError: error.errors}, {status:400})
        }
        console.log('error', error)
    }
}