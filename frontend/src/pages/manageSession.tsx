import { useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { fetchBackend, initialiseAlerts } from "../helpers";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { AlertFunc, Game } from "../types";
import Modal from "../components/modal";

function ManageSession(props: {sessionId: string, createAlert: AlertFunc }) {
  const navigate = useNavigate();
  const [stopGameModal, setStopGameModal] = useState(false);
  const [position, setPosition] = useState(-1);
  const [numQuestions, setNumQuestions] = useState(0);

  async function advanceGame() {
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "ADVANCE"
    }

    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      if (position === numQuestions) {
        props.createAlert("You've reached the end of the game!");
        setStopGameModal(true);
        return;
      } 
    
      const currentGame = data.games.filter(currGame => currGame.active === parseInt(props.sessionId));
      setNumQuestions(currentGame[0].questions.length);

      const mutateResponse = fetchBackend("POST", `/admin/game/${currentGame[0].id}/mutate`, body, token);
      mutateResponse.then(r => {
        setPosition(r.data.position);

        console.log("positiona nd numQuestions");
        console.log(position);
        console.log(numQuestions);
        if (r.error) {
          console.log(r.error);
          props.createAlert(r.error);
        } else {
          console.log("Done!");
          props.createAlert("Successfully advanced game!");
        }
      })
    });

  }

  async function stopGame() {    
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "END"
    }

    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const currentGame = data.games.filter(currGame => currGame.active === parseInt(props.sessionId));
      setNumQuestions(currentGame[0].questions.length);

      const mutateResponse = fetchBackend("POST", `/admin/game/${currentGame[0].id}/mutate`, body, token);
      mutateResponse.then(r => {
        if (r.error) {
          console.log(r.error);
          props.createAlert(r.error);
        } else {
          console.log("Done!");
          props.createAlert("Successfully stoped game!");
          setStopGameModal(true);
        }
      });
    });
  }

  return (
    <form className="py-2">
      <h1 className="text-4xl font-semibold pb-7">Session {props.sessionId} </h1>
      <h1 className="text-4xl font-semibold pb-7">Current position {position} </h1>
      {position === -1 ? (
        <h1 className="text-4xl font-semibold pb-7">The game has not started yet</h1>
      ) : position !== numQuestions ? (
        <h1 className="text-4xl font-semibold pb-7">Current Question: {position} </h1>
      ) : (
        <h1 className="text-4xl font-semibold pb-7">End Quiz</h1>
      )}

      <div className="flex flex-row gap-2 pt-3">
        <Button text="Advance game" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={advanceGame}/>
        <Button text="Stop game" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={stopGame}/>
        {stopGameModal && (
          <Modal>
            <h2>Would you like to view the results?</h2>
            <Button text="Yes" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => navigate(`/session/${props.sessionId}}/results`)}/>
            <Button text="No" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => navigate("/dashboard")}/>
          </Modal>
        )}
      </div>
    </form>
  )
}

export function ManageSessionScreen() {
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
  const { sessionId } = useParams() as { sessionId: string };

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Manage game session</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      <ManageSession sessionId={sessionId} createAlert={createAlert} />
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>)
}