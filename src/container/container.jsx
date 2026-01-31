import React from 'react'

export default function Container({children}) {
  return (
    // Essential layout classes remain, all color/theme classes are removed.
    <div 
        className='
            w-full 
            max-w-7xl 
            mx-auto 
            px-4 
            sm:px-6 
            lg:px-8 
            py-4 
        '
    >
        {children}
    </div>
  )
}