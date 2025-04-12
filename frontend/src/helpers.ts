import { AlertData } from "./components/alert";
import { Answer, StateSetter } from "./types";

interface FetchOptions {
  method: "GET"|"POST"|"PUT"|"DELETE",
  headers: Record<string, string>,
  body?: string
}

export async function fetchBackend(
  httpMethod: "GET"|"POST"|"PUT"|"DELETE", 
  urlFragment: string,
  options?: Record<string, string> | object,
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

export function initialiseAlerts(alerts: AlertData[], setAlerts: StateSetter<AlertData[]>, alertId: number, setAlertId: StateSetter<number>) {
  return function(message: string) {
    setAlerts([...alerts, { message: message, key: alertId }]);
    setAlertId(alertId + 1);
  }
}

/**
 * This function is taken from COMP6080 25T1 Assignment 3!
 * 
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file: File) {
  const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
  
  const reader = new FileReader();
  const dataUrlPromise = new Promise<string>((resolve,reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

export function createSampleAnswer(): Answer {
  return {
    text: "", 
    correct: false, 
    id: Math.floor(Math.random() * 1000000)
  };
}