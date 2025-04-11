import {useState} from "react";
import {useEffect} from "react";
import TextInput from "../forms/textInput";
import { fetchBackend, fileToDataUrl } from "../../helpers";
import Modal from "../modal";
import Button from "../buttons/button";
import Questions from "../questions";
import FileSelect from "../forms/fileInput";

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

export default function CreateGameForm(props: { closeForm: () => void, refreshGames: () => void, createAlert: (message: string) => void }) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File|null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [confirmNoQuestions, setConfirmNoQuestions] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  
  const [modal] = useState(true);

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

  useEffect(() => {
    if (thumbnailFile) {
      const data = fileToDataUrl(thumbnailFile);
      data.then(url => setThumbnailUrl(url));
    }
  }, [thumbnailFile]);

  async function createGame() {
    if (name === "") {
      props.createAlert("Name is empty!");
      return;
    }
    if (questions.length === 0 && !confirmNoQuestions) {
      setConfirmNoQuestions(true);
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      props.createAlert("Invalid token!");
      return;
    }
    const email = localStorage.getItem("email");
    if (!email) {
      props.createAlert("Invalid email!");
      return;
    }

    const newGame = {
      id: games.length + 1,
      name: name,
      thumbnail: thumbnailUrl,
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
      props.createAlert(response.error);
    } else {
      props.createAlert("Created a game!");
      props.refreshGames();
    }

    props.closeForm();
  }

  useEffect(() => {
    if (questions.length !== 0) {
      setConfirmNoQuestions(false);
    }
  }, [questions]);

  return (<>
    {modal && (
      <Modal>
        <TextInput labelName="Game Name" id="game-name" type="text" defaultValue={name} set={setName} onEnter={createGame} />
        <FileSelect labelName="Game Thumbnail (optional)" id="game-thumnail" set={setThumbnailFile} />
        <Questions labelName="Questions" id="game-questions" questions={questions} set={setQuestions} onEnter={createGame} />
        { confirmNoQuestions && <p className="block mb-3">Are you sure you want to create a game with no questions? Press submit to confirm!</p>}
        <div className="flex flex-row gap-2">
          <Button text="Submit" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={createGame}/>
          <Button text="Cancel" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={props.closeForm}/>
        </div>
      </Modal>
    )}
  </>);
}
