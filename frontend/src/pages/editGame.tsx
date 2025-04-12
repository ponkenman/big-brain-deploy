import { Link, useParams } from "react-router-dom";
import LogoutButton from "../components/buttons/logoutButton";
import Navbar from "../components/navbar";
import { Game } from "../types";
import { useEffect, useState } from "react";
import { fetchBackend } from "../helpers";
import Button from "../components/buttons/button";

function GameManager(props: {gameId: string}) {
  const [game, setGame] = useState<Game>();
  const [gameName, setGameName] = useState("");
  const [gameThumbnail, setGameThumbnail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const game = data.games.find(g => g.id.toString() === props.gameId) as Game;
      setGame(game);
      setGameName(game.name);
      setGameThumbnail(game.thumbnail);
    });
  }, []);

  return (game != undefined && <div className="rounded-md bg-indigo-100 p-4 my-7">
    <p>Game id: {props.gameId}</p>
    <p>Created at: {game.createdAt}</p>
    <section>
        <h2 className="text-xl font-semibold pb-3 pt-3">Game metadata</h2>
      <p>Game name: {game.name} </p>
      <p>Game thumbnail</p>
      <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-indigo-400 bg-indigo-200 w-64 my-4">
        <img src={game.thumbnail == "" ? "src/assets/default-game-icon.png" : game.thumbnail} alt={`Thumbnail for ${game.name}`} className="object-cover object-center" />
      </div>
      <Button text="Edit" color="bg-gray-100" hoverColor="hover:bg-gray-200" className="border overflow-hidden border-gray-400 text-sm mb-4"/>
    </section>
    <form>

    </form>
    <h3>Game questions</h3>
  </div>);
}

export function EditGameScreen() {
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
      <GameManager gameId={gameId} />
    </main>
  </>);
}