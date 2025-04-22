import { useContext, useEffect, useState } from "react";
import { fetchBackend } from "../helpers";
import Navbar from "../components/navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../components/forms/textInput";
import Button from "../components/buttons/button";
import { AlertContext } from "../App";

export function JoinGameScreen () {
  const [params,] = useSearchParams();
  const [playerName, setPlayerName] = useState("");
  const [sessionId, setSessionId] = useState<string>(params.get("sessionId") ?? "");
  const navigate = useNavigate();
  const createAlert = useContext(AlertContext);

  useEffect(() => {
    if (sessionId !== "") {
      createAlert("Successfully autofilled game code!");
    }
  }, []);

  async function enterSession() {
    if (playerName === "") {
      createAlert("Please fill in your name!");
      return;
    }
    const body = {
      name: playerName
    }
    if (sessionId === "") {
      createAlert("Please fill in a session code!");
      return;
    }
    const response = await fetchBackend("POST", `/play/join/${sessionId}`, body);
    if (response.error) {
      createAlert(response.error);
    } else {
      localStorage.setItem("playerId", response.playerId);
      localStorage.setItem("playerName", playerName);
      navigate(`/play`);
    }
  }

  return (<>
    <Navbar />
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Join game</h1>
      <form className="rounded-md bg-indigo-100 p-4">
        <TextInput labelName="Enter session code" id="session-code-input" type="text" defaultValue={sessionId} onChange={e => setSessionId(e.target.value)}/>
        <TextInput labelName="Enter display name" id="display-name-input" type="text" onChange={e => setPlayerName(e.target.value)}/>
        <Button text="Enter game" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" onClick={enterSession}/>
      </form>
    </main>
  </>);
}