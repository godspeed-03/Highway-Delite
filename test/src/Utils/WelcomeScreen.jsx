import { useState, useEffect } from "react";

function WelcomeScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        setLoading(true); // Indicate that data is being loaded

        const response = await fetch(
          "http://localhost:8080/api/v1/user/userdata",
          {
            method: "POST",
            credentials: "include", // Ensures cookies are sent with the request
            headers: {
              "Content-Type": "application/json",
            }, // Include cookies for authentication
          }
        );

        if (!response.ok) {
          // Handle HTTP errors like 403 or 500
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle the successful response
        setUser(data.data); // Assuming your ApiResponse structure returns user data in `data`
      } catch (err) {
        // Catch network or fetch-specific errors
        setError(
          err.message || "An error occurred while fetching the user data"
        );
      } finally {
        setLoading(false); // Ensure loading state is updated regardless of success or error
      }
    };

    // Call the function to fetch user data
    fetchUserData();
  }, []); // Empty dependency array means this effect runs once when the component mounts

  return loading ? (
    <div>loading.valueOf............</div>
  ) : (
    <div className=" w-full h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white ">
      <div className="py-16 px-5">
        <div className="bg-white bg-opacity-10 p-8 rounded-lg shadow-lg flex flex-col justify-center items-center gap-5 text-center text-ellipsis">
          <img
            className="md:w-24 md:h-24 w-12 h-12 bg-cover bg-center rounded-full"
            src={`${user?.avatar}`}
            alt=""
          />
          <h1 className="text-4xl font-bold mb-4">Hi, {user?.fullName}!</h1>
          <h2 className="text-2xl">Welcome to Satyam Verse</h2>
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
}

export default WelcomeScreen;
