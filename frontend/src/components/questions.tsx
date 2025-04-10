import {useState} from "react";
import TextInput from "./textInput";
import Button from "../components/button";

type AnswersOptions = {
  text: string,
  correct: boolean
}

type Question = {
  id: number,
  type: string,
  thumbnail: string,
  question: string,
  answers: AnswersOptions[],
  duration: number
  points: number
}

export default function Questions(props: {text: string, labelName: string, id: string, type: string, onEnter?: () => void; set: React.Dispatch<React.SetStateAction<string>> }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [thumbnail, setThumbnail] = useState("");
  const [currQuestion, setCurrQuestion] = useState("");
  const [currAnswerText, setCurrAnswerText] = useState("");
  const [duration, setDuration] = useState(10);
  const [points, setPoints] = useState(1);

  function addQuestions() {
    const newQuestion: Question = {
      id: questions.length + 1,
      type: "",
      thumbnail: "",
      question: "",
      answers: [
        {text: "", correct: false},
        {text: "", correct: false}
      ],
      duration: 10,
      points: 1
    }

    setQuestions([...questions, newQuestion]);
  }

  function updatedQuestion (index: number, update: Partial<Question>) {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {...updatedQuestions[index], ...update}
    setQuestions(updatedQuestions);
  }

  function updateAnswer (questionIndex: number, answerIndex: number, update: Partial<AnswersOptions>) {
    const updatedQuestions = [...questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    updatedAnswers[answerIndex] = {...updatedAnswers[answerIndex], ...update};
    updatedQuestions[questionIndex].answers = updatedAnswers;

    setQuestions(updatedQuestions);
  }

  function addAnswer(questionIndex: number) {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push({text: "", correct: false});
    setQuestions(updatedQuestions);
  }


  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    {questions.map((question, index) => {
      return (<>
        <label className="text-lg font-medium mb-2">Question Type</label>
        {["single-choice", "multiple-choice", "judgement"].map((type) => {
          <input type="radio" name={`question${index}-type`} value={type} onChange={() => updatedQuestion(index, {type: type})}/>
        })}
        <TextInput labelName="Thumbnail" id={`question${index}-thumbnail`} type="text" set={setThumbnail} onEnter={() => updatedQuestion(index, {thumbnail: thumbnail})} />
        <TextInput labelName="Question" id={`question${index}-text`} type="text" set={setCurrQuestion} onEnter={() => updatedQuestion(index, {question: currQuestion})} />
        {question.answers.map((answer, answerIndex) => {
          return (
            <p>Answer {answerIndex + 1}: 
              <TextInput labelName="Answer" id={`question${index}-answer${answerIndex}`} type="text" set={setCurrAnswerText} onEnter={() => updateAnswer(index, answerIndex, {text: currAnswerText})} />
              <input type="radio" name={`question${index}-answer${answerIndex}-correct`} value="True" onChange={() => updateAnswer(index, answerIndex, {correct: true})}/>
              <input type="radio" name={`question${index}-answer${answerIndex}-incorrect`} value="False" onChange={() => updateAnswer(index, answerIndex, {correct: false})}/>
            </p>
          )
        })}
        {question.answers.length < 6 && (
          <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => addAnswer(index)}/>
        )}
        <TextInput labelName="Duration" id={`question${index}-duration`} type="text" set={setDuration} onEnter={() => updatedQuestion(index, {duration: duration})} />
        <TextInput labelName="Points" id={`question${index}-points`} type="text" set={setPoints} onEnter={() => updatedQuestion(index, {points: points})} />
      </>)
    })}
    <Button text="Add Questions" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={addQuestions}/>
  </div>);
}