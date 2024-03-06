'use client'
import { Search } from 'lucide-react'
import { Input } from './ui/input'
import { useRef } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const onSearch = () => {
    const value = inputSearchRef.current?.value
    if (value == '' || value == undefined) {
      return
    }
    router.push('/shop/search?q=' + value)
  }

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-500 left-3" />
        <Input
          ref={inputSearchRef}
          type="text"
          placeholder="Search"
          className="pl-12 pr-4"
        />
      </div>
      <Button size={'icon'} onClick={onSearch}>
        <Search />
      </Button>
    </div>
  )
}
