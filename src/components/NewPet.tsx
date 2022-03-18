import React, { FormEvent, useEffect, useState } from 'react'
import { MdAdd, MdMoneyOff, MdOutlinePets } from 'react-icons/md';
import { Ipets } from '../interfaces/Pets';
import Input from './Input';
import cat1 from '../assets/cat1.png';
import cat2 from '../assets/cat2.png';
import cat3 from '../assets/cat3.png';
import cat4 from '../assets/cat4.png';
import cat5 from '../assets/cat5.png';
import '../styles/newcat.css';
import Button from './Button';
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { IoReturnUpBack } from 'react-icons/io5';
import { FaCat, FaDog } from 'react-icons/fa';
import Radio from './Radio';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { getClient } from '../localstorage/ClientStorage';
import { Iclient } from '../interfaces/Clients';
import { BiImport } from 'react-icons/bi';
import File from './File';
import axios from 'axios';

const NewPet = () => {
    const naviguate = useNavigate()

    const [client, setClient] = useState<Iclient>(getClient() as Iclient);
    const [pet, setPet] = useState<Ipets>({ description: '', gender: 'male', url: '', age: '', forSale: 'false', name: '', price: '10', race: '', type: 'cat' });
    const [pos, setPos] = useState(1)
    useEffect(() => {
        !client?.userName && naviguate('/')
        setPet({...pet,idUser:Number(client.id)})
    }, [client])

    

    const prev = () => {
        pos > 1 && setPos(pos - 1)
    }

    const next = () => {
        pos < 5 && setPos(pos + 1)
    }
    const [error, setIsError] = useState({})

    const add = async(e: FormEvent) => {             
        e.preventDefault()
        
        const g = Object.values(error)    
        if (pet.url&&((g.length === 5 && pet.forSale==='true' || g.length === 5 && pet.forSale==='false') || (g.length===4 && pet.forSale==='false')) && g.every(x => x === true)) {
            console.log(pet);
            await axios.post('https://ani-maux.000webhostapp.com/apis/addNewAnimal.api.php',JSON.stringify(pet))
            .then(()=>naviguate('/profile'))
            .catch(err=>console.log(err))
            
        }
    }

    return (
        <div className='newcat'>
            <IoReturnUpBack onClick={() => naviguate('/profile')} />
            <form className='form' onSubmit={add}>
            <progress id="file" value={pos*20} max="100"></progress>
                {
                    pos === 1 ? (<div>
                        <img alt='' src={cat1} />
                        <Radio pet={pet} name='type' value={pet.type} setValue={setPet} obj={[{ value: 'cat', Icon: FaCat }, { value: 'dog', Icon: FaDog }]} />
                    </div>)


                        : pos === 2 ? (
                            <div>
                                <img alt='' src={cat2} />
                                <Input setIsError={setIsError} regex={/^[a-z]{2,30}$/igm} Icon={MdOutlinePets} min={2} max={30} placeholder='name' name='name' value={pet?.name} val={pet} setVal={setPet} />
                                <Input setIsError={setIsError} regex={/^[a-z]{2,30}$/igm} Icon={MdOutlinePets} min={2} max={30}  placeholder='race' name='race' value={pet?.race} val={pet} setVal={setPet} />
                                <Input setIsError={setIsError} regex={/^[a-z0-9]{1,30}$/igm} Icon={MdOutlinePets} min={1} max={30}  placeholder='age' name='age' value={pet?.age} val={pet} setVal={setPet} />
                                <Radio pet={pet} name='gender' value={pet.gender} setValue={setPet} obj={[{ value: 'female', Icon: IoMdFemale }, { value: 'male', Icon: IoMdMale }]} />
                            </div>)

                            : pos === 3 ? (<div>
                                <img alt='' src={cat3} />
                                <Input setIsError={setIsError} regex={/^[[0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`]+[0-9A-Za-z!@#$%&*()_\-+={[}\]|\:;"'<,>.?\/\\~`éàèç’ ]{10,500}$/igm} min={10} max={500}  istextarea={true} Icon={MdOutlinePets} placeholder='description' name='description' value={pet?.description} val={pet} setVal={setPet} />
                            </div>)

                                : pos === 4 ? (<div>
                                    <img alt='' src={cat4} />
                                    <Radio name='forSale' pet={pet} value={pet.forSale} setValue={setPet} obj={[{ value: "true", text: 'Sale' }, { value: "false", text: 'Adoption' }]} />
                                    {
                                        pet.forSale==='true' && <Input setIsError={setIsError} regex={/^[0-9]{1,8}$/igm} name='price' placeholder='price' Icon={MdMoneyOff} val={pet} value={pet?.price} setVal={setPet} />
                                    }
                                </div>)

                                    : (<div>
                                        <img alt='' src={cat5} />
                                        <label>Upload image</label>
                                        <File Icon={BiImport} setVal={setPet} val={pet} />
                                    </div>)
                }


                {
                  pet.url &&  <img src={pet.url} alt="" />}

                <div>
                    {pos !== 1 && <Button Icon={AiOutlineLeft} click={prev} />}
                    {pos !== 5 && <Button Icon={AiOutlineRight} click={next} />}
                    {pos === 5 && <Button Icon={MdAdd} click={add} />}
                </div>



            </form>
        </div>
    )
}

export default NewPet