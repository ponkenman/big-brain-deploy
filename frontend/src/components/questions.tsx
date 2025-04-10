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
  media: string,
  question: string,
  answers: AnswersOptions[],
  duration: number
  points: number
}

export default function Questions(props: {labelName: string, id: string, questions: Question[], onEnter?: () => void; set: React.Dispatch<React.SetStateAction<any>> }) {
  const [media, setMedia] = useState("");
  const [currQuestion, setCurrQuestion] = useState("");
  const [currAnswerText, setCurrAnswerText] = useState("");
  const [duration, setDuration] = useState(10);
  const [points, setPoints] = useState(1);

  function addQuestions() {
    const newQuestion: Question = {
      id: props.questions.length + 1,
      type: "",
      media: "",
      question: "",
      answers: [
        {text: "", correct: false}
      ],
      duration: 10,
      points: 1
    }

    props.set([...props.questions, newQuestion]);
  }

  function updatedQuestion (index: number, update: Partial<Question>) {
    const updatedQuestions = [...props.questions];
    updatedQuestions[index] = {...updatedQuestions[index], ...update}
    props.set(updatedQuestions);
  }

  function updateAnswer (questionIndex: number, answerIndex: number, update: Partial<AnswersOptions>) {
    const updatedQuestions = [...props.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    updatedAnswers[answerIndex] = {...updatedAnswers[answerIndex], ...update};
    updatedQuestions[questionIndex].answers = updatedAnswers;

    props.set(updatedQuestions);
  }

  function addAnswer(questionIndex: number) {
    const updatedQuestions = [...props.questions];
    updatedQuestions[questionIndex].answers.push({text: "", correct: false});
    props.set(updatedQuestions);
  }


  return (<div className="py-2">
    <div>
      <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    </div>
    {props.questions.map((question, index) => {
      return (<div key={question.id}>
        <label className="text-lg font-medium mb-2">Question Type</label>
        <div>
          <label className="text-lg font-medium mb-2">
            <input type="radio" name={`question${index}-type1`} value={"single-choice"} onChange={() => updatedQuestion(index, {type: "single-choice"})}/>
            single-choice
          </label>
          <label className="text-lg font-medium mb-2">
            <input type="radio" name={`question${index}-type2`} value={"multiple-choice"} onChange={() => updatedQuestion(index, {type: "multiple-choice"})}/>
            multiple-choice
          </label>
          <label className="text-lg font-medium mb-2">
            <input type="radio" name={`question${index}-type3`} value={"judgement-choice"} onChange={() => updatedQuestion(index, {type: "judgement-choice"})}/>
            judgement-choice
          </label>
        </div>
        <TextInput labelName={`Question ${index + 1} Media`} id={`question${index}-media`} type="text" value={question.media} set={setMedia} onEnter={() => updatedQuestion(index, {media: media})} />
        <TextInput labelName={`Question ${index + 1}`} id={`question${index}-text`} type="text" value={question.question} set={setCurrQuestion} onEnter={() => updatedQuestion(index, {question: currQuestion})} />
        {question.answers.map((answer, answerIndex) => {
          return (
            <div key={answerIndex}>Answer {answerIndex + 1}: 
              <TextInput labelName="Answer" id={`question${index}-answer${answerIndex}`} type="text" value={answer.text} set={setCurrAnswerText} onEnter={() => updateAnswer(index, answerIndex, {text: currAnswerText})} />
              <label className="text-lg font-medium mb-2">
                <input type="radio" name={`question${index}-answer${answerIndex}-correct`} value="True" onChange={() => updateAnswer(index, answerIndex, {correct: true})}/>
                Correct
              </label>
              <label className="text-lg font-medium mb-2">
                <input type="radio" name={`question${index}-answer${answerIndex}-incorrect`} value="False" onChange={() => updateAnswer(index, answerIndex, {correct: false})}/>
                Incorrect
              </label>
            </div>
          )
        })}
        <TextInput labelName="Duration" id={`question${index}-duration`} type="text" value={question.duration} set={setDuration} onEnter={() => updatedQuestion(index, {duration: duration})} />
        <TextInput labelName="Points" id={`question${index}-points`} type="text" value={question.points} set={setPoints} onEnter={() => updatedQuestion(index, {points: points})} />
        {question.answers.length < 6 && (
          <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => addAnswer(index)}/>
        )}
      </div>)
    })}
    <Button text="Add Questions" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={addQuestions}/>
  </div>);
}