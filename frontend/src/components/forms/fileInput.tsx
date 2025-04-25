import React from "react";

/**
 * The file select component which takes in props labelName, id, accept and onChange function.
 * 
 * @param props - The passed in labelName, id, checked and onChange function.
 *                labelName - The label name to be displayed on the check box component
 *                id - The id for the check box component
 *                accept - The values passed in as acceptable file inputs (e.g. ".png", ".json")
 *                OnChange - The function to run when the state of checkbox changes
 */
export default function FileSelect(props: { labelName: string, id: string, accept: string | undefined, onChange: React.ChangeEventHandler<HTMLInputElement>}) {
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="file" id={props.id} onChange={props.onChange} accept={props.accept} className="block mt-2 rounded-sm border border-black bg-white cursor-pointer file:bg-gray-300 file:px-2 file:cursor-pointer"></input>
  </div>);
}