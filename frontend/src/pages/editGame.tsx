import { Link, useParams } from "react-router-dom";
import LogoutButton from "../components/buttons/logoutButton";
import Navbar from "../components/navbar";
import { AlertFunc, Game } from "../types";
import { useEffect, useState } from "react";
import { fetchBackend, fileToDataUrl, initialiseAlerts } from "../helpers";
import Button from "../components/buttons/button";
import Modal from "../components/modal";
import TextInput from "../components/forms/textInput";
import FileSelect from "../components/forms/fileInput";
import { AlertData, AlertMenu } from "../components/alert";

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
    });
  }, []);

  function updateGames() {
    const token = localStorage.getItem("token") as string;
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      console.log(data);
      const newGame = {...game, name: name, thumbnail: thumbnailUrl, lastUpdatedAt: new Date().toISOString() } as Game;
      setGame(newGame);
      const games = data.games;
      const gameIndex = games.findIndex(g => g.id.toString() === props.gameId);
      games[gameIndex] = newGame;

      const body = {
        games: games
      }

      const editResponse = fetchBackend("PUT", "/admin/games", body, token);
      editResponse.then(r => {
        console.log(r);
        if (r.error) {
          props.createAlert(r.error);
        } else {
          props.createAlert("Successfully updated!");
          setModalIsVisible(false);
        }
      });

    });
  }

  return (game != undefined && <div className="rounded-md bg-indigo-100 p-4 my-7">
    <p>Game id: {props.gameId}</p>
    <p>Created at: {game.createdAt}</p>
    <p>Last updated at: {game.lastUpdatedAt}</p>
    <section>
        <h2 className="text-xl font-semibold pb-3 pt-3">Game metadata</h2>
      <p>Game name: {game.name} </p>
      <p>Game thumbnail</p>
      <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-indigo-400 bg-indigo-200 w-64 my-4">
        <img src={game.thumbnail == "" ? "src/assets/default-game-icon.png" : game.thumbnail} alt={`Thumbnail for ${game.name}`} className="object-cover object-center" />
      </div>
      <Button text="Edit" color="bg-gray-100" hoverColor="hover:bg-gray-200" className="border overflow-hidden border-gray-400 text-sm mb-4" onClick={() => setModalIsVisible(true)}/>
      {modalIsVisible && <Modal>
        <form>
          <TextInput labelName="Edit name" id="game-name" type="text" defaultValue={name} onChange={e => setName(e.target.value)} />
          <FileSelect labelName="Upload new thumbnail (optional)" id="game-thumnail" set={setThumbnailFile} />
          <div className="flex flex-row gap-2 pt-3">
            <Button text="Submit" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={updateGames}/>
            <Button text="Cancel" color="bg-red-300" hoverColor="hover:bg-red-400" onClick={() => setModalIsVisible(false)}/>
          </div>
        </form>
      </Modal> }
    </section>

    <h3>Game questions</h3>
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