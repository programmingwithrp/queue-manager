import React from 'react'

const LoadingWheel = () => {
  return (
    // one liner loader will not take up much space
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white-900"></div>
    </div>
  )
}

export default LoadingWheel;