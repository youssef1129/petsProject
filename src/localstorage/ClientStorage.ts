import { Iclient } from "../interfaces/Clients";

export const getClient = ()=>{
    const client = JSON.parse(localStorage.getItem('client') || '{}');
    return client;
}

export const setClient = (client: Iclient)=>{
    localStorage.setItem('client',JSON.stringify(client));
}

export const removeClient = ()=>{
    localStorage.removeItem('client');
}