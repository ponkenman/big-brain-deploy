import React, { useState } from "react";
import { fetchBackend } from "../helpers";
import { Link, useNavigate } from "react-router-dom";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

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
      navigate("/dashboard");
    }
  }

  function loginIfEnter(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      login();
    }
  }

  return (<>
    <h1> Login </h1>
    <Link to="/register">Register instead</Link>
    <form>
      <div>
        <label>Name</label>
        <input onChange={e => setName(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
      </div>
      <div>
        <label>Email</label>
        <input onChange={e => setEmail(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
      </div>
      <div>
        <label>Password</label>
        <input onChange={e => setPassword(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
      </div>
      <button type="button" onClick={login}> Login</button>
    </form>

  </>);
}