import { Link, useNavigate } from "react-router-dom";
import { fetchBackend } from "../helpers";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import TextInput from "../components/forms/textInput";
import Button from "../components/buttons/button";
import { AlertContext } from "../App";

export function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const createAlert = useContext(AlertContext);

  // Scroll to top when screen first loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function register() {
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
    if (password !== confirmPassword) {
      createAlert("Passwords do not match");
      return;
    }
    const body = {
      email: email,
      password: password,
      name: name,
    }
    const response = await fetchBackend("POST", "/admin/auth/register", body);
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
        <Button text="Register" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white"/>
      </Link>
      <Link to="/login">
        <Button text="Login" color="bg-pink-200 "hoverColor="hover:bg-pink-400 hover:text-white" />
      </Link>
    </Navbar>
    <main className="bg-white p-7 h-dvh absolute top-15 w-screen">
      <h1 className="text-4xl font-semibold pb-7">Register</h1>
      <form className="rounded-md bg-gray-100 p-4">
        <TextInput labelName="Name" id="register-name" type="text" onChange={e => setName(e.target.value)} onEnter={register} />
        <TextInput labelName="Email" id="register-email" type="email" onChange={e => setEmail(e.target.value)} onEnter={register} />
        <TextInput labelName="Create password" id="register-password" type="password" onChange={e => setPassword(e.target.value)} onEnter={register} />
        <TextInput labelName="Confirm password" id="register-password-confirm" type="password" onChange={e => setConfirmPassword(e.target.value)} onEnter={register} />
        <div className="pt-2">
          <Button text="Register" color="bg-pink-300" hoverColor="hover:bg-pink-400 hover:text-white" onClick={register}/>
          <Link to="/login" className="underline ml-3 text-base">Login instead</Link>
        </div>
      </form>
    </main>
  </>);
}