import {useState} from "react";
import {useEffect} from "react";
import TextInput from "./textInput";
import { initialiseAlerts, fetchBackend } from "../helpers";
import { AlertData, AlertMenu } from "./alert";
import { useNavigate } from "react-router-dom";
import Modal from "../components/modal";
import Button from "../components/button";

// type Questions = {
//   id: string,
//   question: string,
//   answer: string,
//   duration: number
// }

type Game = {
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number,
  createdAt: string,
  questions: string
}

type createGameFormProps = {
  closeForm: () => void;
  refreshGames: () => void;
};

export default function CreateGameForm({ closeForm, refreshGames }: createGameFormProps) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState("");
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [refresh, setRefresh] = useState(0);
  
  const [modal] = useState(true);

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


  async function createGame() {
    console.log("creating game");

    if (name === "") {
      createAlert("Name is empty!");
      return;
    }
    if (questions === "") {
      createAlert("Questions is empty!");
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      createAlert("Invalid token!");
      return;
    }
    const email = localStorage.getItem("email");
    if (!email) {
      createAlert("Invalid email!");
      return;
    }

    const newGame = {
      id: games.length + 1,
      name: name,
      thumbnail: "placeholder",
      owner: email,
      active: 0,
      createdAt: new Date().toISOString(),
      questions: questions
    }

    const updateGames = [...games, newGame];
    setGames(updateGames);

    const body = {
      games: updateGames
    }

    const response = await fetchBackend("PUT", "/admin/games", body, token);
    if (response.error) {
      createAlert(response.error);
    } else {
      createAlert("Created a game!");
      refreshGames();
    }

    closeForm();
  }

  return (<>
      {modal && (
        <Modal>
            <TextInput labelName="Name" id="game-name" type="text" set={setName} onEnter={createGame} />
            <TextInput labelName="Question" id="game-questions" type="text" set={setQuestions} onEnter={createGame} />
            <Button text="Submit" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={createGame}/>
            <Button text="Cancel" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={closeForm}/>
        </Modal>
      )}
    
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}
