import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const LinkedInCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");
    if (code) {
      axios
        .post("http://localhost:4000/signup/linkedin", { code })
        .then((res) => {
          alert(res.data.message);
          navigate("/");
        })
        .catch((err) => {
          console.error(err);
          alert("LinkedIn signup failed");
        });
    }
  }, [location, navigate]);

  return <p>Authenticating with LinkedIn...</p>;
};

export default LinkedInCallback;
