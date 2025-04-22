import {useState} from "react";
import {useEffect} from "react";
import TextInput from "../forms/textInput";
import { fetchBackend, fileToDataUrl, isGame } from "../../helpers";
import Button from "../buttons/button";
import QuestionManager from "../questions/questionManager";
import FileSelect from "../forms/fileInput";
import { AlertFunc, Game, Question, StateSetter } from "../../types";

function SubmitGameButtons(props: {submit: () => void, close: () => void}) {
  return (<div className="flex flex-row gap-2">
    <Button text="Submit" color="bg-green-300" hoverColor="hover:bg-green-400" onClick={props.submit}/>
    <Button text="Cancel" color="bg-gray-300" hoverColor="hover:bg-gray-400" onClick={props.close}/>
  </div>);
}

function ManualGameForm(props: { closeForm: () => void, games: Game[], setGamesLength: StateSetter<number>, createAlert: AlertFunc }) {
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File|null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [confirmNoQuestions, setConfirmNoQuestions] = useState(false);

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

    const now = new Date().toISOString();

    const newGame: Game = {
      pastSessions: [],
      id: Math.floor(Math.random() * 1000000),
      name: name,
      thumbnail: thumbnailUrl,
      owner: email,
      active: 0,
      createdAt: now,
      lastUpdatedAt: now,
      questions: questions
    }

    newGame.questions.forEach((q, i) => {
      q.correctAnswers = q.answers.filter(a => a.correct).map(a => a.text);
      q.index = i + 1;
    });


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

  return (<form>
    <TextInput labelName="Game Name" id="game-name" type="text" defaultValue={name} onChange={e => setName(e.target.value)} />
    <FileSelect labelName="Game Thumbnail (optional)" id="game-thumnail" onChange={e => setThumbnailFile(e.target.files ? e.target.files[0] : null)}/>
    <QuestionManager labelName="Questions" questions={questions} set={setQuestions} />
    { confirmNoQuestions && <p className="block mb-3">Are you sure you want to create a game with no questions? Press submit to confirm!</p>}
    <SubmitGameButtons submit={createGame} close={props.closeForm}/>
  </form>);
}

function ImportFileGameForm(props: { closeForm: () => void, games: Game[], setGamesLength: StateSetter<number>, createAlert: AlertFunc }) {
const [jsonFilePath, setJsonFilePath] = useState<File | null>(null);
const token = localStorage.getItem("token") as string;


async function gameUpload(fileInput: File | null ) {
  if (!fileInput) {
    props.createAlert("Invalid upload");
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    const fileContent = evt.target.result as string;
    const data = JSON.parse(fileContent);
    console.log(data);
    
    console.log("before error");
    if (!isGame(data)) {
      console.log("error setting");
      props.createAlert("Invlid JSON format");
      return;
    }
    
    const newGame: Game = {
      pastSessions: data.pastSessions,
      id: data.id,
      name: data.name,
      thumbnail: data.thumbnail,
      owner: data.owner,
      active: data.active,
      createdAt: data.createdAt,
      lastUpdatedAt: data.lastUpdatedAt,
      questions: data.questions
    }
    
    console.log(props.games);
    
    const updateGames = [...props.games, newGame];
    
    const body = {
      games: updateGames
    }
    
    const response = fetchBackend("PUT", "/admin/games", body, token);
    response.then((data) => {
      if ("error" in data) {
        props.createAlert(data.error);
      } else {
        console.log(props.games);
        props.createAlert("Successfully uploaded a game!");
        console.log(newGame);
        props.setGamesLength(+1);
      }
    });

    props.closeForm();
  };
  
  reader.readAsText(fileInput);
}
  return (<form>
    <div className="pb-2">
      <FileSelect labelName="Upload game data from json" id="game-upload" onChange={e => setJsonFilePath(e.target.files ? e.target.files[0] : null)}/>
    </div>
    <SubmitGameButtons submit={() => gameUpload(jsonFilePath)} close={props.closeForm}/>
  </form>);
}

export default function CreateGameForm(props: { closeForm: () => void, games: Game[], setGamesLength: StateSetter<number>, createAlert: AlertFunc }) {
  const [uploadJson, setUploadJson] = useState(false);

  return (<>
        { !uploadJson 
        ? <>
          <ManualGameForm {...props}/>
          <button className="underline hover:opacity-50 cursor-pointer pt-2" onClick={() => setUploadJson(true)}>Import from json file instead</button>
        </>
        : <>
          <ImportFileGameForm {...props}/>
          <button className="underline hover:opacity-50 cursor-pointer pt-2" onClick={() => setUploadJson(false)}>Enter data manually</button>
        </>
        }
  </>);
}
