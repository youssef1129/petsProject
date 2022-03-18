import React, { ChangeEvent, FC, MouseEventHandler, useState } from 'react';
import { IconType } from 'react-icons/lib';
import { BiMessageSquareError } from 'react-icons/bi';
import * as io from "socket.io-client";
import { RootStateOrAny, useSelector } from 'react-redux';
import { window } from '../window';

interface props {
    val: object;
    value?: string | number;
    setVal: React.Dispatch<React.SetStateAction<any>>;
    Icon: IconType;
    placeholder: string;
    color?: string;
    click?: MouseEventHandler<any>;
    type?: 'password' | 'text' | 'email' | 'tel';
    min?: number;
    max?: number;
    regex?: any;
    password?: string;
    setIsError?: any;
    name?: string;
    istextarea?: boolean;
    socket?: io.Socket<any, any>
    auto?:string
}

const Input: FC<props> = ({ auto='on',socket, value, name, setIsError, regex, password, min, max, Icon, val, placeholder = '', setVal, color = '', click, type, istextarea = false }) => {

    const [error, setError] = useState('none')

    const validateRegex = (val: string, regex: any) => {
        return regex.test(val);
    }
    const { room } = useSelector((state: RootStateOrAny) => state.room.room) || '';
    const OnChange = async (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const name = e.target.name;
        const value = e.target.value.toLowerCase();
        setVal({ ...val, [name]: value })
        if (socket) {

            await socket.emit("onchange", { room: room, status: true })
        }
        if (name !== 'repass') {
            if (!validateRegex(String(value), regex)) {
                setError('initial');
                setIsError((err: any) => { return { ...err, [name]: false } });
            }
            else {
                setIsError((err: any) => { return { ...err, [name]: true } });
                setError('none')
            }
        }
        else if (name === 'repass') {
            if (value !== password) {
                setError('initial');
                setIsError((err: any) => { return { ...err, repass: false } });
            } else {
                setIsError((err: any) => { return { ...err, repass: true } });
                setError('none')
            }
        }
    }

    const OnBlur = async () => {
        if (socket) {
            await socket.emit("onchange", { room: room, status: false })
        }
    }

    const [chosenEmoji, setChosenEmoji] = useState(null);

    return (
        <>
            {
                istextarea ? (
                    <div className='input textarea'>
                        <textarea name={name} minLength={min} maxLength={max} placeholder={placeholder} value={value} onChange={OnChange} />
                        <Icon onClick={click} style={{ color: color }} />
                        <BiMessageSquareError color='red' display={error} className='eror' />
                    </div>
                )

                    : (
                        <div className='input'>
                            <input autoComplete={auto} onBlur={OnBlur} name={name} minLength={min} maxLength={max} type={type} placeholder={placeholder} value={value} onChange={OnChange} />
                            <Icon onClick={click} style={{ color: color }} />
                            <BiMessageSquareError color='red' display={error} className='eror' />
                        </div>
                    )
            }
        </>
    )
}

export default Input

