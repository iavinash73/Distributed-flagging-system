import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(()=>{
    navigate('/signup');
  })

    return(
        <div>Home page</div>
    )
}