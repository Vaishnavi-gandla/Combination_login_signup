import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LinkedInCallback = ({ setIsAuthenticated, setUsername }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse user data from query parameter
    const params = new URLSearchParams(location.search);
    const userData = params.get("user");

    if (userData) {
      try {
        // Attempt to decode and parse the user data from the query
        const user = JSON.parse(decodeURIComponent(userData));

        // Ensure the user data is valid before proceeding
        if (user && user.token && user.firstName && user.lastName) {
          localStorage.setItem("token", user.token); // Store the token from backend
          setIsAuthenticated(true);
          setUsername(`${user.firstName} ${user.lastName}`);
          navigate("/home");
        } else {
          throw new Error("Invalid user data received");
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
        alert("LinkedIn signup failed: " + err.message);
      }
    } else {
      console.error("No user data in query params");
      alert("LinkedIn authentication failed: No user data");
    }
  }, [location, navigate, setIsAuthenticated, setUsername]);

  return <p>Authenticating with LinkedIn...</p>;
};

export default LinkedInCallback;
