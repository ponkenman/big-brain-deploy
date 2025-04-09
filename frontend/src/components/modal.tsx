import { ReactNode } from "react";

export default function Modal(props: {children: ReactNode}) {
  return (
    <div>
      {props.children}
    </div>
  );
};
