import Modal from "../modal";
import { useContext, useEffect, useState } from "react";
import Button from "../buttons/button";
import { ALERT_SUCCESS, fetchBackend } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { Game, PastSessions, Question, StateSetter } from "../../types";
import IconButton from "../buttons/iconButton";
import { AlertContext } from "../../App";

function GameCardButtonMenu(props: { startGame: () => void, stopGame: () => void, currSession: number | null, gameId: number}) {
  const navigate = useNavigate();
  return (<div className="flex flex-col gap-3">
    {props.currSession === null  
      ? <Button text="Start game" color="bg-green-300" hoverColor="hover:bg-green-600 hover:text-white" onClick={props.startGame}/>
      : (<>
        <Button text="Manage session" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={() => navigate(`/session/${props.currSession}`)}/>
        <Button text="Stop game" color="bg-red-300" hoverColor="hover:bg-red-600 hover:text-white" onClick={(props.stopGame)}/>
      </>)}
    <Button text="View past sessions" color="bg-gray-300" hoverColor="hover:bg-gray-600 hover:text-white" onClick={() => navigate(`/pastResults/${props.gameId}`)}/>
  </div>);
}

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

  async function deleteGame() {
    openModal();

    const token = localStorage.getItem("token");
    if (!token) {
      createAlert("Invalid token!");
      return;
    }

    const updatedGames = props.games.filter(game => game.id !== props.gameId);
    const body = {
      games: updatedGames
    }
    console.log(body);

    const response = await fetchBackend("PUT", "/admin/games", body, token);
    if (response.error) {
      createAlert(response.error);
    } else {
      createAlert("Deleted a game!");
      props.setGamesLength(-1);
    }
    closeModal();
  }

  const calcTotalDuration = (questions: Question[]): number => {
    return questions.reduce((prev, curr) => prev + curr.duration, 0);
  }

  async function startGame() {
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "START"
    }
    const response = await fetchBackend("POST", `/admin/game/${props.gameId}/mutate`, body, token);
    if (response.error) {
      console.log(response.error);
      createAlert(response.error);
    } else {
      // By setting gamesLength to -1, triggers useEffect hook in adminGamesList which auto updates game list
      props.setGamesLength(-1);
      console.log("Done!");
      createAlert("Successfully started game!");
      setPlayGameModal(true);
    }
  }

  async function stopGame() {
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "END"
    }
    const response = await fetchBackend("POST", `/admin/game/${props.gameId}/mutate`, body, token);
    if (response.error) {
      console.log(response.error);
      createAlert(response.error);
    } else {
      // By setting gamesLength to +1, triggers useEffect hook in adminGamesList which auto updates game list
      props.setGamesLength(+1);
      console.log("Done!");
      createAlert("Successfully stoped game!");
      setStopGameModal(true);
    }
  }

  function copyToClipBoard() {
    navigator.clipboard.writeText(`${window.origin}/join?sessionId=${currSession}`); 
    createAlert("Successfully copied link!", ALERT_SUCCESS);
  }

  async function storeGame(seeResults: boolean) {
    const token = localStorage.getItem("token") as string;
    const response = await fetchBackend("GET", "/admin/games", undefined, token) as { games: Game[] };
    let sortedGames = response.games;
    console.log(response);
    if ("error" in response) {
      console.log(response.error);
    } else {
      sortedGames = response.games.toSorted((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
    }

    if (currSession == null) {
      console.log("Invalid session");
      createAlert("Invalid session");
      setStopGameModal(false);
      return;
    }

    const response2 = await fetchBackend("GET", `/admin/session/${currSession}/results`, undefined, token);
    if ("error" in response2) {
      console.log(response2.error);
      createAlert(response2.error);
      setStopGameModal(false);
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
    
    const response3 = await fetchBackend("PUT", "/admin/games", body, token);
    console.log("entered response.then")
    
    console.log(response3);
    if (response3.error) {
      console.log(response3.error);
      createAlert(response3.error);
    } else {
      createAlert("Stored an old game!");
      console.log(sortedGames);
    }
    
    if (seeResults) {
      navigate(`/session/${currSession}}/results`);
    } else {
      navigate("/dashboard")
    }
  }

  useEffect(() => {
    const game = props.games.find(game => game.id === props.gameId) as Game;
    setCurrSession(game.active);
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
            <IconButton className="w-5 h-auto hover:opacity-50" onClick={() => navigate(`/game/${props.gameId}`)} svg="src/assets/pencil.svg"/>
            <IconButton className="w-5 h-auto hover:opacity-50" onClick={openModal} svg="src/assets/trash.svg"/>
          </div>
        </div>
      </div>
      <GameCardButtonMenu startGame={startGame} stopGame={stopGame} currSession={currSession} gameId={props.gameId}/>
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
        <IconButton className="w-5 h-auto hover:opacity-50" onClick={copyToClipBoard} svg="src/assets/clipboard.svg"/>
      </div>
  
      <div className="flex flex-row gap-2">
        <Button text="Dismiss" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={() => setPlayGameModal(false)}/>
      </div>
    </Modal>
    <Modal visible={stopGameModal} setVisible={setStopGameModal}>
      <h2>Would you like to view the results?</h2>
      <div className="flex flex-row gap-2">
        <Button text="Yes" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => storeGame(true)}/>
        <Button text="No" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => storeGame(false)}/>
      </div>
    </Modal>
  </article>);
}