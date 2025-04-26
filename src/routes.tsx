// src/routes.tsx
import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Chat from "./pages/Chat";
import Calendar from "./pages/Calendar";
import Mypage from "./pages/Mypage";
import Avatar from "./pages/Avatar";
import EditProfile from "./pages/EditProfile";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Start />} />
    <Route path="/home" element={<Home />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/signin" element={<Signin />} />
    <Route path="/chat" element={<Chat />} />
    <Route path="/calendar" element={<Calendar />} />
    <Route path="/mypage" element={<Mypage />} />
    <Route path="/avatar" element={<Avatar />} />
    <Route path="/editprofile" element={<EditProfile />} />
  </Routes>
);

export default AppRoutes;
