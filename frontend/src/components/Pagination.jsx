import React, { useState } from 'react'


const PaginationBox = ({count}) => {
    console.log(count);
    
    return(
        <div className='bg-blue-500 w-10 h-10 flex items-center justify-center text-center text-white font-bold rounded-sm font-outfit'>
            <h1>{count}</h1>
        </div>
    )
}
const Pagination = () => {
    const [projectLength, setProjectLength] = useState([1, 2, 3, 4, 5, 6, 7])
  return (
    <div className=''>
        {/* the page size refers to the total project length / 9 */}
        <div className='flex justify-center gap-0.5 '>
        {projectLength.map((item) => {
            return <PaginationBox count={item} />
        })}
        </div>
    </div>
  )
}

export default Pagination