import { useEffect, useState } from "react";
import CustomerCard from "../components/CustomerCard";
import { searchAllCustomers } from "../services/customerService";
import Modal from "../../../components/common/Modal";
import CustomerForm from "../components/CustomerForm";
import Pagination from "../../../components/common/Pagination";

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 12;

  const fetchCustomers = async () => {
    const data = await searchAllCustomers();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(
        (c) =>
          c.firstName.toLowerCase().includes(term) ||
          c.lastName.toLowerCase().includes(term)
      );
      setFilteredCustomers(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, customers]);

  const onEditClicked = (id) => {
    const customerToEdit = currentCustomers.find((c) => c._id === id);
    if (customerToEdit) {
      setEditingCustomer(customerToEdit);
      setModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCustomer(null);
    fetchCustomers();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer List</h1>
      <input
        type="text"
        placeholder="Search by name..."
        className="mb-6 w-full max-w-md block mx-auto border border-gray-300 rounded px-4 py-2 text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentCustomers.map((customer) => (
          <CustomerCard
            key={customer._id}
            id={customer._id}
            firstName={customer.firstName}
            lastName={customer.lastName}
            onEditClick={onEditClicked}
          />
        ))}
      </div>
      <Pagination
        totalItems={filteredCustomers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <CustomerForm customer={editingCustomer} onSuccess={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default CustomerListPage;
