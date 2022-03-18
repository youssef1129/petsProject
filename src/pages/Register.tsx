import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import '../styles/login.css';
import pet2 from '../assets/pet2.png';
import Input from '../components/Input';
import { MdAlternateEmail, MdSecurityUpdateGood } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import Button from '../components/Button';
import { AiOutlineLeft, AiOutlinePhone, AiOutlineRight, AiOutlineSecurityScan } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { IoLogIn } from 'react-icons/io5';
import { IoReturnUpBack } from 'react-icons/io5';
import { TiUserOutline } from 'react-icons/ti';
import { Iclient } from '../interfaces/Clients';
import { setClient } from '../localstorage/ClientStorage';
import axios from 'axios';
import profile from '../assets/profile.png';
import File from '../components/File';
import { BiImport } from 'react-icons/bi';
import Loading from '../components/Loading';
import { useMutation } from 'react-query';
import jwtDecode from 'jwt-decode';
import { auth } from '../functions/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { window } from '../window';

const Register = () => {

  const gCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': (response: any) => {

      }
    }, auth);

  }

  const [code,setCode] = useState({code:'',valid:false})
  const [sent,setSent] = useState(false)
  const [phoneEror,setPhoneEror] =useState(false)
  const [codeErr,setCodeErr] = useState(0)


  const checkCode = (e:ChangeEvent<HTMLInputElement>)=>{
    setCode({...code,code:e.target.value})
    
    if(code.code.length>4){
      let confirmationResult = window.confirmationResult
      confirmationResult.confirm(code.code).then(()=>{      
          setCode({...code,valid:true})
          setCodeErr(1);
      }).catch(()=>{
        setCodeErr(2);
      })
    }
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

  const naviguate = useNavigate()

  const [repassword, setRePassword] = useState({ repass: '' })
  const [error, setIsError] = useState({})
  const [client, setCLientt] = useState<Iclient>({ email: '', userName: '', password: '', phone: '', role: 'client', FirstName: '', LastName: '', photo: profile })



  const register = async (e: FormEvent) => {
    e.preventDefault();
    const g = Object.values(error)

    if (g.length === 7 && g.every(x => x === true) && code.valid) {
      await axios.post('https://ani-maux.000webhostapp.com/apis/Register.api.php',
        JSON.stringify(client))
        .then(async () => {
          let body: Iclient = { email: client.email, password: client.password, role: client.role }
          await axios.post('https://ani-maux.000webhostapp.com/apis/Login.api.php',
            JSON.stringify(body))
            .then((d) => {
              let user: any;
              let { data }: any = jwtDecode(d?.data.jwt_token);
              setClient(data)
              naviguate('/')
            })
        })
    }
  }


  const { isLoading, isError, mutate } = useMutation(register, { retry: 3 })
  const [pos, setPos] = useState(1)
  const left = ()=>{
    pos>1 && setPos(prev=>prev-1)
  }
  const right = ()=>{
    pos<3 && setPos(prev=>prev+1)
  }



  return (
    <div className='login'>
      <Loading display={isLoading ? 'flex' : 'none'} />
      <div>
        <img src={pet2} alt="" />
      </div>
      <form className='form' onSubmit={mutate}>
        {isError && <h6>eror</h6>}
        {pos === 1 ?
          <>
            <Input setIsError={setIsError} name='userName' regex={/^[a-z0-9_-]{5,16}$/igm} min={5} max={15} type='text' placeholder='username' color='#009688' Icon={TiUserOutline} setVal={setCLientt} val={client} value={client.userName} />
            <Input setIsError={setIsError} name='FirstName' regex={/^[a-z]{3,16}$/igm} min={3} max={15} type='text' placeholder='first name' color='#967d00' Icon={TiUserOutline} setVal={setCLientt} val={client} value={client.FirstName} />
            <Input setIsError={setIsError} name='LastName' regex={/^[a-z]{3,16}$/igm} min={3} max={15} type='text' placeholder='last name' color='#810096' Icon={TiUserOutline} setVal={setCLientt} val={client} value={client.LastName} />
            <File isUrl={false} Icon={BiImport} setVal={setCLientt} val={client} /></>
          : pos === 3 ?
            <>
              <Input setIsError={setIsError} name='email' regex={/\S+@\S+\.\S+/} min={10} max={40} type='email' placeholder='email' color='#73d377' Icon={MdAlternateEmail} setVal={setCLientt} val={client} value={client.email} />
              <Input setIsError={setIsError} name='password' regex={/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/} min={5} max={30} type='password' placeholder='password' color='rgb(255 20 20 / 80%)' Icon={RiLockPasswordLine} setVal={setCLientt} val={client} value={client.password} />
              <Input setIsError={setIsError} name='repass' min={5} max={30} type='password' placeholder='re-password' color='rgb(255 20 20 / 80%)' Icon={RiLockPasswordLine} setVal={setRePassword} val={repassword} value={repassword.repass} password={client.password} />
            </>
            :
            <>
            {phoneEror&& <h6>Invalid phone number</h6>}
              <Input setIsError={setIsError} name='phone' regex={/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im} min={10} max={21} type='tel' placeholder='phone-number' color='#9c27b0' Icon={AiOutlinePhone} setVal={setCLientt} val={client} value={client.phone} />
              <Button click={send} text='Send verification code' Icon={MdSecurityUpdateGood}/>
              {sent&&<input className='input' value={code.code} onChange={checkCode}  />}
              {
                codeErr===1 ?
                <h6>Valid Code</h6>
                : codeErr === 2?
                <h6>Invalid Code</h6>
                : <></>
              }
            </>
        }

        <div id="recaptcha-container"></div>

        <img src={client.photo} alt='' />
        {
          pos === 1 ?
            <AiOutlineRight onClick={right}/>
            : pos === 2 ?
              <div id='ll'>
                <AiOutlineLeft onClick={left}/>
                <AiOutlineRight onClick={right}/>
              </div>
              :
              <div id='ll'>
                <AiOutlineLeft onClick={left}/>
                <Button click={mutate} text='Register' Icon={IoLogIn} />
              </div>
        }
      </form>
      <IoReturnUpBack id='back' onClick={() => naviguate('/login')} />
    </div>
  )
}

export default Register