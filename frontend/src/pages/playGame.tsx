import { useEffect, useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { fetchBackend, initialiseAlerts } from "../helpers";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { AlertFunc, Answer, QuestionPlayerData, QuestionType } from "../types";

// in seconds
function questionTimeRemaining(question: QuestionPlayerData) {
  const date = new Date(question.isoTimeLastQuestionStarted);
  date.setSeconds(date.getSeconds() + question.duration);
  return Math.floor((date.getTime() - Date.now()) / 1000);
}

function QuestionScreen(props: { createAlert: AlertFunc }) {
  const [question, setQuestion] = useState<QuestionPlayerData | undefined>();
  const [secondsRemaining, setSecondsRemaining] = useState<number | undefined>();
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<string[] | undefined>();
  const playerId = localStorage.getItem("playerId");

  let timerExists = false;
  let currQuestionId: number;
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    function requestBackend() {
      (fetchBackend("GET",`/play/${playerId}/question`) as Promise<{ question: QuestionPlayerData } | { error: string }>).then(data =>{
        if ("error" in data) {
          return;
        } 
        if (data.question.id != currQuestionId) {
          console.log('Set new question!');
          setQuestion(data.question);
          currQuestionId = data.question.id;
          if (questionTimeRemaining(data.question) > 0) {
            setSecondsRemaining(questionTimeRemaining(data.question));
          } else {
            setSecondsRemaining(0);
          }
        }
        // Only set a new timer when former promise resolved to prevent race issues (where earlier promise is resolved later)
        timerId = setTimeout(requestBackend, 1000);
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
    let timer: ReturnType<typeof setTimeout>;
    const timeRemaining = questionTimeRemaining(question);
    if (timeRemaining > 0) {
      timer = setTimeout(() => setSecondsRemaining(questionTimeRemaining(question)), 1000);
    }
    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  useEffect(() => {
    if (secondsRemaining === undefined || secondsRemaining > 0) {
      return;
    }
    // One second buffer to fetch question data 
    setTimeout(() => {
      fetchBackend("GET", `/play/${playerId}/answer`).then(data => {
        console.log(data);
        if (data.error) {
          return;
        }
        setCorrectAnswers(data.answers);
      });
    }, 1000);
  }, [secondsRemaining]);

  function changeAnswer(answer: Answer) {
    if (!question) {
      return;
    }
    const time =  questionTimeRemaining(question);
    if (time < 0) {
      props.createAlert("You can no longer change your answers!");
      return;
    }
    const index = selectedAnswers.findIndex(a => a.id === answer.id);
    let newAnswers: Answer[];
    if (index === -1) {
      // Attempting to select new answer
      if (question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.JUDGEMENT) {
        // Only allow one answer to be selected
        newAnswers = [answer];
      } else {
        // Allow multiple answers to be selected
        newAnswers = [...selectedAnswers, answer];
      }
    } else {
      // Deselecting a current answer
      if (selectedAnswers.length === 1) {
        props.createAlert("You must have at least one answer!");
        return;
      }
      newAnswers = selectedAnswers.toSpliced(index, 1);
    }
    setSelectedAnswers(newAnswers);
    const body = {
      answers: newAnswers.map(a => a.text)
    }
    fetchBackend("PUT", `/play/${playerId}/answer`, body).then(d => console.log(d));
  }

  useEffect(() => {
    console.log(selectedAnswers);
  }, [selectedAnswers]);

  // Reset selectedAnswers and correctAnswers on new question
  useEffect(() => {
    setSelectedAnswers([]);
    setCorrectAnswers(undefined);
  }, [question]);

  return (question !== undefined
    ? <>
      <section>
        <h1 className="text-4xl font-semibold pb-7">{`${question.index}) ${question.question}`}</h1>
        <div className="p-4 rounded-lg bg-indigo-100">
          <h2>Media</h2>
          <p>{secondsRemaining === 0 ? `Time's up!` : `${secondsRemaining} second${secondsRemaining !== 0 ? `s`: ``} remaining`}</p>
          <p>Question type: {question.type}</p>
          { correctAnswers !== undefined && <p>Correct answers were: {correctAnswers.toString()}</p>}
        </div>
      </section>
      <section className="grid grid-cols-2 gap-4 bg-indigo-300 rounded-lg p-4 mt-7">
        {question.answers.map(ans => <button onClick={() => changeAnswer(ans)} key={ans.id} className={`${selectedAnswers.findIndex(a => a.id === ans.id) > -1 ? `bg-green-400` : `bg-green-200`} p-2 rounded-lg min-h-30 flex justify-center items-center cursor-pointer`}>
          <p className="text-center align-middle">{ans.text}</p>
        </button>)}
      </section>
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
      <div className={`bg-indigo-100 text-base p-2 rounded-lg text-center min-w-20`}>
        {localStorage.getItem("playerName") ?? `Player`}
      </div>
    </Navbar>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <GameStateScreen createAlert={createAlert}/>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}