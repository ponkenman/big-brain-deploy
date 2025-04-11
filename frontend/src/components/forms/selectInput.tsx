import { StateSetter } from "../../types";

export default function SelectMenu<T extends string>(props: { labelName: string, defaultValue?: string, options: T[]; set: StateSetter<T>}) {
  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <select className="block mt-2 rounded-md border border-black bg-white px-1" onChange={e => props.set(e.target.value)}>
      {props.options.map((option, index) => <option value={option} key={index}>{option}</option>)}
    </select>
  </div>);
}