import React, {useEffect, useState} from "react";
import TextInput from "./forms/textInput";
import Button from "./buttons/button";
import SelectMenu from "./forms/selectInput";

type AnswersOptions = {
  text: string,
  correct: boolean
}

type Question = {
  id: number,
  type: string,
  media: string,
  question: string,
  answers: AnswersOptions[],
  duration: number
  points: number
}

enum QuestionType {
  SINGLE_CHOICE = "Single Choice",
  MULTIPLE_CHOICE = "Multiple Choice",
  JUDGEMENT = "Judgement"
}

export default function Questions(props: {labelName: string, id: string, questions: Question[], onEnter?: () => void; set: React.Dispatch<React.SetStateAction<Question[]>> }) {
  const [media, setMedia] = useState("");
  const [currQuestion, setCurrQuestion] = useState("");
  const [currAnswerText, setCurrAnswerText] = useState("");
  const [duration, setDuration] = useState(10);
  const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.SINGLE_CHOICE);
  const [points, setPoints] = useState(1);

  function addQuestions() {
    const newQuestion: Question = {
      id: props.questions.length + 1,
      type: "",
      media: "",
      question: "",
      answers: [
        {text: "", correct: false}
      ],
      duration: 10,
      points: 1
    }

    props.set([...props.questions, newQuestion]);
  }

  function updatedQuestion (index: number, update: Partial<Question>) {
    const updatedQuestions = [...props.questions];
    updatedQuestions[index] = {...updatedQuestions[index], ...update}
    props.set(updatedQuestions);
  }

  function updateAnswer (questionIndex: number, answerIndex: number, update: Partial<AnswersOptions>) {
    const updatedQuestions = [...props.questions];
    const updatedAnswers = [...updatedQuestions[questionIndex].answers];
    updatedAnswers[answerIndex] = {...updatedAnswers[answerIndex], ...update};
    updatedQuestions[questionIndex].answers = updatedAnswers;

    props.set(updatedQuestions);
  }

  function addAnswer(questionIndex: number) {
    const updatedQuestions = [...props.questions];
    updatedQuestions[questionIndex].answers.push({text: "", correct: false});
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
    <section className="flex flex-col gap-4">
      {props.questions.map((question, index) => {
        return (<article key={question.id} className="p-4 rounded-lg bg-indigo-300">
          <TextInput labelName={`Question ${index + 1}`} id={`question${index}-text`} type="text" value={question.question} set={setCurrQuestion} onEnter={() => updatedQuestion(index, {question: currQuestion})} />
          <SelectMenu labelName="Question Type" options={Object.values(QuestionType)} set={setQuestionType}></SelectMenu>
          <TextInput labelName={`Question ${index + 1} Media`} id={`question${index}-media`} type="text" value={question.media} set={setMedia} onEnter={() => updatedQuestion(index, {media: media})} />
          {question.answers.map((answer, answerIndex) => {
            return (
              <div key={answerIndex}>Answer {answerIndex + 1}: 
                <TextInput labelName="Answer" id={`question${index}-answer${answerIndex}`} type="text" value={answer.text} set={setCurrAnswerText} onEnter={() => updateAnswer(index, answerIndex, {text: currAnswerText})} />
                <label className="text-lg font-medium mb-2">
                  <input type="radio" name={`question${index}-answer${answerIndex}-correct`} value="True" onChange={() => updateAnswer(index, answerIndex, {correct: true})}/>
                Correct
                </label>
                <label className="text-lg font-medium mb-2">
                  <input type="radio" name={`question${index}-answer${answerIndex}-incorrect`} value="False" onChange={() => updateAnswer(index, answerIndex, {correct: false})}/>
                Incorrect
                </label>
              </div>
            )
          })}
          <TextInput labelName="Duration" id={`question${index}-duration`} type="text" defaultValue={question.duration.toString()} set={setDuration} onEnter={() => updatedQuestion(index, {duration: duration})} />
          <TextInput labelName="Points" id={`question${index}-points`} type="text" defaultValue={question.points.toString()} set={setPoints} onEnter={() => updatedQuestion(index, {points: points})} />
          {question.answers.length < 6 && (
            <Button text="Add Answers" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={() => addAnswer(index)}/>
          )}
          <Button text="Delete Question" color="bg-red-200" hoverColor="hover:bg-red-400" onClick={() => deleteQuestion(question.id)}/>
        </article>)
      })}
    </section>
    <Button text="Add Questions" color="bg-indigo-300" hoverColor="hover:bg-indigo-400" onClick={addQuestions}/>
  </div>);
}