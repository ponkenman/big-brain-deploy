import { StateSetter } from "../../types";

export default function FileSelect(props: { labelName: string, id: string, set: StateSetter<File | null> }) {

  return (<div className="py-2">
    <label htmlFor={props.id} className="text-lg font-medium mb-2">{props.labelName}</label>
    <input type="file" id={props.id} onChange={e => props.set(e.target.files ? e.target.files[0] : null)} accept=".png,.jpg,.jpeg" className="block mt-2 rounded-sm border border-black bg-white cursor-pointer file:bg-indigo-300 file:px-2"></input>
  </div>);
}