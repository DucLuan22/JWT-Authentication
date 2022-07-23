import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
const ConfirmScreen = () => {
  axios.defaults.baseURL = "http://localhost:8000";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const params = useParams();
  useEffect(() => {
    const confirmRegistration = async () => {
      const config = {
        header: {
          "Content-Type": "application/json",
        },
      };
      try {
        const { data } = await axios.get(
          `api/auth/confirmregister/${params.confirmToken}`,
          config
        );
        console.log(data);
        setSuccess(data.data);
      } catch (error) {
        console.log(error);
        setError(error.response.data.error);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    };
    confirmRegistration();
  }, [params]);
  return (
    <div>
      {!error ? "Confirmed Registration Successfully " + success : error}
    </div>
  );
};

export default ConfirmScreen;
