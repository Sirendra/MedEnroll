import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../validation";
import {
  addCustomer,
  updateCustomer,
  fetchPossibleCustomers,
  fuzzyMatchCustomers,
} from "../services/customerService";
import { toast } from "react-toastify";

const CustomerForm = ({ customer = null, onSuccess = () => {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
    },
  });

  const [matches, setMatches] = useState([]);
  const debounceTimeout = useRef(null);
  const originalFilteredCustomers = useRef([]);
  const prevInitialsRef = useRef({ first: "", last: "" });

  const [firstName = "", lastName = ""] =
    useWatch({ control, name: ["firstName", "lastName"] }) || [];

  // Refill form if editing customer changes
  useEffect(() => {
    if (customer) {
      reset({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
      });
    }
  }, [customer, reset]);

  useEffect(() => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    const firstInitial = trimmedFirst.charAt(0).toLowerCase();
    const lastInitial = trimmedLast.charAt(0).toLowerCase();

    const prev = prevInitialsRef.current;
    const initialsChanged =
      firstInitial &&
      lastInitial &&
      (firstInitial !== prev.first || lastInitial !== prev.last);

    if (trimmedFirst.length === 0 && trimmedLast.length === 0) {
      setMatches([]);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      if (initialsChanged) {
        prevInitialsRef.current = { first: firstInitial, last: lastInitial };
        const results = await fetchPossibleCustomers(trimmedFirst, trimmedLast);
        originalFilteredCustomers.current = results;
        let fuzzyResults = fuzzyMatchCustomers(
          results,
          trimmedFirst,
          trimmedLast
        );
        if (customer?._id) {
          fuzzyResults = fuzzyResults.filter(
            (result) => result._id !== customer._id
          );
        }

        setMatches(fuzzyResults);
      } else if (originalFilteredCustomers.current?.length) {
        let fuzzyResults = fuzzyMatchCustomers(
          originalFilteredCustomers.current,
          trimmedFirst,
          trimmedLast
        );
        if (customer?._id) {
          fuzzyResults = fuzzyResults.filter(
            (result) => result._id !== customer._id
          );
        }
        setMatches(fuzzyResults);
      }
    }, 400);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstName, lastName]);

  const onSubmit = async (data) => {
    try {
      if (customer?._id) {
        await updateCustomer(customer._id, data);
        toast.success("Customer updated successfully!");
      } else {
        await addCustomer(data);
        toast.success("Customer added successfully!");
      }
      reset();
      setMatches([]);
      onSuccess();
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warning("Customer already exists.");
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white shadow-md rounded-md max-w-md mx-auto"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          {...register("firstName")}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          {...register("lastName")}
          className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {matches.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-400 rounded p-3 text-sm text-yellow-800">
          ⚠️ Possible duplicates found:
          <ul className="list-disc list-inside mt-1">
            {matches.map((m) => (
              <li key={m._id}>
                {m.firstName} {m.lastName}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-color-brand hover:bg-color-hover text-white font-semibold py-2 px-4 rounded transition"
      >
        {customer ? "Update" : "Register"}
      </button>
    </form>
  );
};

export default CustomerForm;
