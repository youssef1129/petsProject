import React, { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NewPet from './components/NewPet';
import Home from './pages/Home';
import Item from './pages/Item';
import Items from './pages/Items';
import Login from './pages/Login';
import Notif, { Conversation } from './pages/Notif';
import Profile from './pages/Profile';
import Register from './pages/Register';

import { Iclient } from './interfaces/Clients';
import { getClient } from './localstorage/ClientStorage';
import Fpass from './pages/Fpass';


function App() {
  const theme = useSelector((state: RootStateOrAny)=>state.theme.value)

  return (
    <div className={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}>
            <Route path='' element={<Items />} />
            <Route path=':id' element={<Item />} />
            <Route path='profile' element={<Profile/>} />
            <Route />
          </Route>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='add' element={<NewPet/>} />
          <Route path='notifications' element={<Notif/>} >
            <Route path=':convid' element={<Conversation/>} />
          </Route>
          <Route path='fpass' element={<Fpass/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
