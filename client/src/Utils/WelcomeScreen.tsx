import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

interface User {
  id: string;
  fullName: string;
  avatar: string;
}

const WelcomeScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/userdata`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.statusCode === 200) {
          setUser(data.data);
        } else {
          alert(data.message);
        }
      } catch (err: any) {
        alert(err.message || "An error occurred while fetching the user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className="w-full h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white">
      <div className="mt-14 px-5">
        <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center gap-5 text-center text-ellipsis">
          {user ? (
            <>
              <img
                className="md:w-24 md:h-24 w-12 h-12 bg-cover bg-center rounded-full"
                src={user?.avatar}
                alt="User Avatar"
              />
              <h1 className="text-4xl font-bold mb-4">Hi, {user?.fullName}!</h1>
              <h2 className="text-2xl">Welcome to Satyam Verse</h2>
            </>
          ) : (
            <button
              className="w-[55%] py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => {
                navigate("/");
              }}
            >
              Login
            </button>
          )}
        </div>
        <div className="mt-12 max-w-md text-center">
          <p className="text-lg">
            This page is a welcome screen for a test project.
          </p>
          <p className="text-sm mt-2">
            This page is created just to show a welcome screen and doesn't have
            proper styling because there is no scope for extensive frontend
            design here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
