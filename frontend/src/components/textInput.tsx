export default function TextInput(props: { labelName: string, id: string, type: string, onEnter?: () => void; set: React.Dispatch<React.SetStateAction<string>> }) {
    
    function ifEnter(event: React.KeyboardEvent) {
        if (props.onEnter && event.key === "Enter") {
            props.onEnter();
        }
    }

    return (<div>
        <label htmlFor={props.id}>Name</label>
        <input type="text" id={props.id} onChange={e => props.set(e.target.value)} onKeyDown={e => ifEnter(e)}></input>
    </div>);
}