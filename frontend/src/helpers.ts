import { Answer, AnswerResult, Game, MediaType, PastSessions, PersonResult, Question, QuestionType } from "./types";

/***
 * Valid fetch option interface for backend calls
 */
interface FetchOptions {
  method: "GET"|"POST"|"PUT"|"DELETE",
  headers: Record<string, string>,
  body?: string
}

/***
 * A function that modularises backend function calls
 */
export async function fetchBackend(
  httpMethod: "GET"|"POST"|"PUT"|"DELETE", 
  urlFragment: string,
  options?: Record<string, string> | object,
  token?: string
) {
  const urlMain = "http://localhost:5005";
  const fetchOptions: FetchOptions = {
    method: httpMethod,
    headers: {
      "Content-type": "application/json",
    },
    body: options ? JSON.stringify(options) : undefined
  };
  if (token) {
    fetchOptions.headers["Authorization"] = token;
  }
  console.log(urlMain + urlFragment);
  const response = await fetch(urlMain + urlFragment, fetchOptions);

  const data = await response.json();
  console.log(data);
  return data;
  //return await response.json();
}

/**
 * This function is taken from COMP6080 25T1 Assignment 3!
 * 
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file: File) {
  const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  
  const reader = new FileReader();
  const dataUrlPromise = new Promise<string>((resolve,reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

/***
 * Default answer template as a placeholder
 */
export function createSampleAnswer(): Answer {
  return {
    text: "", 
    correct: false, 
    id: Math.floor(Math.random() * 1000000)
  };
}

/***
 * Default question template as a placeholder
 */
export function createDefaultQuestion(): Question {
  return {
    id: Math.floor(Math.random() * 1000000),
    type: QuestionType.SINGLE_CHOICE,
    media: "",
    mediaType: MediaType.NONE,
    question: "",
    answers: [createSampleAnswer(), createSampleAnswer()],
    correctAnswers: [],
    duration: 10,
    points: 5,
    index: -1
  }
}

/**
 * Sample judgement answers serving as placeholders
 */
export const sampleJudgementAnswers = [{
  id: Math.floor(Math.random() * 1000000),
  text: "True",
  correct: false,
}, {
  id: Math.floor(Math.random() * 1000000),
  text: "False",
  correct: true,
}];

/**
 * Type guard for isAnswer, checking if all relevant fields are valid for type Answer
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isAnswer(data: unknown) {
  const ans = data as Answer;

  return typeof ans.id === "number" && 
  typeof ans.text === "string" &&
  typeof ans.correct === "boolean";
}

/**
 * Type guard for isQuestion, checking if all relevant fields are valid for type Question
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isQuestion(data: unknown) {
  const q = data as Question;

  return typeof q.id === "number" &&
  typeof q.type === "string" &&
  typeof q.media === "string" &&
  typeof q.mediaType === "string" &&
  q.answers &&
  Array.isArray(q.answers) &&
  q.answers.every(ans => isAnswer(ans)) &&
  q.correctAnswers &&
  Array.isArray(q.correctAnswers) &&
  q.correctAnswers.every(correctAns => typeof correctAns === "string") &&
  typeof q.duration === "number" &&
  typeof q.points === "number" &&
  typeof q.index === "number";
}

/**
 * Type guard for isDate, checking if the string passed in is a valid date
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isDate(data: unknown) {
  const date = new Date (data as Date);

  return  date instanceof Date && !isNaN(date.getTime());
}

/**
 * Type guard for isAnswerResult, checking if all relevant fields are valid for type AnswerResult
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isAnswerResult(data: unknown) {
  const aR = data as AnswerResult;

  return isDate(aR.answeredAt) &&
  aR.answers &&
  Array.isArray(aR.answers) &&
  aR.answers.every(ans => typeof ans === "string") &&
  typeof aR.correct === "boolean" &&
  isDate(aR.questionStartedAt);
}

/**
 * Type guard for isPersonResult, checking if all relevant fields are valid for type PersonResult
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isPersonResult(data: unknown) {
  const pR = data as PersonResult;

  return pR.answers &&
  Array.isArray(pR.answers) &&
  pR.answers.every(ans => isAnswerResult(ans)) &&
  typeof pR.name === "string";
}

/**
 * Type guard for isPastSessions, checking if all relevant fields are valid for type PastSessions
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isPastSessions(data: unknown) {
  const pS = data as PastSessions;

  return typeof pS.pastSessionId === "number" &&
  pS.result &&
  Array.isArray(pS.result) &&
  pS.result.every(result => isPersonResult(result));
}

/**
 * Type guard for isGame, checking if all relevant fields are valid for type Game
 * 
 * @param data - The JSON.parsed object
 * @returns - True if valid, false if invalid
 */
export function isGame(data: unknown) {
  const g = data as Game;
  
  return Array.isArray(g.pastSessions) &&
  g.pastSessions.every(sesh => isPastSessions(sesh)) &&
  typeof g.id === "number" &&
  typeof g.name === "string" &&
  typeof g.thumbnail === "string" &&
  (typeof g.active === "number" || g.active ===  null) &&
  isDate(g.createdAt) &&
  isDate(g.lastUpdatedAt) &&
  Array.isArray(g.questions) &&
  g.questions.every(ques => isQuestion(ques));
}

/**
 * Returns string representing total duration from one date to another
 * @param from - earlier date
 * @param to - later date
 * @returns
 */
export function durationAgo(from: Date, to: Date) {
  const totalSeconds = Math.floor((to.getTime() - from.getTime()) / 1000);
  let returnString = '';
  if (totalSeconds < 60) {
    return `Less than 1 minute ago`;
  }
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  if (days > 0) {
    returnString += `${days} day${days > 1 ? `s` : ``} `;
  }
  const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
  if (hours > 0) {
    returnString += `${hours} hour${hours > 1 ? `s` : ``} `;
  }
  const minutes = Math.floor((totalSeconds / 60) % 60);
  if (minutes > 0) {
    returnString += `${minutes} minute${minutes > 1 ? `s` : ``}  `;
  }
  return returnString.trim();
}

/**
 * This calculates the seconds taken to answer a questions
 * 
 * @param Date1 - The question start at time
 * @param Date2 - The question end at time
 * @returns Time taken in seconds rounded down
 */
export function calculateSecondsTaken(Date1: ReturnType<typeof Date.toString>, Date2: ReturnType<typeof Date.toString>) {
  const start = new Date(Date1);
  const end = new Date(Date2);

  return Math.floor((end.getTime() - start.getTime()) / 1000);
}

/** Tailwind CSS class to use as second argument of createAlert function for  */
export const ALERT_SUCCESS = "bg-green-200 text-green-950 border border-green-300";

