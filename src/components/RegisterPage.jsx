import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import AuthShell, { Field } from "./AuthShell";
import { api } from "../api";
import { useStoreContext } from "../contextApi/ContextApi";

const RegisterPage = () => {
  const navigate = useNavigate();
  const carry = useLocation().state;
  const { setToken } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ username, email, password }) => {
    setLoading(true);
    setError("");
    try {
      await api.register(username.trim(), email.trim(), password);
      const data = await api.login(username.trim(), password);
      setToken(data.token);
      navigate("/dashboard", { state: carry });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create Account" subtitle="Sign up and start shortening links">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Username" id="username" autoComplete="username" placeholder="Choose a username"
          error={errors.username?.message}
          {...register("username", { required: "Username is required", minLength: { value: 3, message: "Minimum 3 characters" } })} />
        <Field label="Email" id="email" type="email" autoComplete="email" placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} />
        <Field label="Password" id="password" type="password" autoComplete="new-password" placeholder="Minimum 6 characters"
          error={errors.password?.message}
          {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })} />
        {error && <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>}
        <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit"
          className="bg-custom-gradient text-white font-semibold rounded-md py-2.5 disabled:opacity-60">
          {loading ? "Creating account..." : "Sign Up"}
        </motion.button>
        <p className="text-sm text-center text-slate-600">
          Already registered?{" "}
          <Link to="/login" className="text-btnColor font-semibold hover:underline">Login</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default RegisterPage;
