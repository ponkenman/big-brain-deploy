import { useContext, useEffect, useState } from "react";
import { ALERT_SUCCESS, fetchBackend } from "../helpers";
import Navbar from "../components/navbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TextInput from "../components/forms/textInput";
import Button from "../components/buttons/button";
import { AlertContext } from "../App";

export function JoinGameScreen () {
  const [params,] = useSearchParams();
  const [playerName, setPlayerName] = useState("");
  const [sessionId, setSessionId] = useState<string>(params.get("sessionId") ?? "");
  const navigate = useNavigate();
  const createAlert = useContext(AlertContext);

  let messageSent = false;

  useEffect(() => {
    if (sessionId !== "" && !messageSent) {
      // Prevent alert from being sent twice on debug mode
      messageSent = true;
      createAlert("Successfully autofilled game code!", ALERT_SUCCESS);
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
        <Navbar>
      <Link to="/join">
        <Button text="Join a game" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
      <Link to="/register">
        <Button text="Register" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white"/>
      </Link>
      <Link to="/login">
        <Button text="Login" color="bg-pink-200 "hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
    </Navbar>
    <main className={`bg-white p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Join game</h1>
      <form className="rounded-md bg-gray-100 p-4">
        <TextInput labelName="Enter session code" id="session-code-input" type="text" defaultValue={sessionId} onChange={e => setSessionId(e.target.value)}/>
        <TextInput labelName="Enter display name" id="display-name-input" type="text" onChange={e => setPlayerName(e.target.value)}/>
        <Button text="Enter game" color="bg-pink-300 mt-2" hoverColor="hover:bg-pink-400 hover:text-white" onClick={enterSession}/>
      </form>
    </main>
  </>);
}