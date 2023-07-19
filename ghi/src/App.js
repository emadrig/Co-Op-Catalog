import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/loginForm/LoginForm';
import MainPage from './components/mainPage/MainPage';
import NavBar from './components/nav/NavBar'
import PlayGamePage from './components/playGamePage/PlayGamePage';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from './store/userSlice';
import jwt_decode from 'jwt-decode'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoutes() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const token = useSelector(state => state.token)
  let user_id = null;
  let expiration = false


  if (token) {
    const decodedToken = jwt_decode(token)
    user_id = decodedToken.user_id
    if (decodedToken.exp * 1000 < Date.now()) {
      expiration = true
      console.log(expiration)
    }

  }

  useEffect(() => {
    if (!token || expiration) {
      navigate('/login');
    } else {
      fetch(`http://localhost:8000/api/accounts/${user_id}/`)
        .then(res => res.json())
        .then(data => {
          dispatch(setUser(data))
        })
    }
  }, [token, dispatch, navigate, user_id]);

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
