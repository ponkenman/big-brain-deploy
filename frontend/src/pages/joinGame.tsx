import { useEffect, useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { initialiseAlerts } from "../helpers";
import Navbar from "../components/navbar";
import { useSearchParams } from "react-router-dom";
import TextInput from "../components/forms/textInput";
import Button from "../components/buttons/button";

export function JoinGameScreen () {
  const [params, setParams] = useSearchParams();
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [sessionId, setSessionId] = useState<string>(params.get("sessionId") ?? "");
  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);

  useEffect(() => {
    if (sessionId !== "") {
      createAlert("Successfully autofilled game code!");
    }
  }, []);


  return (<>
    <Navbar />
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Join game</h1>
      <form className="rounded-md bg-indigo-100 p-4">
        <TextInput labelName="Enter session code" id="session-code-input" type="text" defaultValue={sessionId} onChange={e => setSessionId(e.target.value)}/>
        <TextInput labelName="Enter display name" id="display-name-input" type="text" onChange={e => setPlayerName(e.target.value)}/>
        <Button text="Enter game" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </form>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}