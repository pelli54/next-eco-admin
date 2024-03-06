import React from 'react'
import { Button } from './ui/button'
import { Minus, Plus } from 'lucide-react'

const QuantitySpin = ({value, setValue}:{value:number, setValue:(v:number) => void}) => {
  const onUp = () => {
    setValue(value + 1)
  }
  const onDown = () => {
    if(value == 1) {
      return
    }
    setValue(value - 1)
  }

  return (
    <div className="flex gap-4 items-center p-0.5 ">
      <Button disabled={value == 1} variant={'ghost'} size={'icon'} className="rounded-lg" onClick={onDown}>
        <Minus />
      </Button>
      <span>{value}</span>
      <Button
        variant={'ghost'}
        size={'icon'}
        className="rounded-lg"
        onClick={onUp}
      >
        <Plus />
      </Button>
    </div>
  )
}

export default QuantitySpin
