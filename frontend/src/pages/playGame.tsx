import { useEffect, useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { initialiseAlerts } from "../helpers";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

export function PlayGameScreen () {
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
  const navigate = useNavigate();

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    if (!playerId) {
        navigate(`/join`);
    }
  }, []);


  return (<>
    <Navbar />
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Game lobby</h1>
      <p>Please wait for game to start!</p>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}