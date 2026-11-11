import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import AuthShell, { Field } from "./AuthShell";
import { api } from "../api";
import { useStoreContext } from "../contextApi/ContextApi";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setToken } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ username, password }) => {
    setLoading(true);
    setError("");
    try {
      const data = await api.login(username.trim(), password);
      setToken(data.token);
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Login to manage your short links">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Username" id="username" autoComplete="username" placeholder="Enter your username"
          error={errors.username && "Username is required"}
          {...register("username", { required: true })} />
        <Field label="Password" id="password" type="password" autoComplete="current-password" placeholder="Enter your password"
          error={errors.password && "Password is required"}
          {...register("password", { required: true })} />
        {error && <p className="text-sm font-semibold text-red-600 bg-red-50 rounded-md px-3 py-2">{error}</p>}
        <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit"
          className="bg-custom-gradient text-white font-semibold rounded-md py-2.5 disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </motion.button>
        <p className="text-sm text-center text-slate-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-btnColor font-semibold hover:underline">Sign up</Link>
        </p>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
