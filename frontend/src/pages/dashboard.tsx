import { Link, useNavigate } from "react-router-dom";
import { fetchBackend } from "../helpers";
import GameCard from "../components/gameCard";
import {useState} from "react";
import {useEffect} from "react";
import Button from "../components/button";
import Navbar from "../components/navbar";
import CreateGameForm from "../components/createGameForm";

// type Questions = {
//   id: string,
//   question: string,
//   answer: string,
//   duration: number
// }

type Game = {
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number,
  createdAt: Date,
  questions: string
}

export function DashboardScreen () {
  const [games, setGames] = useState<Game[]>([]);
  const [showCreateGameForm, setShowCreateGameForm] = useState(false);
  const [refreshGames, setRefreshGames] = useState(0);

  const navigate = useNavigate();
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

  // const calcTotalDuration = (questions: Questions[]): number => {
  const calcTotalDuration = (questions: string): number => {

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
        <Button text="Create Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => setShowCreateGameForm(true)}/>
    </Navbar>

    {showCreateGameForm && <CreateGameForm closeForm={() => setShowCreateGameForm(false)} refreshGames={() => setRefreshGames(refreshGames + 1)}/>}

    <h1>Welcome to dashboard!</h1>
    <div>
      {games.length === 0 ? (
        <h1>You have no games!!!</h1>
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
    <Button text="Logout" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={logout}/>
  </>);
}