import React, { useState } from "react";
import { fetchBackend } from "../helpers";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Button from "../components/button";

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
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    }
  }

  function loginIfEnter(event: React.KeyboardEvent) {
    if (event.key === "Enter") {
      login();
    }
  }

  return (<>
    <Navbar />
    <main className="bg-indigo-50 p-7 h-dvh">
      <h1 className="text-4xl font-semibold">Login</h1>
      <form>
        <div>
          <label>Name</label>
          <input type="name"  onChange={e => setName(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
        </div>
        <div>
          <label>Email</label>
          <input type="email" onChange={e => setEmail(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
        </div>
        <div>
          <label>Password</label>
          <input type="password" onChange={e => setPassword(e.target.value)} onKeyDown={e => loginIfEnter(e)}></input>
        </div>
        <Button text="Login" color="indigo-200" hoverColor="indigo-400" onClick={login}/>
      </form>
      <Link to="/register">Register instead</Link>
    </main>

  </>);
}