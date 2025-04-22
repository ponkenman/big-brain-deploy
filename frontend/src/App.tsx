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
import { PastResultsScreen } from "./pages/pastResults.tsx";
import { createContext, useState } from "react";
import { AlertData, AlertMenu } from "./components/alert.tsx";

export const AlertContext = createContext<(message: string, colour?: string) => void>(() => {});

function App() {
  // Create global alerts system between pages on website
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [alertCount, setAlertCount] = useState(0);
  function createAlert(message: string, colour?: string) {
    const newAlert: AlertData = {
      timestamp: Date.now(),
      message: message,
      key: alertCount,
      colour: colour ?? undefined
    }
    setAlerts(a => [...a, newAlert]);
    setAlertCount(c => c + 1);
  }

  return (
    <BrowserRouter>
      <AlertContext.Provider value={createAlert}>
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
          <Route path="/pastResults/:gameId" element={<PastResultsScreen/>}/>
          <Route path="/" element={<LoginRedirect />} />
          <Route path="" element={<LoginRedirect />} />
        </Routes>
      </AlertContext.Provider>
      <AlertMenu alerts={alerts} setAlerts={setAlerts} />
    </BrowserRouter>
  )
}

export default App;
