import React, { ChangeEvent, useState } from 'react'
import { AiOutlinePhone } from 'react-icons/ai'
import { MdSecurityUpdateGood } from 'react-icons/md'
import Button from '../components/Button'
import Input from '../components/Input'
import { Iclient } from '../interfaces/Clients'
import '../styles/login.css';
import { window } from '../window';
import { auth } from '../functions/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { RiLockPasswordLine } from 'react-icons/ri'
import { IoReturnUpBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Fpass = () => {
    const [client, setCLientt] = useState<Iclient>({ password: '', phone: '' })
    const [code, setCode] = useState({ code: '', valid: false })
    const [sent, setSent] = useState(false)
    const [phoneEror, setPhoneEror] = useState(false)
    const [codeErr, setCodeErr] = useState(2)
    const [error, setIsError] = useState({})
    const [repassword, setRePassword] = useState({ repass: '' })
    const naviguate = useNavigate()

    const checkCode = (e: ChangeEvent<HTMLInputElement>) => {
        setCode({ ...code, code: e.target.value })

        if (code.code.length > 4) {
            let confirmationResult = window.confirmationResult
            confirmationResult.confirm(code.code).then(() => {
                setCode({ ...code, valid: true })
                setCodeErr(1);
            }).catch(() => {
                setCodeErr(2);
            })
        }
    }

    const gCaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
            }
        }, auth);

    }

    const send = () => {
        gCaptcha()
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, client.phone || '', appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                setSent(true);
            }).catch((error) => {
                setPhoneEror(true);
            });
    }

    const onSave= async()=>{
        const g = Object.values(error)
        
        if (g.length === 3 && g.every(x => x === true) && code.valid){
            const body = JSON.stringify({phone:client.phone,password:client.password})
            await axios.post('https://ani-maux.000webhostapp.com/apis/updatePassword.api.php',body).then(()=>{
                naviguate('/login')
            })
        }
    }

    
    return (
        <div className='login'>
            <form className='form'>

                {phoneEror && <h6>Invalid phone number</h6>}

                {codeErr === 2 ?
                    <>
                        <Input setIsError={setIsError} name='phone' regex={/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im} min={10} max={21} type='tel' placeholder='phone-number' color='#9c27b0' Icon={AiOutlinePhone} setVal={setCLientt} val={client} value={client.phone} />
                        <Button click={send} text='Send verification code' Icon={MdSecurityUpdateGood} />
                        {sent && <input className='input' value={code.code} onChange={checkCode} />}
                    </> :
                    <>
                        <Input setIsError={setIsError} name='password' regex={/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/} min={5} max={30} type='password' placeholder='password' color='rgb(255 20 20 / 80%)' Icon={RiLockPasswordLine} setVal={setCLientt} val={client} value={client.password} />
                        <Input setIsError={setIsError} name='repass' min={5} max={30} type='password' placeholder='re-password' color='rgb(255 20 20 / 80%)' Icon={RiLockPasswordLine} setVal={setRePassword} val={repassword} value={repassword.repass} password={client.password} />
                        <Button text='save' click={onSave}/>
                    </>
                }

                <div id="recaptcha-container"></div>
                <IoReturnUpBack id='back' onClick={() => naviguate('/login')} />
            </form>

        </div>
    )
}

export default Fpass