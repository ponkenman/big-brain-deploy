import {useState} from "react";
import {useEffect} from "react";
import TextInput from "./textInput";
import { initialiseAlerts, fetchBackend } from "../helpers";
import { AlertData, AlertMenu } from "./alert";
import Modal from "../components/modal";
import Button from "../components/button";
import Questions from "./questions";

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
  questions: Question[]
}

type createGameFormProps = {
  closeForm: () => void;
  refreshGames: () => void;
};

export default function CreateGameForm({ closeForm, refreshGames }: createGameFormProps) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  
  const [modal] = useState(true);

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

  async function createGame() {
    if (name === "") {
      createAlert("Name is empty!");
      return;
    }
    console.log(questions);
    if (questions.length === 0) {
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
      thumbnail: thumbnail,
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
            <TextInput labelName="Game Name" id="game-name" type="text" set={setName} onEnter={createGame} />
            <TextInput labelName="Game Thumbnail" id="game-thumnail" type="text" set={setThumbnail} onEnter={createGame} />
            <Questions labelName="Questions" id="game-questions" questions={questions} set={setQuestions} onEnter={createGame} />
            <Button text="Submit" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={createGame}/>
            <Button text="Cancel" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={closeForm}/>
        </Modal>
      )}
    
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}
