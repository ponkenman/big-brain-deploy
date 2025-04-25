import { StateSetter, Question, Answer,  } from "../../types";
import Button from "../buttons/button";
import { useEffect, useState } from "react";
import CreateAnswerCards from "./createAnswerCard";

/**
 * This function returns the options for a single choice form.
 * 
 * @param props.questions - The array of type Question for a game's questions
 * @param props.questionIndex - The current question index
 * @param props.setQuestions - The function called to update a game's questions
 */
export default function SingleChoiceForm(props: {questions: Question[], questionIndex: number, setQuestions: StateSetter<Question[]> }) {
  const [answers, setAnswers] = useState<Answer[]>(props.questions[props.questionIndex].answers);

  // Set the game's questions (put request in question manager) everytime answers changes
  useEffect(() => {
    const newQuestions = [...props.questions];
    newQuestions[props.questionIndex].answers = answers;
    props.setQuestions(newQuestions);
  }, [answers]);
    
  // Update answers if inputs are valid
  function updateAnswer (answerIndex: number, update: Partial<Answer>) {
    const updatedAnswers = [...answers];
    if (update.correct != undefined) {
      if (update.correct) {
        updatedAnswers.forEach(ans => ans.correct = false);
      }
      updatedAnswers[answerIndex].correct = update.correct;
    }

    if (update.text != undefined) {
      updatedAnswers[answerIndex].text = update.text;
    }

    setAnswers(updatedAnswers);
  }

  function addAnswer() {
    const newAnswers = [...answers];
    newAnswers.push({ text : "", correct: false, id: Math.floor(Math.random() * 1000000) });
    setAnswers(newAnswers);;
  }


  function deleteAnswer(answerIndex: number) {
    // Delete selected answer by using index
    const newAnswers = answers.toSpliced(answerIndex, 1);
    setAnswers(newAnswers);
  }
  
  return (<section className="flex flex-col gap-3 py-3">
    <CreateAnswerCards answers={answers} deleteAnswer={deleteAnswer} updateAnswer={updateAnswer}/>
    {answers.length < 6 && (
      <Button text="Add Answers" color="bg-pink-100" hoverColor="hover:bg-pink-400 hover:text-white" onClick={addAnswer}/>
    )}
  </section>);
}