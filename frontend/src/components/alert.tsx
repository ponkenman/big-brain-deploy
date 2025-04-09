import React, { useEffect, useState } from "react";
import Button from "./button";

export interface AlertData {
    message: string;
    key: number
}

export function AlertMenu(props: { alerts: AlertData[], setAlerts: React.Dispatch<React.SetStateAction<AlertData[]>>} ) {
  return (<section className="sticky z-1 right-0 bottom-0 ">
    {props.alerts.map( a => <AlertPopup message={a.message} key={a.key}/>)}
  </section>);
}

export function AlertPopup(props: { message: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []); 

  return (visible && <div role="alert" className="bg-red-200 p-4">
    {props.message}
    <Button text="Clear" color="bg-red-50" hoverColor="hover:bg-red-100" onClick={() => setVisible(false)} className="mx-3 text-sm p-1"/>
  </div>);
}