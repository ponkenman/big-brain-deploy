import { ReactNode } from "react";

export default function Modal(props: {children: ReactNode}) {
  return (
    <div className="fixed flex flex-row items-center justify-center inset-0 bg-gray-300/75 transition-opacity">
      <div className="bg-indigo-200 p-4 rounded-xl z-2 max-h-4/5 min-w-4/5 overflow-auto overscroll-none">
        {props.children}
      </div>
    </div>
  );
};
