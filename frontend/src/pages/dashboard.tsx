import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import { AdminGamesList } from "../components/games/adminGamesList";

/**
 * This function displays the dashboard screen, everything from the dashboard to list of games owned by the user
 */
export function DashboardScreen () {
  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className="bg-white p-4 md:p-7 w-screen absolute top-15 min-h-full">
      <h1 className="text-4xl font-semibold pb-7">Dashboard</h1>
      <AdminGamesList />
    </main>
  </>);
}