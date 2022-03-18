import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { FiLogIn } from 'react-icons/fi';
import Button from '../components/Button';
import { FaSlackHash } from 'react-icons/fa';
import { MdOutlineDarkMode } from 'react-icons/md';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { changeTheme } from '../redux/themeSlice';
import Countdown from 'react-countdown';
import { CgProfile } from 'react-icons/cg';
import { getClient } from '../localstorage/ClientStorage';
import { Iclient } from '../interfaces/Clients';
import Draggable from 'react-draggable';
import { MdPets } from 'react-icons/md'
import { IoNotificationsOutline } from 'react-icons/io5';
import { setLog } from '../redux/logSlice';
import axios from 'axios';


const Home = () => {
  const naviguate = useNavigate()

  
  const login = () => {
    naviguate('login')
  }
  const [trans, setTrans] = useState('translateY(-200%)');

  const toggleMenu = () => {
    trans === 'translateY(0)'
      ?
      setTrans('translateY(-200%)')
      :
      setTrans('translateY(0)')
  }

  const dispatch = useDispatch()
  const theme = useSelector((state: RootStateOrAny) => state.theme.value)

  const toggleTheme = () => {
    theme === 'dark' ?
      dispatch(changeTheme('light'))
      :
      dispatch(changeTheme('dark'))
  }

  const goHome = () => {
    naviguate('/')
  }

  const [client, setClientt] = useState(getClient() as Iclient)

  const cl = useSelector((state:RootStateOrAny)=>state.log.value)

  useEffect(()=>{
    client.id && dispatch(setLog(client))
  },[client])
  
  const [not,setNot] = useState(0)

  useEffect(()=>{
    const getNot = async()=>{
      const body = JSON.stringify({idUser:client.id})
      const res = await axios.post('https://ani-maux.000webhostapp.com/apis/getCountUserConversations.api.php',body)
     setNot(res.data.nombreConversations[0].nbrConversations)
    }

    client.id && getNot()
  },[])


  const [display, setDisplay] = useState(true)

  const goProfile = () => {
    naviguate('/profile')
  }

  const goToNotif = () => {
    naviguate('/notifications')
  }


  return (
    <div className='home'>


      <aside>
        <Draggable axis='y'>
          <div className='sidebar' onMouseOver={() => setDisplay(false)} onMouseLeave={() => setDisplay(true)}>


            <span onClick={goToNotif}>
              <span className='notifcount'>{not}</span>
              <Button Icon={IoNotificationsOutline} text={!display ? 'Requests' : ''} />
            </span>
            <Button Icon={MdOutlineDarkMode} click={toggleTheme} text={!display ? 'theme' : ''} />

            {cl.id===null ||cl.id===undefined ?
              <Button Icon={FiLogIn} click={login} text={!display ? 'Login' : ''} />
              :
              <Button Icon={CgProfile} click={goProfile} text={!display ? 'Profile' : ''} />
            }


          </div>
        </Draggable>
      </aside>


      <nav>
        <span id='title'>
          <MdPets id='mainlogo' onClick={goHome} />
          <h2>Ipet</h2>
        </span>
        <h1>EXTRA 50% OFF ENDS IN <Countdown date={Date.now() + 10000000} /> </h1>
        <span className='notif' onClick={goToNotif}>
          <IoNotificationsOutline />
          <span className='notifcount'>{not}</span>
        </span>
        <span id='menu' onClick={toggleMenu}>
          <FaSlackHash />
          <div id='submenu' style={{ transform: trans }}>


            {cl.id===null ||cl.id===undefined ? <Button click={login} text='login' Icon={FiLogIn} />
              : <CgProfile onClick={goProfile} />}

            <MdOutlineDarkMode onClick={toggleTheme} />
          </div>
        </span>
      </nav>

      <Outlet />

      <footer>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d188.88684854453112!2d-73.9857467064201!3d40.7578549472204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sfr!2sma!4v1646602994900!5m2!1sfr!2sma" width="400px" height="300px" loading="lazy"></iframe>
        <label><a>Privacy Policy</a> | <a>Terms of Use</a> | <a>Sales and Refunds</a> | <a>Legal</a> | <a>Site Map</a></label>
        <label>Copyright © 2022 pets Inc. All rights reserved.</label>
      </footer>

    </div>
  )
}

export default Home