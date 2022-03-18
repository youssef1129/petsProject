import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoReturnUpBack } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { Iclient } from '../interfaces/Clients';
import { Ipets } from '../interfaces/Pets';
import { getClient } from '../localstorage/ClientStorage';
import '../styles/item.css';
import Pet from './Pet';

const Item = () => {
  const naviguate = useNavigate()
  const param = useParams()
  const [client, setclient] = useState<Iclient>(getClient as Iclient)
  const obj = JSON.stringify({id:Number(param.id)})
  const [pet,setPet] = useState<Ipets>({description:'',gender:'',url:'',age:'',forSale:'',name:'',price:'',race:'',type:''});
  useEffect(()=>{
    const getData = async() =>{   
      
      const res = await axios.post('https://ani-maux.000webhostapp.com/apis/getAnimalWithId.api.php/',obj)
      setPet(res.data.animal[0])
   } 
    getData()
  },[useParams,param])

  const {isLoading,error,data} = useQuery('pet',async()=>{
    const res =await axios.post('https://ani-maux.000webhostapp.com/apis/getAnimalWithId.api.php/',obj)   
    return res
  })

  useEffect(()=>{  
    try{   
    !isLoading && setPet(data?.data.animal[0])  
    }catch(err){
      naviguate('/')
    }
  },[isLoading])

  const adopte= async()=>{
     const body = JSON.stringify({room:Number(client.id)+Number(pet.idUser),idUserA:client.id,idUserB:pet.idUser})
     await axios.post('https://ani-maux.000webhostapp.com/apis/addNewConversation.api.php',body)
     .then(()=>{
       naviguate('/notifications/')
     })
    }

  return (
    <div className='item'>
      <Loading display={isLoading?'flex':'none'}/>
      <IoReturnUpBack onClick={() => naviguate('/')} id='back44' />

    <div id='cnt33'>
      <img alt='' src={pet.url}/>
    <div className='petInfo'>
        <img alt='' src={pet.url} />
        <div>
          {pet?.forSale==='true' ?
            <Button click={adopte} text={`Buy ${pet.name} $${pet.price}`} />
            :
          <Button click={adopte} text={`Adopte ${pet.name}`} />
          }

        </div>
      </div>
    </div>
      

      <div className='bio'>
          <label>Gender : {pet?.gender}</label>
          <label>Age : {pet?.age}</label>
          <label>Race : {pet?.race}</label>
          <label>About :</label>
          <p>{pet?.description}</p>
      </div>

    <h1>You may also like</h1>
    <RandomPets/>
    

    </div>
  )
}

export default Item


export const RandomPets = ()=>{

  const [items, setItems] = useState<Array<Ipets>>([])
  const param = useParams()

  
  const {isLoading,error,data} = useQuery('pets',async()=>{
    const res =await axios.post('https://ani-maux.000webhostapp.com/apis/getAllAnimaux.api.php').catch(err=>console.log(err))
    return res
  })

  useEffect(()=>{    
    !isLoading && setItems(data?.data?.animaux.slice(0,3).sort(()=>Math.random()-0.5));    
  },[isLoading])

  return(
    <>
      <Loading display={isLoading?'flex':'none'}/>
      <div className='random'>
        {
          items.length>0 && items.map((item)=>{
            return <Pet key={item.id} item={item} />
          })
        }
      </div>
    </>
    
  )
}