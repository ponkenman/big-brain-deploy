import { StateSetter, Question, Answer,  } from "../../types";
import Button from "../buttons/button";
import TextInput from "./textInput";
import { useEffect, useState } from "react";

export default function MultipleChoiceForm(props: {questions: Question[], questionIndex: number, onEnter?: () => void; setQuestions: StateSetter<Question[]> }) {
  const [currAnswerText, setCurrAnswerText] = useState("");
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const newQuestions = [...props.questions];
    newQuestions[props.questionIndex].answers = answers;
    props.setQuestions(newQuestions);
  }, [answers]);
    
  function updateAnswer (answerIndex: number, update: Partial<Answer>) {
    const updatedAnswers = [...answers];
    if (update.correct) {
      updatedAnswers[answerIndex].correct = update.correct;
    }
    if (update.text) {
      updatedAnswers[answerIndex].text = update.text;
    }
    setAnswers(updatedAnswers);
  }

  function addAnswer() {
    const newAnswers = [...answers];
    newAnswers.push({ text : "", correct: false });
    setAnswers(newAnswers);
  }
  
  return (<>
    {answers.map((answer, answerIndex) => {
      return (
        <div key={answerIndex}>Answer {answerIndex + 1}: 
          <TextInput labelName="Answer" id={`question${props.questionIndex}-answer${answerIndex}`} type="text" defaultValue={answer.text} set={setCurrAnswerText} onEnter={() => updateAnswer(props.index, answerIndex, {text: currAnswerText})} />
          <label className="text-lg font-medium mb-2">
            <input type="checkbox" name={`question${props.questionIndex}-answer${answerIndex}-correct`} checked={answer.correct} onChange={() => updateAnswer(props.index, answerIndex, {correct: !answer.correct})}/>
          Correct
          </label>
        </div>
      )
    })}
    {answers.length < 6 && (
      <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={addAnswer}/>
    )}
  </>);
}