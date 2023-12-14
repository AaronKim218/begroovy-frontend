import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import NavBar from './components/NavBar/NavBar';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Posts from './Pages/Posts';
import Profile from './Pages/Profile';
import ReadOnlyPosts from './Pages/ReadOnlyPosts';
import Groups from './Pages/Groups';
import ArtistGroup from './Pages/ArtistGroup';
import Unknown from './Pages/Unknown';
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
