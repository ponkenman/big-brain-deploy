import { useContext, useEffect, useState } from "react";
import GameCard from "./gameCard";
import { APIError, Game } from "../../types";
import { fetchBackend } from "../../helpers";
import Button from "../buttons/button";
import CreateGameForm from "./createGameForm";
import Modal  from "../modals/modal";
import { AlertContext } from "../../App";

/**
 * This function displays all games that the admin owns
 */
export function AdminGamesList() {
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLength, setGamesLength] = useState(1);
  const [showCreateGameForm, setShowCreateGameForm] = useState(false);
  const createAlert = useContext(AlertContext);

  /** 
   * Updates games made by user from backend
   */ 
  async function getGames() {
    const token = localStorage.getItem("token");
    // Check if token is valid to proceed
    if (!token) {
      return;
    }

    const response = await fetchBackend("GET", "/admin/games", undefined, token) as { games: Game[] }| APIError;

    // Create alert if an error occurred, otherwise set games and gamesLength
    if ("error" in response) {
      createAlert(response.error);
    } else {
      // Sort games by most recent created
      setGames(response.games.toSorted((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)));
      setGamesLength(response.games.length);
    }
  };

  // Whenever game state array and gamesLength are out of sync, updates games
  useEffect(() => {
    console.log(gamesLength);
    getGames();
  }, [gamesLength, showCreateGameForm]);

  return (<>
    <Button text="Create Game" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={() => setShowCreateGameForm(true)}/>
    <h2 className="text-3xl font-semibold py-7">Your games</h2>
    <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 bg-gray-200 p-4">
      {games.length === 0 
        ? <p>You currently have no games!</p>
        : games.map(game => 
          <GameCard games={games} setGamesLength={setGamesLength} gameId={game.id} key={game.id}/>)
      }
    </div>
    <Modal visible={showCreateGameForm} setVisible={setShowCreateGameForm}>
      <CreateGameForm closeForm={() => setShowCreateGameForm(false)} games={games} setGamesLength={setGamesLength} />
    </Modal>
  </>);
}