import { useContext, useEffect, useState } from "react";
import { ALERT_SUCCESS, fetchBackend } from "../helpers";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/navbar";
import LogoutButton from "../components/buttons/logoutButton";
import Button from "../components/buttons/button";
import { Game, MediaType, Question } from "../types";
import QuestionManager from "../components/questions/questionManager";
import { AlertContext } from "../App";

function EditQuestionManager(props: { gameId: string, questionId: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const createAlert = useContext(AlertContext);

  useEffect(() => {
    const token = localStorage.getItem("token") as string;
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const game = data.games.find(g => g.id.toString() === props.gameId) as Game;
      setQuestions([game.questions.find(q => q.id.toString() === props.questionId)] as Question[]);
    });
  }, []);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  function updateQuestion() {
    const token = localStorage.getItem("token") as string;
    const response = fetchBackend("GET", "/admin/games", undefined, token) as Promise<{ games: Game[] }>;
    response.then(data => {
      const game = data.games.find(g => g.id.toString() === props.gameId) as Game;
      const questionIndex = game.questions.findIndex(q => q.id.toString() === props.questionId);
      game.questions[questionIndex] = questions[0];
      console.log(data);
      const body = data;
      const editResponse = fetchBackend("PUT", "/admin/games", body, token);
      editResponse.then(r => {
        if (r.error) {
          createAlert(r.error);
        } else {
          createAlert("Successfully updated!", ALERT_SUCCESS);
        }
      });
    });
  }

  return (questions.length === 0 
    ? <></> 
    : <form className="py-2">
      <QuestionManager labelName={``} questions={questions} set={setQuestions} createSingleQuestion={true} mediaType={questions[0].mediaType as MediaType}/>
      <div className="flex flex-row gap-2 pt-3">
        <Button text="Submit" color="bg-emerald-300" hoverColor="hover:bg-emerald-400" onClick={updateQuestion}/>
        <Link to={`/game/${props.gameId}`}>
          <Button text="Cancel" color="bg-red-300" hoverColor="hover:bg-red-400" />
        </Link>
      </div>
    </form>);
}

export function EditQuestionScreen() {
  const { gameId, questionId } = useParams() as { gameId: string, questionId: string };
  return (<>
    <Navbar>
      <LogoutButton />
    </Navbar>
    <main className={`bg-white p-7 w-screen absolute top-15 min-h-full`}>
      <h1 className="text-4xl font-semibold pb-7">Edit question</h1>
      <Link to={`/game/${gameId}`}>
        <Button text="Back to edit game" color="bg-pink-200 "hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
      <EditQuestionManager gameId={gameId} questionId={questionId} />
    </main>
  </>);
}