import React, { useEffect, useState } from 'react';
import { BiLogOutCircle } from 'react-icons/bi';
import { IoReturnUpBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { Iclient } from '../interfaces/Clients';
import { getClient, removeClient } from '../localstorage/ClientStorage';
import '../styles/profile.css';
import { GiSittingDog } from 'react-icons/gi';
import axios from 'axios';
import { useQuery } from 'react-query';
import { async } from '@firebase/util';
import Loading from '../components/Loading';
import { Ipets } from '../interfaces/Pets';
import Pet from './Pet';
import { useDispatch } from 'react-redux';
import { setLog } from '../redux/logSlice';

const Profile = () => {
    const naviguate = useNavigate()
    const [client, setClientt] = useState(getClient as Iclient)
    useEffect(() => {
        !client.userName && naviguate('/')
    }, [])

    const dispatch = useDispatch()
    const logout = () => {
        dispatch(setLog({}))
        removeClient()
        naviguate('/')
    }

    const goToAdd = () => {
        naviguate('/add')
    }

    const [likedPets, setLikedPets] = useState<Array<Ipets>>([])
    const { isLoading, error, data } = useQuery('likedPets', async () => {
        const res = await axios.post('https://ani-maux.000webhostapp.com/apis/getPetsLikesByUser.api.php', JSON.stringify({ idUser: Number(client.id) }))
        return res;
    });

    useEffect(() => {
        !isLoading && setLikedPets(data?.data.userAnimauxLikes)
    }, [isLoading])


    const [myPets, setMyPets] = useState<Array<Ipets>>([])


    useEffect(() => {
        const getMyPets = async () => {
            const res = await axios.post('https://ani-maux.000webhostapp.com/apis/getUserAnimaux.api.php', JSON.stringify({ idUser: Number(client.id) }))
            setMyPets(res.data.userAnimaux)
        };
        getMyPets()

    }, [])

    return (
        <div className='profile'>
            <Loading display={isLoading ? 'flex' : 'none'} />
            <div>
                <IoReturnUpBack onClick={() => naviguate('/')} />
                <Button text='Logout' Icon={BiLogOutCircle} click={logout} />
            </div>

            <div className='settings'>
                <img alt='' src={client.photo} />
                <label>{client.FirstName} {client.LastName}</label>
                <code>{client.userName}</code>
            </div>

            <Button text='Add a pet' Icon={GiSittingDog} click={goToAdd} />
            {
                myPets.length > 0 ? <label>My pets</label>
                    : <label>You don't have pets</label>
            }
            <div className='col'>
                {
                    data && myPets?.map((pet) => {
                        return <Pet item={pet} key={pet.id} />
                    })
                }
            </div>
            {
                likedPets.length > 0 ? <label>liked pets</label>
                    : <label>No liked pets</label>
            }
            <div className='col'>
                {
                    data && likedPets?.map((pet) => {
                        return <Pet item={pet} key={pet.id} />
                    })
                }
            </div>

        </div>
    )
}

export default Profile