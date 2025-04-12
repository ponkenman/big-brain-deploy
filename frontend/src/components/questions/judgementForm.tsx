import { StateSetter, Question, Answer,  } from "../../types";
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

  
  return (<section className="flex flex-col gap-3 py-3">
    {answers.map((answer, answerIndex) => {
      return (
        <article key={answer.id} className="bg-blue-400 rounded-lg p-3">#{answerIndex + 1} 
          <TextInput labelName="Answer" id={`question${props.questionIndex}-answer${answerIndex}`} type="text" defaultValue={answer.text} onChange={e => updateAnswer(answerIndex, {text: e.target.value})}/>
          <CheckboxInput labelName="Correct" id={`question${props.questionIndex}-answer${answerIndex}-correct`} checked={answer.correct} onChange={e => {updateAnswer(answerIndex, {correct: e.target.checked})}} />
      
        </article>
      )
    })}
  </section>);
}