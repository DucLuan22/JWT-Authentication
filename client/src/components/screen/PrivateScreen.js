import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PrivateScreen = () => {
  axios.defaults.baseURL = "http://localhost:8000";
  const [error, setError] = useState("");
  const [privateData, setPrivateData] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      };

      try {
        const { data } = await axios.get("/api/private", config);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem("authToken");
        setError("You are not authorized please login");
      }
    };

    fetchPrivateDate();
  }, []);
  const LogoutHandler = () => {
    localStorage.removeItem("authToken");
    setPrivateData("");
    navigate("/login");
  };
  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <div>
      {privateData}
      {console.log(privateData)}
      <button onClick={LogoutHandler}>Logout</button>
    </div>
  );
};

export default PrivateScreen;
