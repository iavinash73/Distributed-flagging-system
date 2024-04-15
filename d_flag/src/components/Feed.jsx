import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./common/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppContext } from "../Context/AppContext";

export default function Feed() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const context = useContext(AppContext);

  useEffect(() => {
    if (sessionStorage.getItem("jwtToken") == null) {
      navigate("/login");
    }
    getpost();
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    try {
      const token = sessionStorage.getItem("jwtToken");
      const response = await axios.post(
        "http://127.0.0.1:5000/create_post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
          },
        }
      );
      console.log("From /create_post ", response);
      setTitle("");
      setImage(null);
      if (response.status === 201) {
        if (response.data.flag == 1) {
          toast.error("Your account has been flagged!!");
          sessionStorage.removeItem("jwtToken");
          context.setIs_logged_in(0);
          navigate("/login");
        }
        else{
          if (response.data.allow == 0) {
            toast.error("You can't post something like that !!");
          }
          else{
            toast.success("Post uploaded!!");
            getpost();
          }
        }
      } else {
        // Handle registration failure
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const getpost = async () => {
    const token = sessionStorage.getItem("jwtToken");
    const response = await axios.get("http://127.0.0.1:5000/get_posts", {
      headers: {
        "x-access-token": token,
      },
    });
    const reversedData = response.data.slice().reverse();
    setPosts(reversedData);
  };

  // const { data, loading, error, currentPage, handlePageChange, totalPages } =
  //   useAxios("https://jsonplaceholder.typicode.com/posts/");

  return (
    <section className="w-screen font-poppins">
      <div className="w-[50%] mx-auto mb-10">
        <div className="font-medium text-[20px] mb-2 mt-3">
          Write a new post
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            type="textarea"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-200 w-full 0 rounded-md  min-h-[100px] focus:outline-none focus:ring-0 focus:border-black border-2 px-2 py-1 resize-none duration-300 placeholder:italic "
            placeholder="Write your post here..."
            required
          />
          <input
            type="file"
            name="img-upload"
            id="img-upload"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:cursor-pointer duration-300 py-2"
          />
          <Button
            type="submit"
            size={"default"}
            variant={"black"}
            className="mt-2"
          >
            Post
          </Button>
        </form>
      </div>

      <div className="w-[50%] mx-auto font-semibold text-[32px] mb-3">
        Recent posts
      </div>
      <div className="grid grid-cols-1 w-[50%] mx-auto">
        {posts.map((item, index) => (
          <div key={index} className="">
            <div className="text-[20px] font-medium mb-2 ">{item.title}</div>
            
  <figure class="relative  transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
            <img
              className="w-[100%] h-[300px] object-cover rounded-lg mb-4"
              src={"http://127.0.0.1:5000/static/posts/" + item.content}
            >
              

            </img>
            <figcaption class="absolute px-4 text-lg text-white bottom-6">
      <p class="mx-auto font-semibold text-[32px]">Posted by <a href="">{item.username}</a></p>
  </figcaption>
            </figure>
            <div class="text-overlay relative">
  
              
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
