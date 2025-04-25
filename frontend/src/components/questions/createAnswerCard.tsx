import { Answer } from '../../types'
import CloseButton from '../buttons/closeButton'
import CheckboxInput from '../forms/checkboxInput'
import TextInput from '../forms/textInput'

/**
 * This function returns a list of text input and check box input for answers.
 *
 * @param props.answers - The array of type Answer for a question's answers
 * @param props.deleteAnswer - The function called to delete answers
 * @param props.updateAnswer - The function called to update a question's answers
 */
export default function CreateAnswerCards(props: { answers: Answer[], deleteAnswer: (answerIndex: number) => void, updateAnswer: (answerIndex: number, update: Partial<Answer>) => void }) {
  return (props.answers.map((answer, answerIndex) => {
    return (
      <article key={answer.id} className="bg-gray-200 rounded-lg p-3 px-4 relative border border-gray-400">
        #
        {answerIndex + 1}
        { props.answers.length > 2 && <CloseButton className="absolute top-2 right-3 hover:opacity-50 text-gray-500" onClick={() => props.deleteAnswer(answerIndex)} />}
        <TextInput labelName="Answer" id={`answer${answer.id}`} type="text" defaultValue={answer.text} onChange={e => props.updateAnswer(answerIndex, { text: e.target.value })} />
        <CheckboxInput labelName="Correct" id={`-answer${answer.id}-correct`} checked={answer.correct} onChange={(e) => { props.updateAnswer(answerIndex, { correct: e.target.checked }) }} />
      </article>
    )
  }))
}
