import React from "react";
import { useForm } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "../../api/axios";
const LOGIN_URL = "/api/auth/login";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState(""); //korresponderar mot ett error-msg som jag kan få tillbaka vid autenticeringen.

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus
  } = useForm();

  useEffect(() => {
  setFocus("username");
}, [setFocus]);

  const onSubmit = async (data) => {
    console.log("Inloggningsdata:", data);
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ username: data.username, password: data.password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      //console.log(JSON.stringify(response?.data));
      console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      localStorage.setItem("accessToken", accessToken);
      const recievedAccesstoken = localStorage.getItem("accessToken");
      console.log("recieved accessToken: " + recievedAccesstoken);
      const roles = response?.data?.roles;
      console.log("roles: " + roles);
      setUser(data.username);
      setAuth({ user, roles });
      console.log("auth: " + auth.roles + " || " + auth.accessToken + " || " + auth.user);
      setUser("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        setErrMsg("Inget svar från servern");
      } else if (err.response?.status === 400) {
        setErrMsg("Det saknas användarnamn eller lösenord");
      } else if (err.response?.status === 401) {
        setErrMsg("Obehörig");
      } else {
        setErrMsg("Inloggningen misslyckades");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md border border-gray-100">
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <h2 className="text-2xl font-bold text-[#165C6D] mb-6 text-center">
          Logga in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Användarnamn */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Användarnamn
            </label>
            <input
              type="text"
              {...register("username", { required: "Användarnamn krävs" })}
              placeholder="Ex. akarlsson"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.username && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Lösenord */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lösenord
            </label>
            <input
              type="password"
              {...register("password", { required: "Lösenord krävs" })}
              placeholder="••••••••"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#165C6D] focus:outline-none"
            />
            {errors.password && (
              <p className="text-sm text-[#E35C67] mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 bg-[#165C6D] text-white font-semibold rounded-lg shadow hover:bg-[#1f7585] focus:outline-none focus:ring-2 focus:ring-[#165C6D]"
          >
            Logga in
          </button>
          <p>
          Behöver du ett konto? <br />
          <span className="line">
            {/*put router link here*/}
            <a href="#">Registrera dig</a>
          </span>
        </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
