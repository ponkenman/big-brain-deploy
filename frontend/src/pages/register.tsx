import { Link, useNavigate } from "react-router-dom";
import { createAlert, fetchBackend } from "../helpers";
import { useState } from "react";
import Navbar from "../components/navbar";
import TextInput from "../components/textInput";
import Button from "../components/button";
import { AlertData, AlertMenu } from "../components/alert";

export function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertId, setAlertId] = useState(0);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const navigate = useNavigate();

  async function register() {
    if (password !== confirmPassword) {
      createAlert("Passwords do not match", alerts, setAlerts, alertId, setAlertId);
      return;
    }
    const body = {
      email: email,
      password: password,
      name: name,
    }
    const response = await fetchBackend("POST", "/admin/auth/register", body);
    if (response.error) {
      createAlert(response.error, alerts, setAlerts, alertId, setAlertId);
    } else {
      localStorage.setItem("token", response.token);
      navigate("/dashboard");
    }
  }

  return (<>
    <Navbar />
    <main className="bg-indigo-50 p-7 h-dvh">
      <h1 className="text-4xl font-semibold pb-7">Register</h1>
      <form className="rounded-md bg-indigo-100 p-4">
        <TextInput labelName="Name" id="register-name" type="text" set={setName} onEnter={register} />
        <TextInput labelName="Email" id="register-email" type="email" set={setEmail} onEnter={register} />
        <TextInput labelName="Create password" id="register-password" type="password" set={setPassword} onEnter={register} />
        <TextInput labelName="Confirm password" id="register-password-confirm" type="password" set={setConfirmPassword} onEnter={register} />
        <div className="pt-2">
          <Button text="Register" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={register}/>
          <Link to="/login" className="underline ml-3 text-base">Login instead</Link>
        </div>
      </form>
    </main>
    <AlertMenu alerts={alerts} setAlerts={setAlerts} />
  </>);
}