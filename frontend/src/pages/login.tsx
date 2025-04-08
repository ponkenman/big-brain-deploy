import { useState } from "react";
import { fetchBackend } from "../helpers";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Button from "../components/button";
import TextInput from "../components/textInput";

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

  return (<>
    <Navbar />
    <main className="bg-indigo-50 p-7 h-dvh">
      <h1 className="text-4xl font-semibold pb-7">Login</h1>
      <form className="rounded-md bg-indigo-100 p-4">
        <TextInput labelName="Name" id="login-name" type="text" set={setName} onEnter={login} />
        <TextInput labelName="Email" id="login-email" type="email" set={setEmail} onEnter={login} />
        <TextInput labelName="Password" id="login-password" type="password" set={setPassword} onEnter={login} />
        <div className="pt-2">
          <Button text="Login" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={login}/>
          <Link to="/register" className="underline ml-3">Register instead</Link>
        </div>
      </form>
    </main>
  </>);
}