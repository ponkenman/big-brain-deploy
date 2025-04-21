import React from "react";

export default function FileSelect(props: { labelName: string, id: string, accept: string | undefined, onChange: React.ChangeEventHandler<HTMLInputElement>}) {

  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="file" id={props.id} onChange={props.onChange} accept={props.accept} className="block mt-2 rounded-sm border border-black bg-white cursor-pointer file:bg-indigo-300 file:px-2"></input>
    
    {/* onChange={e => props.set(e.target.files ? e.target.files[0] : null)} */}
  </div>);
}