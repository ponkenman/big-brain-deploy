import React from "react";

/**
 * The check box component which takes in props labelName, id, checked and onChange function.
 * 
 * @param props.labelName - The label name to be displayed on the check box component
 * @param props.id - The id for the check box component
 * @param props.checked - The boolean value which determines if the checkbox is ticked or not
 * @param props.onChange - The function to run when the state of checkbox changes
 */
export default function CheckboxInput(props: { labelName: string, id: string, checked?: boolean, onChange: React.ChangeEventHandler<HTMLInputElement>}) {
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="checkbox" id={props.id} checked={props.checked} onChange={props.onChange} className="block mt-2 rounded-sm border border-black bg-white px-2"></input>
  </div>);
}