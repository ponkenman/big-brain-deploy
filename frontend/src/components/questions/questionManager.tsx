import TextInput from "../forms/textInput";
import Button from "../buttons/button";
import SelectMenu from "../forms/selectInput";
import { StateSetter, Question, QuestionType, MediaType } from "../../types";
import SingleChoiceForm from "./singleChoiceForm";
import MultipleChoiceForm from "./multipleChoiceForm";
import JudgementForm from "./judgementForm";
import { createSampleAnswer, fileToDataUrl, sampleJudgementAnswers } from "../../helpers";
import { useState } from "react";
import FileSelect from "../forms/fileInput";


export default function QuestionManager(props: {labelName: string, questions: Question[], set: StateSetter<Question[]>, createSingleQuestion?: boolean, mediaType?: MediaType }) {
  const [currMediaType, setCurrMediaType] = useState<MediaType>(props.mediaType ?? MediaType.NONE);

  function addQuestions() {
    const newQuestion: Question = {
      id: Math.floor(Math.random() * 1000000),
      type: QuestionType.SINGLE_CHOICE,
      media: "",
      mediaType: currMediaType,
      question: "",
      answers: [createSampleAnswer(), createSampleAnswer()],
      correctAnswers: [],
      duration: 10,
      points: 5,
      index: -1,
    }

    props.set([...props.questions, newQuestion]);
  }

  function updateQuestion (index: number, update: Partial<Question>) {
    const updatedQuestions = [...props.questions];
    if ("type" in update) {
      updatedQuestions[index].answers = update.type === QuestionType.JUDGEMENT ? sampleJudgementAnswers : [createSampleAnswer(), createSampleAnswer()];
    }
    updatedQuestions[index] = {...updatedQuestions[index], ...update}
    props.set(updatedQuestions);
  }

  function deleteQuestion(id: number) {
    const updatedQuestions = props.questions.filter((currQuestion) => currQuestion.id !== id);
    props.set(updatedQuestions);
  }

  function updateFileInput(index: number, fileInput: File | null ) {
    if (fileInput) {
      const data = fileToDataUrl(fileInput);
      data.then(url => updateQuestion(index, { media: url, mediaType: MediaType.IMAGE }));
    }
  }

  return (<div className="py-2">
    <div className="mb-3">
      <label className="text-lg font-medium">{props.labelName}</label>
    </div>
    <section className="flex flex-col gap-4 mb-2">
      {props.questions.map((question, index) => {
        console.log(props.questions);
        return (<article key={question.id} className="p-4 rounded-lg bg-indigo-300">
          <TextInput labelName={`Question ${ props.createSingleQuestion ? `` : index + 1}`} id={`question${index}-text`} type="text" defaultValue={question.question} onChange={e => updateQuestion(index, {question: e.target.value})} />
          <SelectMenu labelName="Media Type" id={`question${index}-media`} options={Object.values(MediaType)} onChange={e => setCurrMediaType(e.target.value as MediaType)} defaultValue={currMediaType}/>
          {currMediaType === MediaType.IMAGE ? (
            <>
              {question.media !== "" && <div className="py-2">
                <label htmlFor="current-image" className="text-lg font-medium mb-2">Current Image</label>
                <div className="flex flex-row justify-center border rounded-xl overflow-hidden border-indigo-400 bg-indigo-200 w-64 my-4">
                  <img src={question.media} alt={`Image for your question`} className="object-cover object-center" />
                </div>
              </div>}
              <FileSelect labelName={`Upload Image`} id={`question${index}-media-file`} accept=".png, .jpeg, jpg" onChange={e => updateFileInput(index, (e.target.files ? e.target.files[0] : null))} /> 
            </>
          ) : currMediaType === MediaType.TEXT ? (
            <TextInput labelName={`Enter Text Stimulus`} id={`question${index}-media-text`} type="text" defaultValue={question.media} onChange={e => {updateQuestion(index, {media: e.target.value, mediaType: MediaType.TEXT})}} />
          ) : currMediaType === MediaType.VIDEO ? (
            <TextInput labelName={`Enter Video Embed URL`} id={`question${index}-media-video`} type="text" defaultValue={question.media} onChange={e => updateQuestion(index, {media: e.target.value, mediaType: MediaType.VIDEO})} />
          ) : <></>
          }
          <SelectMenu labelName="Question Type" id="question-type-select" options={Object.values(QuestionType)} onChange={e => updateQuestion(index, {type: e.target.value})} defaultValue={question.type}/>
          {question.type === QuestionType.SINGLE_CHOICE ? (
            <SingleChoiceForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
          ) : question.type === QuestionType.MULTIPLE_CHOICE ? (
            <MultipleChoiceForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
          ) : (
            <JudgementForm questionIndex={index} questions={props.questions} setQuestions={props.set}/>
          )}
          <TextInput labelName="Duration" id={`question${index}-duration`} type="text" defaultValue={question.duration.toString()} onChange={e => updateQuestion(index, {duration: parseInt(e.target.value)})} />
          <TextInput labelName="Points" id={`question${index}-points`} type="text" defaultValue={question.points.toString()} onChange={e => updateQuestion(index, {points: parseInt(e.target.value)})} />
          { !props.createSingleQuestion && <Button text="Delete Question" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={() => deleteQuestion(question.id)}/> }
        </article>)
      })}
    </section>
    { !props.createSingleQuestion && <Button text="Add Questions" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={addQuestions}/>}
  </div>);
}