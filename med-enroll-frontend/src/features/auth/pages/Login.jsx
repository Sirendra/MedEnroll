// import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthForm from "../components/AuthForm";
import { loginSchema } from "../validation";
import { toast } from "react-toastify";
import { loginAdmin } from "../services/authService";
import { useAuth } from "../../../contexts/authContext";

const Login = () => {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const loginData = await loginAdmin(data);
      toast.success("Successfully logged in!");
      login(loginData.data.data.token);
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid credentials.");
      } else {
        toast.error("Something went wrong.");
      }
      reset({
        userName: "",
        password: "",
      });
    }
  };
  return (
    <div className="w-full max-w-lg mx-auto mt-16 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center nav-brand">Login</h1>
      <AuthForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitLabel="Login"
      />
    </div>
  );
};
export default Login;
