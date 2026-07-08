import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import LayoutViewer from "./pages/LayoutViewer";
import { useAuthStore } from "./store/authStore";

const PrivateRoute = ({ children }) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  return accessToken ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects/new" element={<PrivateRoute><NewProject /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><LayoutViewer /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;