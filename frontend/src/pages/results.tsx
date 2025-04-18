import { useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { initialiseAlerts } from "../helpers";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { fetchBackend } from "../helpers";
import { AlertFunc, Game } from "../types";
// import Modal from "../components/modal";

function GetResults(props: {sessionId: string, createAlert: AlertFunc }) {
  const token = localStorage.getItem("token") as string;

  console.log("here are the results");
  console.log(props.sessionId)
  const response = fetchBackend("GET", `/admin/session/${props.sessionId}`, undefined, token);
  response.then(data => {
    console.log(data);
  });
  return (<section>
    <p>something reulsts?</p>
  </section>)
}

export function ResultsScreen() {
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
      <h1 className="text-4xl font-semibold pb-7">Results</h1>
      <h1 className="text-4xl font-semibold pb-7">Session: {sessionId} </h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      <GetResults sessionId={sessionId} createAlert={createAlert}/>
    </main>
    {/* <AlertMenu alerts={alerts} setAlerts={setAlerts} /> */}
  </>)
}