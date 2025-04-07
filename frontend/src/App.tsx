import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from './pages/login.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index={true} path="login" element={<HomePage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
