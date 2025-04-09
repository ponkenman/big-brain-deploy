import React from "react";
import { AlertData } from "./components/alert";

interface FetchOptions {
  method: "GET"|"POST"|"PUT"|"DELETE",
  headers: Record<string, string>,
  body?: string
}

export async function fetchBackend(
  httpMethod: "GET"|"POST"|"PUT"|"DELETE", 
  urlFragment: string,
  options?: Record<string, string> | Object,
  token?: string
) {
  const urlMain = "http://localhost:5005";
  const fetchOptions: FetchOptions = {
    method: httpMethod,
    headers: {
      "Content-type": "application/json",
    },
    body: options ? JSON.stringify(options) : undefined
  };
  if (token) {
    fetchOptions.headers["Authorization"] = token;
  }

  const response = await fetch(urlMain + urlFragment, fetchOptions);
  return await response.json();
}

export function initialiseAlerts(alerts: AlertData[], setAlerts: React.Dispatch<React.SetStateAction<AlertData[]>>, alertId: number, setAlertId: React.Dispatch<React.SetStateAction<number>>) {
  return function(message: string) {
    setAlerts([...alerts, { message: message, key: alertId }]);
    setAlertId(alertId + 1);
  }
}
