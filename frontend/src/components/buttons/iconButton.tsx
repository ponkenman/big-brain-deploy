/**
 * The icon button component which takes in a className, svg and onClick. Displaying the button with the 
 * svg and according to the styling in className.
 * 
 * @param props - The passed in className, svg and onClick function
 *                className - The class name styling to format the button
 *                svg - The image to display on the button
 *                onClick - The function to run when clicked
 */
export default function IconButton(props: { className: string, svg: string, onClick: () => void}) {
  return (<button className={`cursor-pointer ${props.className}`} onClick={props.onClick}>
    <img src={props.svg} />
  </button>);
}