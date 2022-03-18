import { createSlice } from "@reduxjs/toolkit";
import {getClient} from '../localstorage/ClientStorage';

export const logSlice = createSlice({
    name:'log',
    initialState:{value:{}},
    reducers:{
        setLog : (state,action)=>{
            state.value = action.payload;
        }
    }
})


export const {setLog} = logSlice.actions;

export default logSlice.reducer;
