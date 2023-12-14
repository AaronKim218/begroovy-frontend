import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import ReadOnlyPosts from './pages/ReadOnlyPosts';
import Groups from './pages/Groups';
import ArtistGroup from './pages/ArtistGroup';
import Unknown from './pages/Unknown';
import { useSelector } from 'react-redux';

function App() {

  const user = useSelector(state => state.user);

  return (
    <BrowserRouter>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/posts" element={user._id !== '' ? <Posts /> : <ReadOnlyPosts />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/groups" element={<Groups />}/>
          <Route path="/groups/:id" element={<ArtistGroup />}/>
          <Route path="*" element={<Unknown />}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
