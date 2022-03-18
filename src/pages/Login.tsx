import React, { FormEvent, useState } from 'react'
import '../styles/login.css';
import pet from '../assets/pet.png';
import Input from '../components/Input';
import { MdAlternateEmail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import Button from '../components/Button';
import { FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IoLogIn } from 'react-icons/io5';
import { Iclient } from '../interfaces/Clients';
import { setClient } from '../localstorage/ClientStorage';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { useMutation } from 'react-query';
import Loading from '../components/Loading';


const Login = () => {
  const naviguate = useNavigate()
  const [client, setCLientt] = useState<Iclient>({email:'',role:"client",password:''})
  const [error, setIsError] = useState({})

 


  const login = async(e: FormEvent) => {
    e.preventDefault()
    const g = Object.values(error)
    
    if (g.length === 2 && g.every(x => x === true)) {
      setClient(client);
       await axios.post('https://ani-maux.000webhostapp.com/apis/Login.api.php',
      JSON.stringify(client))
      .then((d)=>{
        let user : any;
        let {data}:any= jwtDecode(d?.data.jwt_token);
        setClient(data)
        naviguate('/')
      })
           
    }
  }

  const {isLoading, isError, mutate} = useMutation(login, {retry: 3})

  const register = () => {
    naviguate('/register')
  }
  return (
    <div className='login'>
      <Loading display={isLoading?'flex':'none'}/>
      <div>
        <img src={pet} alt="" />
      </div>
      <form className='form' onSubmit={mutate}>
      {isError && <h6>invalid email or password</h6>}
      <Input setIsError={setIsError} name='email' regex={/\S+@\S+\.\S+/} min={10} max={40} type='email' placeholder='email' color='#73d377' Icon={MdAlternateEmail} setVal={setCLientt} val={client} value={client.email} />
      <Input setIsError={setIsError} name='password' regex={ /^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/} min={5} max={30} type='password' placeholder='password' color='rgb(255 20 20 / 80%)' Icon={RiLockPasswordLine} setVal={setCLientt} val={client} value={client.password} />
      <a onClick={()=>naviguate('/fpass')} >Forgot password?</a>
        <Button cls='solid' click={mutate} text='Login' Icon={FiLogIn} />
        <Button click={register} text='Register' Icon={IoLogIn} />
      </form>
    </div>
  )
}

export default Login