import React, { FC, MouseEventHandler } from 'react'
import { IconType } from 'react-icons/lib'


interface props{
    text?: string;
    click?: MouseEventHandler<HTMLDivElement> | undefined;
    Icon?: IconType;
    cls?: string;
}

const Button:FC<props> = ({text,Icon,click,cls=''}) => {
  return (
    <div className={`btn ${cls}`} onClick={click}>
      {
        text&&<span>{text}</span>
      }
        {
          Icon&&<Icon/>
        }
        
    </div>
  )
}

export default Button