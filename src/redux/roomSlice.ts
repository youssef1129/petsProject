import { createSlice } from "@reduxjs/toolkit";



export const roomSlice = createSlice({
    name:'room',
    initialState:{room:'',img:'',username:'',phone:''},
    reducers:{
        setRoom:(state,action)=>{
            state.room = action.payload;
        }
    }
})


export const {setRoom}  = roomSlice.actions;

export default roomSlice.reducer;