import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { LoginScreen } from './pages/login.tsx'
import { DashboardScreen } from './pages/dashboard.tsx'
import { RegisterScreen } from './pages/register.tsx'
import { LoginRedirect } from './pages/loginRedirect.tsx'
import { EditGameScreen } from './pages/editGame.tsx'
import { EditQuestionScreen } from './pages/editQuestion.tsx'
import { JoinGameScreen } from './pages/joinGame.tsx'
import { PlayGameScreen } from './pages/playGame.tsx'
import { ManageSessionScreen } from './pages/manageSession.tsx'
import { ResultsScreen } from './pages/results.tsx'
import { PlayerResultsScreen } from './pages/playerResult.tsx'
import { PastResultsScreen } from './pages/pastResults.tsx'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { AlertData, AlertMenu } from './components/alert.tsx'

export const AlertContext = createContext<(message: string, colour?: string) => void>(() => {})

/** Wrapper which protects route if user does not have token */
function PrivateRoute(props: { children: ReactNode }) {
  const navigate = useNavigate()
  const createAlert = useContext(AlertContext)

  // Prevent from running twice in debug mode
  let errorRendered = false
  useEffect(() => {
    if (localStorage.getItem('token') === null && !errorRendered) {
      errorRendered = true
      createAlert('You are not logged in!')
      navigate(`/login`)
    }
  }, [])
  return (props.children)
}

/**
 * This function handles createAlert logic and redirecting to pages
 *
 * @returns
 */
function App() {
  // Create global alerts system between pages on website
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [alertCount, setAlertCount] = useState(0)
  function createAlert(message: string, colour?: string) {
    const newAlert: AlertData = {
      timestamp: Date.now(),
      message: message,
      key: alertCount,
      colour: colour ?? undefined,
    }
    setAlertCount(c => c + 1)
    setAlerts(a => [...a, newAlert])
  }

  return (
    <BrowserRouter>
      <AlertContext.Provider value={createAlert}>
        <Routes>
          <Route index path="login" element={<LoginScreen />} />
          <Route path="register" element={<RegisterScreen />} />
          <Route path="join" element={<JoinGameScreen />} />
          <Route path="play" element={<PlayGameScreen />} />
          <Route path="play/:playerId/results" element={<PlayerResultsScreen />} />
          <Route path="/pastResults/:gameId" element={<PastResultsScreen />} />
          {/** Private routes */}
          <Route
            path="dashboard"
            element={(
              <PrivateRoute>
                <DashboardScreen />
              </PrivateRoute>
            )}
          />
          <Route
            path="game/:gameId/question/:questionId"
            element={(
              <PrivateRoute>
                <EditQuestionScreen />
              </PrivateRoute>
            )}
          />
          <Route
            path="game/:gameId"
            element={(
              <PrivateRoute>
                <EditGameScreen />
              </PrivateRoute>
            )}
          />
          <Route
            path="session/:sessionId"
            element={(
              <PrivateRoute>
                <ManageSessionScreen />
              </PrivateRoute>
            )}
          />
          <Route
            path="session/:sessionId/results"
            element={(
              <PrivateRoute>
                <ResultsScreen />
              </PrivateRoute>
            )}
          />
          <Route path="/" element={<LoginRedirect />} />
          <Route path="" element={<LoginRedirect />} />
        </Routes>
      </AlertContext.Provider>
      <AlertMenu alerts={alerts} setAlerts={setAlerts} />
    </BrowserRouter>
  )
}

export default App
