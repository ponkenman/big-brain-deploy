import { useEffect, useState } from "react";
import GameCard from "./gameCard";
import { APIError, Game, Question } from "../../types";
import { fetchBackend } from "../../helpers";
import Button from "../buttons/button";
import CreateGameForm from "./createGameForm";

export function AdminGamesList(props: { createAlert: (message: string) => void }) {
  const [games, setGames] = useState<Game[]>([]);
  const [showCreateGameForm, setShowCreateGameForm] = useState(false);

  async function getGames() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await fetchBackend("GET", "/admin/games", undefined, token) as { games: Game[] }| APIError;
    if ("error" in response) {
      console.log(response.error);
    } else {
      setGames(response.games.toSorted((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)));
    }
  };

  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
  }, [games]);

  return (<>
      <Button text="Create Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => setShowCreateGameForm(true)}/>
      <h2 className="text-3xl font-semibold py-7">Your games</h2>
      <div className="grid gap-4 grid-cols-4">
        {games.length === 0 ? (
          <p>You currently have no games!</p>
        ) : (

          games.map((game, index) => {;
            console.log(games);
            return (
              <GameCard createAlert={props.createAlert} games={games} setGames={setGames} gameId={game.id} key={game.id}/>
            )
          })
        )}
      </div>
      {showCreateGameForm && <CreateGameForm closeForm={() => setShowCreateGameForm(false)} games={games} setGames={setGames} createAlert={props.createAlert}/>}
  </>);
}