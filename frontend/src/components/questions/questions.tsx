import { useState } from "react";
import TextInput from "../forms/textInput";
import Button from "../buttons/button";
import SelectMenu from "../forms/selectInput";
import { StateSetter, Question, QuestionType } from "../../types";
import SingleChoiceForm from "./singleChoiceForm";
import MultipleChoiceForm from "./multipleChoiceForm";
import JudgementForm from "./judgementForm";

export default function QuestionManager(props: {labelName: string, id: string, questions: Question[], onEnter?: () => void; set: StateSetter<Question[]> }) {
  const [media, setMedia] = useState("");
  const [currQuestion, setCurrQuestion] = useState("");
  const [duration, setDuration] = useState(10);
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);
  const [points, setPoints] = useState(1);

  function createSampleAnswer() {
    return {
      text: "", 
      correct: false, 
      id: Math.floor(Math.random() * 1000000)
    };
  }

  function addQuestions() {
    const newQuestion: Question = {
      id: Math.floor(Math.random() * 1000000),
      type: questionType,
      media: media,
      question: currQuestion,
      answers: questionType === QuestionType.JUDGEMENT ?[createSampleAnswer()] : [createSampleAnswer(), createSampleAnswer()],
      duration: duration,
      points: points
    }

    props.set([...props.questions, newQuestion]);
  }

  function updatedQuestion (index: number, update: Partial<Question>) {
    const updatedQuestions = [...props.questions];
    updatedQuestions[index] = {...updatedQuestions[index], ...update}
    props.set(updatedQuestions);
  }

  function deleteQuestion(id: number) {
    const updatedQuestions = props.questions.filter((currQuestion) => currQuestion.id !== id);
    props.set(updatedQuestions);
  }

  return (<div className="py-2">
    <div className="mb-3">
      <label htmlFor={props.id} className="text-lg font-medium">{props.labelName}</label>
    </div>
    <section className="flex flex-col gap-4 mb-2">
      {props.questions.map((question, index) => {
        return (<article key={question.id} className="p-4 rounded-lg bg-indigo-300">
          <TextInput labelName={`Question ${index + 1}`} id={`question${index}-text`} type="text" defaultValue={question.question} onChange={e => setCurrQuestion(e.target.value)} onEnter={() => updatedQuestion(index, {question: currQuestion})} />
          <TextInput labelName={`Media`} id={`question${index}-media`} type="text" defaultValue={question.media} onChange ={e => setMedia(e.target.value)} onEnter={() => updatedQuestion(index, {media: media})} />
          <SelectMenu labelName="Question Type" options={Object.values(QuestionType)} set={setQuestionType}></SelectMenu>
          {questionType === QuestionType.SINGLE_CHOICE ? (
            <SingleChoiceForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
          ) : questionType === QuestionType.MULTIPLE_CHOICE ? (
            <MultipleChoiceForm questionIndex={index} questions={props.questions} setQuestions={props.set} />
          ) : (
            <JudgementForm question={question} index={index} questions={props.questions} set={props.set} onEnter={props.onEnter}/>
          )}
          <TextInput labelName="Duration" id={`question${index}-duration`} type="text" defaultValue={question.duration.toString()} onChange={e => setDuration(parseInt(e.target.value))} onEnter={() => updatedQuestion(index, {duration: duration})} />
          <TextInput labelName="Points" id={`question${index}-points`} type="text" defaultValue={question.points.toString()} onChange={ e=> setPoints(parseInt(e.target.value))} onEnter={() => updatedQuestion(index, {points: points})} />
          <Button text="Delete Question" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={() => deleteQuestion(question.id)}/>
        </article>)
      })}
    </section>
    <Button text="Add Questions" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={addQuestions}/>
  </div>);
}