/**
 * The base button component template which takes in props text, color and hover color to be displayed on button. 
 * 
 * @param props.text - The text to display on the button 
 * @param props.color - The color to display on the button
 * @param props.hoverColor - The hoverColor to display on the button when hovering
 * @param props.onClick - The function to run when clicked
 */
export default function Button(props: { text: string, color: string, hoverColor: string, onClick?: () => void, className?: string} ) {
  return (<button onClick={props.onClick} type="button" className={`${props.hoverColor} ${props.color} text-base p-2 min-w-16 rounded-lg cursor-pointer ${props.className}`}>
    {props.text}
  </button>);
}