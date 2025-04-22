export default function IconButton(props: { className: string, svg: string, onClick: () => void}) {
    return (<button className={`cursor-pointer ${props.className}`} onClick={props.onClick}>
        <img src={props.svg} />
    </button>);
}