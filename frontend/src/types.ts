import React from "react"

export type AnswersOptions = {
  text: string,
  correct: boolean
}

export type Question = {
  id: number,
  type: string,
  media: string,
  question: string,
  answers: AnswersOptions[],
  duration: number
  points: number
}

export enum QuestionType {
  SINGLE_CHOICE = "Single Choice",
  MULTIPLE_CHOICE = "Multiple Choice",
  JUDGEMENT = "Judgement"
}

export type Game = {
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number,

  createdAt: ReturnType<typeof Date.toString>,
  questions: Question[]
}

export type APIError = {
  error: string
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type AlertFunc = (message: string) => void;