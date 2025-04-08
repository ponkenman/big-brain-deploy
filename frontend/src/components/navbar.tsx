import { Link } from "react-router-dom";
import Button from "./button";

export default function Navbar() {
  return (
    <nav className="bg-indigo-300 flex flex-row justify-between items-center h-15 px-4 top-0 sticky">
      <div className="text-lg font-bold italic">bigbrain</div>
      <div className="items-center flex flex-row gap-2 justify-evenly">
        <Link to="/register">
          <Button text="Register" color="bg-indigo-200" hoverColor="hover:bg-indigo-400"/>
        </Link>
        <Link to="/login">
          <Button text="Login" color="bg-indigo-200 "hoverColor="hover:bg-indigo-400" />
        </Link>
      </div>
    </nav>);
}