'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
  const router = useRouter()
  router.push('/shop')
  return (
    <>
      <h1>Welcome</h1>
    </>
  )
}

export default page
