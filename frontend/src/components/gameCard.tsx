import Modal from "../components/modal";
import {useState, useEffect} from "react";
import Button from "../components/button";
import { AlertData, AlertMenu } from "./alert";
import { initialiseAlerts, fetchBackend } from "../helpers";

type Game = {
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number,
  createdAt: string,
  questions: string
}

export default function GameCard(props: {title: string, numQuestions: number, totalDuration: number, id: number, refreshGames: () => void}) {
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);

    useEffect(() => {
      getGames();
    }, []);

  async function getGames() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await fetchBackend("GET", "/admin/games", undefined, token);
    if (response.error) {
      console.log(response.error);
    } else {
      setGames(response.games);
    }
  };

  async function deleteGame() {
    openModal();

    const token = localStorage.getItem("token");
    if (!token) {
      createAlert("Invalid token!");
      return;
    }

    console.log(props.id);
    const updatedGames = games.filter(game => game.id !== props.id);
    console.log(updatedGames);
    setGames(updatedGames);
    

    const body = {
      games: updatedGames
    }

    const response = await fetchBackend("PUT", "/admin/games", body, token);
    if (response.error) {
      createAlert(response.error);
    } else {
      console.log("deleting game");
      createAlert("Deleted a game!");
      props.refreshGames();
    }
  }

  return (<article>
    <p>{props.title}</p>
    <p>{props.numQuestions} Questions</p>
    <p>{props.totalDuration} seconds</p>
    <img src="" alt={`Thumbnail for ${props.title}`}></img>
    <Button text="Edit Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={openModal}/>
    <Button text="Delete Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={openModal}/>
    {modal && (
      <Modal>
        <h1>Delete this game</h1>
        <h2>Are you sure you want to delete this game?</h2>
        <Button text="Delete Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={deleteGame}/>
        <Button text="Cancel" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={closeModal}/>
      </Modal>
    )}
  </article>);
}