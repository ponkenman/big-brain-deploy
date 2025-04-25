import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { calculateSecondsTaken, fetchBackend } from "../helpers";
import { QuestionStats, PersonResult, TopFiveScore, Question } from "../types";
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
import { AlertContext } from "../App";
import PointsModal from "../components/modals/pointsModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

/**
 * This function gets the average results for amount of points and answer time, formatting it into a table and charts
 */
function GetResults(props: {sessionId: string }) {
  const token = localStorage.getItem("token") as string;
  const [results, setResults] = useState<PersonResult[]>([]);
  const [gameData, setGameData] = useState<Question[]>([]);
  const topFiveScore: TopFiveScore[] = [];
  const questionStats: QuestionStats[] = [];
  const responseTimeData: number[] = [];
  const responseTime: number[] = [];
  const navigate = useNavigate();
  const createAlert = useContext(AlertContext);

  // Calls get session result and get game data once
  useEffect(() => {
    const response = fetchBackend("GET", `/admin/session/${parseInt(props.sessionId)}/results`, undefined, token);
    response.then((data) => {
      // If no error when getting session results from backend update results using data
      if ("error" in data) {
        createAlert(data.error);
        navigate("/dashboard")
        return;
      }

      setResults(data.results);
    });

    const response2 = fetchBackend("GET", `/admin/session/${parseInt(props.sessionId)}/status`, undefined, token);
    response2.then((data) => {
      // If no error when getting game data from backend update gameData using data
      if ("error" in data) {
        createAlert(data.error);
        navigate("/dashboard")
        return;
      }

      setGameData(data.results.questions);
    });

    // Only run once per session
  }, [props.sessionId]);

  // Iterate through all results
  results.map((person) => {
    let totalScore = 0;

    // Iterate through each person's answer, pushing and adding to the appropriate fields
    person.answers.map((currAnswer, answerIndex) => {
      // Add points if answer is correct and question points exists
      if (currAnswer.correct && gameData[answerIndex] && gameData[answerIndex].points !== undefined) {
        const duration = calculateSecondsTaken(currAnswer.questionStartedAt, currAnswer.answeredAt);
        const questionDuration = gameData[answerIndex].duration;

        // Add appropraite amount of points according to points system
        if (duration < 0.25 * questionDuration) {
          totalScore += gameData[answerIndex].points;
        } else {
          totalScore += Math.ceil(gameData[answerIndex].points * ((duration / questionDuration) - 0.25));
        }
      }

      // If first time iterating through question push otherwise add to existing index
      if (questionStats.length === answerIndex) {
        questionStats.push({questionNumber: `Question ${answerIndex + 1}`, amountCorrect: currAnswer.correct ? 1 : 0, totalAttempts: 1});
        responseTimeData.push(calculateSecondsTaken(currAnswer.questionStartedAt, currAnswer.answeredAt));
      } else {
        if (currAnswer.correct) {
          questionStats[answerIndex].amountCorrect += 1;
        } 

        // Increase totalAttempts and total seconds taken to answer fields
        questionStats[answerIndex].totalAttempts += 1;
        responseTimeData[answerIndex] += calculateSecondsTaken(currAnswer.questionStartedAt, currAnswer.answeredAt);
      }
    })

    // Add each user and their total to top five score
    topFiveScore.push({name: person.name, score: totalScore} );
  });

  // Sort by score then delete everyone that is not top 5
  topFiveScore.sort((a,b) => b.score - a.score).splice(5, topFiveScore.length);
  responseTimeData.map((totalTime) => {
    responseTime.push(totalTime / results.length);
  });

  return (<section>
    <h3 className="text-2xl font-bold pb-7">Top 5 Users!</h3>
    <table>
      <thead className="text-1xl border-collapse border border-gray-400 ...">
        <th className="p-1 border-collapse border border-gray-400 ...">Rank</th>
        <th className="p-1 border-collapse border border-gray-400 ...">Name</th>
        <th className="p-1 border-collapse border border-gray-400 ...">Score</th>
      </thead>
      <tbody >
        {topFiveScore.map((person, index) => {
          return(
            <tr key={index} className="border-collapse border border-gray-400 ...">
              <td className="px-2 border-collapse border border-gray-400 ...">{index + 1}</td>
              <td className="px-2 border-collapse border border-gray-400 ...">{person.name}</td>
              <td className="px-2 border-collapse border border-gray-400 ...">{person.score}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <Bar 
      data={{
        labels: questionStats.map((data) => data.questionNumber),
        datasets: [
          {
            label: "Percentage Correct",
            data: questionStats.map((data) => (data.amountCorrect / data.totalAttempts)),
            borderColor: '#fed7e2',
            backgroundColor: '#fed7e2'
          }
        ]
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Average Percetage Correct Per Question!",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Question Number",
            },
          },
          y: {
            title: {
              display: true,
              text: "Percentage Correct",
            },
            min: 0,
            max: 1,
            ticks: {
              callback: (data) => `${data * 100}%`,
            }
          }, 
        }
      }}
    />
    <Bar 
      data={{
        labels: questionStats.map((data) => data.questionNumber),
        datasets: [
          {
            label: "Average Answer Time",
            data: responseTime.map((data) => data),
            borderColor: '#fed7e2',
            backgroundColor: '#fed7e2'
          }
        ]
      }}
      options={{
        plugins: {
          title: {
            display: true,
            text: "Average Answer Time Per Question!",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Question Number",
            },
          },
          y: {
            title: {
              display: true,
              text: "Time (seconds)",
            },
          }, 
        }
      }}
    />
  </section>)
}

/**
 * This function displays the overall result screen, everything from the dashboard to the graphs
 */
export function ResultsScreen() {
  const { gameId } = useParams() as { gameId: string };
  const { sessionId } = useParams() as { sessionId: string };
  const [modal, setModal] = useState(false);

  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-white p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Results</h1>
      <h2 className="text-xl font-semibold pb-7">Session: {sessionId.toString()}</h2>
      <div className="flex flex-row gap-2 mb-5">
        <Link to="/dashboard">
          <Button text="Back to dashboard" color="bg-pink-200" hoverColor="hover:bg-pink-400" />
        </Link>
        <Button text="How do points work?" color="bg-pink-200" hoverColor="hover:bg-pink-400" onClick={() => setModal(true)}/>
      </div>
      <PointsModal visible={modal} setVisible={setModal} />
      <GetResults sessionId={sessionId} />
    </main>
  </>)
}