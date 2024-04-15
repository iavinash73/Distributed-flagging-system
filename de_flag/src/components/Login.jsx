import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./common/Button";
import { toast } from "sonner";

export default function Login() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("jwtToken") != null) {
        navigate("/feed")
    }
  }, []);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        formData
      );
      console.log("From /login ",response)
      if (response.status === 200) {
        if(response.data.flag == 1){
          toast.error("You were kicked out");
        }
        else{
          const jwtToken = response.data.token;
          sessionStorage.setItem("jwtToken", jwtToken);
          context.setIs_logged_in(1);
          toast.success("Login successful");
          console.log("Login successful");
          navigate("/feed")
        }
      } else {
        // Handle registration failure
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <section className="h-[calc(100vh-90px)] flex justify-center w-screen items-center">
      <div className="w-[40%]">
        <form onSubmit={formSubmit} className="mx-auto font-poppins">
        <p className="font-semibold text-[40px] text-center mb-4">
            Log in</p>
          <div className="relative w-[100%] mb-4 ">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block pt-[24px] pb-1 px-0 w-full text-md text-black bg-transparent border-0 border-b-[1.5px] border-black appearance-none focus:outline-none focus:ring-0 focus:border-[#085AAB] peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium font-medium absolute text-[20px] duration-[300ms] transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#085AAB] text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              E-mail
            </label>
          </div>
          <div className="relative w-[100%] mb-4 ">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="block pt-[24px] pb-1 px-0 w-full text-md text-black bg-transparent border-0 border-b-[1.5px] border-black appearance-none focus:outline-none focus:ring-0 focus:border-[#085AAB] peer"
              placeholder=" "
              required
            />
            <label className="peer-focus:font-medium font-medium absolute text-[20px] duration-[300ms] transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#085AAB] text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Password
            </label>
          </div>
          <Button
            type="submit"
            size={"default"}
            variant={"black"}
            className="mt-3 mb-4 font-medium"
          >
            Log in
          </Button>
          <p>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="hover:underline hover:cursor-pointer font-medium"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
