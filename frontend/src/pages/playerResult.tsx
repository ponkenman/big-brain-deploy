import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { fetchBackend } from "../helpers";
import { Question, AnswerResult } from "../types";
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
  const sessionId = localStorage.getItem("sessionId");

  const [results, setResults] = useState<AnswerResult[]>([]);
  const [gameData, setGameData] = useState<Question[]>([]);
  const playerScore: number[] = [];
  const questionNumber: string[] = [];


  useEffect(() => {
    const response = fetchBackend("GET", `/play/${playerId}/results`, undefined, token);
    response.then((data) => {
      console.log(data);
      setResults(data);
    });

    //   Can't get points as 
    console.log(sessionId);
    const response2 = fetchBackend("GET", `/admin/session/${sessionId}/status`, undefined, token);
    response2.then((data) => {
      setGameData(data.results.questions);
      console.log(data.results.questions);
    });

    // Only run once per session
  }, [playerId]);

  console.log(results);

  results?.map((question, index) => {
    if (question.correct && gameData[index] && gameData[index].points !== undefined) {
      playerScore.push(gameData[index].points);
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

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <h1>gameId {gameId}</h1>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Here are the your results!</h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      <GetIndivudalResults/>
    </main>
  </>)
}