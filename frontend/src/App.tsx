import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginScreen } from './pages/login.tsx';
import { DashboardScreen } from "./pages/dashboard.tsx";
import { RegisterScreen } from "./pages/register.tsx";
import { LoginRedirect } from "./pages/loginRedirect.tsx";
import { EditGameScreen } from "./pages/editGame.tsx";
import { EditQuestionScreen } from "./pages/editQuestion.tsx";
import { JoinGameScreen } from "./pages/joinGame.tsx";
import { PlayGameScreen } from "./pages/playGame.tsx";
import { ManageSessionScreen } from "./pages/manageSession.tsx";
import { ResultsScreen } from "./pages/results.tsx";
import { PlayerResultsScreen } from "./pages/playerResult.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="login" element={<LoginScreen />}/>
        <Route path="register" element={<RegisterScreen />}/>
        <Route path="join" element={<JoinGameScreen />}/>
        <Route path="play" element={<PlayGameScreen />}/>
        <Route path="dashboard" element={<DashboardScreen />}/>
        <Route path="game/:gameId/question/:questionId" element={<EditQuestionScreen />}/>
        <Route path="game/:gameId" element={<EditGameScreen />}/>
        <Route path="session/:sessionId" element={<ManageSessionScreen/>}/>
        <Route path="session/:sessionId/results" element={<ResultsScreen/>}/>
        <Route path="play/:playerId/results" element={<PlayerResultsScreen/>}/>
        <Route path="/" element={<LoginRedirect />} />
        <Route path="" element={<LoginRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
