const AuthForm = ({
  register,
  errors,
  onSubmit,
  handleSubmit,
  children,
  submitLabel,
}) => (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="space-y-6 p-6 bg-white shadow-md rounded-md max-w-md mx-auto"
  >
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Username
      </label>
      <input
        {...register("userName")}
        className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
      />
      {errors.userName && (
        <p className="text-red-500 text-sm mt-1">{errors.userName.message}</p>
      )}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <input
        type="password"
        {...register("password")}
        className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
      />
      {errors.password && (
        <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
      )}
    </div>
    {children}
    <button
      type="submit"
      className="w-full bg-color-brand hover:bg-color-hover text-white font-semibold py-2 px-4 rounded transition"
    >
      {submitLabel}
    </button>
  </form>
);
export default AuthForm;
