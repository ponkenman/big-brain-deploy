import {useState} from "react";
import {useEffect} from "react";
import TextInput from "../forms/textInput";
import { fetchBackend, fileToDataUrl } from "../../helpers";
import Modal from "../modal";
import Button from "../buttons/button";
import QuestionManager from "../questions/questions";
import FileSelect from "../forms/fileInput";
import { AlertFunc, Game, Question, StateSetter } from "../../types";

export default function CreateGameForm(props: { closeForm: () => void, games: Game[], setGamesLength: StateSetter<number>, createAlert: AlertFunc }) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File|null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [confirmNoQuestions, setConfirmNoQuestions] = useState(false);
  
  const [modal] = useState(true);

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
      id: Math.floor(Math.random() * 1000000),
      name: name,
      thumbnail: thumbnailUrl,
      owner: email,
      active: 0,
      createdAt: new Date().toISOString(),
      questions: questions
    }

    const updateGames = [...props.games, newGame];

    const body = {
      games: updateGames
    }

    const response = await fetchBackend("PUT", "/admin/games", body, token);
    if (response.error) {
      props.createAlert(response.error);
    } else {
      props.createAlert("Created a game!");
      console.log(newGame);
      props.setGamesLength(-1);
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
        <form>
          <TextInput labelName="Game Name" id="game-name" type="text" defaultValue={name} set={setName} onEnter={createGame} />
          <FileSelect labelName="Game Thumbnail (optional)" id="game-thumnail" set={setThumbnailFile} />
          <QuestionManager labelName="Questions" id="game-questions" questions={questions} set={setQuestions} onEnter={createGame} />
          { confirmNoQuestions && <p className="block mb-3">Are you sure you want to create a game with no questions? Press submit to confirm!</p>}
          <div className="flex flex-row gap-2">
            <Button text="Submit" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={createGame}/>
            <Button text="Cancel" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={props.closeForm}/>
          </div>
        </form>
      </Modal>
    )}
  </>);
}
