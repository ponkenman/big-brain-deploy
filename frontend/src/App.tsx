import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginScreen } from './pages/login.tsx';
import { DashboardScreen } from "./pages/dashboard.tsx";
import { RegisterScreen } from "./pages/register.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index={true} path="login" element={<LoginScreen />}/>
          <Route path="register" element={<RegisterScreen />}/>
          <Route path="dashboard" element={<DashboardScreen />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
