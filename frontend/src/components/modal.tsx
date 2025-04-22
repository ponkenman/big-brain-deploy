import { ReactNode } from "react";
import { StateSetter } from "../types";
import CloseButton from "./buttons/closeButton";

/**
 * Creates a modal wrapper around the children HTML elements
 * @param props - visible and setVisible store whether modal is visible in state
 * @returns 
 */
export default function Modal(props: {children: ReactNode, visible: boolean, setVisible: StateSetter<boolean>}) {
  return (
    props.visible && <div className="fixed flex flex-row items-center justify-center inset-0 bg-gray-300/75 transition-opacity">
      <div className="relative bg-white border border-gray-400 p-5 rounded-xl z-2 max-h-4/5 md:w-1/2 w-full overflow-auto overscroll-none shadow-lg">
        <CloseButton className="absolute top-2 right-3 hover:opacity-50" onClick={() => props.setVisible(false)}/>
        {props.children}
      </div>
    </div>
  );
};