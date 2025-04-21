import { AlertData } from "./components/alert";
import { Answer, AnswerResult, Game, MediaType, PastSessions, PersonResult, Question, QuestionType, StateSetter } from "./types";

interface FetchOptions {
  method: "GET"|"POST"|"PUT"|"DELETE",
  headers: Record<string, string>,
  body?: string
}

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

  const response = await fetch(urlMain + urlFragment, fetchOptions);
  return await response.json();
}

export function initialiseAlerts(alerts: AlertData[], setAlerts: StateSetter<AlertData[]>, alertId: number, setAlertId: StateSetter<number>) {
  return function(message: string) {
    setAlerts([...alerts, { message: message, key: alertId }]);
    setAlertId(alertId + 1);
  }
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

export function createSampleAnswer(): Answer {
  return {
    text: "", 
    correct: false, 
    id: Math.floor(Math.random() * 1000000)
  };
}

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

export const sampleJudgementAnswers = [{
  id: Math.floor(Math.random() * 1000000),
  text: "True",
  correct: false,
}, {
  id: Math.floor(Math.random() * 1000000),
  text: "False",
  correct: true,
}];

export function isAnswer(data: unknown) {
  const ans = data as Answer;

  return typeof ans.id === "number" && 
  typeof ans.text === "string" &&
  typeof ans.correct === "boolean";
}

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

export function isDate(data: unknown) {
  const date = data as Date;

  return  date instanceof Date && !isNaN(date.getTime());
}

export function isAnswerResult(data: unknown) {
  const aR = data as AnswerResult;

  return isDate(aR.answeredAt) &&
  aR.answers &&
  Array.isArray(aR.answers) &&
  aR.answers.every(ans => typeof ans === "string") &&
  typeof aR.correct === "boolean" &&
  isDate(aR.questionStartedAt);
}

export function isPersonResult(data: unknown) {
  const pR = data as PersonResult;

  return pR.answers &&
  Array.isArray(pR.answers) &&
  pR.answers.every(ans => isAnswerResult(ans)) &&
  typeof pR.name === "string";
}

export function isPastSessions(data: unknown) {
  const pS = data as PastSessions;

  return typeof pS.pastSessionId === "number" &&
  isPersonResult(pS.result);
}

export function isGame(data: unknown) {
  const g = data as Game;
  
  return typeof g.id === "number" &&
  typeof g.name === "string" &&
  typeof g.thumbnail === "string" &&
  typeof g.owner === "string" &&
  typeof g.active === "number" &&
  isDate(g.createdAt) &&
  isDate(g.lastUpdatedAt) &&
  g.questions &&
  Array.isArray(g.questions) &&
  g.questions.every(ques => isQuestion(ques));
}

