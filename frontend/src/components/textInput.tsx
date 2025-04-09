import React from "react";

export default function TextInput(props: { labelName: string, id: string, type: string, onEnter?: () => void; set: React.Dispatch<React.SetStateAction<string>> }) {
    
  function ifEnter(event: React.KeyboardEvent) {
    if (props.onEnter && event.key === "Enter") {
      props.onEnter();
    }
  }

  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type={props.type} id={props.id} onChange={e => props.set(e.target.value)} onKeyDown={e => ifEnter(e)} className="block mt-2 rounded-sm border border-black bg-white"></input>
  </div>);
}