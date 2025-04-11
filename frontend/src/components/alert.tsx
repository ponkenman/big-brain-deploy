import React, { useEffect, useState } from "react";
import Button from "./buttons/button";
import { StateSetter } from "../types";

export interface AlertData {
    message: string;
    key: number
}

export function AlertMenu(props: { alerts: AlertData[], setAlerts: StateSetter<AlertData[]>} ) {
  return (<section className="fixed z-1 right-0 bottom-0 m-5 flex flex-col gap-3">
    {props.alerts.map( a => <AlertPopup message={a.message} key={a.key}/>)}
  </section>);
}

export function AlertPopup(props: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []); 

  return (visible && <div role="alert" className="bg-red-200 p-4 rounded-xl">
    {props.message}
    <Button text="x" color="bg-red-50" hoverColor="hover:bg-red-100" onClick={() => setVisible(false)} className="mx-3 text-sm p-1"/>
  </div>);
}