import CustomerForm from "../components/CustomerForm";

function CustomerPage() {
  return (
    <div className="w-full max-w-lg mx-auto mt-16 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold text-center nav-brand">
        Customer Registration
      </h1>
      <CustomerForm />
    </div>
  );
}

export default CustomerPage;
