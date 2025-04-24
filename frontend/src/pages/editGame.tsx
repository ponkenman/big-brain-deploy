import { Link, useNavigate, useParams } from "react-router-dom";
import LogoutButton from "../components/buttons/logoutButton";
import Navbar from "../components/navbar";
import { Answer, Game, Question, QuestionType, StateSetter } from "../types";
import { useContext, useEffect, useState } from "react";
import { ALERT_SUCCESS, createDefaultQuestion, durationAgo, fetchBackend, fileToDataUrl } from "../helpers";
import Button from "../components/buttons/button";
import Modal from "../components/modal";
import TextInput from "../components/forms/textInput";
import FileSelect from "../components/forms/fileInput";
import QuestionManager from "../components/questions/questionManager";
import IconButton from "../components/buttons/iconButton";
import { AlertContext } from "../App";

function NewQuestionForm(props: { newQuestion: Question, setNewQuestion: StateSetter<Question> }) {
  const [newQuestions, setNewQuestions] = useState<Question[]>([createDefaultQuestion()]);

  useEffect(() => {
    props.setNewQuestion(newQuestions[0]);
  }, [newQuestions]);

  return (<QuestionManager labelName="Add new question" questions={newQuestions} set={setNewQuestions} createSingleQuestion={true} />)
}

function EditQuestionCard(props: {game: Game, q: Question, setModalIdToDelete: StateSetter<number | undefined>, setDeleteModalIsVisible: StateSetter<boolean>}) {
  const navigate = useNavigate();
  return (<article className="p-4 rounded-lg bg-pink-200 flex flex-row justify-between border border-pink-400 shadow-xs">
    <div>
      <p>{props.q.index}{`)`} <span className="font-medium">{props.q.question}</span></p>
      <p>Possible answers: {props.q.answers.length}</p>
      <p>Correct answers: {props.q.type === QuestionType.JUDGEMENT ? (
        (() => {
          return (props.q.answers.find(a => a.correct) as Answer).text
        })()
      ) : props.q.correctAnswers.length}</p>
      <p>Duration: {props.q.duration} {props.q.duration === 1 ? `second` : `seconds`}</p>
      <p>Points: {props.q.points}</p>
    </div>
    <div className="flex flex-col gap-2">
      <IconButton className="w-5 h-auto hover:opacity-50" onClick={() => navigate(`/game/${props.game.id}/question/${props.q.id}`)} svg="../src/assets/pencil.svg"/>
      <IconButton className="w-5 h-auto hover:opacity-50" onClick={() => {
        props.setModalIdToDelete(props.q.id);
        props.setDeleteModalIsVisible(true);
      }} svg="../src/assets/trash.svg"/>
    </div>
  </article>);
}

function EditQuestionManager(props: { game: Game, setGame: StateSetter<Game|undefined>, updateGame: (newGame: Game) => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<Question>(createDefaultQuestion());
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false);
  const [modalIdToDelete, setModalIdToDelete] = useState<number | undefined>(undefined);

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
    setNewQuestion(createDefaultQuestion());
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
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4 mb-1">
      {questions.length === 0 
        ? <p> You currently have no questions! </p> 
        : questions.map(q => <EditQuestionCard key={q.id} game={props.game} q={q} setModalIdToDelete={setModalIdToDelete} setDeleteModalIsVisible={setDeleteModalIsVisible}/>)}
      <Button text="Add Questions" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white col-span-full" onClick={() => setModalIsVisible(true)}/>
      <Modal visible={modalIsVisible} setVisible={setModalIsVisible}>
        <form>
          <NewQuestionForm newQuestion={newQuestion} setNewQuestion={setNewQuestion}/>
          <div className="flex flex-row gap-2 pt-3">
            <Button text="Submit" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={addQuestion}/>
            <Button text="Cancel" color="bg-red-300" hoverColor="hover:bg-red-400" onClick={cancelAddQuestion}/>
          </div>
        </form>
      </Modal>
      <Modal visible={deleteModalIsVisible} setVisible={setDeleteModalIsVisible}>
        <h4>Delete this question</h4>
        <p>Are you sure you want to delete this question?</p>
        <Button text="Delete" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={deleteQuestion}/>
        <Button text="Cancel" color="bg-gray-200" hoverColor="hover:bg-gray-400" onClick={() => setDeleteModalIsVisible(false)}/>
      </Modal>
    </div>
  </section>)
}

function GameStats(props: {game: Game}) {
  return (<>
    <p className="text-gray-600">#{props.game.id}</p>
    <p className="text-gray-600"><span className="font-medium">Created</span> {durationAgo(new Date(props.game.createdAt), new Date())} ago</p>
    <p className="text-gray-600"><span className="font-medium">Last updated</span> {durationAgo(new Date(props.game.lastUpdatedAt), new Date())} ago</p>
  </>);
}

function GameManager(props: {gameId: string }) {
  const [game, setGame] = useState<Game>();
  const [name, setName] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File|null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const createAlert = useContext(AlertContext);

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
          createAlert(r.error);
        } else {
          createAlert("Successfully updated!", ALERT_SUCCESS);
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
  
  return (game != undefined && <div className="rounded-md bg-gray-200 p-4 my-7">
    <GameStats game={game} />
    <section className="rounded-md bg-gray-300 mt-4 px-4 pb-2 relative">
      <h2 className="text-2xl font-semibold py-3">{game.name} <IconButton className="w-6 h-auto hover:opacity-50 inline-flex ml-1" onClick={() => setModalIsVisible(true)} svg="../src/assets/pencil.svg"/></h2>
      <p>Game thumbnail</p>
      <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-pink-400 bg-pink-200 sm:w-100 my-4">
        <img src={game.thumbnail == "" ? "../src/assets/default-game-icon.png" : game.thumbnail} alt={`Thumbnail for ${game.name}`} className="object-cover object-center" />
      </div>
      <Modal visible={modalIsVisible} setVisible={setModalIsVisible}>
        <form>
          <TextInput labelName="Edit name" id="game-name" type="text" defaultValue={name} onChange={e => setName(e.target.value)} />
          <FileSelect labelName="Upload new thumbnail (optional)" id="game-thumnail" onChange={e => setThumbnailFile(e.target.files ? e.target.files[0] : null)} />
          <div className="flex flex-row gap-2 pt-3">
            <Button text="Submit" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={updateGameMetadata}/>
            <Button text="Cancel" color="bg-red-300" hoverColor="hover:bg-red-400" onClick={() => setModalIsVisible(false)}/>
          </div>
        </form>
      </Modal>
    </section>
    <EditQuestionManager game={game} setGame={setGame} updateGame={updateGame} />
  </div>);
}

export function EditGameScreen() {
  const { gameId } = useParams() as { gameId: string };

  // Scroll to top when screen first loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-white p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Edit game</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
      <GameManager gameId={gameId} />
    </main>
  </>);
}