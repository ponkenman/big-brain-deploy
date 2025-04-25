import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import LogoutButton from '../components/buttons/logoutButton'
import Button from '../components/buttons/button'
import { calculateSecondsTaken, fetchBackend } from '../helpers'
import { AnswerResult } from '../types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import PointsModal from '../components/modals/pointsModal'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

/**
 * This function gets the individual results for amount of points and answer time, formatting it into charts
 */
function GetIndivudalResults() {
  const playerId = localStorage.getItem('playerId')
  const durationPointsString = localStorage.getItem('durationPoints')
  const durationPoints = JSON.parse(durationPointsString as string)
  const [results, setResults] = useState<AnswerResult[]>([])
  const playerScore: number[] = []
  const questionNumber: string[] = []

  // Calls get player result once, setting the data using useState
  useEffect(() => {
    const response = fetchBackend('GET', `/play/${playerId}/results`, undefined)
    response.then((data) => {
      setResults(data)
    })

    // Playerid in the dependency makes it only run once per session
  }, [playerId])

  // Iterate through all results for each question
  results.map((question, index) => {
    // If correct, add points
    if (question.correct && durationPoints[index + 1]
      && durationPoints[index + 1].duration !== undefined && durationPoints[index + 1].points) {
      const points = durationPoints[index + 1].points
      const ansDuration = calculateSecondsTaken(question.questionStartedAt, question.answeredAt)
      const questionDuration = durationPoints[index + 1].duration

      // Add appropraite amount of points according to points system
      if (ansDuration < 0.25 * questionDuration) {
        playerScore.push(points)
      }
      else {
        playerScore.push(Math.ceil(points * (1 - ((ansDuration / questionDuration) - 0.25))))
      }
    }

    // Add question number to array
    questionNumber.push(`Question ${index + 1}`)
  })

  return (
    <section>
      <Bar
        data={{
          labels: questionNumber.map(data => data),
          datasets: [
            {
              label: 'Points per questions',
              data: playerScore.map(data => data),
              borderColor: '#fed7e2',
              backgroundColor: '#fed7e2',
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Your Points Per Question!',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Question Number',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Points',
              },
            },
          },
        }}
      />
      <Bar
        data={{
          labels: questionNumber.map(data => data),
          datasets: [
            {
              label: 'Answer time per questions',
              data: results.map(data => calculateSecondsTaken(data.questionStartedAt, data.answeredAt)),
              borderColor: '#fed7e2',
              backgroundColor: '#fed7e2',
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: 'Your Answer Time Per Question!',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Question Number',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Time (seconds)',
              },
            },
          },
        }}
      />
    </section>
  )
}

/**
 * This function displays the player result screen, everything from the dashboard to the graphs
 */
export function PlayerResultsScreen() {
  const [modal, setModal] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  return (
    <>
      <Navbar>
        {token !== 'null'
          ? (
            <LogoutButton />
          )
          : (
            <Button text="Login" color="bg-pink-200 "hoverColor="hover:bg-pink-400" onClick={() => navigate('/login')} />

          )}
      </Navbar>
      <main className="p-7 w-screen absolute top-15 min-h-full">
        <h1 className="text-4xl font-semibold pb-7">Here are the your results!</h1>
        {token === 'null' && (
          <h2 className="text-2xl font-semibold pb-7">You completed this Quiz! Feel free to close this tab or login when you've finished looking at results!</h2>
        )}
        <div className="flex flex-column gap-2">
          {token !== 'null' && (
            <Link to="/dashboard">
              <Button text="Back to dashboard" color="bg-pink-200" hoverColor="hover:bg-pink-400" />
            </Link>
          )}
          <Button text="How do points work?" color="bg-pink-200" hoverColor="hover:bg-pink-400" onClick={() => setModal(true)} />
        </div>
        <PointsModal visible={modal} setVisible={setModal} />
        <GetIndivudalResults />
      </main>
    </>
  )
}
