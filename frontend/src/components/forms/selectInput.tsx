import React from "react";

export default function SelectMenu<T extends string>(props: { labelName: string, id: string, defaultValue?: string, options: T[]; onChange: React.ChangeEventHandler<HTMLSelectElement>}) {
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <select id={props.id} className="block mt-2 rounded-md border border-black bg-white px-1" onChange={props.onChange} defaultValue={props.defaultValue}>
      {props.options.map((option, index) => <option value={option} key={index}>{option}</option>)}
    </select>
  </div>);
}