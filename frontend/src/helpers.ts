interface FetchOptions {
  method: "GET"|"POST"|"PUT"|"DELETE",
  headers: Record<string, string>,
  body?: string
}

export async function fetchBackend(
  httpMethod: "GET"|"POST"|"PUT"|"DELETE", 
  urlFragment: string,
  options?: Record<string, string>,
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
  return response.json();
}