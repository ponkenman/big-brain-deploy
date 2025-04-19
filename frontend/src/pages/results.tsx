import { useEffect, useState } from "react";
import { AlertData, AlertMenu } from "../components/alert";
import { initialiseAlerts } from "../helpers";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { fetchBackend } from "../helpers";
import { AlertFunc, QuestionStats, PersonResult, TopFiveScore } from "../types";
// import Modal from "../components/modal";

// A table of up to top 5 users and their score
// A bar/line chart showing a breakdown of what percentage of people (Y axis) got certain questions (X axis) correct
// A chart showing the average response/answer time for each question
// Any other interesting information you see fit (Bonus mark can be granted for this based on your implementation)

function GetResults(props: {sessionId: string, createAlert: AlertFunc }) {
  const token = localStorage.getItem("token") as string;
  const [results, setResults] = useState<PersonResult[]>([]);
  const topFiveScore: TopFiveScore[] = [];
  const questionStats: QuestionStats[] = [];
  // const responseTime = [];

  useEffect(() => {
    const response = fetchBackend("GET", `/admin/session/${parseInt(props.sessionId)}/results`, undefined, token);
    response.then((data) => {
      setResults(data.results);
      console.log(results);
    });

    // Only run once per session
  }, [props.sessionId]);

  results.map((person, index) => {
    let totalScore = 0;
    person.answers.map((currAnswer) => {
      if (currAnswer.correct) {
        totalScore += 1;
      }

      if (questionStats.length < index + 1) {
        questionStats.push({amountCorrect: currAnswer.correct ? 1 : 0, totalAttempts: 1});
      } else {
        if (currAnswer.correct) {
          questionStats[index].amountCorrect += 1;
        } 
        questionStats[index].totalAttempts += 1;
      }
    })


    topFiveScore.push({name: person.name, score: totalScore} );

  });

  // sort top five by score then delete everyone that is not top 5
  topFiveScore.sort((a,b) => b.score - a.score).splice(5, topFiveScore.length);

  return (<section>
    <p>something reulsts?</p>
    <h1>Top 5 Users!</h1>
    <table>
      <thead>
        <th>Rank</th>
        <th>Name</th>
        <th>Score</th>
      </thead>
      <tbody>
        {topFiveScore.map((person, index) => {
          return(
            <tr>
              <td>{index + 1}</td>
              <td>{person.name}</td>
              <td>{person.score}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
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
      <h1 className="text-4xl font-semibold pb-7">Session: {sessionId} </h1>
      <Link to="/dashboard">
        <Button text="Back to dashboard" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
      <GetResults sessionId={sessionId} createAlert={createAlert}/>
    </main>
    {/* <AlertMenu alerts={alerts} setAlerts={setAlerts} /> */}
  </>)
}