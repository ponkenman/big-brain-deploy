import { useNavigate } from "react-router-dom";
import { fetchBackend } from "../helpers";
import GameCard from "../components/gameCard";

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
    <div>
      <h2>My games</h2>
      <GameCard title="My game 1" numQuestions={2} totalDuration={3}/>
    </div>
    <button type="button" onClick={logout}>Logout</button>
  </>);
}