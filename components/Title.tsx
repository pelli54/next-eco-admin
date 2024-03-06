import React from 'react'

const Title = ({content}:{content: string}) => {
  return (
    <div className="mt-6 mb-3">
      <h1 className="text-3xl font-light">{content}</h1>
    </div>
  )
}

export default Title
