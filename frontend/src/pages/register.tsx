import { Link, useNavigate } from "react-router-dom";
import { fetchBackend } from "../helpers";
import React, { useState } from "react";

export function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function register() {
    const body = {
      email: email,
      password: password,
      name: name,
    }
    const response = await fetchBackend("POST", "/admin/auth/register", body);
    if (response.error) {
      console.log(response);
    } else {
      navigate("/dashboard");
    }
  }

  function submitIfEnter(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      register();
    }
  }

  return (<>
    <h1>Register</h1>
    <Link to="/login">Login instead</Link>
    <form>
      <div>
        <label>Name</label>
        <input onChange={e => setName(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <div>
        <label>Email</label>
        <input onChange={e => setEmail(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <div>
        <label>Password</label>
        <input onChange={e => setPassword(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <button type="button" onClick={register}>Register</button>
    </form>
  </>);
}