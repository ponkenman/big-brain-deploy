import { useNavigate } from "react-router-dom";
import { fetchBackend } from "../../helpers";
import Button from "./button";

export default function LogoutButton() {
  const navigate = useNavigate();
  async function logout() {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const response = await fetchBackend("POST", "/admin/auth/logout", undefined, token);
    if (response.error) {
      console.log(response.error);
    } else {
      localStorage.clear();
      navigate("/login");
    }
  };
  return       <Button text="Logout" color="bg-indigo-200" hoverColor="hover:bg-indigo-400" onClick={logout}/>;
}