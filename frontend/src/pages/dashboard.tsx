import { fetchBackend, initialiseAlerts } from "../helpers";
import GameCard from "../components/games/gameCard";
import {useState} from "react";
import {useEffect} from "react";
import Button from "../components/buttons/button";
import Navbar from "../components/navbar";
import CreateGameForm from "../components/games/createGameForm";
import { AlertData, AlertMenu } from "../components/alert";
import LogoutButton from "../components/buttons/logoutButton";
import { Game } from "../types";

export function DashboardScreen () {
  const [games, setGames] = useState<Game[]>([]);
  const [showCreateGameForm, setShowCreateGameForm] = useState(false);
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
  
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

  const calcTotalDuration = (questions: Question[]): number => {
    return questions.reduce((prev, curr) => prev + curr.duration, 0);
  }

  useEffect(() => {
    if (games.length === 0) {
      getGames();
    }
  }, [games]);

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Dashboard</h1>
      <Button text="Create Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => setShowCreateGameForm(true)}/>
      <h2 className="text-3xl font-semibold py-7">Your games</h2>
      <div className="grid gap-4 grid-cols-4">
        {games.length === 0 ? (
          <p>You currently have no games!</p>
        ) : (

          games.map((game, index) => {;
            console.log(games);
            return (
              <div key={game.id}>
                <GameCard title={game.name} 
                  questions={game.questions} 
                  thumbnail={game.thumbnail} 
                  numQuestions={index} 
                  totalDuration={game.questions ? calcTotalDuration(game.questions) : 0} 
                  id={game.id} 
                  refreshGames={() => setRefreshGames(refreshGames + 1)}/>
              </div>
            )
          })
        )}
      </div>
    </main>
    {showCreateGameForm && <CreateGameForm closeForm={() => setShowCreateGameForm(false)} refreshGames={() => setRefreshGames(refreshGames + 1)} createAlert={createAlert}/>}
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}