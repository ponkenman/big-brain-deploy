import { useState } from "react";
import { initialiseAlerts, fetchBackend } from "../helpers";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Button from "../components/button";
import TextInput from "../components/textInput";
import { AlertData, AlertMenu } from "../components/alert";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const navigate = useNavigate();

  const createAlert = initialiseAlerts(alerts, setAlerts, alertId, setAlertId);

  async function login() {
    if (name === "") {
      createAlert("Name is empty!");
      return;
    }
    if (email === "") {
      createAlert("Email is empty!");
      return;
    }
    if (password === "") {
      createAlert("Password is empty!");
      return;
    }
    const body = {
      email: email,
      password: password,
      name: name,
    }
    const response = await fetchBackend("POST", "/admin/auth/login", body);
    if (response.error) {
      createAlert(response.error);
    } else {
      localStorage.setItem("token", response.token);
      localStorage.setItem("email", email);
      navigate("/dashboard");
    }
  }

  return (<>
    <Navbar>
      <Link to="/register">
        <Button text="Register" color="bg-indigo-200" hoverColor="hover:bg-indigo-400"/>
      </Link>
      <Link to="/login">
        <Button text="Login" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
      </Link>
    </Navbar>
    <main className="bg-indigo-50 p-7 h-dvh absolute top-15 w-screen">
      <h1 className="text-4xl font-semibold pb-7">Login</h1>
      <form className="rounded-md bg-indigo-100 p-4">
        <TextInput labelName="Name" id="login-name" type="text" set={setName} onEnter={login} />
        <TextInput labelName="Email" id="login-email" type="email" set={setEmail} onEnter={login} />
        <TextInput labelName="Password" id="login-password" type="password" set={setPassword} onEnter={login} />
        <div className="pt-2">
          <Button text="Login" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={login}/>
          <Link to="/register" className="underline ml-3 text-base">Register instead</Link>
        </div>
      </form>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}