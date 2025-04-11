import React from "react";

export default function FileSelect<T>(props: { labelName: string, id: string, set: React.Dispatch<React.SetStateAction<T>> }) {
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="file" id={props.id} onChange={e => props.set(e.target.value)} accept=".png,.jpg,.jpeg" className="block mt-2 rounded-sm border border-black bg-white cursor-pointer file:bg-indigo-300 file:px-2"></input>
  </div>);
}