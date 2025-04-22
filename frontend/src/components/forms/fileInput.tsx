import React from "react";

export default function FileSelect(props: { labelName: string, id: string, onChange: React.ChangeEventHandler<HTMLInputElement>}) {

  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="file" id={props.id} onChange={props.onChange} accept=".png,.jpg,.jpeg, .json" className="block mt-2 rounded-sm border border-black bg-white cursor-pointer file:bg-gray-300 file:px-2 file:cursor-pointer"></input>
  </div>);
}