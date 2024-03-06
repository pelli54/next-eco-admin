import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
    return <div className='w-full h-full flex justify-center items-center'>
        <div>
            <Loader className='animate-spin'/>
        </div>
    </div>
}

export default Loading
