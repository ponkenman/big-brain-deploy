import { StateSetter, Question, Answer,  } from "../../types";
import Button from "../buttons/button";
import CheckboxInput from "../forms/checkboxInput";
import TextInput from "../forms/textInput";
import { useEffect, useState } from "react";

export default function MultipleChoiceForm(props: {questions: Question[], questionIndex: number, setQuestions: StateSetter<Question[]> }) {
  const [answers, setAnswers] = useState<Answer[]>(props.questions[props.questionIndex].answers);

  useEffect(() => {
    const newQuestions = [...props.questions];
    newQuestions[props.questionIndex].answers = answers;
    props.setQuestions(newQuestions);
  }, [answers]);
    
  function updateAnswer (answerIndex: number, update: Partial<Answer>) {
    const updatedAnswers = [...answers];
    if (update.correct != undefined) {
      updatedAnswers[answerIndex].correct = update.correct;
    }
    if (update.text != undefined) {
      updatedAnswers[answerIndex].text = update.text;
    }
    setAnswers(updatedAnswers);
    console.log(updatedAnswers);
  }

  function addAnswer() {
    const newAnswers = [...answers];
    newAnswers.push({ text : "", correct: false, id: Math.floor(Math.random() * 1000000) });
    setAnswers(newAnswers);
    console.log(newAnswers);
  }

  function deleteAnswer(answerIndex: number) {
    const newAnswers = answers.toSpliced(answerIndex, 1);
    setAnswers(newAnswers);
    console.log(newAnswers);
  }
  
  return (<section className="flex flex-col gap-3 py-3">
    {answers.map((answer, answerIndex) => {
      return (
        <article key={answer.id} className="bg-blue-400 rounded-lg p-3">#{answerIndex + 1} 
          <TextInput labelName="Answer" id={`question${props.questionIndex}-answer${answerIndex}`} type="text" defaultValue={answer.text} onChange={e => updateAnswer(answerIndex, {text: e.target.value})}/>
          <CheckboxInput labelName="Correct" id={`question${props.questionIndex}-answer${answerIndex}-correct`} checked={answer.correct} onChange={e => {updateAnswer(answerIndex, {correct: e.target.checked})}} />
          { answers.length > 2 && <Button text="Delete" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={() => deleteAnswer(answerIndex)}/>}
        </article>
      )
    })}
    {answers.length < 6 && (
      <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={addAnswer}/>
    )}
  </section>);
}