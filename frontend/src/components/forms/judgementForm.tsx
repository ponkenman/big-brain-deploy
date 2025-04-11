import { StateSetter, Question, AnswersOptions,  } from "../../types";
import Button from "../buttons/button";
import TextInput from "./textInput";
import { useEffect, useState } from "react";

export default function JudgementForm(props: {question: Question, index: number, questions: Question[], onEnter?: () => void; set: StateSetter<Question[]> }) {
  const [currAnswerText, setCurrAnswerText] = useState("");

  useEffect(() => {
    updateAnswer(props.index, 0, {correct: false})
  }, []);
    
  function updateAnswer (questionIndex: number, answerIndex: number, update: Partial<AnswersOptions>) {
    const updatedQuestions = [...props.questions];
    let updatedAnswers = [...updatedQuestions[questionIndex].answers];

    for (const currAnswer of updatedAnswers) {
      currAnswer.correct = false;
    }

    updatedAnswers[answerIndex] = {...updatedAnswers[answerIndex], ...update};
    updatedQuestions[questionIndex].answers = updatedAnswers;

    props.set(updatedQuestions);
  }

  function addAnswer(questionIndex: number) {
    const updatedQuestions = [...props.questions];
    updatedQuestions[questionIndex].answers.push({text: "", correct: false});
    props.set(updatedQuestions);
  }
  
  return (<>
    {props.question.answers.slice(0,2).map((answer, answerIndex) => {
      return (
        <div key={answerIndex}>Answer {answerIndex + 1}: 
          <TextInput labelName="Answer" id={`question${props.index}-answer${answerIndex}`} type="text" defaultValue={answer.text} set={setCurrAnswerText} onEnter={() => updateAnswer(props.index, answerIndex, {text: currAnswerText})} />
          <label className="text-lg font-medium mb-2">
            <input type="checkbox" name={`question${props.index}-answer${answerIndex}-correct`} checked={answer.correct} onChange={() => updateAnswer(props.index, answerIndex, {correct: !answer.correct})}/>
          Correct
          </label>
        </div>
      )
    })}

    {props.questions[props.index].answers.length < 2 && (
        <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => addAnswer(props.index)}/>
    )}
  </>);
}