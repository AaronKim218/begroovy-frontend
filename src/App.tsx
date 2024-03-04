import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./appPages/Home";
import Login from "./appPages/Login";
import Register from "./appPages/Register";
import Posts from "./appPages/Posts";
import Profile from "./appPages/Profile";
import Unknown from "./appPages/Unknown";
import ReadOnlyPosts from "./appPages/ReadOnlyPosts";
import { useAppSelector } from "./hooks/use-redux";

function App() {
    const userState = useAppSelector((state) => state.user);

    return (
        <BrowserRouter>
            <NavBar />
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/posts"
                        element={userState.user ? <Posts /> : <ReadOnlyPosts />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Unknown />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
