import { Link, useNavigate, useParams } from "react-router-dom";
import LogoutButton from "../components/buttons/logoutButton";
import Navbar from "../components/navbar";
import { AlertFunc, Answer, Game, Question, QuestionType, StateSetter } from "../types";
import { useEffect, useState } from "react";
import { createSampleAnswer, fetchBackend, fileToDataUrl, initialiseAlerts } from "../helpers";
import Button from "../components/buttons/button";
import Modal from "../components/modal";
import TextInput from "../components/forms/textInput";
import FileSelect from "../components/forms/fileInput";
import { AlertData, AlertMenu } from "../components/alert";
import QuestionManager from "../components/questions/questionManager";

const defaultQuestion = {
  id: Math.floor(Math.random() * 1000000),
  type: QuestionType.SINGLE_CHOICE,
  media: "",
  question: "",
  answers: [createSampleAnswer(), createSampleAnswer()],
  correctAnswers: [],
  duration: 10,
  points: 5,
  index: -1,
}

function NewQuestionForm(props: { newQuestion: Question, setNewQuestion: StateSetter<Question> }) {
  const [newQuestions, setNewQuestions] = useState<Question[]>([defaultQuestion]);

  useEffect(() => {
    props.setNewQuestion(newQuestions[0]);
  }, [newQuestions]);

  useEffect(() => {
    setNewQuestions([defaultQuestion]);
  }, []);
  return (<QuestionManager labelName="Add new question" questions={newQuestions} set={setNewQuestions} createSingleQuestion={true} />)
}

function SimpleQuestionManager(props: { game: Game, setGame: StateSetter<Game|undefined>, updateGame: (newGame: Game) => void, createAlert: AlertFunc}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>(defaultQuestion);
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [modalIdToDelete, setModalIdToDelete] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    setQuestions(props.game.questions)
  }, [props.game]);

  function addQuestion() {
    const newGame = {...props.game, lastUpdatedAt: new Date().toISOString() } as Game;
    newGame.questions = [...questions, newQuestion];
    props.updateGame(newGame);
    setModalIsVisible(false);
  }

  function cancelAddQuestion() {
    setModalIsVisible(false);
    setNewQuestion(defaultQuestion);
  }

  function deleteQuestion() {
    if (modalIdToDelete === undefined) {
      return;
    }
    const questionId = modalIdToDelete;
    const newGame = {...props.game};
    const newQuestions = [...newGame.questions].filter(q => q.id !== questionId);
    newGame.questions = newQuestions;
    props.updateGame(newGame);
    setModalIdToDelete(undefined);
    setDeleteModalIsVisible(false);
  }

  return (<section>
    <h3 className="text-xl font-semibold py-3">Game questions</h3>
    <div className="flex flex-col gap-4 mb-1">
      {questions.length === 0 ? <p> You currently have no questions! </p> : questions.map(q => <article className="p-4 rounded-lg bg-indigo-200" key={q.id}>
        <p>{q.index}{`)`} {q.question}</p>
        <p>Answers: {q.answers.length}</p>
        <p>Correct answers: {q.type === QuestionType.JUDGEMENT ? (
          (() => {
            console.log(q);
            return (q.answers.find(a => a.correct) as Answer).text
          })()
        ) : q.correctAnswers.length}</p>
        <p>Duration: {q.duration} {q.duration === 1 ? `second` : `seconds`}</p>
        <div className="flex flex-row items-center py-2 gap-2">
          <Button text="Edit" color="bg-gray-100" hoverColor="hover:bg-gray-200" className="border overflow-hidden border-gray-400 text-sm" onClick={() => navigate(`/game/${props.game.id}/question/${q.id}`)}/>
          <Button text="Delete" color="bg-red-100" hoverColor="hover:bg-red-200" className="border overflow-hidden border-red-400 text-sm" onClick={() => {
            setModalIdToDelete(q.id);
            setDeleteModalIsVisible(true);
          }}/>
        </div>
      </article>)}
      <Button text="Add Questions" color="bg-indigo-200" hoverColor="hover:bg-indigo-300" onClick={() => setModalIsVisible(true)}/>
      {modalIsVisible && 
        <Modal>
          <form>
            <NewQuestionForm newQuestion={newQuestion} setNewQuestion={setNewQuestion}/>
            <div className="flex flex-row gap-2 pt-3">
              <Button text="Submit" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={addQuestion}/>
              <Button text="Cancel" color="bg-red-300" hoverColor="hover:bg-red-400" onClick={cancelAddQuestion}/>
            </div>
          </form>
        </Modal>
      }
      {deleteModalIsVisible && <Modal>
        <h4>Delete this question</h4>
        <p>Are you sure you want to delete this question?</p>
        <Button text="Delete" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={deleteQuestion}/>
        <Button text="Cancel" color="bg-gray-200" hoverColor="hover:bg-gray-400" onClick={() => setDeleteModalIsVisible(false)}/>
      </Modal>}
    </div>
  </section>)
}

function GameManager(props: {gameId: string, createAlert: AlertFunc}) {
  const [game, setGame] = useState<Game>();
  const [name, setName] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File|null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [modalIsVisible, setModalIsVisible] = useState(false);

  useEffect(() => {
    if (thumbnailFile) {
      const data = fileToDataUrl(thumbnailFile);
      data.then(url => setThumbnailUrl(url));
    }
  }, [thumbnailFile]);

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const game = data.games.find(g => g.id.toString() === props.gameId) as Game;
      setGame(game);
      setName(game.name);
      setThumbnailUrl(game.thumbnail);
      console.log(game);
    });
  }, []);

  function updateGame(newGame: Game) {
    const token = localStorage.getItem("token") as string;
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      newGame.questions.forEach((q, i) => {
        q.correctAnswers = q.answers.filter(a => a.correct).map(a => a.text);
        q.index = i + 1;
      });
      const games = data.games;
      const gameIndex = games.findIndex(g => g.id === newGame.id);
      games[gameIndex] = newGame;
      const body = {
        games: games
      }
      const editResponse = fetchBackend("PUT", "/admin/games", body, token);
      editResponse.then(r => {
        if (r.error) {
          props.createAlert(r.error);
        } else {
          props.createAlert("Successfully updated!");
          setGame(newGame);
        }
      });
    });
  }

  function updateGameMetadata() {
    const newGame = {...game, name: name, thumbnail: thumbnailUrl, lastUpdatedAt: new Date().toISOString() } as Game;
    updateGame(newGame);
    setModalIsVisible(false);
  }
  
  return (game != undefined && <div className="rounded-md bg-indigo-100 p-4 my-7">
    <p>Game id: {props.gameId}</p>
    <p>Created at: {game.createdAt}</p>
    <p>Last updated at: {game.lastUpdatedAt}</p>
    <section>
      <h2 className="text-xl font-semibold py-3">Game metadata</h2>
      <p>Game name: {game.name} </p>
      <p>Game thumbnail</p>
      <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-indigo-400 bg-indigo-200 w-64 my-4">
        <img src={game.thumbnail == "" ? "../src/assets/default-game-icon.png" : game.thumbnail} alt={`Thumbnail for ${game.name}`} className="object-cover object-center" />
      </div>
      <Button text="Edit" color="bg-gray-100" hoverColor="hover:bg-gray-200" className="border overflow-hidden border-gray-400 text-sm mb-4" onClick={() => setModalIsVisible(true)}/>
      {modalIsVisible && <Modal>
        <form>
          <TextInput labelName="Edit name" id="game-name" type="text" defaultValue={name} onChange={e => setName(e.target.value)} />
          <FileSelect labelName="Upload new thumbnail (optional)" id="game-thumnail" set={setThumbnailFile} />
          <div className="flex flex-row gap-2 pt-3">
            <Button text="Submit" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={updateGameMetadata}/>
            <Button text="Cancel" color="bg-red-300" hoverColor="hover:bg-red-400" onClick={() => setModalIsVisible(false)}/>
          </div>
        </form>
      </Modal> }
    </section>
    <SimpleQuestionManager game={game} setGame={setGame} updateGame={updateGame} createAlert={props.createAlert}/>
  </div>);
}

export function EditGameScreen() {
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
  const { gameId } = useParams() as { gameId: string };
  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Edit game</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      <GameManager gameId={gameId} createAlert={createAlert} />
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}