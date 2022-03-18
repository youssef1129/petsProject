import React, { FC } from 'react'
import { IconType } from 'react-icons/lib'
import { Ipets } from '../interfaces/Pets'
interface prop {
    text?: string;
    value?: string| any;
    Icon?: IconType;

}

interface props {
    obj: Array<prop>;
    setValue?: any
    value:string | number | undefined;
    name:string;
    pet:Ipets;
}

const Radio: FC<props> = ({ obj, setValue,value ,name,pet}) => {

    const Change = (val: string)=>{
        setValue({...pet,[name]:val})
    }

    return (
        <div className='radio'>
            {
                obj?.map((O,k) => {
                    return <span key={k} onClick={()=>Change(O.value)}>
                        <label>{O.text}</label>
                        {O.Icon && <O.Icon />}
                        <span style={{backgroundColor:O.value===value&&'#8f8f8f' || ''}}></span>
                    </span>
                })
            }
        </div>
    )
}

export default Radio