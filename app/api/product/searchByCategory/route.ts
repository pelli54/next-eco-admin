import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/client";


export async function GET(req: NextRequest) {
  try {
      const searchParams = req.nextUrl.searchParams
      const category = searchParams.get('category')
      const haveCategory = category && category !== '' && category !== null
      let result = [] 
      if(haveCategory){
        result = await prisma.product.findMany({
          skip:0,
          take:100,
          where:{
            CategoryId: Number(category)
          },
          include:{
            category:true,
            images:true
          }
        })
      }else {
        result = await prisma.product.findMany({
          skip:0,
          take:100,
          include:{
            category:true,
            images:true
          }
        })
      }
      return NextResponse.json(result)
  }catch(err){
    console.log(err)
  }
}