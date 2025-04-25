/**
 * The close button component which takes in a className and onClick. Displaying the button according to the styling in className.
 *
 *  @param props.className - The class name styling to format the button
 *  @param props.onClick - The function to run when clicked
 */
export default function CloseButton(props: { className: string, onClick: () => void }) {
  return (
    <button type="button" className={`text-2xl cursor-pointer ${props.className}`} onClick={props.onClick}>
      &times;
    </button>
  )
}
