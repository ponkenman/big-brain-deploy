import { StateSetter, Question, Answer } from '../../types'
import CheckboxInput from '../forms/checkboxInput'
import { useEffect, useState } from 'react'

/**
 * This function returns a checkbox for the judgement form.
 *
 * @param props.questions - The array of type Question for a game's questions
 * @param props.questionIndex - The current question index
 * @param props.setQuestions - The function called to update a game's questions
 */
export default function JudgementForm(props: { questions: Question[], questionIndex: number, setQuestions: StateSetter<Question[]> }) {
  const [answers, setAnswers] = useState<Answer[]>(props.questions[props.questionIndex].answers)

  // Set the game's questions (put request in question manager) everytime answers changes
  useEffect(() => {
    const newQuestions = [...props.questions]
    newQuestions[props.questionIndex].answers = answers
    props.setQuestions(newQuestions)
  }, [answers])

  function updateAnswer(correct: boolean) {
    // Since judgement question only has one answer that is true/false, custom change answers accordingly
    const updatedAnswers: Answer[] = [
      {
        id: Math.floor(Math.random() * 1000000),
        text: 'True',
        correct: correct === true,
      }, {
        id: Math.floor(Math.random() * 1000000),
        text: 'False',
        correct: correct === false,
      },
    ]

    setAnswers(updatedAnswers)
  }

  return (
    <section className="flex flex-col gap-3 py-3">
      <CheckboxInput labelName="True" id={`question${props.questionIndex}-answer-correct`} checked={answers[0].correct} onChange={(e) => { updateAnswer(e.target.checked) }} />
    </section>
  )
}
