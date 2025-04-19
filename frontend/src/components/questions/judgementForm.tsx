import { StateSetter, Question, Answer,  } from "../../types";
import CheckboxInput from "../forms/checkboxInput";
import { useEffect, useState } from "react";

export default function JudgementForm(props: {questions: Question[], questionIndex: number, setQuestions: StateSetter<Question[]> }) {
  const [answers, setAnswers] = useState<Answer[]>(props.questions[props.questionIndex].answers);

  useEffect(() => {
    const newQuestions = [...props.questions];
    newQuestions[props.questionIndex].answers = answers;
    props.setQuestions(newQuestions);
  }, [answers]);
    
  function updateAnswer(correct: boolean) {
    // Since judgement question only has one answer that is true/false, custom change answers accordingly
    const updatedAnswers: Answer[] = [
      {
        id: Math.floor(Math.random() * 1000000),
        text: "True",
        correct: correct === true,
      }, {
        id: Math.floor(Math.random() * 1000000),
        text: "False",
        correct: correct === false,
      }];
    setAnswers(updatedAnswers);
    console.log(updatedAnswers);
  }

  return (<section className="flex flex-col gap-3 py-3">
    <CheckboxInput labelName="True" id={`question${props.questionIndex}-answer$0-correct`} checked={answers[0].correct} onChange={e => {updateAnswer(e.target.checked)}} />
  </section>);
}