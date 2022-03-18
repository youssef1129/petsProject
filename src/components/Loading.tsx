import React, { FC } from 'react'
import { MdPets } from 'react-icons/md'

interface props{
    display?:string;
}

const Loading:FC<props> = ({display}) => {
  return (
      <div className='loading' style={{display:display}}>
            <MdPets  />
      </div>

        
  )
}

export default Loading