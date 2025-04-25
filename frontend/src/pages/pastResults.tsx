import { fetchBackend } from "../helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { Game, PastSessions } from "../types";
import { useEffect, useState } from "react";

/**
 * This shows a list of all pastSessions, with hyperlinks that redirect to the overall results for that session.
 */
export function PastResultsScreen() {
  const [pastSessionData, setPastSessionData] = useState<PastSessions[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token") as string;
  const { gameId } = useParams() as { gameId: string };

  // Get games and add all past sessions to an array if it matches game id
  useEffect(() =>{
    (fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>).then((data) => {
      const temptPastSessions: PastSessions[] = [];
      data.games.map((game) => {
        if (game.id === parseInt(gameId)) {
          game.pastSessions.map((currSession: PastSessions) => {
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
    <main className={`bg-white p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Past results</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
      <div className="bg-gray-200 p-4 mt-7">
        {pastSessionData.length === 0
          ? <p>You currently have no past sessions</p>
          : <>{pastSessionData.map((session) => {
            return (
              <div key={session.pastSessionId}>
                <a className="text-black hover:underline hover:text-pink-400 cursor-pointer"  onClick={() => navigate(`/session/${session.pastSessionId}/results`)}>View session {session.pastSessionId} results</a>
              </div>
            );
          })}</>}
      </div>

    </main>
  </>)
}