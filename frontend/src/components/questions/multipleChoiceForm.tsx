import { StateSetter, Question, Answer,  } from "../../types";
import Button from "../buttons/button";
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
        <article key={answerIndex} className="bg-blue-400 rounded-lg p-3">#{answerIndex + 1} 
          <TextInput labelName="Answer" id={`question${props.questionIndex}-answer${answerIndex}`} type="text" defaultValue={answer.text} set={setCurrText}/>
          <label className="text-lg font-medium mb-2">
            <input type="checkbox" name={`question${props.questionIndex}-answer${answerIndex}-correct`} checked={answer.correct} onChange={() => updateAnswer(props.index, answerIndex, {correct: !answer.correct})}/>
          Correct
          </label>
          { answers.length > 2 && <Button text="Delete" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={() => deleteAnswer(answerIndex)}/>}
        </article>
      )
    })}
    {answers.length < 6 && (
      <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={addAnswer}/>
    )}
  </section>);
}