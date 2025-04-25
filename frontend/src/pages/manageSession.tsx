import { useContext, useEffect, useState } from "react";
import { ALERT_SUCCESS, fetchBackend } from "../helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { Game, PastSessions } from "../types";
import Modal from "../components/modals/modal";
import { AlertContext } from "../App";

/**
 * The function which contains all other functions, containing all relevant const to be shared across
 * 
 * @param props the passed in sessionId
 */
function ManageSession(props: {sessionId: string }) {
  const navigate = useNavigate();
  const [stopGameModal, setStopGameModal] = useState(false);
  const [position, setPosition] = useState(-1);
  const [numQuestions, setNumQuestions] = useState(0);
  const token = localStorage.getItem("token") as string;
  const createAlert = useContext(AlertContext);

  // Update current position, otherwise when switching between dashboard and manageSession, it will alway appear as -1 to start
  useEffect(() => {
    (fetchBackend("GET", `/admin/session/${props.sessionId}/status`, undefined, token)).then((data) => {
      // If error, create alert and do not set position
      if ("error" in data) {
        createAlert(data.error);
        return;
      }

      setPosition(data.results.position);
    });
  }, []);
  
  /**
   * This function advances the game, checking if it has reached the end
   */
  async function advanceGame() {
    // Get all games from backend
    (fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>).then((data) => {
      // If error when trying to advance an inactive game, create alert
      if ("error" in data) {
        createAlert("You've reached the end of the game!", ALERT_SUCCESS);
        setStopGameModal(true);
        return;
      }
    
      // Find current game
      const currentGame = data.games.filter(currGame => currGame.active === parseInt(props.sessionId));

      // If length is equal to zero, no active games, show stop game modal
      if (currentGame.length === 0) {
        createAlert("You've reached the end of the game!", ALERT_SUCCESS);
        setStopGameModal(true);
        return;
      } 

      setNumQuestions(currentGame[0].questions.length);
      localStorage.setItem("gameId", currentGame[0].id.toString());

      // Reached the end of game, show modal to view results or return to dashboard
      if (position === currentGame[0].questions.length) {
        createAlert("You've reached the end of the game!", ALERT_SUCCESS);
        setStopGameModal(true);
        return;
      } 

      const body = {
        mutationType: "ADVANCE"
      }
  
      // Advance game to next position 
      const mutateResponse = fetchBackend("POST", `/admin/game/${currentGame[0].id}/mutate`, body, token);
      mutateResponse.then(r => {
        setPosition(r.data.position);

        if (r.error) {
          createAlert(r.error);
        } else {
          createAlert("Successfully advanced game!", ALERT_SUCCESS);
        }
      })
    });

  }
  
  /**
   * This function stops a game
   */
  async function stopGame() {
    // Check if game has already ended (advanced to end and didn't proceed to results or dashboard)
    if (position === numQuestions) {
      createAlert("You've reached the end of the game!", ALERT_SUCCESS);
      setStopGameModal(true);
      return;
    }

    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "END"
    }
    
    // Stop game by getting all games and finding the correct game to stop
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const currentGame = data.games.filter(currGame => currGame.active === parseInt(props.sessionId));
      localStorage.setItem("gameId", currentGame[0].id.toString());

      // Stop game and show modal to redirect to results or dashboard
      const mutateResponse = fetchBackend("POST", `/admin/game/${currentGame[0].id}/mutate`, body, token);
      mutateResponse.then(r => {
        if (r.error) {
          createAlert(r.error);
        } else {
          createAlert("Successfully stoped game!", ALERT_SUCCESS);
          setStopGameModal(true);
        }
      });
    });
  }

  /**
   * This function stores a game, called regardless when see result or return to dashboard is clicked. Navigating
   * to results or dashboard depending on the parameters
   * 
   * @param seeResults - Boolean value if they want to navigate to results
   */
  async function storeGame(seeResults: boolean) {
    // Get all games from backend
    const response = await fetchBackend("GET", "/admin/games", undefined, token) as { games: Game[] };
    let sortedGames = response.games;

    // If getting games from backend was successfull, sort games by date otherwise create an alert for error
    if ("error" in response) {
      createAlert(response.error as string);
    } else {
      sortedGames = response.games.toSorted((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    }

    // Get session results
    const response2 = await fetchBackend("GET", `/admin/session/${parseInt(props.sessionId)}/results`, undefined, token);
    
    const pastSession: PastSessions = {
      pastSessionId: parseInt(props.sessionId),
      result: response2.results
    }
    
    // Find the correct game and push this session's results into that game's past sessions
    const gameId = JSON.parse(localStorage.getItem("gameId") as string);
    const gameIndex = sortedGames.findIndex(g => g.id === gameId);
    sortedGames[gameIndex].pastSessions.push(pastSession);

    const body = {
      games: sortedGames
    }
    
    // Store game
    const response3 = await fetchBackend("PUT", "/admin/games", body, token);

    // Create alert depending if adding past session to back end was successful or not
    if (response3.error) {
      createAlert(response3.error);
    } else {
      createAlert("Stored an old game!", ALERT_SUCCESS);
    }
    
    // Navigate to results page or dashboard depending on seeResults boolean
    if (seeResults) {
      navigate(`/session/${props.sessionId}/results`)
    } else {
      navigate("/dashboard")
    }
  }

  return (
    <form className="py-2">
      <h2 className="text-4xl font-semibold pb-7">Current position {position} </h2>
      {position === -1 ? (
        <h3 className="text-4xl font-semibold pb-7">The game has not started yet</h3>
      ) : position !== numQuestions ? (
        <h3 className="text-4xl font-semibold pb-7">Current Question: {position} </h3>
      ) : (
        <h3 className="text-4xl font-semibold pb-7">End Quiz</h3>
      )}

      <div className="flex flex-row gap-2 pt-3">
        <Button text="Advance game" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={advanceGame}/>
        <Button text="Stop game" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={stopGame}/>
        <Modal visible={stopGameModal} setVisible={setStopGameModal}>
          <h2>Would you like to view the results?</h2>
          <div className="flex flex-row gap-2 pt-3">
            <Button text="Yes" color="bg-pink-300" hoverColor="hover:bg-pink-400" onClick={() => {
              storeGame(true);
            }}/>
            <Button text="No" color="bg-pink-300" hoverColor="hover:bg-pink-400" onClick={() => {
              storeGame(false);
            }}/>
          </div>
        </Modal>
      </div>
    </form>
  )
}

/**
 * This function displays the manage session screen, everything from the dashboard to advance and stop game
 */
export function ManageSessionScreen() {
  const { sessionId } = useParams() as { sessionId: string };
  localStorage.setItem("sessionId", sessionId);

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-white p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Manage game session</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
      <ManageSession sessionId={sessionId} />
    </main>
  </>)
}