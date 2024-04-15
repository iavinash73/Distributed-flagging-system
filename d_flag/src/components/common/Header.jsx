import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import { Link } from "react-router-dom";
import { useContext, useDebugValue, useEffect, useState } from "react";
import { Button } from "./Button";
import { toast } from "sonner";

export default function Header() {
  const navigate = useNavigate();
  const context = useContext(AppContext);

  useEffect(() => {
    if (sessionStorage.getItem("jwtToken") != null) {
      context.setIs_logged_in(1);
    } else {
      context.setIs_logged_in(0);
    }
  }, [context.is_logged_in]);
  const handleLogOut = () => {
    sessionStorage.removeItem("jwtToken");
    toast.warning("Logged out")
    context.setIs_logged_in(0);
    navigate("/login");
  };
  return (
    <header className="">
      <div className="flex justify-between items-center px-5 h-[70px]">
        <div className="font-poppins font-semibold text-[32px]">
          TRIPLE A
        </div>
        <nav
          className={`font-poppins text-[18px] flex ${
            context.is_logged_in ? " mr-[110px] " : " mr-[50px] "
          }`}
        >
          {context.is_logged_in ? <ul className="flex gap-10">
            <li>
              <Link to="/explore">Explore</Link>
            </li>
            <li>
              <Link to="/feed">Feed</Link>
            </li>
            <li>
              <Link to="/dm">DMs</Link>
            </li>
          </ul>: ""}
          
        </nav>
        <div className=" flex">
          {context.is_logged_in ? (
            <Button
              size={"default"}
              variant={"black"}
              className="font-poppins"
              onClick={handleLogOut}
            >
              Log Out
            </Button>
          ) : (
            <>
              <Link to="/login">
                <Button
                  size={"default"}
                  variant={"black"}
                  className="font-poppins mr-4"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size={"default"}
                  variant={"black"}
                  className="font-poppins mr-4"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <hr className="border-1 mb-2" />
    </header>
  );
}
