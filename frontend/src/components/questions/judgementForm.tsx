import { StateSetter, Question, Answer,  } from "../../types";
import CheckboxInput from "../forms/checkboxInput";
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
    <CheckboxInput labelName="True" id={`question${props.questionIndex}-answer$0-correct`} checked={answers[0].correct} onChange={e => {updateAnswer(0, {correct: e.target.checked})}} />
  </section>);
}