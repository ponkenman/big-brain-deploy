import { useParams } from "react-router-dom";
import LogoutButton from "../components/buttons/logoutButton";
import Navbar from "../components/navbar";

export function EditGameScreen() {
  const { gameId } = useParams();
  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Edit game</h1>
      <p>Game id: {gameId}</p>
      <h2>Game metadata</h2>
      <h3>Game questions</h3>
    </main>
  </>);
}