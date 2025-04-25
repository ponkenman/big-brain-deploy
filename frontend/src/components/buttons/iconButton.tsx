/**
 * The icon button component which takes in a className, svg and onClick. Displaying the button with the 
 * svg and according to the styling in className.
 * 
 * @param props.className - The class name styling to format the button
 * @param props.svg - The image to display on the button
 * @param props.svg - The alt tage to display when the svg cannot be loaded
 * @param props.onClick - The function to run when clicked
 */
export default function IconButton(props: { className: string, svg: string, onClick: () => void, alt: string }) {
  return (<button className={`cursor-pointer ${props.className}`} onClick={props.onClick}>
    <img src={props.svg} alt={props.alt}/>
  </button>);
}