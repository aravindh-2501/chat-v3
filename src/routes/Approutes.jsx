import { Navigate, Route, Routes } from "react-router-dom";
import Register from "../auth/Register";
import Login from "../auth/Login";
import Chat from "../pages/chat";
import { useUserStore } from "../store/userStore";
import { Profile } from "../pages/profile";

const AppRoutes = () => {
  const user = useUserStore((state) => state.currentUser);

  return (
    <Routes>
      <Route path="/" element={user ? <Chat /> : <Navigate to="/login" />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};
export default AppRoutes;
