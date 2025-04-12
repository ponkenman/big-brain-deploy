import React from "react";

export default function CheckboxInput(props: { labelName: string, id: string, checked?: boolean, onChange: React.ChangeEventHandler<HTMLInputElement>}) {
  
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="checkbox" id={props.id} checked={props.checked} onChange={props.onChange} className="block mt-2 rounded-sm border border-black bg-white px-2"></input>
  </div>);
}