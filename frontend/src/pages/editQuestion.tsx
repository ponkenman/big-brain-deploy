import { useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { initialiseAlerts } from "../helpers";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";

export function EditQuestionScreen() {
    const [alertId, setAlertId] = useState(0);
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
    const { gameId, questionId } = useParams() as { gameId: string, questionId: string };
    return (<>
      <Navbar>
        <LogoutButton />
      </Navbar>
      <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
        <h1 className="text-4xl font-semibold pb-7">Edit question</h1>
        <p> Question id: {questionId}</p>
        <Link to={`/game/${gameId}`}>
          <Button text="Back to edit game" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
        </Link>
      </main>
      <AlertMenu alerts={alerts} setAlerts={setAlerts} />
    </>);
  }