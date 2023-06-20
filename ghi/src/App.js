import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm';
import MainPage from './components/mainPage/MainPage';
import NavBar from './components/nav/NavBar'


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='' element={<MainPage />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
