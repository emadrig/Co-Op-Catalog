import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/loginForm/LoginForm';
import MainPage from './components/mainPage/MainPage';
import NavBar from './components/nav/NavBar'
import PlayGamePage from './components/playGamePage/PlayGamePage';


function App() {

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