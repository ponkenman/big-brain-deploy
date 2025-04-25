import Modal from "../modals/modal";
import { useContext, useEffect, useState } from "react";
import Button from "../buttons/button";
import { ALERT_SUCCESS, fetchBackend } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { Game, PastSessions, Question, StateSetter } from "../../types";
import IconButton from "../buttons/iconButton";
import { AlertContext } from "../../App";

/**
 * This function returns a button of menu's depending on if the current session is active or not
 * 
 * @param props.startGame - The function called to start a game
 * @param props.stopGame - The function called to stop a game
 * @param props.currSession - The currents session id
 * @param props.gameId - The current game id
 */
function GameCardButtonMenu(props: { startGame: () => void, stopGame: () => void, currSession: number | null, inactive: boolean, gameId: number}) {
  const navigate = useNavigate();
  return (<div className="flex flex-col gap-3">
    {props.inactive
      ? <Button text="Start game" color="bg-green-300" hoverColor="hover:bg-green-600 hover:text-white" onClick={props.startGame}/>
      : (<>
        <Button text="Manage session" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={() => navigate(`/session/${props.currSession}`)}/>
        <Button text="Stop game" color="bg-red-300" hoverColor="hover:bg-red-600 hover:text-white" onClick={(props.stopGame)}/>
      </>)}
    <Button text="View past sessions" color="bg-gray-300" hoverColor="hover:bg-gray-600 hover:text-white" onClick={() => navigate(`/pastResults/${props.gameId}`)}/>
  </div>);
}

/**
 * This function displays the game on dashboard, showing the quiz name, amount of questions, total length and all other interactions.
 * 
 * @param props.games - The current games
 * @param props.setGamesLength - The function called to set games length
 * @param props.gameId - The current game id
 */
export default function GameCard(props: { games: Game[], setGamesLength: StateSetter<number>, gameId: number }) {
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const navigate = useNavigate();
  const game = props.games.find(game => game.id === props.gameId) as Game;
  const [currSession, setCurrSession] = useState<number|null>(game.active);
  const [playGameModal, setPlayGameModal] = useState(false);
  const [stopGameModal, setStopGameModal] = useState(false);
  const createAlert = useContext(AlertContext);
  const [inactive, setInactive] = useState(true);

  // This function deletes the selected game
  async function deleteGame() {
    openModal();

    // Check if token is valid and user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      createAlert("Invalid token!");
      return;
    }

    const updatedGames = props.games.filter(game => game.id !== props.gameId);
    const body = {
      games: updatedGames
    }
    
    // Update modified games list
    const response = await fetchBackend("PUT", "/admin/games", body, token);
    if (response.error) {
      createAlert(response.error);
    } else {
      createAlert("Sucessfully deleted a game!", ALERT_SUCCESS);
      
      // Update gamesLength to update games list in adminGamesList
      props.setGamesLength(-1);
    }
  
    closeModal();
  }

  // Calculate total duration of a game
  const calcTotalDuration = (questions: Question[]): number => {
    return questions.reduce((prev, curr) => prev + curr.duration, 0);
  }

  // Start a game
  async function startGame() {
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "START"
    }
    
    const response = await fetchBackend("POST", `/admin/game/${props.gameId}/mutate`, body, token);
    if (response.error) {
      createAlert(response.error);
    } else {
      // By setting gamesLength to -1, triggers useEffect hook in adminGamesList which auto updates game list
      props.setGamesLength(-1);
      createAlert("Successfully started game!", ALERT_SUCCESS);
      setPlayGameModal(true);
    }
  }

  // Stop a game
  async function stopGame() {
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "END"
    }

    const response = await fetchBackend("POST", `/admin/game/${props.gameId}/mutate`, body, token);
    if (response.error) {
      createAlert(response.error);
    } else {
      // By setting gamesLength to -1, triggers useEffect hook in adminGamesList which auto updates game list
      props.setGamesLength(-1);
      createAlert("Successfully stopped game!", ALERT_SUCCESS);
      setStopGameModal(true);
    }
  }

  // Copy join game link to clipboard
  function copyToClipBoard() {
    navigator.clipboard.writeText(`${window.origin}/join?sessionId=${currSession}`); 
    createAlert("Successfully copied link!", ALERT_SUCCESS);
  }

  // Store game in past sessions
  async function storeGame(seeResults: boolean) {
    const token = localStorage.getItem("token") as string;
    const response = await fetchBackend("GET", "/admin/games", undefined, token) as { games: Game[] };
    let sortedGames = response.games;
    
    // If no eror, sort games in order of creation
    if ("error" in response) {
      createAlert(response.error as string);
    } else {
      sortedGames = response.games.toSorted((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    }

    if (currSession == null) {
      createAlert("Invalid session");
      setStopGameModal(true);
      return;
    }

    // If error when getting results, session has already ended
    const response2 = await fetchBackend("GET", `/admin/session/${currSession}/results`, undefined, token);
    if ("error" in response2) {
      createAlert(response2.error);
      setStopGameModal(true);
      return;
    }
    
    const pastSession: PastSessions = {
      pastSessionId: currSession,
      result: response2.results
    }
    
    const gameIndex = sortedGames.findIndex(g => g.id === props.gameId);
    sortedGames[gameIndex].pastSessions.push(pastSession);
    console.log(sortedGames);

    const body = {
      games: sortedGames
    }
    
    // Create alert based on the response of storing the game
    const response3 = await fetchBackend("PUT", "/admin/games", body, token);
    if (response3.error) {
      createAlert(response3.error);
    } else {
      createAlert("Stored an old game!", ALERT_SUCCESS);
    }

    // By setting gamesLength to -1, triggers useEffect hook in adminGamesList which auto updates game list
    props.setGamesLength(-1);
    
    // Navigate to results page if seeResults is true, otherwise just close modal and remain on dashboard
    if (seeResults) {
      navigate(`/session/${currSession}/results`);
    } else {
      setStopGameModal(false);
    }
    // Make sure current session is stopped
    setCurrSession(null);
  }

  // Set current session status to game's active status everytime props.games changes
  useEffect(() => {
    const game = props.games.find(game => game.id === props.gameId) as Game;
    if (game.active === null) {
      setInactive(true);
    } else {
      setInactive(false);
      setCurrSession(game.active);
    }
  }, [props.games]);

  return (<article className="rounded-lg bg-white border border-gray-400 h-auto overflow-hidden shadow-lg">
    <div className="flex flex-row justify-center bg-pink-200 shadow-md">
      <img src={game.thumbnail == "" ? "src/assets/default-game-icon.png" : game.thumbnail} alt={`Thumbnail for ${game.name}`} className="object-cover object-center w-auto md:h-50" />
    </div>
    <div className="p-5">
      <div className="mb-5">
        <div className="flex flex-row justify-between">
          <div>
            <p className="font-semibold">{game.name} {currSession && <span className="ml-1 p-1 border border-green-600 text-green-600 text-center rounded-lg text-xs align-[1px]">Active</span>}</p>
            <p>{game.questions ? game.questions.length : "0"} Questions</p>
            <p>{game.questions ? calcTotalDuration(game.questions) : "0"} seconds</p>
          </div>
          <div className="flex flex-col gap-2">
            <IconButton ariaLabel="Edit game" alt="Edit game" className="w-5 h-auto hover:opacity-50" onClick={() => navigate(`/game/${props.gameId}`)} svg="src/assets/pencil.svg"/>
            <IconButton ariaLabel="Delete game" alt="Delete game" className="w-5 h-auto hover:opacity-50" onClick={openModal} svg="src/assets/trash.svg"/>
          </div>
        </div>
      </div>
      <GameCardButtonMenu startGame={startGame} stopGame={stopGame} currSession={currSession} inactive={inactive} gameId={props.gameId}/>
    </div>
    <Modal visible={modal} setVisible={setModal}>
      <p className="font-semibold">Confirm delete</p>
      <p>Are you sure you want to delete this game?</p>
      <div className="flex flex-row gap-2 pt-4">
        <Button text="Delete" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={deleteGame}/>
        <Button text="Cancel" color="bg-gray-200" hoverColor="hover:bg-gray-400" onClick={closeModal}/>
      </div>
    </Modal>

    <Modal visible={playGameModal} setVisible={setPlayGameModal}>
      <p className="font-semibold">Game session link</p>
      <p>Copy the link below and share it to invite users to join the game!</p>
      <div className="py-2 px-1 my-2 border border-black rounded-lg flex flex-row justify-between">
        <p className="font-semibold">{`${window.origin}/join?sessionId=${currSession}`}</p>
        <IconButton ariaLabel="Copy link" alt="Copy link" className="w-5 h-auto hover:opacity-50" onClick={copyToClipBoard} svg="src/assets/clipboard.svg"/>
      </div>
  
      <div className="flex flex-row gap-2">
        <Button text="Dismiss" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={() => setPlayGameModal(false)}/>
      </div>
    </Modal>
    <Modal visible={stopGameModal} setVisible={setStopGameModal}>
      <h2>Would you like to view the results?</h2>
      <div className="flex flex-row gap-2">
        <Button text="Yes" color="bg-pink-300" hoverColor="hover:bg-pink-400" onClick={() => storeGame(true)}/>
        <Button text="No" color="bg-pink-300" hoverColor="hover:bg-pink-400" onClick={() => storeGame(false)}/>
      </div>
    </Modal>
  </article>);
}