import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AuthForm from "../components/AuthForm";
import { registerSchema } from "../validation";
import { registerAdmin } from "../services/authService";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      adminKey: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerAdmin(data);
      toast.success("Admin registered successfully!");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("Invalid admin key!");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-16 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center nav-brand">Register</h1>
      <AuthForm
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        submitLabel="Register"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            {...register("confirmPassword")}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            {...register("fullName")}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Admin Key
          </label>
          <input
            {...register("adminKey")}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
          />
          {errors.adminKey && (
            <p className="text-red-500 text-sm mt-1">
              {errors.adminKey.message}
            </p>
          )}
        </div>
      </AuthForm>
    </div>
  );
};

export default Register;
