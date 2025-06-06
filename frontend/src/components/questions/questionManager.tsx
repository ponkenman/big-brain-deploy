import TextInput from '../forms/textInput'
import Button from '../buttons/button'
import SelectMenu from '../forms/selectInput'
import { StateSetter, Question, QuestionType, MediaType } from '../../types'
import SingleChoiceForm from './singleChoiceForm'
import MultipleChoiceForm from './multipleChoiceForm'
import JudgementForm from './judgementForm'
import { createSampleAnswer, fileToDataUrl, sampleJudgementAnswers } from '../../helpers'
import { useState } from 'react'
import FileSelect from '../forms/fileInput'
import CloseButton from '../buttons/closeButton'

/**
 * This function handles all the logic for a creating and editing a question, displaying the appropraite form depending on the question type.
 *
 * @param props.questions - The array of type Question for a game's questions
 * @param props.questionIndex - The current question index
 * @param props.setQuestions - The function called to update a game's questions
 */
export default function QuestionManager(props: { labelName: string, questions: Question[], set: StateSetter<Question[]>, createSingleQuestion?: boolean, mediaType?: MediaType }) {
  const [currMediaType, setCurrMediaType] = useState<MediaType>(props.mediaType ?? MediaType.NONE)

  function addQuestions() {
    const newQuestion: Question = {
      id: Math.floor(Math.random() * 1000000),
      type: QuestionType.SINGLE_CHOICE,
      media: '',
      mediaType: currMediaType,
      question: '',
      answers: [createSampleAnswer(), createSampleAnswer()],
      correctAnswers: [],
      duration: 10,
      points: 5,
      index: -1,
    }

    props.set([...props.questions, newQuestion])
  }

  function updateQuestion(index: number, update: Partial<Question>) {
    const updatedQuestions = [...props.questions]

    // If judgement, input sample answers
    if ('type' in update) {
      updatedQuestions[index].answers = update.type === QuestionType.JUDGEMENT ? sampleJudgementAnswers : [createSampleAnswer(), createSampleAnswer()]
    }

    updatedQuestions[index] = { ...updatedQuestions[index], ...update }
    props.set(updatedQuestions)
  }

  function deleteQuestion(id: number) {
    const updatedQuestions = props.questions.filter(currQuestion => currQuestion.id !== id)
    props.set(updatedQuestions)
  }

  // Chnage file input from file to a url
  function updateFileInput(index: number, fileInput: File | null) {
    if (fileInput) {
      const data = fileToDataUrl(fileInput)
      data.then(url => updateQuestion(index, { media: url, mediaType: MediaType.IMAGE }))
    }
  }

  // While return output very large, more difficult to refactor into different components as all relevant to question state
  return (
    <div className="">
      <label className="text-lg font-medium">{props.labelName}</label>
      <section className="flex flex-col gap-4">
        {props.questions.map((question, index) => {
          return (
            <article key={question.id} className="p-4 rounded-lg bg-pink-200 relative">
              { !props.createSingleQuestion && <CloseButton className="absolute top-2 right-3 hover:opacity-50" onClick={() => deleteQuestion(question.id)} /> }
              <TextInput labelName={`Question ${props.createSingleQuestion ? `` : index + 1}`} id={`question${index}-text`} type="text" defaultValue={question.question} onChange={e => updateQuestion(index, { question: e.target.value })} />
              <SelectMenu labelName="Media Type" id={`question${index}-media`} options={Object.values(MediaType)} onChange={e => setCurrMediaType(e.target.value as MediaType)} defaultValue={currMediaType} />
              {currMediaType === MediaType.IMAGE
                ? (
                  <>
                    {question.media !== '' && (
                      <div className="py-2">
                        <label htmlFor="current-image" className="text-lg font-medium mb-2">Current Image</label>
                        <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-pink-400 bg-pink-200 w-64 my-4">
                          <img src={question.media} alt="Image for your question" className="object-cover object-center" />
                        </div>
                      </div>
                    )}
                    <FileSelect labelName="Upload Image" id={`question${index}-media-file`} accept=".png,.jpeg,.jpg" onChange={e => updateFileInput(index, (e.target.files ? e.target.files[0] : null))} />
                  </>
                )
                : currMediaType === MediaType.TEXT
                  ? (
                    <TextInput labelName="Enter Text Stimulus" id={`question${index}-media-text`} type="text" defaultValue={question.media} onChange={(e) => { updateQuestion(index, { media: e.target.value, mediaType: MediaType.TEXT }) }} />
                  )
                  : currMediaType === MediaType.VIDEO
                    ? (
                      <TextInput labelName="Enter Video Embed URL" id={`question${index}-media-video`} type="text" defaultValue={question.media} onChange={e => updateQuestion(index, { media: e.target.value, mediaType: MediaType.VIDEO })} />
                    )
                    : <></>}
              <SelectMenu labelName="Question Type" id={`question-type-select-${question.id}`}options={Object.values(QuestionType)} onChange={e => updateQuestion(index, { type: e.target.value })} defaultValue={question.type} />
              {question.type === QuestionType.SINGLE_CHOICE
                ? (
                  <SingleChoiceForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
                )
                : question.type === QuestionType.MULTIPLE_CHOICE
                  ? (
                    <MultipleChoiceForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
                  )
                  : (
                    <JudgementForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
                  )}
              <TextInput labelName="Duration" id={`question${index}-duration`} type="text" defaultValue={question.duration.toString()} onChange={e => updateQuestion(index, { duration: parseInt(e.target.value) })} />
              <TextInput labelName="Points" id={`question${index}-points`} type="text" defaultValue={question.points.toString()} onChange={e => updateQuestion(index, { points: parseInt(e.target.value) })} />
            </article>
          )
        })}
      </section>
      { !props.createSingleQuestion && <Button text="Add Questions" color="bg-pink-300 my-3" hoverColor="hover:bg-pink-400 hover:text-white" onClick={addQuestions} />}
    </div>
  )
}
