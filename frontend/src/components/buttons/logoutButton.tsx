import { useNavigate } from "react-router-dom";
import { fetchBackend } from "../../helpers";
import Button from "./button";
import { useContext } from "react";
import { AlertContext } from "../../App";

/**
 * A wrapper of the button component, which logs out the current user.
 */
export default function LogoutButton() {
  const navigate = useNavigate();
  const createAlert = useContext(AlertContext);
  
  async function logout() {
    const token = localStorage.getItem("token");
    // Exit function early if the user is not logged in
    if (!token) {
      return;
    }

    // If the user is logged in, logout
    const response = await fetchBackend("POST", "/admin/auth/logout", undefined, token);

    // If an error occurred create an alert, else clear all local storage and navigate to login
    if (response.error) {
      createAlert(response.error);
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };

  return <Button text="Logout" color="bg-pink-200" hoverColor="hover:bg-pink-400 hover:text-white" onClick={logout}/>;
}