import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import Profile from "./pages/Profile";
import Unknown from "./pages/Unknown";
import ReadOnlyPosts from "./pages/ReadOnlyPosts";
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
