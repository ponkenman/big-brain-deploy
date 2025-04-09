import Modal from "../components/modal";
import {useState} from "react";
import Button from "../components/button";

export default function GameCard(props: {title: string, numQuestions: number, totalDuration: number}) {
  const [modal, setModal] = useState(false);
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const deleteGame = () => {
    // Delete this game
    openModal();
  }

  return (<article>
    <p>{props.title}</p>
    <p>{props.numQuestions} Questions</p>
    <p>{props.totalDuration} seconds</p>
    <img src="" alt={`Thumbnail for ${props.title}`}></img>
    <Button text="Edit Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={openModal}/>
    <Button text="Delete Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={deleteGame}/>
    {modal && (
      <Modal>
        <h1>Delete this game</h1>
        <h2>Are you sure you want to delete this game?</h2>
        <Button text="Delete Game" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={deleteGame}/>
        <Button text="Cancel" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={closeModal}/>
      </Modal>
    )}
  </article>);
}