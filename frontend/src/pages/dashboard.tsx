import { useNavigate } from "react-router-dom";
import { fetchBackend } from "../helpers";

export function DashboardScreen () {
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

  return (<>
    <h1>Welcome to dashboard!</h1>
    <button type="button" onClick={logout}>Logout</button>
  </>);
}