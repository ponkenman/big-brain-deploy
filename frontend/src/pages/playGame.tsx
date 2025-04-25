import { useContext, useEffect, useState } from 'react'
import { fetchBackend } from '../helpers'
import Navbar from '../components/navbar'
import { useNavigate } from 'react-router-dom'
import { Answer, DurationPoints, MediaType, QuestionPlayerData, QuestionType } from '../types'
import { AlertContext } from '../App'
import Button from '../components/buttons/button'

/**
 * This function displays the media from the question
 *
 * @param props - The passed in question
 */
function QuestionMediaDisplay(props: { question: QuestionPlayerData }) {
  let component
  switch (props.question.mediaType) {
  case MediaType.TEXT:
    component = (
      <div className="py-2 w-full flex flex-row justify-center">
        <div className="border rounded-xl overflow-hidden border-pink-400 bg-pink-200 max-w-100 my-4 p-3 min-w-60 min-h-40">
          <p className="text-xl text-center">{props.question.media}</p>
        </div>
      </div>
    );
    break;
  case MediaType.VIDEO:
    component = (
      <div className="py-2 w-full flex flex-row justify-center">
        <div className="my-4">
          <iframe className="md:w-150 w-100 md:h-75 h-50" src={props.question.media} />
        </div>
      </div>
    );
    break;
  case MediaType.IMAGE:
    component = (
      <div className="py-2 w-full flex flex-row justify-center">
        <div className="border rounded-xl overflow-hidden border-pink-400 bg-pink-200 max-w-100 my-4">
          <img src={props.question.media} alt="Image for your question" className="object-cover object-center" />
        </div>
      </div>
    );
    break;
  default:
    component = <></>
  }

  return (component)
}

/**
 * This function returns the time remaining in seconds
 */
function questionTimeRemaining(question: QuestionPlayerData) {
  const date = new Date(question.isoTimeLastQuestionStarted)
  date.setSeconds(date.getSeconds() + question.duration)

  return Math.floor((date.getTime() - Date.now()) / 1000)
}

/**
 * This function handles all game logic, displays the current question media and the answers
 */
function QuestionScreen() {
  const [question, setQuestion] = useState<QuestionPlayerData | undefined>()
  const [secondsRemaining, setSecondsRemaining] = useState<number | undefined>()
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([])
  const [correctAnswers, setCorrectAnswers] = useState<string[] | undefined>()
  const [durationPoints, setDurationPoints] = useState<DurationPoints[]>([])

  const playerId = localStorage.getItem('playerId')
  const navigate = useNavigate()
  const createAlert = useContext(AlertContext)

  let timerExists = false
  let currQuestionId: number

  // Get current question from backend and add relevant information to local storage
  useEffect(() => {
    (fetchBackend('GET', `/play/${playerId}/question`)).then((data) => {
      const currDurationPoints: DurationPoints = {
        duration: data.question.duration,
        points: data.question.points,
      }

      // Append previous current question duration and points to previous to be used in playerResults
      setDurationPoints(prev => [...prev, currDurationPoints])

      localStorage.setItem('durationPoints', JSON.stringify(durationPoints))
    })
    // Run everytime the question changes
  }, [question])

  // Get current question from backend, set question if different and poll every second for countdown
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>
    function requestBackend() {
      (fetchBackend('GET', `/play/${playerId}/question`) as Promise<{ question: QuestionPlayerData } | { error: string }>).then((data) => {
        // If can't find current question, game has navigate to view results
        if ('error' in data) {
          navigate(`/play/${playerId}}/results`)
          return
        }

        // If new question, set question and call setSeconds remaning to initiate countdown from other useEffect
        if (data.question.id != currQuestionId) {
          setQuestion(data.question)
          currQuestionId = data.question.id
          if (questionTimeRemaining(data.question) > 0) {
            setSecondsRemaining(questionTimeRemaining(data.question))
          }
          else {
            setSecondsRemaining(0)
          }
        }
        // Only set a new timer when former promise resolved to prevent race issues (where earlier promise is resolved later)
        timerId = setTimeout(requestBackend, 1000)
      })
    }
    // Prevent running twice in strict mode
    if (!timerExists) {
      requestBackend()
      timerExists = true
    }

    return () => clearTimeout(timerId)
  }, [])

  // Countdown logic- Updates seconds remaining everytime it changes, ending when time reamining reaches 0
  useEffect(() => {
    // If invalid question, don't countdown
    if (!question) {
      return
    }

    let timer: ReturnType<typeof setTimeout>
    const timeRemaining = questionTimeRemaining(question)

    // If valid question and timeRemaining is greater than 0, countdown and loop again
    if (timeRemaining > 0) {
      timer = setTimeout(() => setSecondsRemaining(questionTimeRemaining(question)), 1000)
    }

    return () => clearTimeout(timer)
  }, [secondsRemaining])

  // Check if countdown has run out in order to submit answers
  useEffect(() => {
    // Check if countdown is active
    if (secondsRemaining === undefined || secondsRemaining > 0) {
      return
    }

    // One second buffer to fetch question data
    setTimeout(() => {
      fetchBackend('GET', `/play/${playerId}/answer`).then((data) => {
        if (data.error) {
          return
        }
        // If countdown is not active, set answers
        setCorrectAnswers(data.answers)
      })
    }, 1000)
  }, [secondsRemaining])

  // This function contains the logic for changing an answer
  function changeAnswer(answer: Answer) {
    if (!question) {
      return
    }
    const time = questionTimeRemaining(question)
    if (time < 0) {
      createAlert('You can no longer change your answers!')
      return
    }
    const index = selectedAnswers.findIndex(a => a.id === answer.id)
    let newAnswers: Answer[]
    if (index === -1) {
      // Attempting to select new answer
      if (question.type === QuestionType.SINGLE_CHOICE || question.type === QuestionType.JUDGEMENT) {
        // Only allow one answer to be selected
        newAnswers = [answer]
      }
      else {
        // Allow multiple answers to be selected
        newAnswers = [...selectedAnswers, answer]
      }
    }
    else {
      // Deselecting a current answer
      if (selectedAnswers.length === 1) {
        createAlert('You must have at least one answer!')
        return
      }
      newAnswers = selectedAnswers.toSpliced(index, 1)
    }
    setSelectedAnswers(newAnswers)

    const body = {
      answers: newAnswers.map(a => a.text),
    }

    fetchBackend('PUT', `/play/${playerId}/answer`, body).then(d => console.log(d))
  }

  // Reset selectedAnswers and correctAnswers on new question
  useEffect(() => {
    setSelectedAnswers([])
    setCorrectAnswers(undefined)
  }, [question])

  return (question !== undefined
    ? (
      <>
        <section>
          <h2 className="text-4xl font-semibold pb-7">{`${question.index}) ${question.question}`}</h2>
          <div className="p-4 rounded-lg bg-pink-200">
            <QuestionMediaDisplay question={question} />
            <div className="flex flex-col items-center gap-2">
              <p className="rounded-full bg-pink-400 text-white px-2 py-1 border border-gray-400">{secondsRemaining === 0 ? `Time's up!` : `Seconds`}</p>
              <div className="text-white rounded-full w-10 h-10 font-semibold text-md bg-pink-400 border border-gray-400 text-center align-middle flex flex-col items-center justify-center"><p>{secondsRemaining}</p></div>
            </div>
            <p className="font-semibold">
              Question type:{question.type}
            </p>
            { correctAnswers !== undefined && (
              <p>
                Correct answers were:{correctAnswers.toString()}
              </p>
            )}
          </div>
        </section>
        <section className={`grid ${question.answers.length > 2 ? `xl:grid-cols-3` : ``} md:grid-cols-2 gap-4 bg-gray-200 rounded-lg p-5 mt-7`}>
          {question.answers.map(ans => (
            <button onClick={() => changeAnswer(ans)} key={ans.id} className={`${selectedAnswers.findIndex(a => a.id === ans.id) > -1 ? `bg-pink-400 text-white` : `bg-pink-200`} ${correctAnswers !== undefined ? (correctAnswers.some(text => ans.text === text) ? `border-green-500 border-2` : `border-red-500 border-2`) : `border-black border`} p-2 rounded-lg min-h-30 flex justify-center items-center cursor-pointer shadow-xl hover:opacity-50 relative`}>
              <p className="text-center align-middle text-xl font-semibold">{ans.text}</p>
            </button>
          ))}
        </section>
      </>
    )
    : (
      <>
        Loading...
      </>
    ))
}

/**
 * Screen visible to player while game has not yet started
 */
function LobbyScreen() {
  const [text, setText] = useState('Play minigame')
  const [isPlaying, setIsPlaying] = useState(false)
  const [timestamp, setTimestamp] = useState<number>(0)
  const [isGreen, setIsGreen] = useState(false)
  const [leaderboard, setLeaderboard] = useState<number[]>([])
  const [recentScore, setRecentScore] = useState<string>('')

  // Mini game to test reaction time
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>

    // Check if game has started
    if (!isGreen && isPlaying) {
      // Run only after 2 seconds, then regular intervals thereafter
      timer = setTimeout(() => {
        timer = setInterval(() => {
          if (!isGreen && isPlaying) {
            // Generate random numbers until 7, setting state to green
            const randomNum = Math.floor(Math.random() * 10)
            if (randomNum === 7) {
              setText('Now!')
              setTimestamp(Date.now())
              setIsGreen(true)
            }

            if (randomNum === 2) {
              setText('Almost there...')
            }
          }
        }, 300)
      }, 2 * 1000)
    }

    return () => clearInterval(timer)
  }, [isPlaying, isGreen])

  // This function handles the user input when testing reaction time
  function onClick() {
    const responseTime = Date.now()
    if (!isPlaying) {
      setIsPlaying(true)
      setText('Wait...')
      return
    }

    // If button is clicked when not green, reset
    if (!isGreen) {
      setRecentScore(`Failed!`)
      setText('Play minigame')
      setTimestamp(0)
      setIsGreen(false)
      setIsPlaying(false)
      return
    }

    const score = responseTime - timestamp
    setRecentScore(`${score} ms`)
    // If valid click, add to sorted leaderboard
    if (leaderboard.length < 5) {
      setLeaderboard([...leaderboard, score].toSorted((a, b) => a - b))
    }
    else {
      const firstSmaller = leaderboard.findIndex(n => n > score)
      if (firstSmaller !== -1) {
        const newLeaderboard = leaderboard.toSpliced(firstSmaller, 0, score)
        newLeaderboard.pop()
        setLeaderboard(newLeaderboard)
      }
    }

    // Reset mini-game
    setText('Play minigame')
    setTimestamp(0)
    setIsGreen(false)
    setIsPlaying(false)
  }

  return (
    <>
      <h1 className="text-4xl font-semibold pb-7">Game lobby</h1>
      <p className="mb-4">Please wait for game to start!</p>
      <div className="p-4 bg-gray-100 rounded-lg items-center">
        <p className="my-5">
          While you're waiting, why not test your reflexes? After pressing the button below, press the button again when it turns
          <span className="font-semibold">green</span>
          {' '}
          and see how fast your reflexes are!
        </p>
        <Button text={text} color={isPlaying ? (isGreen ? 'bg-green-300' : 'bg-red-300') : 'bg-pink-300'} hoverColor={isPlaying ? '' : 'hover:bg-pink-400 hover:text-white'} onClick={onClick} />
        { (leaderboard.length !== 0 || recentScore !== '') && (
          <div className="mt-3 p-3 bg-pink-200 rounded-lg">
            { recentScore !== '' && (
              <p className="font-semibold">
                Recent score:
                {recentScore}
              </p>
            )}
            { leaderboard.length !== 0 && (
              <>
                <p className="font-semibold">Leaderboard</p>
                {leaderboard.map((score, index) => <p key={`${index}-${score}`}>{`#${index + 1} ${score} ms`}</p>)}
              </>
            )}
          </div>
        )}
      </div>

    </>
  )
}

/**
 * This function handles the logic for game state screen, displaying lobby or questions screen
 */
function GameStateScreen() {
  const [started, setStarted] = useState(false)
  const navigate = useNavigate()
  const createAlert = useContext(AlertContext)
  let timerExists = false

  useEffect(() => {
    // Requests session data every second and updates corresponding values only if data changed
    let timerId: ReturnType<typeof setTimeout>

    // Get player status from backend
    function requestBackend() {
      const playerId = localStorage.getItem('playerId')
      if (started === false) {
        fetchBackend('GET', `/play/${playerId}/status`).then((data) => {
          // Handle errors, navigiating to joinGame page if session has ended early otherwise create an alert
          if (data.error) {
            if (data.error === 'Session ID is not an active session') {
              // Session has stopped early
              // localStorage.clear(); // comment only if testing in same browser
              navigate(`/join`)
            }
            else {
              createAlert(data.error)
            }
            return
          }

          // If game started does not match, set according to get request
          if (started != data.started) {
            setStarted(data.started)
          }
          else {
            // Only set a new timer when former promise resolved to prevent race issues (where earlier promise is resolved later)
            timerId = setTimeout(requestBackend, 1000)
          }
        })
      }
    }

    // Prevent running twice in strictm ode
    if (!timerExists) {
      timerExists = true
      requestBackend()
    }
    return () => clearTimeout(timerId)
  }, [])

  return (started === false
    ? <LobbyScreen />
    : <QuestionScreen />
  )
}

/**
 * This function displays the overall play game screen, everything from the dashboard to lobby and questions
 */
export function PlayGameScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const playerId = localStorage.getItem('playerId')
    if (!playerId) {
      navigate(`/join`)
    }
  }, [])

  return (
    <>
      <Navbar>
        <div className="bg-pink-100 text-base p-2 rounded-lg text-center min-w-20">
          {localStorage.getItem('playerName') ?? `Player`}
        </div>
      </Navbar>
      <main className="bg-white p-7 w-screen absolute top-15 min-h-full">
        <GameStateScreen />
      </main>
    </>
  )
}
