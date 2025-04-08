import { Link, useNavigate } from "react-router-dom";
import { fetchBackend } from "../helpers";
import React, { useState } from "react";
import Navbar from "../components/navbar";

export function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  async function register() {
    if (password !== confirmPassword) {
      console.log("Passwords don't match!");
      return;
    }
    const body = {
      email: email,
      password: password,
      name: name,
    }
    const response = await fetchBackend("POST", "/admin/auth/register", body);
    if (response.error) {
      console.log(response);
    } else {
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    }
  }

  function submitIfEnter(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      register();
    }
  }

  return (<>
    <Navbar />
    <h1>Register</h1>
    <Link to="/login">Login instead</Link>
    <form>
      <div>
        <label>Name</label>
        <input type="text" onChange={e => setName(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <div>
        <label>Email</label>
        <input type="email" onChange={e => setEmail(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <div>
        <label>Password</label>
        <input type="password" onChange={e => setPassword(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <div>
        <label>Confirm Password</label>
        <input type="password" onChange={e => setConfirmPassword(e.target.value)} onKeyDown={e => submitIfEnter(e)}></input>
      </div>
      <button type="button" onClick={register}>Register</button>
    </form>
  </>);
}