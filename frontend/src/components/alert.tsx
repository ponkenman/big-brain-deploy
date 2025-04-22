import { useEffect, useState } from "react";
import { StateSetter } from "../types";
import CloseButton from "./buttons/closeButton";

export interface AlertData {
  /** Return value of Date.now() when alert is called */
  timestamp: number;
  message: string;
  key: number;
  /** Default colour style set to "bg-red-200 text-red-950 border border-red-300" */
  colour?: string;
}

export function AlertMenu(props: { alerts: AlertData[], setAlerts: StateSetter<AlertData[]>} ) {
  useEffect(() => {
    // Empties alerts array when no alerts have been created after 5 seconds
    const timer = setTimeout(() => {
      props.setAlerts(props.alerts.filter(a => (Date.now() - a.timestamp > 5 * 1000)))
    }, 5 * 1000);
    return () => clearTimeout(timer);
  }, [props.alerts]);

  return (<section className="fixed z-1 right-0 bottom-0 m-5 flex flex-col gap-3 max-h-3/4 overflow-scroll">
    {props.alerts.map( a => <AlertPopup data={a} key={a.key} alerts={props.alerts} setAlerts={props.setAlerts} />)}
  </section>);
}

export function AlertPopup(props: { data: AlertData, alerts: AlertData[], setAlerts: StateSetter<AlertData[]> }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Makes alert disappear after four seconds
    const timer = setTimeout(() => setVisible(false), 4 * 1000);
    return () => clearTimeout(timer);
  }, []); 

  return (visible && <div role="alert" className={`${props.data.colour ?? `bg-red-200 text-red-950 border border-red-300`} px-3 py-2 rounded-xl flex flex-row justify-between items-center`}>
    <span className="mr-5">{props.data.message}</span>
    <CloseButton className="hover:text-black" onClick={() => {
      setVisible(false);
      props.setAlerts([]);
    }}/>
  </div>);
}

