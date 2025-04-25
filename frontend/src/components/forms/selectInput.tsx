import React from "react";

/**
 * The select input component which takes in props labelName, id, defaultValue, options, and onChange function.
 * 
 * @param props.labelName - The label name to be displayed on the check box component
 * @param props.id - The id for the check box component
 * @param props.defaultValue - The default value to be displayed on the select menu
 * @param props.options - The options available for the select menu
 * @param props.onChange - The function to run when the state of checkbox changes
 */
export default function SelectMenu<T extends string>(props: { labelName: string, id: string, defaultValue?: string, options: T[]; onChange: React.ChangeEventHandler<HTMLSelectElement>}) {
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <select id={props.id} className="block mt-2 rounded-md border border-black bg-white px-1" onChange={props.onChange} defaultValue={props.defaultValue}>
      {props.options.map((option, index) => <option value={option} key={index}>{option}</option>)}
    </select>
  </div>);
}