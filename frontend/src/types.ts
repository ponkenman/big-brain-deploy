import React from "react"

export type Answer = {
  id: number
  text: string,
  correct: boolean
}

export type DurationPoints = {
  duration: number,
  points: number
}

export enum QuestionType {
  SINGLE_CHOICE = "Single Choice",
  MULTIPLE_CHOICE = "Multiple Choice",
  JUDGEMENT = "Judgement"
}

export enum MediaType {
  NONE = "None",
  IMAGE = "Image",
  VIDEO = "Video",
  TEXT = "Text Stimulus"
}

export type Question = {
  id: number,
  type: string,
  media: string,
  mediaType: string
  question: string,
  answers: Answer[],
  correctAnswers: string[],
  duration: number
  points: number,
  index: number
}

export interface QuestionPlayerData extends Omit<Question, "correctAnswers"> {
  isoTimeLastQuestionStarted: ReturnType<typeof Date.toString>
}

export type Game = {
  pastSessions: PastSessions[],
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number | null,
  createdAt: ReturnType<typeof Date.toString>,
  lastUpdatedAt: ReturnType<typeof Date.toString>,
  questions: Question[]
}

export type AnswerResult = {
  answeredAt: ReturnType<typeof Date.toString>,
  answers: string[],
  correct: boolean, 
  questionStartedAt: ReturnType<typeof Date.toString>
}

export type PersonResult = {
  answers: AnswerResult[],
  name: string
}

export type GameResults = {
  results: PersonResult[]
}

export type PastSessions = {
  pastSessionId: number | null,
  result: PersonResult[]
}

export type TopFiveScore = {
  name: string,
  score: number
}

export type QuestionStats = {
  questionNumber: string,
  amountCorrect: number,
  totalAttempts: number
}

export type APIError = {
  error: string
}

export enum FileMedia {
  PNG = ".png",
  JPG = ".jpg",
  JPEG = ".jpeg"
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

