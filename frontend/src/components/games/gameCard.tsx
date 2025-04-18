import Modal from "../modal";
import { useEffect, useState } from "react";
import Button from "../buttons/button";
import { fetchBackend } from "../../helpers";
import { useNavigate } from "react-router-dom";
import { AlertFunc, Game, Question, StateSetter } from "../../types";

export default function GameCard(props: { createAlert: AlertFunc, games: Game[], setGamesLength: StateSetter<number>, gameId: number }) {
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const navigate = useNavigate();
  const game = props.games.find(game => game.id === props.gameId) as Game;
  const [currSession, setCurrSession] = useState<number|null>(game.active);
  const [playGameModal, setPlayGameModal] = useState(false);
  const [stopGameModal, setStopGameModal] = useState(false);

  async function deleteGame() {
    openModal();

    const token = localStorage.getItem("token");
    if (!token) {
      props.createAlert("Invalid token!");
      return;
    }

    const updatedGames = props.games.filter(game => game.id !== props.gameId);
    const body = {
      games: updatedGames
    }
    console.log(body);

    const response = await fetchBackend("PUT", "/admin/games", body, token);
    if (response.error) {
      props.createAlert(response.error);
    } else {
      props.createAlert("Deleted a game!");
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
      props.createAlert(response.error);
    } else {
      // By setting gamesLength to -1, triggers useEffect hook in adminGamesList which auto updates game list
      props.setGamesLength(-1);
      console.log("Done!");
      props.createAlert("Successfully started game!");
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
      props.createAlert(response.error);
    } else {
      // By setting gamesLength to +1, triggers useEffect hook in adminGamesList which auto updates game list
      props.setGamesLength(+1);
      console.log("Done!");
      props.createAlert("Successfully stoped game!");
      setStopGameModal(true);
    }
  }

  useEffect(() => {
    const game = props.games.find(game => game.id === props.gameId) as Game;
    setCurrSession(game.active);
  }, [props.games]);

  return (<article className="p-5 rounded-lg bg-indigo-200 h-85">
    <p className="font-semibold">{game.name}</p>
    <p>{game.questions ? game.questions.length : "0"} Questions</p>
    <p>{game.questions ? calcTotalDuration(game.questions) : "0"} seconds</p>
    <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-indigo-400 bg-indigo-300 my-4">
      <img src={game.thumbnail == "" ? "src/assets/default-game-icon.png" : game.thumbnail} alt={`Thumbnail for ${game.name}`} className="object-cover object-center h-40 w-auto" />
    </div>
    <div className="flex flex-row gap-2">
      {currSession === null  
        ? <Button text="Start game" color="bg-emerald-200" hoverColor="hover:bg-emerald-400" onClick={startGame}/>
        : (<>
          <Button text="Manage session" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => navigate(`/session/${currSession}`)}/>
          <Button text="Stop game" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={stopGame}/>
        </>)}
      <Button text="Edit" color="bg-gray-200" hoverColor="hover:bg-gray-400" onClick={() => navigate(`/game/${props.gameId}`)}/>
      <Button text="Delete" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={openModal}/>
    </div>
    {modal && (
      <Modal>
        <h1>Delete this game</h1>
        <h2>Are you sure you want to delete this game?</h2>
        <div className="flex flex-row gap-2">
          <Button text="Delete Game" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={deleteGame}/>
          <Button text="Cancel" color="bg-gray-200" hoverColor="hover:bg-gray-400" onClick={closeModal}/>
        </div>
      </Modal>
    )}
    {playGameModal && (
      <Modal>
        <h1>Game session link</h1>
        <h2>Copy the link below and share it to invite users to join the game!</h2>
        <p>{`${window.origin}/join?sessionId=${currSession}`}</p>
        <Button text="Dismiss" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => setPlayGameModal(false)}/>
      </Modal>
    )}
    {stopGameModal && (
      <Modal>
        <h2>Would you like to view the results?</h2>
        <div className="flex flex-row gap-2">
          <Button text="Yes" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => setStopGameModal(false)}/>
          <Button text="No" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => setStopGameModal(false)}/>
        </div>
      </Modal>
    )}
  </article>);
}