import { useEffect, useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { fetchBackend, initialiseAlerts } from "../helpers";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { AlertFunc, Question, QuestionPlayerData } from "../types";

function questionStillActive(question: QuestionPlayerData) {
  const date = new Date(question.isoTimeLastQuestionStarted);
  date.setSeconds(date.getSeconds() + question.duration);
  return date > new Date();
}

function QuestionScreen(props: { createAlert: AlertFunc }) {
  const [question, setQuestion] = useState<QuestionPlayerData | undefined>();
  const [secondsRemaining, setSecondsRemaining] = useState<number | undefined>();

  let timerExists = false;
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;

    function requestBackend() {
      const playerId = localStorage.getItem("playerId");
      (fetchBackend("GET",`/play/${playerId}/question`) as Promise<{ question: QuestionPlayerData } | { error: string }>).then(data =>{
        console.log(data);
        if ("error" in data) {
          return;
        } 
        if (!question || data.question.id !== question.id) {
          setQuestion(data.question);
        }
        const active = questionStillActive(data.question);
        // Only set a new timer when former promise resolved to prevent race issues (where earlier promise is resolved later)
        if (active) {
          timerId = setTimeout(requestBackend, 1000);
        }
      });
    }
    // Prevent running twice in strict mode
    if (!timerExists) {
      requestBackend();
      timerExists = true;
    }
    return () => clearTimeout(timerId);
  }, []);

  useEffect(() => {
    if (!question) {
      return;
    }
    setSecondsRemaining(question.duration);
    let timer: ReturnType<typeof setTimeout>;
    function decrement() {
      if (secondsRemaining) {
        setSecondsRemaining(secondsRemaining - 1);
        timer = setTimeout(decrement, 1000);
      }
    }
    timer = setTimeout(decrement, 1000);
    return () => clearTimeout(timer);
  }, [question]);

  return (question !== undefined
    ? <>
      <h1 className="text-4xl font-semibold pb-7">{`${question.index}) ${question.question}`}</h1>
      <h2></h2>
      <h3>{secondsRemaining}</h3>
    </>
    : <>
      Loading...
    </>);
}

function GameStateScreen(props: { createAlert: AlertFunc }) {
  const [started, setStarted] = useState(false);
  let timerExists = false;
  useEffect(() => {
    // Requests session data every second and updates corresponding values only if data changed
    let timerId: ReturnType<typeof setTimeout>;

    function requestBackend() {
      const playerId = localStorage.getItem("playerId");
      if (started === false) {
        fetchBackend("GET", `/play/${playerId}/status`).then(data => {
          console.log(data);
          if (data.error) {
            props.createAlert(data.error);
            return;
          }
          if (started != data.started) {
            setStarted(data.started);
          } else {
            // Only set a new timer when former promise resolved to prevent race issues (where earlier promise is resolved later)
            timerId = setTimeout(requestBackend, 1000);
          }
        });
      } 
    }

    // Prevent running twice in strictm ode
    if (!timerExists) {
      timerExists = true;
      requestBackend();
    }
    return () => clearTimeout(timerId);
  }, []);

  return (started === false
    ? <>
        <h1 className="text-4xl font-semibold pb-7">Game lobby</h1>
        <p>Please wait for game to start!</p>
      </> 
    : <QuestionScreen createAlert={props.createAlert}/>
  );
}

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
    <Navbar>
    <div className={`bg-indigo-100 text-base p-2 min-w-16 rounded-lg text-center min-w-20`}>
      {localStorage.getItem("playerName") ?? `Player`}
    </div>
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <GameStateScreen createAlert={createAlert}/>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}