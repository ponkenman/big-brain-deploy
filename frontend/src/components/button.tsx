export default function Button(props: { text: string, color: string, hoverColor: string, onClick?: () => void }) {
  return (
    <button onClick={props.onClick} type="button" className={`hover:bg-${props.hoverColor} bg-${props.color} text-base p-2 min-w-16 h-11 rounded-lg cursor-pointer`}>
      {props.text}
    </button>);
}