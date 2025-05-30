import { describe, expect, it } from 'vitest'
import GameCard from '../components/games/gameCard'
import { fireEvent, render, screen } from '@testing-library/react'
import { Game } from '../types'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const defaultProps: { gameId: number, games: Game[], setGamesLength: () => void } = {
  gameId: 11619,
  games: [{
    active: null,
    createdAt: '2025-04-22T11:55:19.491Z',
    id: 11619,
    lastUpdatedAt: '2025-04-22T11:55:19.491Z',
    name: 'My test game 1',
    pastSessions: [],
    owner: 'test@email.com',
    thumbnail: '',
    questions: [
      {
        id: 262953,
        type: 'Single Choice',
        media: '',
        mediaType: 'None',
        question: '1',
        answers: [
          {
            text: '',
            correct: false,
            id: 39936,
          },
          {
            text: '',
            correct: false,
            id: 914962,
          },
        ],
        correctAnswers: [],
        duration: 10,
        points: 10,
        index: 1,
      },
      {
        id: 17852,
        type: 'Single Choice',
        media: '',
        mediaType: 'None',
        question: '2',
        answers: [
          {
            text: '',
            correct: false,
            id: 27797,
          },
          {
            text: '',
            correct: false,
            id: 60535,
          },
        ],
        correctAnswers: [],
        duration: 30,
        points: 5,
        index: 2,
      },
      {
        id: 818853,
        type: 'Single Choice',
        media: '',
        mediaType: 'None',
        question: '3',
        answers: [
          {
            text: '',
            correct: false,
            id: 34325,
          },
          {
            text: '',
            correct: false,
            id: 89364,
          },
        ],
        correctAnswers: [],
        duration: 60,
        points: 20,
        index: 3,
      },
    ],
  }],
  setGamesLength: () => {},
}

// Note: need to wrap in Router as implementation uses useNavigate
const TestGameCard = (props: { gameId: number, games: Game[], setGamesLength: () => void }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<GameCard {...props} />} />
      </Routes>
    </BrowserRouter>
  )
}

describe('GameCard', () => {
  it('renders', () => {
    render(<TestGameCard {...defaultProps} />)
  })

  it('Shows correct details of game and buttons', () => {
    render(<TestGameCard {...defaultProps} />)

    // All data of game is displayed correctly
    expect(screen.getByText('My test game 1')).toBeVisible()
    expect(screen.getByText('3 Questions')).toBeVisible()
    expect(screen.getByText('100 seconds')).toBeVisible()
    expect(screen.getByText('Start game')).toBeVisible()
    expect(screen.getByText('View past sessions')).toBeVisible()
  })

  it('Can open and close delete modal', () => {
    render(<TestGameCard {...defaultProps} />)
    // Modal can open and exists
    fireEvent.click(screen.getByAltText('Delete game'))
    expect(screen.getByText('Confirm delete')).toBeVisible()
    fireEvent.click(screen.getByText('Cancel'))
  })

  it('Displays new buttons if game active', () => {
    const activeGameProps: { gameId: number, games: Game[], setGamesLength: () => void } = {
      gameId: 11619,
      games: [{
        active: 111111,
        createdAt: '2025-04-22T11:55:19.491Z',
        id: 11619,
        lastUpdatedAt: '2025-04-22T11:55:19.491Z',
        name: 'My test game 1',
        pastSessions: [],
        owner: 'test@email.com',
        thumbnail: '',
        questions: [
          {
            id: 262953,
            type: 'Single Choice',
            media: '',
            mediaType: 'None',
            question: '1',
            answers: [
              {
                text: '',
                correct: false,
                id: 39936,
              },
              {
                text: '',
                correct: false,
                id: 914962,
              },
            ],
            correctAnswers: [],
            duration: 10,
            points: 10,
            index: 1,
          },
          {
            id: 17852,
            type: 'Single Choice',
            media: '',
            mediaType: 'None',
            question: '2',
            answers: [
              {
                text: '',
                correct: false,
                id: 27797,
              },
              {
                text: '',
                correct: false,
                id: 60535,
              },
            ],
            correctAnswers: [],
            duration: 30,
            points: 5,
            index: 2,
          },
          {
            id: 818853,
            type: 'Single Choice',
            media: '',
            mediaType: 'None',
            question: '3',
            answers: [
              {
                text: '',
                correct: false,
                id: 34325,
              },
              {
                text: '',
                correct: false,
                id: 89364,
              },
            ],
            correctAnswers: [],
            duration: 60,
            points: 20,
            index: 3,
          },
        ],
      }],
      setGamesLength: () => {},
    }

    render(<TestGameCard {...activeGameProps} />)
    expect(screen.getByText('Active')).toBeVisible()
    expect(screen.getByText('Manage session')).toBeVisible()
    expect(screen.getByText('Stop game')).toBeVisible()
    // Start game button no longer exists
    expect(screen.queryByText('Start game')).toBeNull()
  })
})
