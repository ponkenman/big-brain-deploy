export default function CloseButton(props: { className: string, onClick: () => void}) {
    return (<button className={`text-2xl cursor-pointer ${props.className}`} onClick={props.onClick}>
        &times;
    </button>);
}