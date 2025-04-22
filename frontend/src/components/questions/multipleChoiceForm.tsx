import { StateSetter, Question, Answer,  } from "../../types";
import Button from "../buttons/button";
import { useEffect, useState } from "react";
import CreateAnswerCards from "./createAnswerCard";

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
    <CreateAnswerCards answers={answers} deleteAnswer={deleteAnswer} updateAnswer={updateAnswer}/>
    {answers.length < 6 && (
      <Button text="Add Answers" color="bg-pink-200" hoverColor="hover:bg-indigo-400 hover:text-white" onClick={addAnswer}/>
    )}
  </section>);
}