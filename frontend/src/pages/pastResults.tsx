import { fetchBackend } from "../helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { Game, PastSessions } from "../types";
import { useEffect, useState } from "react";

export function PastResultsScreen() {
  const [pastSessionData, setPastSessionData] = useState<PastSessions[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;
  const { gameId } = useParams() as { gameId: string };
  
  useEffect(() =>{
    (fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>).then((data) => {
      const temptPastSessions: PastSessions[] = [];
      data.games.map((game) => {
        if (game.id === parseInt(gameId)) {
          game.pastSessions.map((currSession: PastSessions) => {
            console.log(currSession);
            temptPastSessions.push(currSession);
          });
        }
      });
      setPastSessionData(temptPastSessions);
    });
  }, []);

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1>Past Results Library!</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      {pastSessionData.map((session) => {
        return (
          <div key={session.pastSessionId}>
            <a className="text-indigo-400 hover:underline"  onClick={() => navigate(`/session/${session.pastSessionId}/results`)}>View session {session.pastSessionId} results</a>
          </div>
        );
      })}
    </main>
  </>)
}