import Modal from "../components/modal";
import {useState, useEffect} from "react";
import Button from "../components/button";
import { AlertData, AlertMenu } from "./alert";
import { initialiseAlerts, fetchBackend } from "../helpers";
import EditGameForm from "../components/editGameForm";

type AnswersOptions = {
  text: string,
  correct: boolean
}

type Question = {
  id: number,
  type: string,
  media: string,
  question: string,
  answers: AnswersOptions[],
  duration: number
  points: number
}

type Game = {
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number,
  createdAt: string,
  questions: string
}

export default function GameCard(props: {title: string, questions: Question[], thumbnail: string, numQuestions: number, totalDuration: number, id: number, refreshGames: () => void}) {
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [showEditGameForm, setShowEditGameForm] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);

  useEffect(() => {
    getGames();
  }, [refresh]);

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

    const updatedGames = games.filter(game => game.id !== props.id);
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
    <Button text="Edit Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => setShowEditGameForm(true)}/>
    <Button text="Delete Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={openModal}/>
    {showEditGameForm && 
      <EditGameForm 
      title={props.title} 
      questions={props.questions} 
      thumbnail={props.thumbnail} 
      id={props.id} 
      closeForm={() => setShowEditGameForm(false)} 
      refreshGames={() => props.refreshGames()}
    />}
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