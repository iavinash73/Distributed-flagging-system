import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import { Button } from "./common/Button";
import axios from "axios";
import { toast } from "sonner";

export default function SignUp() {
  const context = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(()=>{
    if (sessionStorage.getItem("jwtToken") != null) {
      navigate("/feed")
    }
  },[])

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    birthdate: "",
    email: "",
    password: "",
    gender: "male",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const formSubmit =  async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        formData
      );
      console.log("From /register", response)
      if (response.status === 201) {
        const jwtToken =  response.data["token"]
        sessionStorage.setItem("jwtToken", jwtToken);
        context.setIs_logged_in(1);
        toast.success("Registration successful");
        console.log("Registration successful");
        navigate("/feed")
      } else {
        // Handle registration failure
        toast.error("Registration failed");
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }

    setFormData({
      username: "",
      full_name: "",
      birthdate: "",
      email: "",
      password: "",
      gender: "male",
    });
  };
  return (
    <section className="h-[calc(100vh-90px)] flex justify-center w-screen items-center">
      <div className="w-[60%]">
        <form onSubmit={formSubmit} className="mx-auto font-poppins">
          <p className="font-bold text-[40px] text-center mb-12">
            Sign up !!
          </p>
          <fieldset>
            <div className="flex">
              <div className="relative w-[100%] mb-4 mr-5">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block pt-[24px] pb-1 px-0 w-full text-md text-black bg-transparent border-0 border-b-[1.5px] border-black appearance-none focus:outline-none focus:ring-0 focus:border-[#085AAB] peer"
                  placeholder=" "
                  required
                />
                <label className="peer-focus:font-medium font-medium absolute text-[20px] duration-[300ms] transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#085AAB] text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Username
                </label>
              </div>

              <div className="relative w-[100%] mb-4 ml-5">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="block pt-[24px] pb-1 px-0 w-full text-md text-black bg-transparent border-0 border-b-[1.5px] border-black appearance-none focus:outline-none focus:ring-0 focus:border-[#085AAB] peer"
                  placeholder=" "
                  required
                />
                <label className="peer-focus:font-medium font-medium absolute text-[20px] duration-[300ms] transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#085AAB] text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Full Name
                </label>
              </div>
            </div>
            <div className="flex">
              <div className="relative w-[100%] mb-3 mr-5">
                <input
                  type="date"
                  name="birthdate"
                  id="birthdate"
                  value={formData.birthdate}
                  onChange={handleInputChange}
                  className="block pt-[24px] pb-1 px-0 w-full text-md text-black bg-transparent border-0 border-b-[1.5px] border-black appearance-none focus:outline-none focus:ring-0 focus:border-[#085AAB] peer"
                  placeholder=" "
                  required
                />
                <label className="peer-focus:font-medium font-medium absolute text-[20px] duration-[300ms] transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#085AAB] text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Date of Birth
                </label>
              </div>

              <div className="relative w-[100%] mb-3 ml-5">
                <select
                  type="password"
                  name="gender"
                  id="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="block pt-[24px] pb-1 px-0 w-full text-md text-black bg-transparent border-0 border-b-[1.5px] border-black appearance-none focus:outline-none focus:ring-0 focus:border-[#085AAB] peer"
                  placeholder=" "
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <label className="peer-focus:font-medium font-medium absolute text-[20px] duration-[300ms] transform -translate-y-6 scale-75 top-4 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#085AAB] text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Gender
                </label>
              </div>
            </div>

            <div className="relative w-[100%] mb-3 ">
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

            <div className="relative w-[100%] mb-3 ">
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
          </fieldset>
          <Button
            type="submit"
            size={"default"}
            variant={"black"}
            className="mt-3 mb-3 font-medium"
          >
            Sign Up
          </Button>
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="hover:underline hover:cursor-pointer font-medium"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
