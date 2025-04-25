import Modal from "./modal";
import { StateSetter } from "../../types";

/**
 * Creates a modal wrapper around the children HTML elements
 * @param props - visible and setVisible store whether modal is visible in state
 * @returns 
 */
export default function PointsModal(props: {visible: boolean, setVisible: StateSetter<boolean>}) {
  return (
    <Modal visible={props.visible} setVisible={props.setVisible}>
      <p>Points are calculated by the following:</p>
      <ul>
        <p>If you answer correctly within the first 25% of the question duration you get full points.</p>
        <p>If answered after the first 25% of the question duration, each subsequent % will lose that percent
        of the full points rounded up.</p>
        <p>Incorrect answers gives no points.</p>
        <br></br>
        <li>For Example:</li>
        <li>For a 10 seconds 10 point question, answering within 2.5 will give full points.</li>
        <li>Answering at exactly 5 second duration will result in 7.5 points.</li>
        <li>Answering at the exact end will result in the minimum points for a correct answer 3.</li>
      </ul>
    </Modal>
  );
};