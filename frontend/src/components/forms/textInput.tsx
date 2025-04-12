import React from "react";

export default function TextInput(props: { labelName: string, id: string, type: string, defaultValue?: string, onEnter?: () => void; onChange: React.ChangeEventHandler<HTMLInputElement>}) {
  function ifEnter(event: React.KeyboardEvent) {
    if (props.onEnter && event.key === "Enter") {
      props.onEnter();
    }
  }
  
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type={props.type} id={props.id} defaultValue={props.defaultValue} onChange={props.onChange} onKeyDown={e => ifEnter(e)} className="block mt-2 rounded-sm border border-black bg-white px-2"></input>
  </div>);
}