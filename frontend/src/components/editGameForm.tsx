import {useState} from "react";
import {useEffect} from "react";
import { initialiseAlerts, fetchBackend } from "../helpers";
import { AlertData, AlertMenu } from "./alert";
import Modal from "../components/modal";
import Button from "../components/button";
import TextBox from "../components/textBox";
import Questions from "../components/questions"

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

export default function EditGameForm(props: {title: string, questions: Question[], thumbnail: string, id: number, closeForm: () => void, refreshGames: () => void}) {
  const [name, setName] = useState(props.title);
  const [questions, setQuestions] = useState<Question[]>(props.questions);
  const [thumbnail, setThumbnail] = useState(props.thumbnail);
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [refresh] = useState(0);
  
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

  async function editGame() {
    if (name === "") {
      createAlert("Name is empty!");
      return;
    }
    if (questions.length === 0) {
      createAlert("Questions is empty!");
      return;
    }
    if (thumbnail === "") {
      createAlert("thumbnail is empty!");
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
      id: props.id,
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
      console.log("Edited a game!");
      createAlert("Edited a game!");
      props.refreshGames();
    }

    props.closeForm();
  }

  return (<>
    {modal && (
      <Modal>
        <TextBox text={name} labelName="Name" id="game-name" type="text" set={setName} onEnter={editGame} />
        <TextBox text={thumbnail} labelName="Thumbnail" id="game-thumnail" type="text" set={setThumbnail} onEnter={editGame} />
        <Questions 
          labelName="Questions" 
          id="game-questions" 
          questions={questions} 
          set={setQuestions} 
        />
        <Button text="Submit" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={editGame}/>
        <Button text="Cancel" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={props.closeForm}/>
      </Modal>
    )}
    
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}
