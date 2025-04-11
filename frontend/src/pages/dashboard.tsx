import { Link, useNavigate } from "react-router-dom";
import { fetchBackend, initialiseAlerts } from "../helpers";
import GameCard from "../components/gameCard";
import {useState} from "react";
import {useEffect} from "react";
import Button from "../components/button";
import Navbar from "../components/navbar";
import CreateGameForm from "../components/createGameForm";
import { AlertData, AlertMenu } from "../components/alert";

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
  createdAt: Date,
  questions: Question[]
}

export function DashboardScreen () {
  const [games, setGames] = useState<Game[]>([]);
  const [showCreateGameForm, setShowCreateGameForm] = useState(false);
  const [refreshGames, setRefreshGames] = useState(0);
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const navigate = useNavigate();

  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);

  async function logout() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await fetchBackend("POST", "/admin/auth/logout", undefined, token);
    if (response.error) {
      console.log(response.error);
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };
  
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
    let totalDuration = 0;
    // for (const currQuestion of questions) {
    //   totalDuration += currQuestion.duration
    // }
  
    return totalDuration;
  }

  useEffect(() => {
    getGames();
  }, [refreshGames]);

  return (<>
    <Navbar>
        <Button text="Logout" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={logout}/>
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Dashboard</h1>
      <Button text="Create Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => setShowCreateGameForm(true)}/>
      <div className="pt-5">
        {games.length === 0 ? (
          <h1>You currently have no games!</h1>
        ) : (
          games.map((game, index) => {
            return (
              <div key={game.id}>
                <h1>Game {index + 1}!</h1>
                <GameCard title={game.name} 
                questions={game.questions} 
                thumbnail={game.thumbnail} 
                numQuestions={index} 
                totalDuration={calcTotalDuration(game.questions)} 
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