import React, { useEffect, useState } from "react";
import Axios from "../../configs/axiosConfig";
import { useParams } from "react-router-dom";
const ConfirmScreen = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const params = useParams();
  useEffect(() => {
    const confirmRegistration = async () => {
      try {
        const { data } = await Axios.get(
          `api/auth/confirmregister/${params.confirmToken}`
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
