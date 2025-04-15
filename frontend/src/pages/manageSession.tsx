import { useEffect, useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { fetchBackend, initialiseAlerts } from "../helpers";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { AlertFunc, Game, Question } from "../types";
import Modal from "../components/modal";

export function ManageSession(props: { gameId: string, sessionId: string, createAlert: AlertFunc }) {
  const navigate = useNavigate();
  const [stopGameModal, setStopGameModal] = useState(false);

  // const [playGameModal, setPlayGameModal] = useState(false);

  async function advanceGame() {
    // const token = localStorage.getItem("token") as string;
    // const body = {
    //   mutationType: "ADVANCE"
    // }
    // const response = await fetchBackend("POST", `/admin/game/${props.gameId}/mutate`, body, token);
    // if (response.error) {
    //   console.log(response.error);
    //   props.createAlert(response.error);
    // } else {
    //   console.log("Done!");
    //   props.createAlert("Successfully advanced game!");
    //   setStopGameModal(true);
    // }
  }

  async function stopGame() {    
    const token = localStorage.getItem("token") as string;
    const body = {
      mutationType: "END"
    }
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const currentGame = data.games.filter(currGame => currGame.active === parseInt(props.sessionId));
      console.log(currentGame);

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
    <h1 className="text-4xl font-semibold pb-7">Game {props.gameId} | Session {props.sessionId} </h1>
    <div className="flex flex-row gap-2 pt-3">
      <Button text="Advance game" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={advanceGame}/>
      <Button text="Stop game" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => stopGame()}/>
      {stopGameModal && (
        <Modal>
          <h2>Would you like to view the results?</h2>
          <Button text="Yes" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={() => navigate("/dashboard")}/>
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
  const { gameId } = useParams() as { gameId: string };
  const { sessionId } = useParams() as { sessionId: string };

  return (<>
      <Navbar>
        <LogoutButton />
      </Navbar>
      <h1>gameId {gameId}</h1>
      <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
        <h1 className="text-4xl font-semibold pb-7">Manage game session</h1>
        <Link to="/dashboard">
          <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
        </Link>
        <ManageSession gameId={gameId} sessionId={sessionId} createAlert={createAlert} />
      </main>
      <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>)
}