import { useEffect, useState } from "react";
import { AlertData } from "../components/alert";
import { initialiseAlerts } from "../helpers";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { fetchBackend } from "../helpers";
import { AlertFunc, QuestionStats, PersonResult, TopFiveScore, Question } from "../types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

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


function GetResults(props: {sessionId: string, createAlert: AlertFunc }) {
  const token = localStorage.getItem("token") as string;
  const [results, setResults] = useState<PersonResult[]>([]);
  const [gameData, setGameData] = useState<Question[]>([]);
  const topFiveScore: TopFiveScore[] = [];
  const questionStats: QuestionStats[] = [];
  const responseTimeData: number[] = [];
  const responseTime: number[] = [];


  useEffect(() => {
    const response = fetchBackend("GET", `/admin/session/${parseInt(props.sessionId)}/results`, undefined, token);
    response.then((data) => {
      setResults(data.results);
      console.log(data.results);
    });

    const response2 = fetchBackend("GET", `/admin/session/${parseInt(props.sessionId)}/status`, undefined, token);
    response2.then((data) => {
      setGameData(data.results.questions);
      console.log(data.results.questions);
    });

    // Only run once per session
  }, [props.sessionId]);

  results.map((person, index) => {
    let totalScore = 0;
    person.answers.map((currAnswer) => {
      // Does not account for multiple choice
      if (currAnswer.correct && gameData[index] && gameData[index].points !== undefined) {
        totalScore += gameData[index].points;
      }
      

      if (questionStats.length < index + 1) {
        questionStats.push({questionNumber: `Question ${index + 1}`, amountCorrect: currAnswer.correct ? 1 : 0, totalAttempts: 1});
        responseTimeData.push(calculateSecondsTaken(currAnswer.questionStartedAt, currAnswer.answeredAt));
      } else {
        if (currAnswer.correct) {
          questionStats[index].amountCorrect += 1;
        } 

        questionStats[index].totalAttempts += 1;
        responseTimeData[index] += calculateSecondsTaken(currAnswer.questionStartedAt, currAnswer.answeredAt);
      }
    })


    topFiveScore.push({name: person.name, score: totalScore} );

  });

  // sort top five by score then delete everyone that is not top 5
  topFiveScore.sort((a,b) => b.score - a.score).splice(5, topFiveScore.length);
  responseTimeData.map((totalTime) => {
    responseTime.push(totalTime / results.length);
  });

  return (<section>
    <h1>Top 5 Users!</h1>
    <table className="border-collapse border border-gray-400 ...">
      <thead className="border-collapse border border-gray-400 ...">
        <th className="border-collapse border border-gray-400 ...">Rank</th>
        <th className="border-collapse border border-gray-400 ...">Name</th>
        <th className="border-collapse border border-gray-400 ...">Score</th>
      </thead>
      <tbody >
        {topFiveScore.map((person, index) => {
          return(
            <tr key={index} className="border-collapse border border-gray-400 ...">
              <td className="border-collapse border border-gray-400 ...">{index + 1}</td>
              <td className="border-collapse border border-gray-400 ...">{person.name}</td>
              <td className="border-collapse border border-gray-400 ...">{person.score}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <h1>Average Answer Time!</h1>
    <Bar 
      data={{
        labels: questionStats.map((data) => data.questionNumber),
        datasets: [
          {
            label: "Percentage Correct",
            data: questionStats.map((data) => (data.amountCorrect / data.totalAttempts))
          }
        ]
      }}
    />
    <h1>Average Response Time</h1>
    <Bar 
      data={{
        labels: questionStats.map((data) => data.questionNumber),
        datasets: [
          {
            label: "Average Response Time",
            data: responseTime
          }
        ]
      }}
    />
  </section>)
}

export function ResultsScreen() {
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);
  const { gameId } = useParams() as { gameId: string };
  const { sessionId } = useParams() as { sessionId: string };

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <h1>gameId {gameId}</h1>
    <main className={`bg-indigo-50 p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Results</h1>
      <h1 className="text-4xl font-semibold pb-7">Session: {sessionId.toString()} </h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      <GetResults sessionId={sessionId} createAlert={createAlert}/>
    </main>
    {/* <AlertMenu alerts={alerts} setAlerts={setAlerts} /> */}
  </>)
}