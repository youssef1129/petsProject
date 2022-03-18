import React, { useEffect, useState } from 'react';
import '../styles/items.css';
import { Ipets } from '../interfaces/Pets';
import Button from '../components/Button';
import { TiArrowUnsorted } from 'react-icons/ti';
import { FaCat, FaDog, } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Radio from '../components/Radio';
import { IoReturnUpBack } from 'react-icons/io5';
import Pet from './Pet';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import axios from 'axios'
import { useQuery } from 'react-query';
import Loading from '../components/Loading';
import { Iclient } from '../interfaces/Clients';
import { getClient } from '../localstorage/ClientStorage';
import {GrClear} from 'react-icons/gr';
import { MdClear } from 'react-icons/md';

const Items = () => {

  const naviguate = useNavigate()
  const [client,setClient] = useState<Iclient>(getClient as Iclient)
  const [items, setItems] = useState<Array<Ipets>>([])
  const [backup, setBackup] = useState<Array<Ipets>>([])

  const {isLoading,error,data} = useQuery('pets',async()=>{
    const res =await axios.post('https://ani-maux.000webhostapp.com/apis/getAllAnimaux.api.php').catch(err=>console.log(err))
    return res
  })

  useEffect(()=>{    
    !isLoading && setItems(data?.data?.animaux.filter((x:Ipets)=>x.idUser!==client.id));    
    !isLoading && setBackup(data?.data?.animaux.filter((x:Ipets)=>x.idUser!==client.id));
  },[isLoading])

  const [minItems, setMinItems] = useState(0)
  const [maxItems, setMaxItems] = useState(20)

  const pagination = (num: number) => {
    setMinItems((prev) => prev = num - 20)
    setMaxItems((prev) => prev = num)
  }


  const [toggleFilter, setToggleFilter] = useState('hide')

  const [pet, setPet] = useState<Ipets>({ nbrLikes:0,description: '', gender: 'male', url: '', age: '', forSale: 'true' , id: 0, name: '', price: '10', race: '', type: 'cat' });


  const Sort = ()=>{
      const filtred = backup.filter((p)=>p.forSale===pet.forSale&&p.gender===pet.gender&&p.type===pet.type)
      setItems(filtred);
      
  }

  const clear = ()=>{
    setItems(backup);
  }

  return (
    <div className='cnt56'>
      <Loading display={isLoading?'flex':'none'}/>
      <Button text='Sort By' Icon={TiArrowUnsorted} click={() => setToggleFilter('show')} />

      <div className='items'>
        {
          items.slice(minItems, maxItems).map((item) => {
            return <Pet  key={item.id} item={item} />
          })
        }
      </div>


      <div className={`filter ${toggleFilter}`}>
        <IoReturnUpBack id='back2' onClick={() => setToggleFilter('hide')} />
        <Radio name='type' pet={pet} value={pet.type} setValue={setPet} obj={[{ value: 'cat', Icon: FaCat }, { value: 'dog', Icon: FaDog }]} />
        <Radio name='gender' pet={pet} value={pet.gender} setValue={setPet} obj={[{ value: 'female', Icon: IoMdFemale}, { value: 'male', Icon: IoMdMale }]} />
        <Radio name='forSale' pet={pet} value={pet.forSale} setValue={setPet} obj={[{ value: 'true', text: 'Sale' }, { value: 'false', text: 'Adoption' }]} />
        <Button text='SORT' Icon={TiArrowUnsorted} click={Sort} />
        <Button text='CLEAR' Icon={MdClear} click={clear} />
      </div>


      {
        items.length > 20 && <div className='cstmrgn'>
          {
            [...Array(Math.ceil(items.length / 20))].map((e, i) => {
              return <Button key={i} click={() => pagination(20 * (i + 1))} text={(i + 1).toString()} />
            })
          }
        </div>
      }
    </div>
  )
}

export default Items