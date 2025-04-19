import { initialiseAlerts } from "../helpers";
import { useState } from "react";
import Navbar from "../components/navbar";
import { AlertData, AlertMenu } from "../components/alert";
import LogoutButton from "../components/buttons/logoutButton";
import { AdminGamesList } from "../components/games/adminGamesList";

export function DashboardScreen () {
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Dashboard</h1>
      <AdminGamesList createAlert={createAlert}/>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}