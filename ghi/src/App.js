import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/loginForm/LoginForm';
import MainPage from './components/mainPage/MainPage';
import NavBar from './components/nav/NavBar'
import PlayGamePage from './components/playGamePage/PlayGamePage';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from 'react';


function App() {
  const dispatch = useDispatch()
  const token = useSelector(state => state.token)
  const user_id = jwt_decode(token).user_id

  useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/accounts/${user_id}/`)
        .then(res => res.json())
        .then(data => {
          dispatch(setUser(data))
        })
  })


  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path='/' element={<MainPage />} />
          <Route path='/play/:gameName/' element={<PlayGamePage />} />
          <Route path='/play/:gameName/:id/' element={<PlayGamePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;