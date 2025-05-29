import { ToastContainer } from "react-toastify";
import AppRoutes from "./components/routes/AppRoutes";
import MainLayout from "./components/layouts/MainLayout";

function App() {
  return (
    <>
      <MainLayout>
        <AppRoutes></AppRoutes>
      </MainLayout>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        theme="light"
        toastClassName="bg-[var(--color-brand)] text-white rounded-lg shadow"
        bodyClassName="text-sm"
        progressClassName="bg-[var(--color-hover)]"
      />
    </>
  );
}

export default App;
