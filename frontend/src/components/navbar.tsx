import { ReactNode } from "react";

export default function Navbar(props: { children: ReactNode }) {
  return (
    <nav className="bg-indigo-300 flex flex-row justify-between items-center h-15 px-4 top-0 sticky">
      <div className="text-lg font-bold italic">bigbrain</div>
      <div className="items-center flex flex-row gap-2 justify-evenly">
        {props.children}
      </div>
    </nav>);
}