import axios from "axios";
import React, { useMemo, useState } from "react";
import BACKEND_URL from "../config/backend";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../store/authProvider";

const emailPattern = /^(?:[^\s@]+)@(?:[^\s@]+)\.[^\s@]{2,}$/i;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEmailValid = useMemo(() => emailPattern.test(email.trim()), [email]);
  const isPasswordValid = useMemo(() => password.trim().length >= 8, [password]);

  const validate = () => {
    const nextFieldErrors = {};

    if (!name.trim()) nextFieldErrors.name = "Organization name is required";
    // else if (!isEmailValid) nextFieldErrors.email = "Enter a valid email";

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
      const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
        name: name,
        email: email.toLowerCase(),
        password: password,
      });

      if (response.data?.success) {
        const token = response.data?.token || response.data?.data?.token;
        const user = response.data?.user || response.data?.data?.user;
        if (!token) {
          throw new Error("Registration succeeded but token missing in response");
        }
        login(token, user);
        toast.success(response.data.message || "Registered successfully");
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
            <h1 className="text-2xl font-semibold tracking-tight">Register New Organization</h1>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {formError && <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">{formError}</div>}
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Organization Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={
                    "block w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors placeholder:text-gray-400 " +
                    "border-gray-300 focus:border-gray-400 " +
                    (fieldErrors.name ? "border-red-400 focus:border-red-500" : "")
                  }
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.email && (
                  <p id="name-error" className="mt-1 text-xs text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

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
                <p className="text-xs text-gray-600">This mail will be used as a manager.</p>

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
                <input
                  id="password"
                  type="password"
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
                {isLoading ? "Signing up…" : "Sign up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
