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
import { useNavigate } from 'react-router-dom';

function ProtectedRoutes() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const token = useSelector(state => state.token)
  const [userId, setUserId] = useState(null);
  const [expired, setExpired] = useState(false);


  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        setUserId(decodedToken.user_id);
        setExpired(decodedToken.exp * 1000 < Date.now());
      } catch (e) {
        console.error(e);
        setUserId(null);
        setExpired(true);
      }
    }
  }, [token])


  useEffect(() => {
    if (!token || expired) {
      navigate('/login');
    } else {
      if (userId) {
        fetch(`http://localhost:8000/api/accounts/${userId}/`)
          .then(res => res.json())
          .then(data => {
            dispatch(setUser(data))
          })
      }
    }
  }, [token, dispatch, navigate, userId, expired]);


  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path='/' element={<MainPage />} />
        <Route path='/play/:gameName/' element={<PlayGamePage />} />
        <Route path='/play/:gameName/:id/' element={<PlayGamePage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <ProtectedRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;