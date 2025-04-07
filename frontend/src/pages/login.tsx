import { useState } from "react";
import { fetchBackend } from "../helpers";

export function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function login() {
    const body = {
      email: email,
      password: password,
      name: name,
    }
    const response = await fetchBackend("POST", "/admin/auth/login", body);
    if (response.error) {
      console.log(response);
    } else {
      console.log("Happy!");
    }
  }

  function loginIfEnter(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      login();
    }
  }

  return (<>
    <h1> Login </h1>
    <form>
      <div>
        <label>Email</label>
        <input onChange={e => setEmail(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
      </div>
      <div>
        <label>Password</label>
        <input onChange={e => setPassword(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
      </div>
      <div>
        <label>Name</label>
        <input onChange={e => setName(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
      </div>
      <button type="button" onClick={login}> Login</button>
    </form>

  </>);
}