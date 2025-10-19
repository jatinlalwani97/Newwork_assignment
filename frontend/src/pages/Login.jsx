import React, { useMemo, useState } from "react";
import { useAuth } from "../store/authProvider";
import axios from "axios";
import BACKEND_URL from "../config/backend";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const emailPattern = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]{2,}$/i;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = useMemo(() => emailPattern.test(email.trim()), [email]);
  const isPasswordValid = useMemo(() => password.trim().length >= 8, [password]);

  const validate = () => {
    const nextFieldErrors = {};
    if (!email.trim()) nextFieldErrors.email = "Email is required";
    else if (!isEmailValid) nextFieldErrors.email = "Enter a valid email";

    if (!password.trim()) nextFieldErrors.password = "Password is required";
    else if (!isPasswordValid) nextFieldErrors.password = "Minimum 8 characters";

    setFieldErrors(nextFieldErrors);
    return Object.keys(nextFieldErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
        email: email.toLowerCase(),
        password: password,
      });

      if (response.data?.success) {
        const token = response.data?.token || response.data?.data?.token;
        const user = response.data?.user || response.data?.data?.user;
        if (!token) {
          throw new Error("Login succeeded but token missing in response");
        }
        login(token, user);
        toast.success(response.data.message || "Logged in successfully");
        navigate("/dashboard", { replace: true });
      } else {
        const serverErr = response.data?.error || "Failed to register new organization";
        setFormError(serverErr);
      }
    } catch (err) {
      // console.log("error:", err);

      let message = "Something went wrong. Please try again.";
      if (axios.isAxiosError(err)) {
        // prefer server-provided message when available
        message = err.response?.data?.error || err.response?.data?.message || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {formError && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</div>}
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={
                    "block w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 " +
                    "border-gray-300 focus:border-gray-400 " +
                    (fieldErrors.email ? "border-red-400 focus:border-red-500" : "")
                  }
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={
                      "block w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 " +
                      "border-gray-300 focus:border-gray-400 " +
                      (fieldErrors.password ? "border-red-400 focus:border-red-500" : "")
                    }
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      // Eye closed SVG
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-7 0-1.226.433-2.442 1.393-3.609M14.121 9.879a3 3 0 11-4.242 4.242M7.757 7.757l8.486 8.486M21 21l-2.122-2.121M17.657 16.657A9.964 9.964 0 0021 12c0-2.97-4-7-9-7-1.025 0-2.021.145-2.966.412"
                        />
                      </svg>
                    ) : (
                      // Eye open SVG
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 2.97-4 7-9 7s-9-4.03-9-7 4-7 9-7 9 4.03 9 7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-800 transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
