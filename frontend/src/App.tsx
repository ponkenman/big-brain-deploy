import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginScreen } from './pages/login.tsx';
import { DashboardScreen } from "./pages/dashboard.tsx";
import { RegisterScreen } from "./pages/register.tsx";
import { LoginRedirect } from "./pages/loginRedirect.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="login" element={<LoginScreen />}/>
        <Route path="register" element={<RegisterScreen />}/>
        <Route path="dashboard" element={<DashboardScreen />}/>
        <Route path="/" element={<LoginRedirect />} />
        <Route path="" element={<LoginRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
