import { SignupInput } from "@manishverma/glowverse-common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const [postInputs, setPostInputs] = useState<SignupInput>({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  // Helper functions for validation
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  async function sendRequest() {
    // Validation checks
    const validationErrors: { email?: string; password?: string; name?: string } = {};
    if (!validateEmail(postInputs.email)) validationErrors.email = "Invalid email format";
    if (!validatePassword(postInputs.password)) validationErrors.password = "Password must be at least 6 characters";
    if (type === "signup" && !postInputs.name) validationErrors.name = "Name is required";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );
      const jwt = response.data;
      localStorage.setItem("token", jwt);
      navigate("/blogs");
    } catch (e) {
      alert("Error while signing up");
    }
  }

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an account</div>
            <div className="text-slate-400">
              {type === "signin" ? "Don't have an account?" : "Already have an account?"}
              <Link className="pl-1 underline" to={type === "signin" ? "/signup" : "/signin"}>
                {type === "signin" ? "Sign up" : "Login"}
              </Link>
            </div>
          </div>

          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="Enter your name"
                value={postInputs.name}
                error={errors.name}
                onChange={(e) => {
                  setPostInputs({ ...postInputs, name: e.target.value });
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              placeholder="Enter your email"
              value={postInputs.email}
              error={errors.email}
              onChange={(e) => {
                setPostInputs({ ...postInputs, email: e.target.value });
              }}
            />
            <LabelledInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={postInputs.password}
              error={errors.password}
              onChange={(e) => {
                setPostInputs({ ...postInputs, password: e.target.value });
              }}
            />
            <button
              type="button"
              onClick={sendRequest}
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value: string;
  error?: string;
}
function LabelledInput({ label, placeholder, onChange, type, value, error }: LabelledInputType) {
  return (
    <div>
      <div>
        <label className="block mb-2 text-sm font-semibold text-black pt-4">{label}</label>
        <input
          onChange={onChange}
          type={type || "text"}
          value={value}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder={placeholder}
          required
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
}
