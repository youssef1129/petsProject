import axios from 'axios'
import React, { FC, useEffect, useState } from 'react'
import { FaRegHeart } from 'react-icons/fa'
import { RiHeart3Fill, RiHeart3Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { Iclient } from '../interfaces/Clients'
import { Ipets } from '../interfaces/Pets'
import { getClient } from '../localstorage/ClientStorage'

interface props {
    item: Ipets;
}

const Pet: FC<props> = ({ item}) => {

    const [pet,setPet] = useState<Ipets>({...item})

    const naviguate = useNavigate()
    const goToPet = (id: Number) => {
        pet.idUser!== client.id && naviguate('/' + id);
    }

    const [client, setClient] = useState<Iclient>(getClient() as Iclient);

    useEffect(()=>{
        const getLikes = async()=>{
            if(client.id){
                const body = JSON.stringify({idPet:pet.id,idUser:client.id})
                const res = await axios.post('https://ani-maux.000webhostapp.com/apis/GetIdsPetsLikedByUser.api.php',body)
                const lks = res.data.userAnimauxLikesIds                
                if(lks.length>0){
                    lks.forEach((l:any)=>{
                        Number(l)==pet.id && setPet({...pet,liked:true})
                    })
                }
            }
        }

        getLikes();
       
    },[])

    const like = async () => {
        !client.id && naviguate('/login')
        const l = Number(pet.nbrLikes)+1
        setPet({...pet,liked:true,nbrLikes:l})
        const body = JSON.stringify({idPet:pet.id,idUser:client.id})
        await axios.post('https://ani-maux.000webhostapp.com/apis/addNewLike.api.php',body)

    }

    const dislike = async () => {
        !client.id && naviguate('/login')
        const l = Number(pet.nbrLikes)-1
        setPet({...pet,liked:false,nbrLikes:l})
        const body = JSON.stringify({idPet:pet.id,idUser:client.id})
        await axios.post('https://ani-maux.000webhostapp.com/apis/deleteLike.api.php',body)
    }

    return (
        <div className="pet">
            <img alt='' src={pet.url} onClick={() => goToPet(Number(pet.id))} />
            <label>{pet?.name}</label>

            {
                    pet.liked ?
                    <span id='dislike' onClick={dislike}>
                        <RiHeart3Fill />
                        <span>{pet.nbrLikes}</span>
                    </span>
                    :
                    <span id='like' onClick={like}>
                        <RiHeart3Line />
                        <span>{pet.nbrLikes}</span>
                    </span>
            }



        </div>
    )
}

export default Pet