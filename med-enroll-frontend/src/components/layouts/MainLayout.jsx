import Navbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-grow bg-gray-50 p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
