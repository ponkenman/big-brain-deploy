import React from "react"

export type Answer = {
  id: number
  text: string,
  correct: boolean
}

export type Question = {
  id: number,
  type: string,
  media: string | File | null,
  question: string,
  answers: Answer[],
  correctAnswers: string[],
  duration: number
  points: number
}

export enum QuestionType {
  SINGLE_CHOICE = "Single Choice",
  MULTIPLE_CHOICE = "Multiple Choice",
  JUDGEMENT = "Judgement"
}

export enum MediaType {
  IMAGE_MEDIA = "Image",
  VIDEO_MEDIA = "Video",
  TEXT_MEDIA = "Text Stimulus"
}

export type Game = {
  id: number,
  name: string,
  thumbnail: string,
  owner: string,
  active: number | null,
  createdAt: ReturnType<typeof Date.toString>,
  lastUpdatedAt: ReturnType<typeof Date.toString>,
  questions: Question[]
}

export type APIError = {
  error: string
}

export type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type AlertFunc = (message: string) => void;