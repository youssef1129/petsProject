import React, { FormEvent, useEffect, useState } from 'react'
import { IoReturnUpBack } from 'react-icons/io5';
import { RiSendPlaneLine } from 'react-icons/ri';
import { Outlet, useNavigate } from 'react-router-dom'
import Input from '../components/Input';
import '../styles/notif.css';
import * as io from "socket.io-client";
import { Imessage } from '../interfaces/Messages';
import { getClient } from '../localstorage/ClientStorage';
import { Iclient } from '../interfaces/Clients';
import { BsThreeDots } from 'react-icons/bs';
import { useQuery } from 'react-query'
import axios from 'axios';
import { IConv } from '../interfaces/Conversations';
import Loading from '../components/Loading';
import {RootStateOrAny, useDispatch,useSelector} from 'react-redux';
import { setRoom } from '../redux/roomSlice';
import { AiOutlinePhone } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

const socket = io.connect("https://serene-beyond-90059.herokuapp.com/");

const Notif = () => {
    const naviguate = useNavigate()
    const [client, setclient] = useState<Iclient>(getClient as Iclient)
    useEffect(() => {
        !client.id && naviguate('/')
    }, [])
    return (
        <div id='cnt312'>
            <IoReturnUpBack onClick={() => naviguate('/')} />
            <Chat />
            <Outlet />
        </div>
    )
}

export default Notif

export const Chat = () => {
    const [client, setClient] = useState<Iclient>(getClient as Iclient)
    const naviguate = useNavigate()
    const [conversations, setConversations] = useState<Array<IConv>>([])

    const { isLoading, error, data } = useQuery('convs', async () => {
        const body = JSON.stringify({ idUser: client.id })
        const res = await axios.post('https://ani-maux.000webhostapp.com/apis/getUserConversations.api.php', body)
        return res;
    })

    useEffect(() => {
        !isLoading && setConversations(data?.data?.userConversations)          
    }, [isLoading])

    const dispatch = useDispatch()

    const onClient = (room:string,img:string,username:string,phone:string) => {
        socket.emit("join", room);
        dispatch(setRoom({room:room,img:img,username:username,phone:phone}))
        naviguate('/notifications/'+room)
    }


    return <div className='chat'> 
        <Loading display={isLoading ? 'flex' : 'none'} />
        {
            conversations.length>0 ? conversations.map((c) => {
                return <div key={c.room} onClick={()=>onClient(c.room,c.userNameA==client.userName?c.photoB:c.photoA,c.userNameA==client.userName?c.userNameB:c.userNameA,c.userNameA==client.userName?c.phoneB:c.phoneA)}>
                    <img alt='' src={c.userNameA==client.userName?c.photoB:c.photoA} />
                    <label>{c.userNameA==client.userName?c.userNameB:c.userNameA}</label>
                </div>
            })
            : <label>No conversation yet</label>
        }


    </div>
}

export const Conversation = () => {
    const [client, setclient] = useState<Iclient>(getClient as Iclient)
    const [status, setStatus] = useState(false)
    const {room,img,username,phone} = useSelector((state:RootStateOrAny)=>state.room.room)
    const [message, setMessage] = useState<Imessage>({idUser : Number(client.id), message: '', date: '', room: room })
    const [messages, setMessages] = useState<Array<Imessage>>([])
    
    const send = async (e: FormEvent) => {
        e.preventDefault();
        await socket.emit("send", message);
        axios.post('https://ani-maux.000webhostapp.com/apis/addNewMessage.api.php',JSON.stringify(message))
        setMessages((prev) => [...prev, message]);
        setMessage({ ...message, message: "" });
    };

    useEffect(() => {
        socket.on('receive', (data) => {
            setMessages((prev) => [...prev, data])
        })
    }, [socket])

    useEffect(() => {
        socket.on('oninput', (data) => {
            setStatus(data.status)
        })
    }, [socket])

    useEffect(() => {
        const today = new Date();
        const timee = today.getHours() + ":" + today.getMinutes()
        setMessage({ ...message, date: timee })

    }, [message.message])

    useEffect(() => {
        const ss = document.getElementsByClassName('messages')[0];
        ss.scrollTo(0, ss.scrollHeight)
    }, [messages])

    useEffect(()=>{
        const getMessages = async()=>{
            const data = await axios.post('https://ani-maux.000webhostapp.com/apis/getConversationMessages.api.php',JSON.stringify({room:room}))
            setMessages(data.data.conversationMessages)
            
        }
        getMessages();
    },[room])

    const naviguate = useNavigate()
    const deleteConv = async()=>{
        const body = JSON.stringify({room:room})
        await axios.post('https://ani-maux.000webhostapp.com/apis/deleteConversation.api.php',body)
        naviguate('/notifications')
    }

    return <form className='conversation' onSubmit={send}>
        <div>
            <div>
                <img alt='' src={img} />
                <label>{username}</label>
            </div>   
            {status && <BsThreeDots id='typing' />}
            {/* <MdDelete onClick={deleteConv} className='deleteConv'/> */}
            <a href={`tel:${phone}`}><AiOutlinePhone/></a>
        </div>
        <div className='messages'>
            {
                messages.map((m) => {
                    return (<div className={`message ${m.idUser == client.id && 'me'}`} key={m.idMessage}>
                        {
                        m.idUser==client.id?
                        <img alt='' src={client.photo} />
                        :
                        <img alt='' src={img} />
                        }
                        <p>{m.message}</p>
                        <h6>{m.date}</h6>
                    </div>)
                })
            }
        </div>
        <div>
            <Input auto='off' socket={socket} name='message' click={send} placeholder='write message' Icon={RiSendPlaneLine} val={message} value={message.message} setVal={setMessage} />
        </div>
    </form>
}




