import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Unknown from './pages/Unknown';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/posts" element={<Posts />}/>
          <Route path="*" element={<Unknown />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
