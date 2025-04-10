import React from "react";

export default function TextBox(props: {text: string, labelName: string, id: string, type: string, onEnter?: () => void; set: React.Dispatch<React.SetStateAction<string>> }) {
    
  function ifEnter(event: React.KeyboardEvent) {
    if (props.onEnter && event.key === "Enter") {
      props.onEnter();
    }
  }

  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <textarea id={props.id} value={props.text} onChange={(e) => props.set(e.target.value)} onKeyDown={ifEnter} className="block mt-2 rounded-sm border border-black bg-white"/>
  </div>);
}