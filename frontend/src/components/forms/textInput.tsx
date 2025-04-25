import React from "react";

/**
 * The text input component which takes in props labelName, id, type, defaultValue, onEnter and onChange function.
 * 
 * @param props.labelName - The label name to be displayed on the check box component
 * @param props.id - The id for the check box component
 * @param props.type - The type which changes the behaviour of a text input (e.g. password hides input)
 * @param props.defaultValue - The default value to be displayed on the text input
 * @param props.onEnter - The function to run when enter is pressed
 * @param props.onChange - The function to run when the input changes
 */
export default function TextInput(props: { labelName: string, id: string, type: string, defaultValue?: string, onEnter?: () => void; onChange: React.ChangeEventHandler<HTMLInputElement>}) {
  // This function checks if onEnter was activated by the enter key
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