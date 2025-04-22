import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { fetchBackend } from "../helpers";
import { AnswerResult } from "../types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Modal from "../components/modal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function calculateSecondsTaken(Date1: ReturnType<typeof Date.toString>, Date2: ReturnType<typeof Date.toString>) {
  const start = new Date(Date1);
  const end = new Date(Date2);

  return Math.floor((end.getTime() - start.getTime()) / 1000);
}
  
  
function GetIndivudalResults() {
  const token = localStorage.getItem("token") as string;
  const playerId = localStorage.getItem("playerId");
  const durationPointsString = localStorage.getItem("durationPoints");
  const durationPoints = JSON.parse(durationPointsString);
  
  const [results, setResults] = useState<AnswerResult[]>([]);
  const playerScore: number[] = [];
  const questionNumber: string[] = [];


  useEffect(() => {
    console.log(playerId);
    console.log(token);

    const response = fetchBackend("GET", `/play/${playerId}/results`, undefined, token);
    response.then((data) => {
      console.log(data);
      setResults(data);
    });

    // Only run once per session
  }, [playerId]);

  console.log(results);

  results.map((question, index) => {
    if (question.correct && durationPoints[index + 1] && 
      durationPoints[index + 1].duration !== undefined && durationPoints[index + 1].points) {
      const points = durationPoints[index+ 1].points;
      const ansDuration = calculateSecondsTaken(question.questionStartedAt, question.answeredAt);
      const questionDuration = durationPoints[index + 1].duration;

      if (ansDuration < 0.25 * questionDuration) {
        console.log("points scored" + points);
        playerScore.push(points);
      } else {
        console.log("index:" + index + "answDuration" + ansDuration);
        console.log("points scored" + points * ((ansDuration / questionDuration) - 0.25));
        playerScore.push(points * (1 - ((ansDuration / questionDuration) - 0.25)));
      }
    }
    
    questionNumber.push(`Question ${index + 1}`);
  });

  return (<section>
    <h1>Question Data!</h1>
    <Bar 
      data={{
        labels: questionNumber.map((data) => data),
        datasets: [
          {
            label: "Points per questions",
            data: playerScore.map((data) => data),
            borderColor: '#36A2EB',
            backgroundColor: '#9BD0F5',
          },
          {
            label: "Answer time per questions",
            data: results.map((data) => calculateSecondsTaken(data.questionStartedAt, data.answeredAt)),
            borderColor: '#7986CB',
            backgroundColor: '#7986CB'
          }
        ],
  
      }}
    />
  </section>)
}

export function PlayerResultsScreen() {
  const { gameId } = useParams() as { gameId: string };
  const [modal, setModal] = useState(false);

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <h1>gameId {gameId}</h1>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Here are the your results!</h1>
      <div className="flex flex-row gap-2">
        <Link to="/dashboard">
          <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
        </Link>
        <Button text="How do points work?" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" onClick={() => setModal(true)}/>
      </div>
      {modal && (
        <Modal>
          <p>Points are calculated by the following:</p>
          <ul>
            <p>If you answer correctly within the first 25% of the question duration you get full points.</p>
            <p>If answered after the first 25% of the question duration, each subsequent % will lose that percent
            of the full points, e.g. 10 seconds 10 point question, answering within 2.5 will give full points.</p>
            <p>Incorrect answers gives no points.</p>
            <br></br>
            <li>For Example:</li>
            <li>Answering at exactly 5 second duration will result in 7.5 points.</li>
            <li>Answering at the exact end will result in the minimum points for a correct answer 2.5.</li>
          </ul>
          <Button text="Close" color="bg-indigo-300 "hoverColor="hover:bg-indigo-400" onClick={() => setModal(false)}/>
        </Modal>
      )}
      <GetIndivudalResults/>
    </main>
  </>)
}