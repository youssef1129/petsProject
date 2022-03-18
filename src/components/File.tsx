import React, { ChangeEvent, FC } from 'react'
import { IconType } from 'react-icons/lib'
import { Iclient } from '../interfaces/Clients'
import { Ipets } from '../interfaces/Pets'

interface props {
    val: Iclient | Ipets;
    setVal: React.Dispatch<any>;
    Icon?: IconType;
    isUrl?:boolean;
}

const File: FC<props> = ({ Icon, setVal, val ,isUrl=true}) => {

    const OnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            
            var FR = new FileReader();

            FR.addEventListener("load", function (event: any) {
               const k = event.target.result;
               isUrl?
               setVal({...val,url:k})
               :
               setVal({...val,photo:k});
               
                // var b46 = e.target.result.split(',')[1]
            });
            FR.readAsDataURL(e.target.files[0]);
        }
    }

    return (
        <div className='file'>
            <input type='file' accept="image/*" onChange={OnChange} />
            {Icon && <Icon />}
        </div>
    )
}

export default File