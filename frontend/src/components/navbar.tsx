import { ReactNode } from "react";

export default function Navbar(props: { children?: ReactNode, colour?: string, textColour?: string }) {
  return (
    <nav className={`${props.colour ? props.colour : `bg-pink-300`} flex flex-row justify-between items-center h-15 px-4 top-0 w-screen fixed z-5 shadow-lg`}>
      <div className={`text-lg font-bold italic ${props.textColour ? props.textColour : `text-black`}`}>bigbrain</div>
      <div className={`items-center flex flex-row gap-2 justify-evenly ${props.textColour ? props.textColour : `text-black`}`}>
        {props.children}
      </div>
    </nav>);
}